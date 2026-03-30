import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app

@pytest.mark.asyncio
async def test_health_check():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}

@pytest.mark.asyncio
async def test_root_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/")
        assert response.status_code == 200
        assert "Smart Retail Shelf Intelligence" in response.json()["message"]

@pytest.mark.asyncio
async def test_auth_endpoints_exist():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # These endpoints should exist (may return 422 for missing data)
        response = await client.post("/auth/register", json={"name": "test", "email": "test@test.com", "password": "test123"})
        assert response.status_code in [200, 400, 422]

@pytest.mark.asyncio
async def test_alerts_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/alerts/active")
        assert response.status_code in [200, 401]

@pytest.mark.asyncio
async def test_products_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/products")
        assert response.status_code in [200, 401]

@pytest.mark.asyncio
async def test_cameras_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/cameras")
        assert response.status_code in [200, 401]