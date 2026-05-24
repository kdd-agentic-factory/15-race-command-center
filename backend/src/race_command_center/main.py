import logging
import os
import pathlib
from contextlib import asynccontextmanager

import structlog
from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from prometheus_client import CONTENT_TYPE_LATEST, Counter, Histogram, generate_latest

from race_command_center.database import init_db
from race_command_center.rate_limit import RateLimitMiddleware


def _configure_otel(app: FastAPI, service_name: str = "race-command-center") -> None:
    endpoint = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "")
    if not endpoint:
        return
    try:
        from opentelemetry import trace
        from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
        from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
        from opentelemetry.sdk.resources import Resource
        from opentelemetry.sdk.trace import TracerProvider
        from opentelemetry.sdk.trace.export import BatchSpanProcessor

        provider = TracerProvider(resource=Resource.create({"service.name": service_name}))
        provider.add_span_processor(BatchSpanProcessor(OTLPSpanExporter(endpoint=endpoint, insecure=True)))
        trace.set_tracer_provider(provider)
        FastAPIInstrumentor.instrument_app(app)
        logging.getLogger(__name__).info("OTEL tracing enabled → %s", endpoint)
    except Exception as exc:
        logging.getLogger(__name__).warning("OTEL setup failed (non-fatal): %s", exc)
from race_command_center.routers import (
    circuits,
    copilot,
    decisions,
    health,
    parts,
    pregp,
    reports,
    sessions,
    setup,
    simulation,
    telemetry,
    websocket,
)

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s %(name)s %(levelname)s %(message)s",
)
structlog.configure(
    processors=[
        structlog.stdlib.add_log_level,
        structlog.stdlib.add_logger_name,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ],
    wrapper_class=structlog.stdlib.BoundLogger,
    logger_factory=structlog.stdlib.LoggerFactory(),
)

logger = logging.getLogger(__name__)

REQUEST_COUNT = Counter(
    "rcc_http_requests_total",
    "Total HTTP requests",
    ["method", "path", "status_code"],
)
REQUEST_LATENCY = Histogram(
    "rcc_http_request_duration_seconds",
    "HTTP request duration",
    ["method", "path"],
)


@asynccontextmanager
async def lifespan(application: FastAPI):
    await init_db()
    logger.info("Race Command Center started (DB ready)")
    yield
    logger.info("Race Command Center shutting down")


app = FastAPI(
    title="Race Command Center",
    version="0.2.0",
    description=(
        "Operational dashboard for the KDD-governed agentic race engineering platform. "
        "All data is persisted to PostgreSQL (SQLite fallback for local dev)."
    ),
    lifespan=lifespan,
)

_allowed_origins = os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")
_origins = [o.strip() for o in _allowed_origins if o.strip()] or ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RateLimitMiddleware, calls_per_minute=int(os.getenv("RATE_LIMIT_PER_MINUTE", "120")))


@app.middleware("http")
async def metrics_middleware(request: Request, call_next):
    path = request.url.path
    method = request.method
    with REQUEST_LATENCY.labels(method=method, path=path).time():
        response = await call_next(request)
    REQUEST_COUNT.labels(method=method, path=path, status_code=response.status_code).inc()
    return response


@app.get("/metrics", include_in_schema=False)
async def metrics():
    return Response(content=generate_latest(), media_type=CONTENT_TYPE_LATEST)


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

_configure_otel(app)

static_dir = pathlib.Path(__file__).parent.parent.parent.parent / "static"
if static_dir.exists():
    app.mount("/", StaticFiles(directory=str(static_dir), html=True), name="static")
