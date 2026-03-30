from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId

class POSTransaction(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    store_id: str
    product_sku: str
    product_name: str
    quantity: int
    price: float
    total_amount: float
    transaction_time: datetime = Field(default_factory=datetime.utcnow)
    payment_method: str = "cash"  # cash, card, upi
    
class POSSummary(BaseModel):
    total_sales: float
    total_transactions: int
    top_products: list
    hourly_breakdown: dict