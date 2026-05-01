$ErrorActionPreference = "Stop"

Push-Location (Join-Path $PSScriptRoot "..")
try {
  docker compose -f ../10-infra-docker/docker-compose.yml -f ../10-infra-docker/docker-compose.observability.yml -f docker-compose.global.yml down
}
finally {
  Pop-Location
}
