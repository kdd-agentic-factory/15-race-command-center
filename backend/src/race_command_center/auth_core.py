"""
JWT issuance + verification + auth_users DB queries.
Self-contained: no dependency on InsForge HTTP API.
"""
from __future__ import annotations

import logging
import os
from datetime import datetime, timedelta, timezone

import asyncpg
import bcrypt
import jwt

logger = logging.getLogger(__name__)

JWT_SECRET: str = os.getenv("JWT_SECRET", "")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_SECONDS = int(os.getenv("JWT_EXPIRY_SECONDS", "3600"))

# Auth tables live in the insforge DB; falls back to main DATABASE_URL
_AUTH_URL_RAW: str = os.getenv(
    "AUTH_DATABASE_URL",
    os.getenv("DATABASE_URL", ""),
)
# asyncpg requires plain postgresql:// (not postgresql+asyncpg://)
AUTH_DATABASE_URL: str = _AUTH_URL_RAW.replace("postgresql+asyncpg://", "postgresql://")

if not JWT_SECRET:
    logger.warning("JWT_SECRET not set — using insecure default (set it in production!)")
_signing_key = JWT_SECRET or "kdd-dev-secret-change-me"


# ── Token helpers ──────────────────────────────────────────────────────────────

def issue_token(user_id: str, email: str, role: str, display_name: str = "") -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "display_name": display_name,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(seconds=JWT_EXPIRY_SECONDS)).timestamp()),
    }
    return jwt.encode(payload, _signing_key, algorithm=JWT_ALGORITHM)


def verify_token(token: str) -> dict:
    """Decode and verify a JWT. Raises jwt.PyJWTError on failure."""
    return jwt.decode(token, _signing_key, algorithms=[JWT_ALGORITHM])


# ── Database helpers ───────────────────────────────────────────────────────────

async def _get_conn() -> asyncpg.Connection:
    return await asyncpg.connect(AUTH_DATABASE_URL, timeout=10)


async def authenticate_user(email: str, password: str) -> dict | None:
    """Return user dict if credentials are valid, else None."""
    if not AUTH_DATABASE_URL:
        logger.error("AUTH_DATABASE_URL not configured")
        return None
    try:
        conn = await _get_conn()
    except Exception as exc:
        logger.error("auth DB connection failed: %s", exc)
        return None

    try:
        row = await conn.fetchrow(
            """
            SELECT user_id, email, display_name, role,
                   password_hash, is_active, is_verified, metadata
            FROM auth_users WHERE email = $1
            """,
            email,
        )
        if not row:
            return None
        if not row["is_active"]:
            return None
        if not row["password_hash"]:
            return None
        if not bcrypt.checkpw(password.encode(), row["password_hash"].encode()):
            return None
        await conn.execute(
            "UPDATE auth_users SET last_login_at = now() WHERE user_id = $1",
            row["user_id"],
        )
        return dict(row)
    except Exception as exc:
        logger.error("authenticate_user error: %s", exc)
        return None
    finally:
        await conn.close()


async def get_user_by_id(user_id: str) -> dict | None:
    if not AUTH_DATABASE_URL:
        return None
    try:
        conn = await _get_conn()
        row = await conn.fetchrow(
            "SELECT user_id, email, display_name, role, is_active, metadata "
            "FROM auth_users WHERE user_id = $1",
            user_id,
        )
        await conn.close()
        return dict(row) if row else None
    except Exception as exc:
        logger.error("get_user_by_id error: %s", exc)
        return None
