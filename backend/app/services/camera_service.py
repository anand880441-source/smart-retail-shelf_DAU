from datetime import datetime
from typing import List, Dict
import httpx

CAMERAS: Dict[str, Dict] = {}

async def get_all_cameras():
    return list(CAMERAS.values())

async def get_camera(camera_id: str):
    return CAMERAS.get(camera_id)

async def add_camera(camera_data: dict):
    camera_id = f"CAM{len(CAMERAS) + 1:03d}"
    camera = {
        "id": camera_id,
        **camera_data,
        "status": "offline",
        "last_health_check": datetime.utcnow().isoformat(),
        "created_at": datetime.utcnow().isoformat()
    }
    CAMERAS[camera_id] = camera
    return camera

async def update_camera(camera_id: str, camera_data: dict):
    if camera_id not in CAMERAS:
        return None
    CAMERAS[camera_id].update(camera_data)
    CAMERAS[camera_id]["last_health_check"] = datetime.utcnow().isoformat()
    return CAMERAS[camera_id]

async def delete_camera(camera_id: str):
    return CAMERAS.pop(camera_id, None)

async def check_camera_health(stream_url: str) -> bool:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(stream_url, timeout=5.0)
            return response.status_code == 200
    except:
        return False