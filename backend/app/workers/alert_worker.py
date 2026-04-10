import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient

from ..core.config import settings

async def process_alerts():
    """Background worker to process and dispatch alerts"""
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    
    while True:
        # Find unprocessed critical alerts
        alerts = await db.alerts.find({"status": "active", "priority": "critical"}).to_list(10)
        
        for alert in alerts:
            # Dispatch alert (email, webhook, etc.)
            print(f"[ALERT] {alert.get('title')} - {alert.get('priority')}")
            
            # Mark as processed
            await db.alerts.update_one(
                {"_id": alert["_id"]},
                {"$set": {"dispatched_at": datetime.utcnow()}}
            )
        
        await asyncio.sleep(5)  # Check every 5 seconds

if __name__ == "__main__":
    asyncio.run(process_alerts())