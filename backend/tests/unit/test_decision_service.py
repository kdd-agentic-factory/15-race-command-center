import pytest


def test_list_decisions_returns_mock_data(client):
    response = client.get("/api/v1/decisions")
    assert response.status_code == 200
    data = response.json()
    assert "decisions" in data
    assert data["total"] >= 2


def test_approve_decision(client):
    # approved_by is now derived from the authenticated principal, not the body
    response = client.post("/api/v1/decisions/dec-map2/approve", json={"notes": "Approved after simulation"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "approved"
    assert data["approved_by"] == "Test Runner"  # from the mock principal override


def test_reject_decision(client):
    response = client.post("/api/v1/decisions/dec-rebound/reject", json={"reason": "Risk too high for current session"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "rejected"
    assert "reason" in data


def test_request_simulation(client):
    response = client.post("/api/v1/decisions/dec-map2/request-simulation")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "simulation_required"


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "race-command-center"
