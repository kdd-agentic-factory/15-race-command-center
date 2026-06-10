"""Sliding-window per-IP rate limiting middleware.

NOTE: Uses @app.middleware("http") pattern (NOT deprecated BaseHTTPMiddleware)
for compatibility with Starlette 1.x.
"""
from __future__ import annotations

import time
from collections import defaultdict

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

_SKIP_PATHS = frozenset({"/health", "/metrics", "/healthz", "/readyz"})


def setup_rate_limit_middleware(app: FastAPI, calls_per_minute: int = 100, window_seconds: float = 60.0) -> None:
    """Register rate-limit middleware using @app.middleware('http') — Starlette 1.x compatible."""
    _limit = calls_per_minute
    _window = window_seconds
    _buckets: dict[str, list[float]] = defaultdict(list)
    _last_cleanup = time.monotonic()

    @app.middleware("http")
    async def rate_limit_middleware(request: Request, call_next):
        nonlocal _last_cleanup

        if request.url.path in _SKIP_PATHS:
            return await call_next(request)

        ip = (request.client.host if request.client else None) or "unknown"
        now = time.monotonic()

        if now - _last_cleanup > 300:
            _buckets.clear()
            _last_cleanup = now

        window_start = now - _window
        bucket = [t for t in _buckets[ip] if t > window_start]

        if len(bucket) >= _limit:
            oldest = bucket[0]
            retry_after = int(_window - (now - oldest)) + 1
            return JSONResponse(
                status_code=429,
                content={"detail": "Rate limit exceeded. Please slow down."},
                headers={"Retry-After": str(retry_after)},
            )

        bucket.append(now)
        _buckets[ip] = bucket
        return await call_next(request)
