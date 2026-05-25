"""Integration test configuration — uses file-based SQLite so connections share state."""
import os
import pathlib

# Must be set before race_command_center is first imported.
_TEST_DB = pathlib.Path(__file__).parent / "test_rcc.db"
os.environ.setdefault("DATABASE_URL", f"sqlite+aiosqlite:///{_TEST_DB}")
os.environ.setdefault("RATE_LIMIT_PER_MINUTE", "99999")

import pytest
from fastapi.testclient import TestClient

from race_command_center.main import app


@pytest.fixture(scope="session")
def client():
    with TestClient(app) as c:
        yield c
    _TEST_DB.unlink(missing_ok=True)
