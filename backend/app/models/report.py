from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class StockoutReport(BaseModel):
    period_days: int
    total_stockouts: int
    critical_stockouts: int
    total_revenue_loss: float
    top_products: List[dict]
    
class ComplianceReport(BaseModel):
    total_planograms: int
    average_compliance: float
    planograms: List[dict]
    
class InventoryReport(BaseModel):
    total_products: int
    total_inventory_units: int
    low_stock_items: int
    out_of_stock_items: int
    products: List[dict]