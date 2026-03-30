from pydantic import BaseModel
from typing import List, Optional

class DemandForecastResponse(BaseModel):
    product_sku: str
    days: int
    dates: List[str]
    forecast: List[int]
    upper_bound: List[int]
    lower_bound: List[int]
    confidence_level: int

class ReorderPointResponse(BaseModel):
    product_sku: str
    current_stock: int
    lead_time_days: int
    safety_stock_days: int
    forecast_demand_during_lead_time: int
    reorder_point: int
    should_reorder: bool
    recommended_order_quantity: int