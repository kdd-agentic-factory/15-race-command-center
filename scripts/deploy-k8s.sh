#!/usr/bin/env sh
set -eu

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/../.." && pwd)"

for path in \
  "11-infra-kubernetes/namespaces" \
  "11-infra-kubernetes/base" \
  "11-infra-kubernetes/observability" \
  "01-agent-orchestrator/k8s" \
  "03-rag-cag-knowledge-layer/k8s" \
  "15-race-command-center/k8s"
do
  if [ -d "$ROOT/$path" ]; then
    echo "Applying $path"
    kubectl apply -f "$ROOT/$path"
  else
    echo "Skipping missing $path"
  fi
done
