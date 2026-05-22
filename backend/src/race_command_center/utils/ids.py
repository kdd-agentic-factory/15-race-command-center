import uuid
import time


def new_id(prefix: str = "") -> str:
    short = uuid.uuid4().hex[:8]
    return f"{prefix}-{short}" if prefix else short


def new_session_id() -> str:
    return f"session-{int(time.time())}-{uuid.uuid4().hex[:6]}"


def new_part_id() -> str:
    return new_id("part")


def new_decision_id() -> str:
    return new_id("dec")


def new_simulation_id() -> str:
    return new_id("sim")


def new_report_id() -> str:
    return new_id("rpt")
