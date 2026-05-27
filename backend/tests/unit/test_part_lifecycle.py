import pytest


def test_list_parts_returns_mock_data(client, seeded_part_id):
    response = client.get("/api/v1/parts")
    assert response.status_code == 200
    data = response.json()
    assert "parts" in data
    assert data["total"] >= 1


def test_create_part(client):
    payload = {
        "name": "Test Duct",
        "part_type": "cooling",
        "target_circuit_id": "jerez",
        "problem_statement": "Test problem",
        "technical_hypothesis": "Test hypothesis",
        "expected_impact": "Test impact",
        "risk_level": "low",
    }
    response = client.post("/api/v1/parts", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Duct"
    assert data["status"] == "concept"
    assert data["part_id"].startswith("part-")


def test_update_part_status(client, seeded_part_id):
    response = client.patch(f"/api/v1/parts/{seeded_part_id}/status", json={"status": "simulated"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "simulated"


def test_part_simulate_queues_simulation(client, seeded_part_id):
    response = client.post(f"/api/v1/parts/{seeded_part_id}/simulate", json={"circuit_id": "jerez"})
    assert response.status_code == 200
    data = response.json()
    assert data["simulation_requested"] is True
    assert "simulation_id" in data
