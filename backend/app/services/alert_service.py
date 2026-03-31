from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from ..models.alert import AlertCreate, AlertUpdate

def _serialize_alert(alert):
    """Convert MongoDB alert doc to JSON-friendly dict with 'id' field."""
    if alert:
        alert["id"] = str(alert.pop("_id", ""))
    return alert

async def create_alert(db: AsyncIOMotorDatabase, alert_data: AlertCreate):
    alert_dict = alert_data.model_dump()
    alert_dict["created_at"] = datetime.utcnow()
    alert_dict["status"] = "active"
    
    result = await db.alerts.insert_one(alert_dict)
    created_alert = await db.alerts.find_one({"_id": result.inserted_id})
    return _serialize_alert(created_alert)

async def get_active_alerts(db: AsyncIOMotorDatabase):
    alerts = await db.alerts.find({"status": "active"}).sort("created_at", -1).to_list(100)
    return [_serialize_alert(a) for a in alerts]

async def get_all_alerts(db: AsyncIOMotorDatabase, limit: int = 100):
    alerts = await db.alerts.find().sort("created_at", -1).to_list(limit)
    return [_serialize_alert(a) for a in alerts]

async def get_alerts_by_status(db: AsyncIOMotorDatabase, status: str, limit: int = 100):
    alerts = await db.alerts.find({"status": status}).sort("created_at", -1).to_list(limit)
    return [_serialize_alert(a) for a in alerts]

async def update_alert_status(db: AsyncIOMotorDatabase, alert_id: str, status: str):
    result = await db.alerts.update_one(
        {"_id": ObjectId(alert_id)},
        {"$set": {"status": status, "resolved_at": datetime.utcnow() if status == "resolved" else None}}
    )
    return result.modified_count > 0

async def get_alerts_by_priority(db: AsyncIOMotorDatabase, priority: str):
    alerts = await db.alerts.find({"status": "active", "priority": priority}).sort("created_at", -1).to_list(50)
    return [_serialize_alert(a) for a in alerts]

async def get_alert_stats(db: AsyncIOMotorDatabase):
    pipeline = [
        {"$match": {"status": "active"}},
        {"$group": {
            "_id": "$priority",
            "count": {"$sum": 1},
            "total_revenue": {"$sum": "$revenue_impact"}
        }}
    ]
    stats = await db.alerts.aggregate(pipeline).to_list(None)
    
    result = {"critical": 0, "high": 0, "medium": 0, "low": 0, "total_revenue": 0}
    for stat in stats:
        if stat["_id"] in result:
            result[stat["_id"]] = stat["count"]
        result["total_revenue"] += stat.get("total_revenue", 0)
    
    return result