from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, List
from motor.motor_asyncio import AsyncIOMotorDatabase
from ...core.database import get_database
from ..routes.auth import get_current_user_required
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/inventory", tags=["Inventory"])

class StockUpdate(BaseModel):
    sku: str
    quantity: int
    location: str

class InventoryItem(BaseModel):
    sku: str
    product_name: str
    current_stock: int
    location: str
    last_updated: datetime
    status: str

# Mock inventory data
INVENTORY = {
    "MILK001": {"product_name": "Milk 1L", "current_stock": 85, "location": "Aisle 1", "status": "good"},
    "CHS002": {"product_name": "Cheese", "current_stock": 45, "location": "Aisle 1", "status": "good"},
    "YGT003": {"product_name": "Yogurt", "current_stock": 12, "location": "Aisle 1", "status": "low"},
    "BRD004": {"product_name": "White Bread", "current_stock": 8, "location": "Aisle 2", "status": "low"},
    "CRO005": {"product_name": "Croissant", "current_stock": 0, "location": "Aisle 2", "status": "out"},
    "BGL006": {"product_name": "Bagels", "current_stock": 24, "location": "Aisle 2", "status": "good"},
    "APL007": {"product_name": "Apples", "current_stock": 56, "location": "Aisle 3", "status": "good"},
    "BAN008": {"product_name": "Bananas", "current_stock": 23, "location": "Aisle 3", "status": "good"},
    "ORG009": {"product_name": "Oranges", "current_stock": 3, "location": "Aisle 3", "status": "critical"},
    "CHP010": {"product_name": "Potato Chips", "current_stock": 34, "location": "Aisle 4", "status": "good"},
    "COK011": {"product_name": "Cookies", "current_stock": 0, "location": "Aisle 4", "status": "out"},
    "POP012": {"product_name": "Popcorn", "current_stock": 18, "location": "Aisle 4", "status": "good"},
    "EGG013": {"product_name": "Eggs Dozen", "current_stock": 42, "location": "Aisle 5", "status": "good"},
    "BTR014": {"product_name": "Butter", "current_stock": 7, "location": "Aisle 5", "status": "low"},
    "CRM015": {"product_name": "Cream Cheese", "current_stock": 0, "location": "Aisle 5", "status": "out"},
}

@router.get("/")
async def get_inventory(
    status: Optional[str] = None,
    location: Optional[str] = None,
    current_user=Depends(get_current_user_required)
):
    items = []
    for sku, data in INVENTORY.items():
        if status and data["status"] != status:
            continue
        if location and data["location"] != location:
            continue
        items.append({
            "sku": sku,
            "product_name": data["product_name"],
            "current_stock": data["current_stock"],
            "location": data["location"],
            "status": data["status"]
        })
    return items

@router.get("/low-stock")
async def get_low_stock_items(
    threshold: int = 10,
    current_user=Depends(get_current_user_required)
):
    low_stock = []
    for sku, data in INVENTORY.items():
        if data["current_stock"] <= threshold and data["current_stock"] > 0:
            low_stock.append({
                "sku": sku,
                "product_name": data["product_name"],
                "current_stock": data["current_stock"],
                "location": data["location"],
                "status": "low"
            })
    return low_stock

@router.get("/out-of-stock")
async def get_out_of_stock_items(
    current_user=Depends(get_current_user_required)
):
    out_of_stock = []
    for sku, data in INVENTORY.items():
        if data["current_stock"] == 0:
            out_of_stock.append({
                "sku": sku,
                "product_name": data["product_name"],
                "location": data["location"],
                "status": "out"
            })
    return out_of_stock

@router.post("/update")
async def update_stock(
    update: StockUpdate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    if update.sku not in INVENTORY:
        raise HTTPException(status_code=404, detail="Product not found")
    
    old_stock = INVENTORY[update.sku]["current_stock"]
    INVENTORY[update.sku]["current_stock"] = update.quantity
    
    # Update status based on new stock level
    if update.quantity <= 0:
        INVENTORY[update.sku]["status"] = "out"
    elif update.quantity < 10:
        INVENTORY[update.sku]["status"] = "critical"
    elif update.quantity < 20:
        INVENTORY[update.sku]["status"] = "low"
    else:
        INVENTORY[update.sku]["status"] = "good"
    
    # Create alert if stock became critical
    if update.quantity < 10 and old_stock >= 10:
        alert = {
            "title": f"Critical Stock: {INVENTORY[update.sku]['product_name']}",
            "description": f"Stock level dropped to {update.quantity} units",
            "priority": "critical",
            "type": "low_stock",
            "location": update.location,
            "product_name": INVENTORY[update.sku]["product_name"],
            "product_sku": update.sku,
            "status": "active",
            "revenue_impact": 500,
            "created_at": datetime.utcnow()
        }
        await db.alerts.insert_one(alert)
    
    return {
        "message": "Stock updated",
        "sku": update.sku,
        "old_stock": old_stock,
        "new_stock": update.quantity,
        "status": INVENTORY[update.sku]["status"]
    }