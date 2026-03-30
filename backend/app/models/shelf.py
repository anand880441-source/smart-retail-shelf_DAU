from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from bson import ObjectId

class Shelf(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    aisle_id: str
    shelf_position: str  # top, middle, bottom
    product_sku: str
    product_name: str
    facing_count: int
    stock_level: int
    price: float
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    
class ShelfUpdate(BaseModel):
    facing_count: Optional[int] = None
    stock_level: Optional[int] = None
    price: Optional[float] = None