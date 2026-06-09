"""Authentication dependencies for protected endpoints.

Derives the calling principal from one of three sources (checked in order):
1. ``request.state.insforge_claims`` — set by ``InsForgeAuthMiddleware`` when
   ``INSFORGE_AUTH_ENABLED=true`` (JWT Bearer token).
2. ``X-Principal-Id`` / ``X-Principal-Role`` headers — used by trusted internal
   callers (e.g. other KDD services behind the API gateway).
3. Fallback to a system-level placeholder when neither source is available
   (local dev with auth disabled).

Usage::

    @router.post("/decisions/{id}/approve")
    async def approve(
        id: str,
        principal: dict = Depends(get_current_principal),
    ):
        principal["id"]   # user_id or "system"
        principal["role"] # role string or "system"
"""

from __future__ import annotations

from fastapi import Depends, HTTPException, Request, status
from pydantic import BaseModel


class Principal(BaseModel):
    """Represents the authenticated or inferred calling principal."""

    id: str
    role: str = "unknown"
    email: str = ""
    display_name: str = ""


async def get_current_principal(request: Request) -> Principal:
    """Extract the calling principal from JWT claims or trusted headers.

    Sources checked in order:
    1. ``request.state.insforge_claims`` (JWT middleware).
    2. ``X-Principal-Id`` / ``X-Principal-Role`` headers.
    3. Fallback: ``system`` / ``system``.
    """
    # --- Source 1: JWT claims (set by InsForgeAuthMiddleware) ---
    claims = getattr(request.state, "insforge_claims", None)
    if claims:
        return Principal(
            id=claims.get("sub", "unknown"),
            role=claims.get("role", "unknown"),
            email=claims.get("email", ""),
            display_name=claims.get("display_name", ""),
        )

    # --- Source 2: Trusted internal headers ---
    princ_id = request.headers.get("X-Principal-Id", "")
    if princ_id:
        return Principal(
            id=princ_id,
            role=request.headers.get("X-Principal-Role", "internal"),
            email=request.headers.get("X-Principal-Email", ""),
            display_name=request.headers.get("X-Principal-Name", ""),
        )

    # --- Source 3: Fallback for local dev ---
    return Principal(id="system", role="system", display_name="System")
