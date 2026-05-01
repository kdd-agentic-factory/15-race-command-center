COMPOSE_FULL=docker compose -f docker-compose.full-stack.yml
COMPOSE_RACE=docker compose -f docker-compose.race.yml

.PHONY: start start-race stop reset logs deploy-k8s export-paper-evidence validate

start:
	$(COMPOSE_FULL) up -d --build

start-race:
	$(COMPOSE_RACE) up -d --build

stop:
	$(COMPOSE_FULL) down

reset:
	$(COMPOSE_FULL) down -v

logs:
	$(COMPOSE_FULL) logs -f --tail=200

deploy-k8s:
	kubectl apply -f k8s/

export-paper-evidence:
	sh scripts/export-paper-evidence.sh

validate:
	python -c "import pathlib, yaml; [yaml.safe_load(open(p, encoding='utf-8')) for p in pathlib.Path('.').rglob('*.yml')]; [yaml.safe_load(open(p, encoding='utf-8')) for p in pathlib.Path('.').rglob('*.yaml')]; print('yaml ok')"

