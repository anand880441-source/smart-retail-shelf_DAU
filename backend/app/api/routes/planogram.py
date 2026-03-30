from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from typing import List
from ...core.database import get_database
from ...services.planogram_service import (
    create_planogram, get_planograms, get_planogram, compare_compliance
)
from ...models.planogram import PlanogramCreate, ComplianceResult
from ..routes.auth import get_current_user_required
from motor.motor_asyncio import AsyncIOMotorDatabase
import base64
import io
from PIL import Image

router = APIRouter(prefix="/planogram", tags=["Planogram"])

@router.post("/")
async def create_new_planogram(
    planogram: PlanogramCreate,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    result = await create_planogram(db, planogram)
    return {"message": "Planogram created", "planogram": result}

@router.get("/")
async def list_planograms(
    store_id: str = None,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    return await get_planograms(db, store_id)

@router.get("/{planogram_id}")
async def get_planogram_by_id(
    planogram_id: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    planogram = await get_planogram(db, planogram_id)
    if not planogram:
        raise HTTPException(status_code=404, detail="Planogram not found")
    return planogram

@router.post("/{planogram_id}/compare")
async def compare_with_detection(
    planogram_id: str,
    detected_products: List[dict],
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    result = await compare_compliance(db, planogram_id, detected_products)
    if not result:
        raise HTTPException(status_code=404, detail="Planogram not found")
    return result

@router.post("/upload-image")
async def upload_shelf_image(
    file: UploadFile = File(...),
    current_user=Depends(get_current_user_required)
):
    # Mock image processing - in production, this would use YOLO
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))
    
    # Mock detection results
    mock_detected_products = [
        {"product_name": "Milk 1L", "product_sku": "MILK001", "position": "top_shelf", "facing_count": 2},
        {"product_name": "Cheese", "product_sku": "CHS002", "position": "middle_shelf", "facing_count": 1},
        {"product_name": "Yogurt", "product_sku": "YGT003", "position": "bottom_shelf", "facing_count": 1},
    ]
    
    return {
        "message": "Image processed",
        "detected_products": mock_detected_products,
        "image_size": image.size
    }