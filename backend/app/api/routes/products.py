from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from ...core.database import get_database
from ..routes.auth import get_current_user_required
from pydantic import BaseModel

router = APIRouter(prefix="/products", tags=["Products"])

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    stock_level: Optional[int] = None

# Product database
PRODUCTS = {
    "MILK001": {"name": "Milk 1L", "price": 3.99, "category": "Dairy", "stock_level": 85},
    "CHS002": {"name": "Cheese", "price": 5.49, "category": "Dairy", "stock_level": 45},
    "YGT003": {"name": "Yogurt", "price": 2.99, "category": "Dairy", "stock_level": 12},
    "BRD004": {"name": "White Bread", "price": 2.49, "category": "Bakery", "stock_level": 8},
    "CRO005": {"name": "Croissant", "price": 1.99, "category": "Bakery", "stock_level": 0},
    "BGL006": {"name": "Bagels", "price": 3.49, "category": "Bakery", "stock_level": 24},
    "APL007": {"name": "Apples", "price": 0.99, "category": "Produce", "stock_level": 56},
    "BAN008": {"name": "Bananas", "price": 0.69, "category": "Produce", "stock_level": 23},
    "ORG009": {"name": "Oranges", "price": 1.29, "category": "Produce", "stock_level": 3},
    "CHP010": {"name": "Potato Chips", "price": 4.99, "category": "Snacks", "stock_level": 34},
    "COK011": {"name": "Cookies", "price": 3.49, "category": "Snacks", "stock_level": 0},
    "POP012": {"name": "Popcorn", "price": 2.99, "category": "Snacks", "stock_level": 18},
    "EGG013": {"name": "Eggs Dozen", "price": 4.99, "category": "Eggs", "stock_level": 42},
    "BTR014": {"name": "Butter", "price": 5.49, "category": "Dairy", "stock_level": 7},
    "CRM015": {"name": "Cream Cheese", "price": 3.99, "category": "Dairy", "stock_level": 0},
}

@router.get("/")
async def get_all_products(
    category: Optional[str] = None,
    current_user=Depends(get_current_user_required)
):
    products = []
    for sku, data in PRODUCTS.items():
        if category and data["category"].lower() != category.lower():
            continue
        products.append({
            "sku": sku,
            "name": data["name"],
            "price": data["price"],
            "category": data["category"],
            "stock_level": data["stock_level"],
            "status": "in_stock" if data["stock_level"] > 10 else "low_stock" if data["stock_level"] > 0 else "out_of_stock"
        })
    return products

@router.get("/{sku}")
async def get_product(
    sku: str,
    current_user=Depends(get_current_user_required)
):
    product = PRODUCTS.get(sku)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {
        "sku": sku,
        "name": product["name"],
        "price": product["price"],
        "category": product["category"],
        "stock_level": product["stock_level"]
    }

@router.put("/{sku}")
async def update_product(
    sku: str,
    update: ProductUpdate,
    current_user=Depends(get_current_user_required)
):
    if sku not in PRODUCTS:
        raise HTTPException(status_code=404, detail="Product not found")
    
    if update.name:
        PRODUCTS[sku]["name"] = update.name
    if update.price:
        PRODUCTS[sku]["price"] = update.price
    if update.category:
        PRODUCTS[sku]["category"] = update.category
    if update.stock_level is not None:
        PRODUCTS[sku]["stock_level"] = update.stock_level
    
    return {"message": "Product updated", "product": PRODUCTS[sku]}

@router.get("/categories")
async def get_categories(
    current_user=Depends(get_current_user_required)
):
    categories = list(set(p["category"] for p in PRODUCTS.values()))
    return {"categories": categories}