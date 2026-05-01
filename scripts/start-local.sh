#!/usr/bin/env sh
set -eu
docker compose -f docker-compose.race.yml up -d --build

