from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Depends, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
from ...core.database import get_database
from ...core.config import settings
from ...models.user import UserCreate, UserResponse, Token
from ...services.auth_service import (
    get_password_hash, verify_password, create_access_token, 
    decode_token, get_google_user_info, get_github_user_info
)
from motor.motor_asyncio import AsyncIOMotorDatabase
import httpx

# ... rest of your code remains the same
from bson import ObjectId

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)

# Initialize OAuth
oauth = OAuth(Config(environ={
    "GOOGLE_CLIENT_ID": settings.GOOGLE_CLIENT_ID,
    "GOOGLE_CLIENT_SECRET": settings.GOOGLE_CLIENT_SECRET,
}))

oauth.register(
    name="google",
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)

# ==================== Helper Functions ====================

async def get_user_by_email(db: AsyncIOMotorDatabase, email: str):
    return await db.users.find_one({"email": email})

async def create_user(db: AsyncIOMotorDatabase, user_data: dict):
    result = await db.users.insert_one(user_data)
    return await db.users.find_one({"_id": result.inserted_id})

# ==================== JWT Authentication ====================

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    if not token:
        return None
    payload = decode_token(token)
    if payload is None:
        return None
    email = payload.get("sub")
    if email is None:
        return None
    user = await get_user_by_email(db, email)
    return user

async def get_current_user_required(
    current_user = Depends(get_current_user)
):
    if current_user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user

# ==================== Email/Password Auth ====================

@router.post("/register", response_model=UserResponse)
async def register(user_data: UserCreate, db: AsyncIOMotorDatabase = Depends(get_database)):
    # Check if user exists
    existing_user = await get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = {
        "name": user_data.name,
        "email": user_data.email,
        "hashed_password": hashed_password,
        "role": user_data.role,
        "store_id": user_data.store_id,
        "is_active": True,
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(new_user)
    created_user = await db.users.find_one({"_id": result.inserted_id})
    
    return UserResponse(
        id=str(created_user["_id"]),
        name=created_user["name"],
        email=created_user["email"],
        role=created_user["role"],
        store_id=created_user.get("store_id"),
        is_active=created_user["is_active"]
    )

@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    user = await get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

# ==================== Google OAuth ====================

@router.get("/google/login")
async def google_login(request: Request):
    redirect_uri = settings.GOOGLE_REDIRECT_URI
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/google/callback")
async def google_callback(request: Request, db: AsyncIOMotorDatabase = Depends(get_database)):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = await get_google_user_info(token["access_token"])
        
        if not user_info:
            raise HTTPException(status_code=400, detail="Failed to get user info")
        
        # Check if user exists
        existing_user = await get_user_by_email(db, user_info["email"])
        
        if not existing_user:
            # Create new user
            new_user = {
                "name": user_info.get("name", user_info["email"].split("@")[0]),
                "email": user_info["email"],
                "hashed_password": "",  # No password for OAuth users
                "role": "associate",
                "is_active": True,
                "created_at": datetime.utcnow(),
                "auth_provider": "google"
            }
            result = await db.users.insert_one(new_user)
            user_id = str(result.inserted_id)
        else:
            user_id = str(existing_user["_id"])
        
        # Create JWT token
        access_token = create_access_token(data={"sub": user_info["email"]})
        
        # Redirect to frontend with token
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/callback?token={access_token}")
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Google auth failed: {str(e)}")

# ==================== GitHub OAuth ====================

@router.get("/github/login")
async def github_login():
    # GitHub OAuth URL
    auth_url = f"https://github.com/login/oauth/authorize?client_id={settings.GITHUB_CLIENT_ID}&scope=user:email"
    return RedirectResponse(url=auth_url)

@router.get("/github/callback")
async def github_callback(code: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    try:
        # Exchange code for access token
        async with httpx.AsyncClient() as client:
            token_response = await client.post(
                "https://github.com/login/oauth/access_token",
                headers={"Accept": "application/json"},
                data={
                    "client_id": settings.GITHUB_CLIENT_ID,
                    "client_secret": settings.GITHUB_CLIENT_SECRET,
                    "code": code,
                    "redirect_uri": settings.GITHUB_REDIRECT_URI
                }
            )
            token_data = token_response.json()
            access_token = token_data.get("access_token")
            
            if not access_token:
                raise HTTPException(status_code=400, detail="Failed to get access token")
            
            # Get user info
            user_info = await get_github_user_info(access_token)
            
            if not user_info or not user_info.get("email"):
                raise HTTPException(status_code=400, detail="Failed to get user info or email not found")
            
            # Check if user exists
            existing_user = await get_user_by_email(db, user_info["email"])
            
            if not existing_user:
                # Create new user
                new_user = {
                    "name": user_info.get("name", user_info["email"].split("@")[0]),
                    "email": user_info["email"],
                    "hashed_password": "",  # No password for OAuth users
                    "role": "associate",
                    "is_active": True,
                    "created_at": datetime.utcnow(),
                    "auth_provider": "github",
                    "github_id": user_info.get("id")
                }
                result = await db.users.insert_one(new_user)
            
            # Create JWT token
            access_token_jwt = create_access_token(data={"sub": user_info["email"]})
            
            # Redirect to frontend with token
            return RedirectResponse(url=f"{settings.FRONTEND_URL}/auth/callback?token={access_token_jwt}")
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"GitHub auth failed: {str(e)}")

# ==================== User Info Endpoint ====================

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user_required)):
    return UserResponse(
        id=str(current_user["_id"]),
        name=current_user["name"],
        email=current_user["email"],
        role=current_user["role"],
        store_id=current_user.get("store_id"),
        is_active=current_user["is_active"]
    )

# Add missing import
from datetime import datetime
from fastapi.responses import RedirectResponse
import httpx