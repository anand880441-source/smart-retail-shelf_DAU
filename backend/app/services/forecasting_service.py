import random
from datetime import datetime, timedelta
from typing import Dict, List

class ForecastingService:
    def __init__(self):
        self.historical_data = {}
    
    async def predict_demand(self, product_sku: str, days: int = 30) -> Dict:
        """Predict demand for a product"""
        dates = []
        forecasts = []
        
        base_demand = {
            "MILK001": 150,
            "BRD004": 200,
            "EGG013": 180,
        }
        
        base = base_demand.get(product_sku, 100)
        
        for i in range(days):
            date = (datetime.utcnow() + timedelta(days=i)).strftime("%Y-%m-%d")
            dates.append(date)
            
            # Add weekly seasonality
            day_of_week = (datetime.utcnow() + timedelta(days=i)).weekday()
            multiplier = 1.3 if day_of_week >= 5 else 1.0
            
            forecast = int(base * multiplier * random.uniform(0.9, 1.1))
            forecasts.append(forecast)
        
        return {
            "product_sku": product_sku,
            "dates": dates,
            "forecast": forecasts,
            "confidence_interval": [0.8, 1.2]
        }
    
    async def calculate_reorder_point(self, product_sku: str, lead_time_days: int = 3) -> Dict:
        """Calculate reorder point based on forecast"""
        forecast = await self.predict_demand(product_sku, lead_time_days)
        total_demand = sum(forecast["forecast"])
        
        return {
            "product_sku": product_sku,
            "lead_time_days": lead_time_days,
            "forecast_demand": total_demand,
            "reorder_point": total_demand,
            "safety_stock": int(total_demand * 0.2)
        }