from pydantic import BaseModel
from typing import List, Optional

class ProductPlacementSchema(BaseModel):
    product_name: str
    product_sku: str
    expected_position: str
    expected_facing_count: int

class PlanogramCreate(BaseModel):
    name: str
    store_id: str
    aisle: str
    shelf_layout_image_url: Optional[str] = None
    products: List[ProductPlacementSchema]

class ComplianceResult(BaseModel):
    planogram_id: str
    total_products: int
    correct_placements: int
    compliance_score: float
    violations: List[dict]