"""Integration tests for the /sessions CRUD API."""
import pytest


_SESSION_PAYLOAD = {
    "circuit_id": "mugello",
    "bike_id": "RC213V-2024",
    "rider_id": "93",
    "session_type": "FP1",
    "weekend_id": "2024-ITA",
    "weather": {"condition": "dry", "temp_air": 28},
}


def test_list_sessions_initially_empty_or_list(client):
    resp = client.get("/sessions")
    assert resp.status_code == 200
    data = resp.json()
    assert "sessions" in data
    assert "total" in data
    assert isinstance(data["sessions"], list)


def test_create_session(client):
    resp = client.post("/sessions", json=_SESSION_PAYLOAD)
    assert resp.status_code == 201
    data = resp.json()
    assert data["circuit_id"] == "mugello"
    assert data["session_type"] == "FP1"
    assert data["status"] == "active"
    assert "session_id" in data
    return data["session_id"]


def test_get_session_by_id(client):
    created = client.post("/sessions", json=_SESSION_PAYLOAD).json()
    session_id = created["session_id"]

    resp = client.get(f"/sessions/{session_id}")
    assert resp.status_code == 200
    data = resp.json()
    assert data["session_id"] == session_id
    assert data["circuit_id"] == "mugello"


def test_get_session_not_found(client):
    resp = client.get("/sessions/does-not-exist")
    assert resp.status_code == 404


def test_close_session(client):
    created = client.post("/sessions", json=_SESSION_PAYLOAD).json()
    session_id = created["session_id"]

    resp = client.post(f"/sessions/{session_id}/close")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "closed"
    assert data["session_id"] == session_id


def test_close_nonexistent_session(client):
    resp = client.post("/sessions/ghost-session/close")
    assert resp.status_code == 404


def test_list_sessions_includes_created(client):
    created = client.post("/sessions", json=_SESSION_PAYLOAD).json()
    session_id = created["session_id"]

    resp = client.get("/sessions")
    assert resp.status_code == 200
    ids = [s["session_id"] for s in resp.json()["sessions"]]
    assert session_id in ids
