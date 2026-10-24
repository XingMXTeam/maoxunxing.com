#!/usr/bin/env bash
# Push per-language search indices to Algolia. Requires ALGOLIA_ADMIN_KEY (never commit this key).
#
# Split indices (2026-10-24): a single shared index made bilingual pages collide
# on objectID (zh and en files share one uri), so one language's text won and
# single-language pages 404'd from the other language's search. Now:
#   zh -> my-blog-index     (all .md except *.en.md; default-language files
#                            such as bare section _index.md belong to zh)
#   en -> my-blog-index-en  (*.en.md only)
#
# The zh run keeps hugo-algolia's own sender (proven in CI). The en index is
# new, and hugo-algolia's sender calls getSettings/searchSynonyms on the live
# index before sending, which 404s on a not-yet-existing index and aborts the
# whole build step. So en is generated only and sent by send-algolia-index.js,
# whose saveObjects auto-creates the index. The en send is deliberately
# non-fatal: a stale search index must never block a site deploy.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

KEY="${ALGOLIA_ADMIN_KEY:?Set ALGOLIA_ADMIN_KEY to your Algolia Admin API key}"

TMP="$(mktemp "${TMPDIR:-/tmp}/algolia-config.XXXXXX.yaml")"
cleanup() { rm -f "$TMP"; }
trap cleanup EXIT

send_index() {
  local glob="$1" index="$2"
  cat > "$TMP" <<EOF
---
algolia:
  index: "${index}"
  key: "${KEY}"
  appID: "D7NQ3RODEC"
EOF
  npx hugo-algolia -s -i "${glob}" --config "$TMP"
}

# Chinese index (existing name, keeps its settings history).
send_index "content/**/!(*.en).md" "my-blog-index"

# English index: generate only, then send via the custom sender.
cat > "$TMP" <<EOF
---
algolia:
  index: "my-blog-index-en"
  key: "${KEY}"
  appID: "D7NQ3RODEC"
EOF
npx hugo-algolia -i "content/**/*.en.md" --config "$TMP"
node scripts/send-algolia-index.js "my-blog-index-en" "public/algolia.json" || {
  echo "WARNING: English index send failed (site deploy continues); see the error above." >&2
}
