from pydantic import BaseModel
from typing import Optional, List

class StockUpdate(BaseModel):
    sku: str
    quantity: int
    location: str

class InventoryItem(BaseModel):
    sku: str
    product_name: str
    current_stock: int
    location: str
    status: str

class InventoryResponse(BaseModel):
    items: List[InventoryItem]
    total_items: int
    low_stock_count: int
    out_of_stock_count: int