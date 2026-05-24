"""Integration tests for the /telemetry endpoints."""
import time


def test_mock_telemetry(client):
    resp = client.get("/telemetry/mock")
    assert resp.status_code == 200
    data = resp.json()
    assert "ts" in data
    assert "speed" in data
    assert "phase" in data


def test_mock_telemetry_with_session_id(client):
    resp = client.get("/telemetry/mock", params={"session_id": "ses-abc"})
    assert resp.status_code == 200
    data = resp.json()
    assert data["session_id"] == "ses-abc"


def test_mock_telemetry_batch(client):
    resp = client.get("/telemetry/mock/batch", params={"count": 5})
    assert resp.status_code == 200
    samples = resp.json()["samples"]
    assert len(samples) == 5


def test_mock_telemetry_batch_cap(client):
    resp = client.get("/telemetry/mock/batch", params={"count": 999})
    assert resp.status_code == 200
    assert len(resp.json()["samples"]) == 100


def test_ingest_telemetry_samples(client):
    samples = [
        {"ts": time.time(), "speed": 200.0, "phase": "drive"},
        {"ts": time.time() + 0.01, "speed": 210.0, "phase": "drive"},
    ]
    resp = client.post("/telemetry/samples/ses-test-001", json=samples)
    assert resp.status_code == 200
    data = resp.json()
    assert data["session_id"] == "ses-test-001"
    assert data["saved"] == 2


def test_ingest_empty_samples_rejected(client):
    resp = client.post("/telemetry/samples/ses-test-002", json=[])
    assert resp.status_code == 400


def test_get_telemetry_for_session(client):
    samples = [{"ts": time.time(), "speed": 180.0, "phase": "apex"}]
    client.post("/telemetry/samples/ses-query-001", json=samples)

    resp = client.get("/telemetry/sessions/ses-query-001")
    assert resp.status_code == 200
    data = resp.json()
    assert data["session_id"] == "ses-query-001"
    assert "samples" in data
    assert len(data["samples"]) >= 1


def test_get_telemetry_empty_session(client):
    resp = client.get("/telemetry/sessions/no-data-session")
    assert resp.status_code == 200
    data = resp.json()
    assert data["samples"] == []
