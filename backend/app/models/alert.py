from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_pydantic_core_schema__(cls, source_type, handler):
        from pydantic_core import core_schema
        return core_schema.no_info_after_validator_function(
            cls.validate, core_schema.str_schema()
        )
    
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

class Alert(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    title: str
    description: str
    priority: str  # critical, high, medium, low
    type: str  # stockout, planogram_violation, price_mismatch, low_stock
    location: str  # aisle, shelf, store_id
    product_name: str
    product_sku: str
    status: str = "active"  # active, acknowledged, resolved
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None
    revenue_impact: float = 0.0
    
    model_config = {
        "populate_by_name": True,
        "arbitrary_types_allowed": True,
        "json_encoders": {ObjectId: str}
    }

class AlertCreate(BaseModel):
    title: str
    description: str
    priority: str
    type: str
    location: str
    product_name: str
    product_sku: str
    revenue_impact: float = 0.0

class AlertUpdate(BaseModel):
    status: str

class AlertResponse(BaseModel):
    id: str
    title: str
    description: str
    priority: str
    type: str
    location: str
    product_name: str
    product_sku: str
    status: str
    created_at: datetime
    revenue_impact: float