#!/usr/bin/env bash
# Optional: verify Hugo + theme submodule before local dev.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if ! command -v hugo >/dev/null 2>&1; then
  echo "hugo not found. Install Hugo Extended: https://gohugo.io/installation/"
  exit 1
fi

if [[ ! -f themes/hugo-coder/theme.toml ]] && [[ ! -f themes/hugo-coder/go.mod ]]; then
  echo "Theme missing. Run: git submodule update --init"
  exit 1
fi

echo "OK: hugo $(hugo version)"
echo "Starting dev server at http://localhost:1313/ (Ctrl+C to stop)"
exec hugo server
