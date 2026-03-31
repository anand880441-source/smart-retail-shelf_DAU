from fastapi import APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect, Query
from typing import List, Optional
from ...core.database import get_database
from ...services.alert_service import (
    create_alert, get_active_alerts, get_all_alerts,
    update_alert_status, get_alerts_by_priority, get_alert_stats,
    get_alerts_by_status
)
from ...services.websocket_manager import manager
from ...models.alert import AlertCreate, AlertUpdate, AlertResponse
from ..dependencies import get_current_user_required
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(prefix="/alerts", tags=["Alerts"])

@router.get("/", response_model=List[dict])
async def get_alerts(
    status: Optional[str] = Query(None),
    limit: int = Query(100),
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    if status:
        return await get_alerts_by_status(db, status, limit)
    return await get_all_alerts(db, limit)

@router.post("/", response_model=dict)
async def create_new_alert(
    alert: AlertCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    created_alert = await create_alert(db, alert)
    await manager.broadcast({"type": "new_alert", "data": created_alert})
    return {"message": "Alert created", "alert": created_alert}

@router.get("/active", response_model=List[dict])
async def get_active_alerts_endpoint(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    return await get_active_alerts(db)

@router.get("/all", response_model=List[dict])
async def get_all_alerts_endpoint(
    limit: int = 100,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    return await get_all_alerts(db, limit)

@router.put("/{alert_id}")
async def resolve_alert(
    alert_id: str,
    update: AlertUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    success = await update_alert_status(db, alert_id, update.status)
    if not success:
        raise HTTPException(status_code=404, detail="Alert not found")
    return {"message": f"Alert {update.status}", "alert_id": alert_id}

@router.get("/stats")
async def get_stats(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    return await get_alert_stats(db)

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await websocket.send_json({"type": "pong"})
    except WebSocketDisconnect:
        manager.disconnect(websocket)