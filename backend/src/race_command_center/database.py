"""Async SQLAlchemy database layer — PostgreSQL in production, SQLite for local dev."""

import json
import logging
import os

from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool, AsyncAdaptedQueuePool

logger = logging.getLogger(__name__)

_DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite+aiosqlite:///./race_command_center.db",
)

# asyncpg requires postgresql+asyncpg:// prefix
if _DATABASE_URL.startswith("postgresql://"):
    _DATABASE_URL = _DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
elif _DATABASE_URL.startswith("postgres://"):
    _DATABASE_URL = _DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)

_is_sqlite = _DATABASE_URL.startswith("sqlite")

engine = create_async_engine(
    _DATABASE_URL,
    echo=os.getenv("DB_ECHO", "false").lower() == "true",
    poolclass=NullPool if _is_sqlite else AsyncAdaptedQueuePool,
    pool_pre_ping=True if not _is_sqlite else False,
    json_serializer=json.dumps,
    json_deserializer=json.loads,
)

AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

_DDL = """
CREATE TABLE IF NOT EXISTS race_sessions (
    session_id   TEXT PRIMARY KEY,
    weekend_id   TEXT,
    circuit_id   TEXT NOT NULL,
    bike_id      TEXT NOT NULL,
    rider_id     TEXT,
    session_type TEXT NOT NULL,
    status       TEXT NOT NULL DEFAULT 'created',
    started_at   TEXT,
    ended_at     TEXT,
    weather      TEXT NOT NULL DEFAULT '{}',
    metadata     TEXT NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS decisions (
    decision_id       TEXT PRIMARY KEY,
    session_id        TEXT,
    recommendation_id TEXT,
    title             TEXT NOT NULL,
    decision_type     TEXT NOT NULL,
    risk_level        TEXT NOT NULL,
    status            TEXT NOT NULL DEFAULT 'proposed',
    proposed_by       TEXT NOT NULL DEFAULT 'system',
    approved_by       TEXT,
    evidence          TEXT NOT NULL DEFAULT '[]',
    simulation_id     TEXT,
    workflow_id       TEXT,
    created_at        TEXT,
    decided_at        TEXT,
    notes             TEXT
);

CREATE TABLE IF NOT EXISTS setups (
    setup_id     TEXT PRIMARY KEY,
    session_id   TEXT,
    circuit_id   TEXT NOT NULL,
    label        TEXT NOT NULL,
    components   TEXT NOT NULL DEFAULT '{}',
    created_at   TEXT,
    updated_at   TEXT
);

CREATE TABLE IF NOT EXISTS parts (
    part_id      TEXT PRIMARY KEY,
    bike_id      TEXT NOT NULL,
    name         TEXT NOT NULL,
    part_type    TEXT NOT NULL,
    status       TEXT NOT NULL DEFAULT 'nominal',
    usage_laps   INTEGER NOT NULL DEFAULT 0,
    max_laps     INTEGER,
    installed_at TEXT,
    metadata     TEXT NOT NULL DEFAULT '{}'
);
"""


async def init_db() -> None:
    async with engine.begin() as conn:
        for stmt in _DDL.strip().split(";"):
            stmt = stmt.strip()
            if stmt:
                await conn.execute(text(stmt))
    logger.info("Database schema initialised (%s)", "sqlite" if _is_sqlite else "postgres")


async def get_session() -> AsyncSession:  # type: ignore[misc]
    async with AsyncSessionLocal() as session:
        yield session
