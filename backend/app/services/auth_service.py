from jose import JWTError, jwt
from datetime import datetime, timedelta
from ..core.config import settings
import httpx
import bcrypt

# Direct bcrypt functions (no passlib)
def get_password_hash(password: str) -> str:
    # Convert password to bytes and hash
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    plain_bytes = plain_password.encode('utf-8')
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(plain_bytes, hashed_bytes)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def decode_token(token: str):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None

async def get_google_user_info(access_token: str):
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if response.status_code == 200:
            return response.json()
        return None

async def get_github_user_info(access_token: str):
    async with httpx.AsyncClient() as client:
        user_response = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        email_response = await client.get(
            "https://api.github.com/user/emails",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        
        if user_response.status_code == 200:
            user_data = user_response.json()
            emails = email_response.json() if email_response.status_code == 200 else []
            
            primary_email = None
            for email in emails:
                if email.get("primary"):
                    primary_email = email.get("email")
                    break
            if not primary_email and emails:
                primary_email = emails[0].get("email")
            
            return {
                "id": str(user_data.get("id")),
                "name": user_data.get("name") or user_data.get("login"),
                "email": primary_email,
                "avatar_url": user_data.get("avatar_url")
            }
        return None