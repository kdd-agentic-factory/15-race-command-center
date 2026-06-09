"""Integration test configuration — uses file-based SQLite so connections share state."""
import os
import pathlib

# Must be set before race_command_center is first imported.
_TEST_DB = pathlib.Path(__file__).parent / "test_rcc.db"
os.environ.setdefault("DATABASE_URL", f"sqlite+aiosqlite:///{_TEST_DB}")
os.environ.setdefault("RATE_LIMIT_PER_MINUTE", "99999")
os.environ.setdefault("INSFORGE_AUTH_ENABLED", "false")  # middleware disabled in tests
# Mock telemetry endpoints are only registered when mock mode is on (off in prod).
os.environ.setdefault("ENABLE_MOCK_MODE", "true")

import pytest
from fastapi.testclient import TestClient

from race_command_center.auth_deps import Principal, get_current_principal
from race_command_center.main import app


# Override auth so integration tests don't need Bearer tokens.
async def _mock_principal() -> Principal:
    return Principal(id="test_runner", role="admin", display_name="Test Runner")

app.dependency_overrides[get_current_principal] = _mock_principal


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c
    _TEST_DB.unlink(missing_ok=True)
