from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from typing import List, Dict
import base64
import io
from PIL import Image
import numpy as np
from motor.motor_asyncio import AsyncIOMotorDatabase
from ...core.database import get_database
from ..routes.auth import get_current_user_required
from datetime import datetime  

router = APIRouter(prefix="/detection", tags=["Detection"])

# Mock product database for detection
PRODUCT_DB = {
    "MILK001": {"name": "Milk 1L", "price": 3.99, "category": "Dairy"},
    "CHS002": {"name": "Cheese", "price": 5.49, "category": "Dairy"},
    "YGT003": {"name": "Yogurt", "price": 2.99, "category": "Dairy"},
    "BRD004": {"name": "White Bread", "price": 2.49, "category": "Bakery"},
    "CRO005": {"name": "Croissant", "price": 1.99, "category": "Bakery"},
    "BGL006": {"name": "Bagels", "price": 3.49, "category": "Bakery"},
    "APL007": {"name": "Apples", "price": 0.99, "category": "Produce"},
    "BAN008": {"name": "Bananas", "price": 0.69, "category": "Produce"},
    "ORG009": {"name": "Oranges", "price": 1.29, "category": "Produce"},
    "CHP010": {"name": "Potato Chips", "price": 4.99, "category": "Snacks"},
    "COK011": {"name": "Cookies", "price": 3.49, "category": "Snacks"},
    "POP012": {"name": "Popcorn", "price": 2.99, "category": "Snacks"},
    "EGG013": {"name": "Eggs Dozen", "price": 4.99, "category": "Eggs"},
    "BTR014": {"name": "Butter", "price": 5.49, "category": "Dairy"},
    "CRM015": {"name": "Cream Cheese", "price": 3.99, "category": "Dairy"},
}

@router.post("/analyze-shelf")
async def analyze_shelf_image(
    file: UploadFile = File(...),
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    """Analyze shelf image and detect products"""
    try:
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Mock detection results
        # In production, this would use YOLO model
        detected_products = [
            {"sku": "MILK001", "confidence": 0.95, "position": "top_shelf", "facing_count": 2},
            {"sku": "CHS002", "confidence": 0.92, "position": "middle_shelf", "facing_count": 1},
            {"sku": "YGT003", "confidence": 0.88, "position": "bottom_shelf", "facing_count": 1},
            {"sku": "BRD004", "confidence": 0.94, "position": "top_shelf", "facing_count": 1},
            {"sku": "EGG013", "confidence": 0.91, "position": "middle_shelf", "facing_count": 2},
        ]
        
        # Enrich with product details
        results = []
        low_stock_detected = []
        
        for detection in detected_products:
            product = PRODUCT_DB.get(detection["sku"], {})
            results.append({
                "sku": detection["sku"],
                "name": product.get("name", "Unknown"),
                "price": product.get("price", 0),
                "category": product.get("category", "Unknown"),
                "confidence": detection["confidence"],
                "position": detection["position"],
                "facing_count": detection["facing_count"]
            })
            
            # Check for low stock (mock logic)
            if detection["facing_count"] == 1:
                low_stock_detected.append(detection["sku"])
        
        # Create alerts for low stock detected
        for sku in low_stock_detected:
            product = PRODUCT_DB.get(sku, {})
            existing_alert = await db.alerts.find_one({
                "product_sku": sku,
                "type": "low_stock",
                "status": "active"
            })
            
            if not existing_alert:
                alert = {
                    "title": f"Low Stock Alert: {product.get('name', sku)}",
                    "description": f"Product has only 1 facing remaining. Needs restocking.",
                    "priority": "medium",
                    "type": "low_stock",
                    "location": "Shelf",
                    "product_name": product.get("name", sku),
                    "product_sku": sku,
                    "status": "active",
                    "revenue_impact": product.get("price", 0) * 50,
                    "created_at": datetime.utcnow()
                }
                await db.alerts.insert_one(alert)
        
        return {
            "success": True,
            "image_size": image.size,
            "products_detected": len(results),
            "detections": results,
            "low_stock_alerts_created": len(low_stock_detected)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/product/{sku}")
async def get_product_details(
    sku: str,
    current_user=Depends(get_current_user_required)
):
    product = PRODUCT_DB.get(sku)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

from datetime import datetime