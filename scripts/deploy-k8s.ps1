$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..\..")
$paths = @(
  "11-infra-kubernetes\namespaces",
  "11-infra-kubernetes\base",
  "11-infra-kubernetes\observability",
  "01-agent-orchestrator\k8s",
  "03-rag-cag-knowledge-layer\k8s",
  "15-race-command-center\k8s"
)

foreach ($relativePath in $paths) {
  $path = Join-Path $root $relativePath
  if (Test-Path $path) {
    Write-Host "Applying $relativePath"
    kubectl apply -f $path
  }
  else {
    Write-Host "Skipping missing $relativePath"
  }
}
