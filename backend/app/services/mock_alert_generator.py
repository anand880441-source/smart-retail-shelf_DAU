import asyncio
import random
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorDatabase

products = [
    {"name": "Milk 1L", "sku": "MILK001", "aisle": "Aisle 1 - Dairy"},
    {"name": "White Bread", "sku": "BRD004", "aisle": "Aisle 2 - Bakery"},
    {"name": "Eggs Dozen", "sku": "EGG013", "aisle": "Aisle 5 - Eggs"},
    {"name": "Butter", "sku": "BTR014", "aisle": "Aisle 5 - Eggs"},
    {"name": "Apples", "sku": "APL007", "aisle": "Aisle 3 - Produce"},
    {"name": "Bananas", "sku": "BAN008", "aisle": "Aisle 3 - Produce"},
    {"name": "Potato Chips", "sku": "CHP010", "aisle": "Aisle 4 - Snacks"},
    {"name": "Cream Cheese", "sku": "CRM015", "aisle": "Aisle 5 - Eggs"},
]

priorities = ["critical", "high", "medium", "low"]
alert_types = ["stockout", "low_stock", "planogram_violation"]

async def generate_mock_alerts(db: AsyncIOMotorDatabase):
    while True:
        await asyncio.sleep(random.randint(15, 45))  # Alert every 15-45 seconds
        
        product = random.choice(products)
        priority = random.choice(priorities)
        alert_type = random.choice(alert_types)
        
        stock_impact = random.randint(50, 500)
        
        alert_data = {
            "title": f"{alert_type.replace('_', ' ').title()}: {product['name']}",
            "description": f"Product {product['name']} in {product['aisle']} requires attention",
            "priority": priority,
            "type": alert_type,
            "location": product["aisle"],
            "product_name": product["name"],
            "product_sku": product["sku"],
            "revenue_impact": stock_impact
        }
        
        await db.alerts.insert_one(alert_data)
        print(f"Mock alert created: {product['name']} - {priority}")