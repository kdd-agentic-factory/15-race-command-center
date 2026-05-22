from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import pathlib

from race_command_center.routers import (
    health,
    sessions,
    telemetry,
    circuits,
    setup,
    parts,
    pregp,
    decisions,
    copilot,
    simulation,
    reports,
    websocket,
)

app = FastAPI(
    title="Race Command Center",
    version="0.1.0",
    description="Operational dashboard for the KDD-governed agentic race engineering platform.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, tags=["health"])
app.include_router(sessions.router, prefix="/sessions", tags=["sessions"])
app.include_router(telemetry.router, prefix="/telemetry", tags=["telemetry"])
app.include_router(circuits.router, prefix="/circuits", tags=["circuits"])
app.include_router(setup.router, prefix="/setup", tags=["setup"])
app.include_router(parts.router, prefix="/parts", tags=["parts"])
app.include_router(pregp.router, prefix="/pre-gp", tags=["pre-grand-prix"])
app.include_router(decisions.router, prefix="/decisions", tags=["decisions"])
app.include_router(copilot.router, prefix="/copilot", tags=["copilot"])
app.include_router(simulation.router, prefix="/simulation", tags=["simulation"])
app.include_router(reports.router, prefix="/reports", tags=["reports"])
app.include_router(websocket.router, tags=["websocket"])

static_dir = pathlib.Path(__file__).parent.parent.parent.parent / "static"
if static_dir.exists():
    app.mount("/", StaticFiles(directory=str(static_dir), html=True), name="static")
