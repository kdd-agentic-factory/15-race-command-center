FROM node:20-slim AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci --quiet

COPY frontend .
RUN npm run build


FROM python:3.11-slim AS backend

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

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
      python-dotenv

COPY --from=frontend-build /app/static ./static

EXPOSE 8150

HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8150/health')"

CMD ["uvicorn", "race_command_center.main:app", \
     "--host", "0.0.0.0", "--port", "8150", \
     "--workers", "1"]
