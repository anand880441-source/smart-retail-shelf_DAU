from datetime import datetime
from typing import Optional, List
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

class ProductPlacement(BaseModel):
    product_name: str
    product_sku: str
    expected_position: str  # e.g., "top_shelf", "middle_shelf", "bottom_shelf"
    expected_facing_count: int
    actual_facing_count: Optional[int] = None
    is_correct: Optional[bool] = None

class Planogram(BaseModel):
    id: Optional[PyObjectId] = Field(default_factory=PyObjectId, alias="_id")
    name: str
    store_id: str
    aisle: str
    shelf_layout_image_url: Optional[str] = None
    products: List[ProductPlacement]
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class PlanogramCreate(BaseModel):
    name: str
    store_id: str
    aisle: str
    shelf_layout_image_url: Optional[str] = None
    products: List[ProductPlacement]

class ComplianceResult(BaseModel):
    planogram_id: str
    total_products: int
    correct_placements: int
    compliance_score: float
    violations: List[dict]