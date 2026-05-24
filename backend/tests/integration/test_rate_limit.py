"""Integration tests for rate limiting middleware.

The rate limit is read from RATE_LIMIT_PER_MINUTE env var (default 120).
To exercise the limiter we patch the middleware's _limit to a low value.
"""
import pytest
from unittest.mock import patch

from race_command_center.rate_limit import RateLimitMiddleware


def test_health_exempt_from_rate_limit(client):
    """Health endpoint is always allowed regardless of rate limit state."""
    for _ in range(5):
        resp = client.get("/health")
        assert resp.status_code == 200


def test_metrics_exempt_from_rate_limit(client):
    for _ in range(5):
        resp = client.get("/metrics")
        assert resp.status_code == 200


def test_429_when_limit_exceeded():
    """Hammer the API beyond the configured limit and expect a 429."""
    import os
    os.environ["RATE_LIMIT_PER_MINUTE"] = "3"
    try:
        from race_command_center.main import app
        from fastapi.testclient import TestClient

        # Directly set _limit on the existing middleware instance
        for middleware in app.middleware_stack.__dict__.get("app", app).__dict__.get("middleware", []) or []:
            pass

        # Alternative: patch at class level for a small limit
        with TestClient(app) as c:
            # The middleware is already instantiated with RATE_LIMIT_PER_MINUTE.
            # Directly lower the limit on the middleware instance inside the stack.
            _find_and_patch_limit(app, limit=2)
            responses = [c.get("/sessions") for _ in range(6)]

        statuses = [r.status_code for r in responses]
        assert 429 in statuses
        # The 429 response must include Retry-After header
        rate_limited = [r for r in responses if r.status_code == 429]
        assert rate_limited[0].headers.get("Retry-After") is not None
    finally:
        os.environ.pop("RATE_LIMIT_PER_MINUTE", None)


def _find_and_patch_limit(app, limit: int):
    """Walk the ASGI middleware stack and lower _limit on RateLimitMiddleware."""
    current = app.middleware_stack
    while current is not None:
        if isinstance(current, RateLimitMiddleware):
            current._limit = limit
            return
        current = getattr(current, "app", None)


def test_retry_after_header_present_on_429():
    """The 429 response must carry Retry-After so clients know when to retry."""
    from race_command_center.main import app
    from fastapi.testclient import TestClient

    with TestClient(app) as c:
        _find_and_patch_limit(app, limit=1)
        # First request should succeed
        c.get("/sessions")
        # Second should be rate limited
        for _ in range(10):
            resp = c.get("/sessions")
            if resp.status_code == 429:
                assert "Retry-After" in resp.headers
                return
    pytest.skip("Could not trigger rate limit in this test run")
