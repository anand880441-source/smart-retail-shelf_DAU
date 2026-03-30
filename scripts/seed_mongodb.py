import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def seed_database():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.smart_retail
    
    # Create sample products
    products = [
        {"sku": "MILK001", "name": "Milk 1L", "price": 3.99, "category": "Dairy", "stock": 85},
        {"sku": "BRD004", "name": "White Bread", "price": 2.49, "category": "Bakery", "stock": 8},
        {"sku": "EGG013", "name": "Eggs Dozen", "price": 4.99, "category": "Eggs", "stock": 42},
    ]
    
    for product in products:
        await db.products.update_one({"sku": product["sku"]}, {"$set": product}, upsert=True)
    
    # Create sample alerts
    alerts = [
        {"title": "Low Stock: White Bread", "priority": "high", "type": "low_stock", "status": "active", "revenue_impact": 120},
        {"title": "Stockout: Croissant", "priority": "critical", "type": "stockout", "status": "active", "revenue_impact": 300},
    ]
    
    for alert in alerts:
        await db.alerts.insert_one(alert)
    
    print("Database seeded successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())