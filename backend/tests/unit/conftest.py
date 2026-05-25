"""Unit test setup — disables rate limiting and seeds the test DB."""
import os

# Must be set before race_command_center is first imported.
os.environ.setdefault("RATE_LIMIT_PER_MINUTE", "99999")
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./test_unit.db")

import pytest
from fastapi.testclient import TestClient

from race_command_center.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        _seed(c)
        yield c


def _seed(c: TestClient) -> None:
    """Seed the unit test DB with the data the unit tests expect."""
    # Decisions with explicit IDs (the decisions model accepts decision_id in POST body)
    c.post("/decisions", json={
        "decision_id": "dec-map2",
        "title": "Cambiar mapa motor a MAP2",
        "decision_type": "engine_map",
        "risk_level": "medium",
        "proposed_by": "telemetry_agent",
        "status": "proposed",
        "session_id": "ses-unit-test",
    })
    c.post("/decisions", json={
        "decision_id": "dec-rebound",
        "title": "Ajuste de rebound trasero",
        "decision_type": "suspension",
        "risk_level": "low",
        "proposed_by": "digital_twin",
        "status": "proposed",
        "session_id": "ses-unit-test",
    })

    # Setups with explicit IDs
    c.post("/setup", json={
        "setup_id": "setup-base-jerez",
        "name": "Base Jerez FP1",
        "front_preload": 10.0,
        "rear_preload": 12.0,
        "front_compression": 8.0,
        "rear_compression": 9.0,
        "front_rebound": 7.0,
        "rear_rebound": 8.0,
        "engine_map": "MAP1",
        "front_compound": "medium",
        "rear_compound": "medium",
        "status": "active",
    })
    c.post("/setup", json={
        "setup_id": "setup-q-jerez",
        "name": "Qualifying Jerez",
        "front_preload": 10.0,
        "rear_preload": 14.0,
        "front_compression": 8.0,
        "rear_compression": 11.0,
        "front_rebound": 7.0,
        "rear_rebound": 10.0,
        "engine_map": "MAP2",
        "front_compound": "soft",
        "rear_compound": "soft",
        "status": "active",
    })


@pytest.fixture(scope="module")
def seeded_part_id(client) -> str:
    """Create a part and return its generated ID for tests that update by ID."""
    resp = client.post("/parts", json={
        "name": "Brake Disc Jerez Spec",
        "part_type": "braking",
        "target_circuit_id": "jerez",
        "problem_statement": "High brake temperature at Jerez",
        "technical_hypothesis": "Larger ventilation slots reduce temperature",
        "expected_impact": "-10°C peak brake temperature",
        "risk_level": "low",
    })
    assert resp.status_code == 201, f"Part creation failed: {resp.text}"
    return resp.json()["part_id"]
