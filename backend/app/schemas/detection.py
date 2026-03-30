from pydantic import BaseModel
from typing import List, Optional

class DetectionResult(BaseModel):
    success: bool
    image_size: tuple
    products_detected: int
    detections: List[dict]
    low_stock_alerts_created: int

class ProductDetail(BaseModel):
    sku: str
    name: str
    price: float
    category: str
    confidence: float
    position: str
    facing_count: int