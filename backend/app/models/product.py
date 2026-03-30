from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId

class Product(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    sku: str
    name: str
    price: float
    category: str
    stock_level: int
    reorder_point: int = 10
    supplier: Optional[str] = None
    last_updated: datetime = Field(default_factory=datetime.utcnow)

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    stock_level: Optional[int] = None
    reorder_point: Optional[int] = None