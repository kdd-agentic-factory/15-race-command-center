import pytest
from fastapi.testclient import TestClient
from race_command_center.main import app

client = TestClient(app)


def test_list_parts_returns_mock_data():
    response = client.get("/parts")
    assert response.status_code == 200
    data = response.json()
    assert "parts" in data
    assert data["total"] >= 3


def test_create_part():
    payload = {
        "name": "Test Duct",
        "part_type": "cooling",
        "target_circuit_id": "jerez",
        "problem_statement": "Test problem",
        "technical_hypothesis": "Test hypothesis",
        "expected_impact": "Test impact",
        "risk_level": "low",
    }
    response = client.post("/parts", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Duct"
    assert data["status"] == "concept"
    assert data["part_id"].startswith("part-")


def test_update_part_status():
    part_id = "part-brake-jerez"
    response = client.patch(f"/parts/{part_id}/status", json={"status": "simulated"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "simulated"


def test_part_simulate_queues_simulation():
    response = client.post("/parts/part-brake-jerez/simulate", json={"circuit_id": "jerez"})
    assert response.status_code == 200
    data = response.json()
    assert data["simulation_requested"] is True
    assert "simulation_id" in data
