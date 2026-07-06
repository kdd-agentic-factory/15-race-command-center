#!/bin/bash
# Staging deploy for 15-race-command-center
# Usage: ./deploy-staging.sh [staging-url]

set -e

STAGING_URL=${1:-"https://kdd-race-command-center-preview.insforge.site"}

echo "=== Building 15-race-command-center ==="
echo "Base: /command-center/"
echo "Output: ../static/"
echo ""

npm run build

echo ""
echo "=== Build complete ==="
echo "Output directory: ../static/"
echo ""
echo "=== Deploy instructions ==="
echo "1. Create InsForge project: kdd-race-command-center-preview"
echo "2. Deploy ../static/ content"
echo "3. Set base path: /command-center/"
echo "4. Set VITE_RACE_AI_COPILOT_URL if 16 is available"
echo ""
echo "=== After deploy, update 13 ==="
echo "Set VITE_RACE_COMMAND_CENTER_URL=$STAGING_URL/command-center"
echo "in 13's .env before building 13"
