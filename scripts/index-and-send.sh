#!/usr/bin/env bash
# Push search index to Algolia. Requires ALGOLIA_ADMIN_KEY (never commit this key).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

KEY="${ALGOLIA_ADMIN_KEY:?Set ALGOLIA_ADMIN_KEY to your Algolia Admin API key}"

TMP="$(mktemp "${TMPDIR:-/tmp}/algolia-config.XXXXXX.yaml)"
cleanup() { rm -f "$TMP"; }
trap cleanup EXIT

cat > "$TMP" <<EOF
---
algolia:
  index: "my-blog-index"
  key: "${KEY}"
  appID: "D7NQ3RODEC"
EOF

exec npx hugo-algolia -s -i "content/**/*.md" --config "$TMP"
