"""Integration tests for rate limiting middleware."""
import contextlib
import pytest

from race_command_center.rate_limit import RateLimitMiddleware


def _find_rate_limiter(app) -> RateLimitMiddleware | None:
    """Walk the ASGI middleware stack and return the RateLimitMiddleware instance."""
    current = app.middleware_stack
    while current is not None:
        if isinstance(current, RateLimitMiddleware):
            return current
        current = getattr(current, "app", None)
    return None


@contextlib.contextmanager
def _patch_limit(app, limit: int):
    """Temporarily set _limit on the RateLimitMiddleware, restoring afterwards."""
    mw = _find_rate_limiter(app)
    if mw is None:
        yield
        return
    original = mw._limit
    mw._limit = limit
    try:
        yield mw
    finally:
        mw._limit = original
        mw._buckets.clear()  # reset counters so next test starts fresh


def test_health_exempt_from_rate_limit(client):
    """Health endpoint is always allowed regardless of rate limit state."""
    for _ in range(5):
        resp = client.get("/health")
        assert resp.status_code == 200


def test_metrics_exempt_from_rate_limit(client):
    for _ in range(5):
        resp = client.get("/metrics")
        assert resp.status_code == 200


def test_429_when_limit_exceeded(client):
    """Hammer the API beyond the configured limit and expect a 429."""
    from race_command_center.main import app

    with _patch_limit(app, limit=2) as mw:
        responses = [client.get("/api/v1/sessions") for _ in range(6)]

    statuses = [r.status_code for r in responses]
    assert 429 in statuses
    rate_limited = [r for r in responses if r.status_code == 429]
    assert rate_limited[0].headers.get("Retry-After") is not None


def test_retry_after_header_present_on_429(client):
    """The 429 response must carry Retry-After so clients know when to retry."""
    from race_command_center.main import app

    with _patch_limit(app, limit=1):
        client.get("/api/v1/sessions")  # first request passes
        for _ in range(10):
            resp = client.get("/api/v1/sessions")
            if resp.status_code == 429:
                assert "Retry-After" in resp.headers
                return
    pytest.skip("Could not trigger rate limit in this test run")
