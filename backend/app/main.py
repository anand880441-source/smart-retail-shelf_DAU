from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from .core.database import connect_to_mongo, close_mongo_connection
from .core.config import settings
from .api.routes import auth
from .api.routes import auth, alerts
from .api.routes import auth, alerts, analytics
from .api.routes import auth, alerts, analytics, planogram

app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

# Add SessionMiddleware (required for OAuth)
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(alerts.router)
app.include_router(analytics.router)
app.include_router(planogram.router)

@app.on_event("startup")
async def startup():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown():
    await close_mongo_connection()

@app.get("/")
async def root():
    return {"message": "Smart Retail Shelf Intelligence API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}