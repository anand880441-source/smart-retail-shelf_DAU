from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
import os

class Settings(BaseSettings):
    # App
    APP_NAME: str = "Smart Retail Shelf Intelligence"
    DEBUG: bool = True
    
    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Database
    MONGODB_URL: str
    MONGODB_DB_NAME: str = "smart_retail"
    
    # Google OAuth
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/auth/google/callback"
    
    # GitHub OAuth
    GITHUB_CLIENT_ID: str
    GITHUB_CLIENT_SECRET: str
    GITHUB_REDIRECT_URI: str = "http://localhost:8000/auth/github/callback"
    
    # Frontend
    FRONTEND_URL: str = "http://localhost:3000"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="ignore"
    )

settings = Settings()

# Diagnostic prints for Render logs
# Only print in production (or if RENDER env is present)
if not settings.DEBUG or os.getenv("RENDER") or os.getenv("FRONTEND_URL"):
    print(f"--- CONFIGURATION LOG ---")
    print(f"APP_ENV: {'Render' if os.getenv('RENDER') else 'Local'}")
    print(f"FRONTEND_URL: {settings.FRONTEND_URL}")
    print(f"GOOGLE_REDIRECT: {settings.GOOGLE_REDIRECT_URI}")
    print(f"GITHUB_REDIRECT: {settings.GITHUB_REDIRECT_URI}")
    print(f"-------------------------")