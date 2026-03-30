from pydantic import BaseModel, EmailStr
from typing import Optional

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "associate"
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str
    
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    
class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str
    is_active: bool