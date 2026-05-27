FROM node:20.18.0-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci --quiet

COPY frontend .
RUN npm run build


FROM python:3.11.10-slim AS backend

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app/src

COPY backend/pyproject.toml ./pyproject.toml
COPY backend/src ./src

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir \
      fastapi \
      "uvicorn[standard]" \
      pydantic \
      pydantic-settings \
      httpx \
      structlog \
      prometheus-client \
      opentelemetry-api \
      opentelemetry-sdk \
      opentelemetry-instrumentation-fastapi \
      "opentelemetry-exporter-otlp-proto-grpc>=1.24.0" \
      python-dotenv \
      websockets \
      "sqlalchemy[asyncio]>=2.0" \
      "asyncpg>=0.29" \
      "aiosqlite>=0.20" \
      PyJWT \
      bcrypt

COPY --from=frontend-build /app/static ./static

RUN addgroup --system kdd && adduser --system --ingroup kdd --uid 1000 kdd \
    && chown -R kdd:kdd /app

USER kdd

EXPOSE 8150

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8150/health')" || exit 1

CMD ["uvicorn", "race_command_center.main:app", \
     "--host", "0.0.0.0", "--port", "8150", \
     "--workers", "1"]
