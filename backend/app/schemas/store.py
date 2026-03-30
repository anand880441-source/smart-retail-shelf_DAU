from pydantic import BaseModel
from typing import Optional

class StoreSchema(BaseModel):
    name: str
    address: str
    city: str
    state: str
    zip_code: str
    phone: str
    email: str
    manager_name: str
    total_aisles: int = 5
    
class StoreUpdateSchema(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    manager_name: Optional[str] = None