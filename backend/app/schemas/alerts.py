from pydantic import BaseModel
from typing import Optional
from datetime import datetime

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