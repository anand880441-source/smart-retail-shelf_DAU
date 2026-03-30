from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from ...core.database import get_database
from ..routes.auth import get_current_user_required
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/stores", tags=["Stores"])

class StoreCreate(BaseModel):
    name: str
    address: str
    city: str
    state: str
    zip_code: str
    phone: str
    email: str
    manager_name: str
    total_aisles: int = 5

class StoreUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    manager_name: Optional[str] = None

# Mock store database
STORES = {
    "store_001": {
        "name": "Smart Retail Downtown",
        "address": "123 Main Street",
        "city": "Ahmedabad",
        "state": "Gujarat",
        "zip_code": "380015",
        "phone": "+91 98765 43210",
        "email": "downtown@smartretail.com",
        "manager_name": "Raunak Shahu",
        "total_aisles": 5,
        "created_at": datetime.utcnow().isoformat(),
        "status": "active"
    }
}

@router.get("/")
async def get_all_stores(
    current_user=Depends(get_current_user_required)
):
    stores = []
    for store_id, data in STORES.items():
        stores.append({
            "id": store_id,
            "name": data["name"],
            "address": data["address"],
            "city": data["city"],
            "state": data["state"],
            "phone": data["phone"],
            "manager_name": data["manager_name"],
            "status": data["status"]
        })
    return stores

@router.get("/{store_id}")
async def get_store(
    store_id: str,
    current_user=Depends(get_current_user_required)
):
    if store_id not in STORES:
        raise HTTPException(status_code=404, detail="Store not found")
    data = STORES[store_id]
    return {
        "id": store_id,
        "name": data["name"],
        "address": data["address"],
        "city": data["city"],
        "state": data["state"],
        "zip_code": data["zip_code"],
        "phone": data["phone"],
        "email": data["email"],
        "manager_name": data["manager_name"],
        "total_aisles": data["total_aisles"],
        "status": data["status"]
    }

@router.post("/")
async def create_store(
    store: StoreCreate,
    current_user=Depends(get_current_user_required)
):
    import uuid
    store_id = f"store_{str(uuid.uuid4())[:8]}"
    STORES[store_id] = {
        "name": store.name,
        "address": store.address,
        "city": store.city,
        "state": store.state,
        "zip_code": store.zip_code,
        "phone": store.phone,
        "email": store.email,
        "manager_name": store.manager_name,
        "total_aisles": store.total_aisles,
        "created_at": datetime.utcnow().isoformat(),
        "status": "active"
    }
    return {"message": "Store created", "store_id": store_id}

@router.put("/{store_id}")
async def update_store(
    store_id: str,
    update: StoreUpdate,
    current_user=Depends(get_current_user_required)
):
    if store_id not in STORES:
        raise HTTPException(status_code=404, detail="Store not found")
    
    if update.name:
        STORES[store_id]["name"] = update.name
    if update.address:
        STORES[store_id]["address"] = update.address
    if update.phone:
        STORES[store_id]["phone"] = update.phone
    if update.manager_name:
        STORES[store_id]["manager_name"] = update.manager_name
    
    return {"message": "Store updated"}

@router.delete("/{store_id}")
async def delete_store(
    store_id: str,
    current_user=Depends(get_current_user_required)
):
    if store_id not in STORES:
        raise HTTPException(status_code=404, detail="Store not found")
    
    del STORES[store_id]
    return {"message": "Store deleted"}