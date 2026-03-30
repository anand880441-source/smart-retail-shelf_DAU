from typing import Dict, List
from datetime import datetime

class InventoryService:
    def __init__(self):
        self.inventory = {}
    
    async def get_inventory(self, store_id: str = None) -> List[Dict]:
        """Get current inventory levels"""
        # Mock inventory data
        return [
            {"sku": "MILK001", "product_name": "Milk 1L", "stock": 85, "location": "Aisle 1", "status": "good"},
            {"sku": "BRD004", "product_name": "White Bread", "stock": 8, "location": "Aisle 2", "status": "low"},
            {"sku": "EGG013", "product_name": "Eggs Dozen", "stock": 42, "location": "Aisle 5", "status": "good"},
        ]
    
    async def update_stock(self, sku: str, quantity: int, location: str) -> Dict:
        """Update stock level for a product"""
        return {
            "sku": sku,
            "old_stock": 50,  # mock
            "new_stock": quantity,
            "location": location,
            "updated_at": datetime.utcnow().isoformat(),
            "status": "critical" if quantity < 10 else "good"
        }
    
    async def get_low_stock_items(self, threshold: int = 10) -> List[Dict]:
        """Get all items with stock below threshold"""
        inventory = await self.get_inventory()
        return [item for item in inventory if item["stock"] < threshold]
    
    async def get_out_of_stock_items(self) -> List[Dict]:
        """Get all out of stock items"""
        inventory = await self.get_inventory()
        return [item for item in inventory if item["stock"] == 0]