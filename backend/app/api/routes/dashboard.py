from fastapi import APIRouter, Depends
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from ...core.database import get_database
from ..routes.auth import get_current_user_required

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
async def get_dashboard_stats(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    # Get active alerts count
    active_alerts = await db.alerts.count_documents({"status": "active"})
    
    # Get critical alerts count
    critical_alerts = await db.alerts.count_documents({"status": "active", "priority": "critical"})
    
    # Get total revenue at risk
    revenue_pipeline = [
        {"$match": {"status": "active"}},
        {"$group": {"_id": None, "total": {"$sum": "$revenue_impact"}}}
    ]
    revenue_result = await db.alerts.aggregate(revenue_pipeline).to_list(None)
    revenue_at_risk = revenue_result[0]["total"] if revenue_result else 0
    
    # Get total products count (mock - from shelf map)
    total_products = 15  # From your ShelfMapPage data
    
    # Get low stock products (mock)
    low_stock_products = 3
    
    # Get store health score (mock)
    store_health = 92
    
    # Get planogram compliance (mock)
    planogram_compliance = 87
    
    return {
        "active_alerts": active_alerts,
        "critical_alerts": critical_alerts,
        "revenue_at_risk": revenue_at_risk,
        "total_products": total_products,
        "low_stock_products": low_stock_products,
        "store_health": store_health,
        "planogram_compliance": planogram_compliance
    }

@router.get("/recent-alerts")
async def get_recent_alerts(
    limit: int = 5,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    alerts = await db.alerts.find({"status": "active"}).sort("created_at", -1).to_list(limit)
    for alert in alerts:
        alert["_id"] = str(alert["_id"])
    return alerts