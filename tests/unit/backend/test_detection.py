import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)

def test_detection_endpoint():
    response = client.get("/detection/product/MILK001")
    assert response.status_code in [200, 401]  # 401 if not authenticated

def test_analyze_shelf():
    with open("test_image.jpg", "rb") as f:
        response = client.post("/detection/analyze-shelf", files={"file": ("test.jpg", f, "image/jpeg")})
    assert response.status_code in [200, 401, 422]