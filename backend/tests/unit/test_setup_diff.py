import pytest


def test_setup_diff_detects_changes(client):
    response = client.get("/setup/diff/setup-base-jerez/setup-q-jerez")
    assert response.status_code == 200
    data = response.json()
    assert "changes" in data
    assert len(data["changes"]) > 0


def test_setup_diff_same_setup(client):
    response = client.get("/setup/diff/setup-base-jerez/setup-base-jerez")
    assert response.status_code == 200
    data = response.json()
    assert data["changes"] == []
    assert data["risk_level"] == "low"


def test_setup_diff_unknown_setup(client):
    response = client.get("/setup/diff/nonexistent/setup-base-jerez")
    assert response.status_code == 200
    data = response.json()
    assert "note" in data
