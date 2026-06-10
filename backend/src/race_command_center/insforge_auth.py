"""Optional JWT auth middleware.

Verifies Bearer tokens locally using JWT_SECRET (HS256).
Enabled only when INSFORGE_AUTH_ENABLED=true.
Does NOT call the InsForge HTTP API — fully self-contained.

NOTE: Uses @app.middleware("http") pattern (NOT deprecated BaseHTTPMiddleware)
for compatibility with Starlette 1.x.
"""
from __future__ import annotations

import logging
import os

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)

_AUTH_ENABLED = os.getenv("INSFORGE_AUTH_ENABLED", "true").lower() == "true"
# Path prefixes that require Bearer auth (everything else is public — SPA, assets, etc.)
_AUTH_REQUIRED = frozenset({"/api/v1"})

# Explicit public paths (not covered by _AUTH_REQUIRED check)
_PUBLIC = frozenset({
    "/health", "/healthz", "/readyz",
    "/metrics", "/prometheus",
    "/docs", "/openapi.json", "/redoc",
    "/auth/login",  # login itself must be public
})

if not _AUTH_ENABLED:
    logger.info("InsForge auth disabled (INSFORGE_AUTH_ENABLED != true)")


def setup_auth_middleware(app: FastAPI) -> None:
    """Register auth middleware using @app.middleware('http') — Starlette 1.x compatible."""

    @app.middleware("http")
    async def auth_middleware(request: Request, call_next):
        if not _AUTH_ENABLED:
            return await call_next(request)

        path = request.url.path
        # Only protect API paths; everything else (SPA, assets, static) is public
        if not any(path.startswith(prefix) for prefix in _AUTH_REQUIRED):
            return await call_next(request)
        if any(path == bp or path == bp + "/" for bp in _PUBLIC):
            return await call_next(request)

        auth = request.headers.get("Authorization", "")
        if not auth.startswith("Bearer "):
            return JSONResponse(
                status_code=401,
                content={"detail": "Missing Bearer token"},
                headers={"WWW-Authenticate": "Bearer"},
            )

        token = auth.removeprefix("Bearer ").strip()
        try:
            from race_command_center.auth_core import verify_token
            claims = verify_token(token)
            request.state.insforge_claims = claims
        except Exception:
            return JSONResponse(
                status_code=401,
                content={"detail": "Invalid or expired token"},
                headers={"WWW-Authenticate": "Bearer"},
            )

        return await call_next(request)
