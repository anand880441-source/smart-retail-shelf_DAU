import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient

from ..core.config import settings

async def process_detection_queue():
    """Background worker to process detection jobs"""
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.MONGODB_DB_NAME]
    
    while True:
        # Find pending detection jobs
        jobs = await db.detection_jobs.find({"status": "pending"}).to_list(10)
        
        for job in jobs:
            # Process detection
            print(f"Processing detection job: {job.get('_id')}")
            
            # Update status
            await db.detection_jobs.update_one(
                {"_id": job["_id"]},
                {"$set": {"status": "completed", "completed_at": datetime.utcnow()}}
            )
        
        await asyncio.sleep(2)  # Check every 2 seconds

if __name__ == "__main__":
    asyncio.run(process_detection_queue())