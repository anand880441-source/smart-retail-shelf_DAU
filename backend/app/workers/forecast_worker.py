import asyncio
import random
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient

async def generate_daily_forecasts():
    """Background worker to generate daily demand forecasts"""
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client.smart_retail
    
    while True:
        # Run at midnight
        now = datetime.utcnow()
        next_run = (now + timedelta(days=1)).replace(hour=0, minute=0, second=0)
        wait_seconds = (next_run - now).total_seconds()
        await asyncio.sleep(wait_seconds)
        
        # Generate forecasts for all products
        products = await db.products.find().to_list(100)
        for product in products:
            forecast = {
                "product_sku": product.get("sku"),
                "date": now.date().isoformat(),
                "forecast_quantity": random.randint(50, 200),
                "lower_bound": random.randint(30, 100),
                "upper_bound": random.randint(100, 250),
                "confidence": 90
            }
            await db.forecasts.insert_one(forecast)
        
        print(f"Forecasts generated for {len(products)} products at {now}")

if __name__ == "__main__":
    asyncio.run(generate_daily_forecasts())