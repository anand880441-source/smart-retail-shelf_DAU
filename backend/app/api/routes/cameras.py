from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from ...core.database import get_database
from ..routes.auth import get_current_user_required
from pydantic import BaseModel
from datetime import datetime, timedelta

router = APIRouter(prefix="/cameras", tags=["Cameras"])

class CameraConfig(BaseModel):
    name: str
    location: str
    stream_url: str
    is_active: bool = True

# Mock camera data
CAMERAS = {
    "CAM001": {
        "name": "Aisle 1 Camera",
        "location": "Aisle 1 - Dairy",
        "stream_url": "rtsp://camera1.local/stream",
        "is_active": True,
        "last_health_check": datetime.utcnow().isoformat(),
        "status": "online"
    },
    "CAM002": {
        "name": "Aisle 2 Camera",
        "location": "Aisle 2 - Bakery",
        "stream_url": "rtsp://camera2.local/stream",
        "is_active": True,
        "last_health_check": datetime.utcnow().isoformat(),
        "status": "online"
    },
    "CAM003": {
        "name": "Aisle 3 Camera",
        "location": "Aisle 3 - Produce",
        "stream_url": "rtsp://camera3.local/stream",
        "is_active": False,
        "last_health_check": (datetime.utcnow() - timedelta(hours=2)).isoformat(),
        "status": "offline"
    },
    "CAM004": {
        "name": "Aisle 4 Camera",
        "location": "Aisle 4 - Snacks",
        "stream_url": "rtsp://camera4.local/stream",
        "is_active": True,
        "last_health_check": datetime.utcnow().isoformat(),
        "status": "online"
    },
    "CAM005": {
        "name": "Aisle 5 Camera",
        "location": "Aisle 5 - Eggs & Dairy",
        "stream_url": "rtsp://camera5.local/stream",
        "is_active": True,
        "last_health_check": datetime.utcnow().isoformat(),
        "status": "online"
    }
}

@router.get("/")
async def get_all_cameras(
    current_user=Depends(get_current_user_required)
):
    cameras = []
    for cam_id, data in CAMERAS.items():
        cameras.append({
            "id": cam_id,
            "name": data["name"],
            "location": data["location"],
            "is_active": data["is_active"],
            "status": data["status"],
            "last_health_check": data["last_health_check"]
        })
    return cameras

@router.get("/{camera_id}")
async def get_camera(
    camera_id: str,
    current_user=Depends(get_current_user_required)
):
    if camera_id not in CAMERAS:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    data = CAMERAS[camera_id]
    return {
        "id": camera_id,
        "name": data["name"],
        "location": data["location"],
        "stream_url": data["stream_url"],
        "is_active": data["is_active"],
        "status": data["status"],
        "last_health_check": data["last_health_check"]
    }

@router.post("/")
async def add_camera(
    camera: CameraConfig,
    current_user=Depends(get_current_user_required)
):
    import uuid
    camera_id = f"CAM{str(uuid.uuid4())[:4].upper()}"
    CAMERAS[camera_id] = {
        "name": camera.name,
        "location": camera.location,
        "stream_url": camera.stream_url,
        "is_active": camera.is_active,
        "last_health_check": datetime.utcnow().isoformat(),
        "status": "online" if camera.is_active else "offline"
    }
    return {"message": "Camera added", "camera_id": camera_id}

@router.put("/{camera_id}")
async def update_camera(
    camera_id: str,
    camera: CameraConfig,
    current_user=Depends(get_current_user_required)
):
    if camera_id not in CAMERAS:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    CAMERAS[camera_id]["name"] = camera.name
    CAMERAS[camera_id]["location"] = camera.location
    CAMERAS[camera_id]["stream_url"] = camera.stream_url
    CAMERAS[camera_id]["is_active"] = camera.is_active
    CAMERAS[camera_id]["status"] = "online" if camera.is_active else "offline"
    CAMERAS[camera_id]["last_health_check"] = datetime.utcnow().isoformat()
    
    return {"message": "Camera updated"}

@router.delete("/{camera_id}")
async def delete_camera(
    camera_id: str,
    current_user=Depends(get_current_user_required)
):
    if camera_id not in CAMERAS:
        raise HTTPException(status_code=404, detail="Camera not found")
    
    del CAMERAS[camera_id]
    return {"message": "Camera deleted"}

from datetime import timedelta