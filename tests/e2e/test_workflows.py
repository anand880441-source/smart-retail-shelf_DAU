import pytest
from httpx import AsyncClient
from backend.app.main import app

@pytest.mark.asyncio
async def test_auth_flow():
    async with AsyncClient(app=app, base_url="http://test") as client:
        # Register
        response = await client.post("/auth/register", json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "test123",
            "role": "associate"
        })
        assert response.status_code == 200
        
        # Login
        response = await client.post("/auth/login", data={
            "username": "test@example.com",
            "password": "test123"
        })
        assert response.status_code == 200
        token = response.json()["access_token"]
        
        # Get user info
        response = await client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert response.status_code == 200

@pytest.mark.asyncio
async def test_alert_flow():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/alerts/active")
        assert response.status_code in [200, 401]