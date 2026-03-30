from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

mongodb = MongoDB()

async def connect_to_mongo():
    mongodb.client = AsyncIOMotorClient(settings.MONGODB_URL)
    mongodb.db = mongodb.client[settings.MONGODB_DB_NAME]
    print(f"Connected to MongoDB: {settings.MONGODB_DB_NAME}")

async def close_mongo_connection():
    if mongodb.client:
        mongodb.client.close()
        print("Disconnected from MongoDB")

def get_database():
    return mongodb.db