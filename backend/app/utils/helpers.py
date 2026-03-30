import re
from datetime import datetime
from typing import List, Dict

def validate_email(email: str) -> bool:
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def format_currency(amount: float) -> str:
    return f"${amount:,.2f}"

def calculate_revenue_impact(stock_level: int, price: float, daily_sales: int = 10) -> float:
    days_out_of_stock = max(0, daily_sales - stock_level) / daily_sales if daily_sales > 0 else 0
    return days_out_of_stock * price * daily_sales

def group_by_category(products: List[Dict]) -> Dict:
    grouped = {}
    for product in products:
        category = product.get("category", "Other")
        if category not in grouped:
            grouped[category] = []
        grouped[category].append(product)
    return grouped