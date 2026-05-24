"""Integration tests for the /health endpoint."""


def test_health_ok(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] in {"ok", "degraded"}
    assert data["service"] == "race-command-center"


def test_health_has_dependencies(client):
    data = client.get("/health").json()
    assert "dependencies" in data
    assert "database" in data["dependencies"]


def test_metrics_endpoint(client):
    resp = client.get("/metrics")
    assert resp.status_code == 200
