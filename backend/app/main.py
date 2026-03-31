import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from .core.database import connect_to_mongo, close_mongo_connection
from .core.config import settings
from .api.routes import (
    auth, alerts, analytics, planogram, dashboard, 
    detection, products, forecasting, inventory, 
    cameras, stores, reports
)
from .workers import process_alerts, generate_daily_forecasts, process_detection_queue
from .services.websocket_manager import manager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB
    await connect_to_mongo()
    
    # Start background workers
    alert_task = asyncio.create_task(process_alerts())
    forecast_task = asyncio.create_task(generate_daily_forecasts())
    detection_task = asyncio.create_task(process_detection_queue())
    
    yield
    
    # Shutdown: Stop workers and close MongoDB connection
    alert_task.cancel()
    forecast_task.cancel()
    detection_task.cancel()
    await close_mongo_connection()

app = FastAPI(
    title=settings.APP_NAME, 
    debug=settings.DEBUG,
    lifespan=lifespan
)

# Add SessionMiddleware (required for OAuth)
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(auth.router)
app.include_router(alerts.router)
app.include_router(analytics.router)
app.include_router(planogram.router)
app.include_router(dashboard.router)
app.include_router(detection.router)
app.include_router(products.router)
app.include_router(forecasting.router)
app.include_router(inventory.router)
app.include_router(cameras.router)
app.include_router(stores.router)
app.include_router(reports.router)

# WebSocket endpoint for alerts
@app.websocket("/ws/alerts")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.get("/")
async def root():
    return {"message": "Smart Retail Shelf Intelligence API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}