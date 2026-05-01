$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$repos = @(
  "00-kdd-governance",
  "01-agent-orchestrator",
  "02-mcp-gateway",
  "03-rag-cag-knowledge-layer",
  "04-skills-autoskills-registry",
  "05-documentation-agent",
  "06-kdd-data-pipelines",
  "07-agentic-workflows",
  "08-experimentation-lab",
  "09-observability-platform",
  "10-infra-docker",
  "11-infra-kubernetes",
  "12-ci-cd-security",
  "13-ui-command-center",
  "14-paper-reproducibility-kit",
  "15-race-command-center"
)

$repos | ForEach-Object {
  $path = Join-Path $root $_
  [pscustomobject]@{
    Repository = $_
    Present = Test-Path $path
    Dockerfile = Test-Path (Join-Path $path "Dockerfile")
    Compose = @(Get-ChildItem -Path $path -Filter "docker-compose*.yml" -File -ErrorAction SilentlyContinue).Count
    Kubernetes = Test-Path (Join-Path $path "k8s")
  }
} | Format-Table -AutoSize
