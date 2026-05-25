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
    setup_id                TEXT PRIMARY KEY,
    session_id              TEXT,
    name                    TEXT NOT NULL DEFAULT '',
    front_preload           REAL,
    rear_preload            REAL,
    front_compression       REAL,
    rear_compression        REAL,
    front_rebound           REAL,
    rear_rebound            REAL,
    front_ride_height       REAL,
    rear_ride_height        REAL,
    wheelbase               REAL,
    swingarm_length         REAL,
    engine_map              TEXT,
    traction_control_map    TEXT,
    anti_wheelie_map        TEXT,
    engine_brake_map        TEXT,
    front_tire_pressure     REAL,
    rear_tire_pressure      REAL,
    front_compound          TEXT,
    rear_compound           TEXT,
    aero_package            TEXT,
    custom_parts            TEXT NOT NULL DEFAULT '[]',
    status                  TEXT NOT NULL DEFAULT 'draft',
    created_at              TEXT,
    updated_at              TEXT
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

CREATE TABLE IF NOT EXISTS simulation_results (
    simulation_id    TEXT PRIMARY KEY,
    baseline_setup_id TEXT NOT NULL,
    session_id       TEXT,
    circuit_id       TEXT,
    result_json      TEXT NOT NULL DEFAULT '{}',
    created_at       TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS telemetry_samples (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    ts         REAL NOT NULL,
    sample_json TEXT NOT NULL DEFAULT '{}',
    created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_telem_session ON telemetry_samples (session_id);
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


async def save_simulation_result(simulation_id: str, baseline_setup_id: str, result: dict, session_id: str | None = None, circuit_id: str | None = None) -> None:
    from datetime import datetime, timezone
    ts = datetime.now(timezone.utc).isoformat()
    async with AsyncSessionLocal() as db:
        await db.execute(
            text("""
                INSERT INTO simulation_results (simulation_id, baseline_setup_id, session_id, circuit_id, result_json, created_at)
                VALUES (:sim_id, :baseline, :session_id, :circuit_id, :result_json, :ts)
                ON CONFLICT (simulation_id) DO UPDATE SET result_json = :result_json, created_at = :ts
            """) if not _is_sqlite else text("""
                INSERT OR REPLACE INTO simulation_results (simulation_id, baseline_setup_id, session_id, circuit_id, result_json, created_at)
                VALUES (:sim_id, :baseline, :session_id, :circuit_id, :result_json, :ts)
            """),
            {"sim_id": simulation_id, "baseline": baseline_setup_id, "session_id": session_id, "circuit_id": circuit_id, "result_json": json.dumps(result), "ts": ts},
        )
        await db.commit()


async def load_simulation_result(simulation_id: str) -> dict | None:
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            text("SELECT result_json FROM simulation_results WHERE simulation_id = :sim_id"),
            {"sim_id": simulation_id},
        )
        row = result.fetchone()
    return json.loads(row.result_json) if row else None


async def list_simulation_results(session_id: str | None = None, limit: int = 50) -> list[dict]:
    async with AsyncSessionLocal() as db:
        if session_id:
            result = await db.execute(
                text("SELECT result_json FROM simulation_results WHERE session_id = :sid ORDER BY created_at DESC LIMIT :limit"),
                {"sid": session_id, "limit": limit},
            )
        else:
            result = await db.execute(
                text("SELECT result_json FROM simulation_results ORDER BY created_at DESC LIMIT :limit"),
                {"limit": limit},
            )
        rows = result.fetchall()
    return [json.loads(r.result_json) for r in rows]


async def save_telemetry_samples(session_id: str, samples: list[dict]) -> int:
    from datetime import datetime, timezone
    ts = datetime.now(timezone.utc).isoformat()
    async with AsyncSessionLocal() as db:
        for s in samples:
            await db.execute(
                text("INSERT INTO telemetry_samples (session_id, ts, sample_json, created_at) VALUES (:sid, :ts_val, :sample, :ts)"),
                {"sid": session_id, "ts_val": s.get("ts", 0.0), "sample": json.dumps(s), "ts": ts},
            )
        await db.commit()
    return len(samples)


async def load_telemetry_by_session(session_id: str, limit: int = 500) -> list[dict]:
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            text("SELECT sample_json FROM telemetry_samples WHERE session_id = :sid ORDER BY ts DESC LIMIT :limit"),
            {"sid": session_id, "limit": limit},
        )
        rows = result.fetchall()
    return [json.loads(r.sample_json) for r in reversed(rows)]
