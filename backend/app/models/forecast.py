from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class DemandForecast(BaseModel):
    product_sku: str
    product_name: str
    forecast_dates: List[str]
    forecast_values: List[int]
    upper_bound: List[int]
    lower_bound: List[int]
    confidence_level: int = 90
    generated_at: datetime = datetime.utcnow()

class ReorderPoint(BaseModel):
    product_sku: str
    current_stock: int
    lead_time_days: int
    forecast_demand: int
    reorder_point: int
    should_reorder: bool
    recommended_quantity: int