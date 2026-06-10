"""Integration tests for the rate limiting middleware.

The middleware is closure-based (setup_rate_limit_middleware registers an
@app.middleware('http') handler), so each test builds a small standalone
FastAPI app with a low limit instead of patching internals on the main app.
"""
from fastapi import FastAPI
from fastapi.testclient import TestClient

from race_command_center.rate_limit import setup_rate_limit_middleware


def _build_app(calls_per_minute: int) -> TestClient:
    app = FastAPI()
    setup_rate_limit_middleware(app, calls_per_minute=calls_per_minute)

    @app.get("/health")
    async def health():
        return {"status": "ok"}

    @app.get("/metrics")
    async def metrics():
        return {"metrics": "ok"}

    @app.get("/api/v1/sessions")
    async def sessions():
        return {"sessions": []}

    return TestClient(app)


def test_health_exempt_from_rate_limit():
    """Health endpoint is always allowed regardless of rate limit state."""
    client = _build_app(calls_per_minute=2)
    for _ in range(10):
        assert client.get("/health").status_code == 200


def test_metrics_exempt_from_rate_limit():
    client = _build_app(calls_per_minute=2)
    for _ in range(10):
        assert client.get("/metrics").status_code == 200


def test_429_when_limit_exceeded():
    """Hammer the API beyond the configured limit and expect a 429."""
    client = _build_app(calls_per_minute=2)
    responses = [client.get("/api/v1/sessions") for _ in range(6)]

    statuses = [r.status_code for r in responses]
    assert statuses[:2] == [200, 200]
    assert 429 in statuses


def test_retry_after_header_present_on_429():
    """The 429 response must carry Retry-After so clients know when to retry."""
    client = _build_app(calls_per_minute=1)
    assert client.get("/api/v1/sessions").status_code == 200
    resp = client.get("/api/v1/sessions")
    assert resp.status_code == 429
    assert "Retry-After" in resp.headers
    assert int(resp.headers["Retry-After"]) >= 1
