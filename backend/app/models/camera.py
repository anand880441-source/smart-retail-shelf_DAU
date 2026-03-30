from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field
from bson import ObjectId

class Camera(BaseModel):
    id: Optional[str] = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    name: str
    location: str
    stream_url: str
    is_active: bool = True
    status: str = "offline"
    last_health_check: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True