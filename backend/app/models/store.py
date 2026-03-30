from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from bson import ObjectId

class Store(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    name: str
    address: str
    city: str
    state: str
    zip_code: str
    phone: str
    email: str
    manager_name: str
    total_aisles: int = 5
    status: str = "active"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
class StoreCreate(BaseModel):
    name: str
    address: str
    city: str
    state: str
    zip_code: str
    phone: str
    email: str
    manager_name: str
    total_aisles: int = 5