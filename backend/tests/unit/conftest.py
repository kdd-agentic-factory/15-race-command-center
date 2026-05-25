"""Unit test setup — disables rate limiting and provides a shared TestClient."""
import os

# Disable rate limiting in unit tests (set before app import)
os.environ.setdefault("RATE_LIMIT_PER_MINUTE", "99999")
os.environ.setdefault("DATABASE_URL", "sqlite+aiosqlite:///./test_unit.db")

import pytest
from fastapi.testclient import TestClient

from race_command_center.main import app


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c
