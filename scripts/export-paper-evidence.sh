#!/usr/bin/env sh
set -eu
mkdir -p paper-evidence
cp README.md design.md paper-evidence/
cp docs/*.md paper-evidence/
echo "Paper evidence exported to paper-evidence/"

