from fastapi import APIRouter, Depends, HTTPException
from typing import List, Optional
from motor.motor_asyncio import AsyncIOMotorDatabase
from ...core.database import get_database
from ..routes.auth import get_current_user_required
from datetime import datetime, timedelta
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from io import BytesIO
from fastapi.responses import StreamingResponse

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/stockout")
async def get_stockout_report(
    days: int = 30,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    """Generate stockout report"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Get stockout alerts from database
    alerts = await db.alerts.find({
        "type": "stockout",
        "created_at": {"$gte": start_date}
    }).to_list(1000)
    
    # Calculate statistics
    total_stockouts = len(alerts)
    critical_stockouts = len([a for a in alerts if a.get("priority") == "critical"])
    total_revenue_loss = sum(a.get("revenue_impact", 0) for a in alerts)
    
    # Group by product
    product_stats = {}
    for alert in alerts:
        product = alert.get("product_name", "Unknown")
        if product not in product_stats:
            product_stats[product] = {"count": 0, "revenue": 0}
        product_stats[product]["count"] += 1
        product_stats[product]["revenue"] += alert.get("revenue_impact", 0)
    
    # Sort products by count
    top_products = sorted(product_stats.items(), key=lambda x: x[1]["count"], reverse=True)[:10]
    
    return {
        "period_days": days,
        "total_stockouts": total_stockouts,
        "critical_stockouts": critical_stockouts,
        "total_revenue_loss": total_revenue_loss,
        "top_products": [
            {"name": name, "count": stats["count"], "revenue_loss": stats["revenue"]}
            for name, stats in top_products
        ],
        "alerts": [
            {
                "id": str(a["_id"]),
                "product": a.get("product_name"),
                "sku": a.get("product_sku"),
                "priority": a.get("priority"),
                "revenue_impact": a.get("revenue_impact", 0),
                "date": a.get("created_at").isoformat() if a.get("created_at") else None
            }
            for a in alerts[:50]
        ]
    }

@router.get("/compliance")
async def get_compliance_report(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    """Generate planogram compliance report"""
    planograms = await db.planograms.find().to_list(100)
    
    compliance_scores = []
    for p in planograms:
        # Get compliance checks for this planogram
        compliance_scores.append({
            "name": p.get("name"),
            "aisle": p.get("aisle"),
            "compliance_score": 85  # Mock score
        })
    
    avg_compliance = sum(c["compliance_score"] for c in compliance_scores) / len(compliance_scores) if compliance_scores else 0
    
    return {
        "total_planograms": len(planograms),
        "average_compliance": round(avg_compliance, 1),
        "planograms": compliance_scores
    }

@router.get("/inventory")
async def get_inventory_report(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    """Generate inventory summary report"""
    # Mock inventory data (from products endpoint)
    products = [
        {"sku": "MILK001", "name": "Milk 1L", "stock": 85, "category": "Dairy"},
        {"sku": "BRD004", "name": "White Bread", "stock": 8, "category": "Bakery"},
        {"sku": "EGG013", "name": "Eggs Dozen", "stock": 42, "category": "Eggs"},
    ]
    
    total_products = len(products)
    total_stock = sum(p["stock"] for p in products)
    low_stock = len([p for p in products if p["stock"] < 10])
    out_of_stock = len([p for p in products if p["stock"] == 0])
    
    return {
        "total_products": total_products,
        "total_inventory_units": total_stock,
        "low_stock_items": low_stock,
        "out_of_stock_items": out_of_stock,
        "products": products
    }

@router.get("/export/pdf")
async def export_pdf_report(
    report_type: str,
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    """Export report as PDF"""
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)
    
    p.drawString(100, 750, f"Smart Retail Shelf - {report_type.upper()} Report")
    p.drawString(100, 730, f"Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}")
    p.drawString(100, 710, "=" * 50)
    
    if report_type == "stockout":
        report = await get_stockout_report(db=db, current_user=current_user)
        y = 680
        p.drawString(100, y, f"Total Stockouts: {report['total_stockouts']}")
        p.drawString(100, y-20, f"Critical Stockouts: {report['critical_stockouts']}")
        p.drawString(100, y-40, f"Revenue Loss: ${report['total_revenue_loss']}")
    
    p.save()
    buffer.seek(0)
    
    return StreamingResponse(buffer, media_type="application/pdf", headers={"Content-Disposition": f"attachment; filename={report_type}_report.pdf"})