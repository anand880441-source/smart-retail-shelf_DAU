from fastapi import APIRouter, Depends
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from ...core.database import get_database
from ..dependencies import get_current_user_required

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/dashboard")
async def get_dashboard_analytics(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    # Get alert statistics
    alert_pipeline = [
        {"$group": {
            "_id": "$priority",
            "count": {"$sum": 1},
            "revenue": {"$sum": "$revenue_impact"}
        }}
    ]
    alert_stats = await db.alerts.aggregate(alert_pipeline).to_list(None)
    
    # Get alerts over time (last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    time_pipeline = [
        {"$match": {"created_at": {"$gte": seven_days_ago}}},
        {"$group": {
            "_id": {"$dateToString": {"format": "%Y-%m-%d", "date": "$created_at"}},
            "count": {"$sum": 1}
        }},
        {"$sort": {"_id": 1}}
    ]
    time_stats = await db.alerts.aggregate(time_pipeline).to_list(None)
    
    # Get alerts by type
    type_pipeline = [
        {"$group": {
            "_id": "$type",
            "count": {"$sum": 1}
        }}
    ]
    type_stats = await db.alerts.aggregate(type_pipeline).to_list(None)
    
    # Get top products with most alerts
    product_pipeline = [
        {"$group": {
            "_id": "$product_name",
            "count": {"$sum": 1},
            "revenue": {"$sum": "$revenue_impact"}
        }},
        {"$sort": {"count": -1}},
        {"$limit": 5}
    ]
    product_stats = await db.alerts.aggregate(product_pipeline).to_list(None)
    
    # Calculate resolution rate
    total_alerts = await db.alerts.count_documents({})
    resolved_alerts = await db.alerts.count_documents({"status": "resolved"})
    resolution_rate = (resolved_alerts / total_alerts * 100) if total_alerts > 0 else 0
    
    # Calculate average response time (mock data for now)
    avg_response_time = 12.5  # minutes
    
    return {
        "alert_stats": alert_stats,
        "trend_data": time_stats,
        "type_distribution": type_stats,
        "top_products": product_stats,
        "resolution_rate": round(resolution_rate, 1),
        "avg_response_time": avg_response_time,
        "total_alerts": total_alerts
    }

@router.get("/forecast")
async def get_forecast_data(
    db: AsyncIOMotorDatabase = Depends(get_database),
    current_user=Depends(get_current_user_required)
):
    # Mock forecast data for demo
    # In production, this would come from Prophet/LightGBM models
    
    import random
    dates = []
    actual = []
    forecast = []
    upper_bound = []
    lower_bound = []
    
    for i in range(30):
        date = (datetime.utcnow() - timedelta(days=30-i)).strftime("%Y-%m-%d")
        dates.append(date)
        
        # Actual sales (with some randomness)
        actual_val = random.randint(50, 150)
        actual.append(actual_val)
        
        # Forecast (smooth trend)
        forecast_val = int(actual_val * random.uniform(0.85, 1.15))
        forecast.append(forecast_val)
        
        upper_bound.append(forecast_val + random.randint(10, 30))
        lower_bound.append(max(0, forecast_val - random.randint(10, 30)))
    
    return {
        "dates": dates[-7:],  # Last 7 days
        "actual": actual[-7:],
        "forecast": forecast[-7:],
        "upper_bound": upper_bound[-7:],
        "lower_bound": lower_bound[-7:],
        "next_7_days": {
            "dates": [(datetime.utcnow() + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(1, 8)],
            "forecast": [random.randint(60, 140) for _ in range(7)],
            "upper": [random.randint(80, 160) for _ in range(7)],
            "lower": [random.randint(40, 100) for _ in range(7)]
        }
    }