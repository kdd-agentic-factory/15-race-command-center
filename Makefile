COMPOSE_GLOBAL=docker compose -f ../10-infra-docker/docker-compose.yml -f ../10-infra-docker/docker-compose.observability.yml -f docker-compose.global.yml
COMPOSE_FULL=docker compose -f docker-compose.full-stack.yml
COMPOSE_RACE=docker compose -f docker-compose.race.yml

.PHONY: start start-race start-local-stack start-web stop stop-race reset logs ps deploy-k8s export-paper-evidence paper-poc validate validate-global

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
