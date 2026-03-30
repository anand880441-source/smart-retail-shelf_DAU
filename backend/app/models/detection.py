from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from bson import ObjectId

class DetectionResult(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    image_url: str
    detected_products: List[dict]
    total_products: int
    processing_time_ms: float
    created_at: datetime = Field(default_factory=datetime.utcnow)

class DetectionRequest(BaseModel):
    image_base64: str
    planogram_id: Optional[str] = None