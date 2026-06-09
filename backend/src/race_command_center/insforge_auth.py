"""Optional JWT auth middleware.

Verifies Bearer tokens locally using JWT_SECRET (HS256).
Enabled only when INSFORGE_AUTH_ENABLED=true.
Does NOT call the InsForge HTTP API — fully self-contained.
"""
from __future__ import annotations

import logging
import os

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

logger = logging.getLogger(__name__)

_AUTH_ENABLED = os.getenv("INSFORGE_AUTH_ENABLED", "true").lower() == "true"
_BYPASS = {
    "/health", "/healthz", "/readyz",
    "/metrics", "/prometheus",
    "/docs", "/openapi.json", "/redoc",
    "/auth/login",  # login itself must be public
}

if not _AUTH_ENABLED:
    logger.info("InsForge auth disabled (INSFORGE_AUTH_ENABLED != true)")


class InsForgeAuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if not _AUTH_ENABLED:
            return await call_next(request)

        path = request.url.path
        if any(path == bp or path.startswith(bp + "/") for bp in _BYPASS):
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
