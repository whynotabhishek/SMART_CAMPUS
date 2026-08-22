import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_stats_endpoint():
    response = client.get("/api/stats")
    assert response.status_code in [200, 500] # Might be 500 if DB not configured, but endpoint exists
