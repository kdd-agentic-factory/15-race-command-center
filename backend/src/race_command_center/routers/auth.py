"""Auth router: login + current-user endpoints."""
from __future__ import annotations

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

from race_command_center.auth_core import (
    JWT_EXPIRY_SECONDS,
    authenticate_user,
    get_user_by_id,
    issue_token,
    verify_token,
)

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
async def login(body: LoginRequest):
    user = await authenticate_user(body.email, body.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = issue_token(
        user_id=user["user_id"],
        email=user["email"],
        role=user["role"],
        display_name=user["display_name"],
    )
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": JWT_EXPIRY_SECONDS,
        "user": {
            "user_id": user["user_id"],
            "email": user["email"],
            "display_name": user["display_name"],
            "role": user["role"],
            "is_verified": user.get("is_verified", False),
            "metadata": user.get("metadata") or {},
        },
    }


@router.get("/me")
async def me(request: Request):
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token = auth.removeprefix("Bearer ").strip()
    try:
        claims = verify_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = await get_user_by_id(claims["sub"])
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "user_id": user["user_id"],
        "email": user["email"],
        "display_name": user["display_name"],
        "role": user["role"],
        "metadata": user.get("metadata") or {},
    }
