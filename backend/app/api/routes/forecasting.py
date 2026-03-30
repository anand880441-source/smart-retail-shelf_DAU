from fastapi import APIRouter, Depends
from datetime import datetime, timedelta
import random
from motor.motor_asyncio import AsyncIOMotorDatabase
from ...core.database import get_database
from ..routes.auth import get_current_user_required

router = APIRouter(prefix="/forecasting", tags=["Forecasting"])

@router.get("/demand")
async def get_demand_forecast(
    product_sku: str = None,
    days: int = 30,
    current_user=Depends(get_current_user_required)
):
    """Get demand forecast for products"""
    
    # Mock demand forecast data
    # In production, this would use Prophet or LightGBM
    
    dates = []
    forecasts = []
    upper_bounds = []
    lower_bounds = []
    
    base_demand = {
        "MILK001": 150,
        "BRD004": 200,
        "EGG013": 180,
        "default": 100
    }
    
    base = base_demand.get(product_sku, base_demand["default"]) if product_sku else 100
    
    for i in range(days):
        date = (datetime.utcnow() + timedelta(days=i)).strftime("%Y-%m-%d")
        dates.append(date)
        
        # Add weekly seasonality
        day_of_week = (datetime.utcnow() + timedelta(days=i)).weekday()
        weekend_multiplier = 1.3 if day_of_week >= 5 else 1.0
        
        forecast_val = int(base * weekend_multiplier * random.uniform(0.9, 1.1))
        forecasts.append(forecast_val)
        upper_bounds.append(forecast_val + random.randint(10, 30))
        lower_bounds.append(max(0, forecast_val - random.randint(10, 30)))
    
    return {
        "product_sku": product_sku or "all",
        "days": days,
        "dates": dates,
        "forecast": forecasts,
        "upper_bound": upper_bounds,
        "lower_bound": lower_bounds,
        "confidence_level": 90
    }

@router.get("/reorder-point")
async def get_reorder_point(
    product_sku: str,
    lead_time_days: int = 3,
    safety_stock_days: int = 2,
    current_user=Depends(get_current_user_required)
):
    """Calculate reorder point for a product"""
    
    # Get forecast for lead time period
    forecast_data = await get_demand_forecast(product_sku, lead_time_days + safety_stock_days, current_user)
    
    total_demand = sum(forecast_data["forecast"])
    
    # Mock current stock (would come from database)
    current_stock = {
        "MILK001": 85,
        "BRD004": 8,
        "EGG013": 42,
        "default": 50
    }
    
    stock = current_stock.get(product_sku, current_stock["default"])
    
    reorder_point = total_demand
    should_order = stock <= reorder_point
    
    return {
        "product_sku": product_sku,
        "current_stock": stock,
        "lead_time_days": lead_time_days,
        "safety_stock_days": safety_stock_days,
        "forecast_demand_during_lead_time": total_demand,
        "reorder_point": reorder_point,
        "should_reorder": should_order,
        "recommended_order_quantity": total_demand - stock if should_order else 0
    }