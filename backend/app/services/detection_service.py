from typing import List, Dict
from PIL import Image
import numpy as np

class DetectionService:
    def __init__(self):
        self.model = None
        
    async def detect_products(self, image: Image.Image) -> List[Dict]:
        """Detect products in shelf image"""
        # Mock detection - will be replaced with YOLO
        mock_products = [
            {"sku": "MILK001", "name": "Milk 1L", "confidence": 0.95, "bbox": [10, 20, 100, 150]},
            {"sku": "BRD004", "name": "White Bread", "confidence": 0.92, "bbox": [120, 20, 210, 150]},
        ]
        return mock_products
    
    async def count_facings(self, detections: List[Dict]) -> Dict:
        """Count facings per product"""
        facing_count = {}
        for detection in detections:
            sku = detection["sku"]
            facing_count[sku] = facing_count.get(sku, 0) + 1
        return facing_count
    
    async def check_price_tags(self, image: Image.Image) -> List[Dict]:
        """Check if price tags match products"""
        # Mock price tag check
        return [
            {"product": "Milk 1L", "price": 3.99, "correct": True},
            {"product": "White Bread", "price": 2.49, "correct": True},
        ]