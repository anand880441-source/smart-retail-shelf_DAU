from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId
from ..models.planogram import PlanogramCreate, ComplianceResult

async def create_planogram(db: AsyncIOMotorDatabase, planogram_data: PlanogramCreate):
    planogram_dict = planogram_data.model_dump()
    planogram_dict["created_at"] = datetime.utcnow()
    planogram_dict["updated_at"] = datetime.utcnow()
    
    result = await db.planograms.insert_one(planogram_dict)
    return await db.planograms.find_one({"_id": result.inserted_id})

async def get_planograms(db: AsyncIOMotorDatabase, store_id: str = None):
    query = {}
    if store_id:
        query["store_id"] = store_id
    planograms = await db.planograms.find(query).to_list(100)
    for p in planograms:
        p["_id"] = str(p["_id"])
    return planograms

async def get_planogram(db: AsyncIOMotorDatabase, planogram_id: str):
    planogram = await db.planograms.find_one({"_id": ObjectId(planogram_id)})
    if planogram:
        planogram["_id"] = str(planogram["_id"])
    return planogram

async def compare_compliance(db: AsyncIOMotorDatabase, planogram_id: str, detected_products: list[dict]):
    planogram = await get_planogram(db, planogram_id)
    if not planogram:
        return None
    
    violations = []
    correct_count = 0
    
    for expected in planogram["products"]:
        # Find matching product in detected
        detected = next(
            (d for d in detected_products if d["product_sku"] == expected["product_sku"]),
            None
        )
        
        if not detected:
            violations.append({
                "product_name": expected["product_name"],
                "product_sku": expected["product_sku"],
                "issue": "Missing product",
                "severity": "high"
            })
        elif detected.get("facing_count", 0) < expected["expected_facing_count"]:
            violations.append({
                "product_name": expected["product_name"],
                "product_sku": expected["product_sku"],
                "issue": f"Insufficient facings: Expected {expected['expected_facing_count']}, Found {detected.get('facing_count', 0)}",
                "severity": "medium"
            })
            correct_count += 1
        elif detected.get("position") != expected["expected_position"]:
            violations.append({
                "product_name": expected["product_name"],
                "product_sku": expected["product_sku"],
                "issue": f"Wrong position: Expected {expected['expected_position']}, Found {detected.get('position')}",
                "severity": "medium"
            })
            correct_count += 1
        else:
            correct_count += 1
    
    compliance_score = (correct_count / len(planogram["products"])) * 100
    
    # Create alerts for violations
    for violation in violations:
        if violation["severity"] == "high":
            alert = {
                "title": f"Planogram Violation: {violation['product_name']}",
                "description": violation["issue"],
                "priority": "high",
                "type": "planogram_violation",
                "location": planogram["aisle"],
                "product_name": violation["product_name"],
                "product_sku": violation["product_sku"],
                "status": "active",
                "revenue_impact": 0
            }
            await db.alerts.insert_one(alert)
    
    return ComplianceResult(
        planogram_id=planogram_id,
        total_products=len(planogram["products"]),
        correct_placements=correct_count,
        compliance_score=compliance_score,
        violations=violations
    )

from datetime import datetime