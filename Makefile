COMPOSE_GLOBAL=docker compose -f ../10-infra-docker/docker-compose.yml -f ../10-infra-docker/docker-compose.observability.yml -f docker-compose.global.yml
COMPOSE_FULL=docker compose -f docker-compose.full-stack.yml
COMPOSE_RACE=docker compose -f docker-compose.race.yml

BACKEND_SRC=backend/src
FRONTEND_SRC=frontend

.PHONY: dev backend frontend test test-backend test-unit test-e2e install build \
        start start-race start-local-stack start-web stop stop-race reset \
        logs ps deploy-k8s export-paper-evidence paper-poc validate validate-global

# ─── Development ─────────────────────────────────────────────────────────────

dev:
	@echo "Starting backend + frontend in development mode..."
	$(MAKE) backend &
	$(MAKE) frontend

backend:
	@echo "Starting FastAPI backend on port 8150..."
	cd backend && pip install -e ".[dev]" --quiet && \
	uvicorn race_command_center.main:app --host 0.0.0.0 --port 8150 --reload \
	  --reload-dir src/race_command_center

frontend:
	@echo "Starting Vite frontend on port 5173..."
	cd frontend && npm install && npm run dev

build:
	cd frontend && npm install && npm run build
	@echo "Frontend built to ./static"

install:
	cd frontend && npm install
	cd backend && pip install -e ".[dev]"

# ─── Testing ─────────────────────────────────────────────────────────────────

test: test-backend

test-backend:
	cd backend && python -m pytest tests/ -v

test-unit:
	cd backend && python -m pytest tests/unit/ -v

test-e2e:
	cd tests/e2e && npx playwright test

# ─── Docker ──────────────────────────────────────────────────────────────────

start:
	$(COMPOSE_GLOBAL) up -d --build

start-local-stack:
	$(COMPOSE_FULL) up -d --build

start-race:
	$(COMPOSE_RACE) up -d --build

start-web:
	python -m http.server 8090 -d apps/web-dashboard

stop:
	$(COMPOSE_GLOBAL) down

stop-race:
	$(COMPOSE_FULL) down

reset:
	$(COMPOSE_GLOBAL) down -v

logs:
	$(COMPOSE_GLOBAL) logs -f --tail=200

ps:
	$(COMPOSE_GLOBAL) ps

# ─── Operations ──────────────────────────────────────────────────────────────

deploy-k8s:
	powershell -ExecutionPolicy Bypass -File scripts/deploy-k8s.ps1

export-paper-evidence:
	sh scripts/export-paper-evidence.sh

paper-poc:
	python scripts/run-paper-poc.py

validate:
	python -c "import pathlib, yaml; [yaml.safe_load(open(p, encoding='utf-8')) for p in pathlib.Path('.').rglob('*.yml')]; [yaml.safe_load(open(p, encoding='utf-8')) for p in pathlib.Path('.').rglob('*.yaml')]; print('yaml ok')"

validate-global:
	$(COMPOSE_GLOBAL) config --quiet
