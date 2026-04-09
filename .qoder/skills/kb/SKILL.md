---
name: kb
description: "Knowledge base management for the maoxunxing.com Hugo blog. Collect raw materials (from URLs, text, or clipboard), compile them into structured notes, preview the knowledge base locally, and run health checks. Use when the user mentions collecting materials, adding to knowledge base, previewing raw content, compiling notes, or running /kb commands."
---

# Knowledge Base Manager

Manage the three-layer knowledge pipeline: `content/raw/` -> `content/notes/` -> `content/posts/`.

## Repository Path

This skill operates on the maoxunxing.com Hugo blog repository:

```
REPO_ROOT = the directory containing this .qoder/ folder
```

All paths below are relative to REPO_ROOT.

## Commands

Parse the user's input to determine which action to take:

| Trigger pattern | Action |
|---|---|
| `收集` / `collect` + URL | Fetch URL content, create raw entry |
| `收集` / `collect` + text (no URL) | Save text as raw entry |
| `编译` / `compile` + topic/tag | Merge related raw entries into a notes entry |
| `预览` / `preview` | Start `hugo server -D` for local preview |
| `检查` / `check` / `健康检查` | Audit raw/ and notes/ for issues |
| `列表` / `list` | List all raw entries with status |

## Action: Collect from URL

1. Use WebFetch to retrieve the URL content
2. Generate a kebab-case slug from the article title (e.g., `understanding-rag-pipelines`)
3. Create directory: `content/raw/{slug}/`
4. Write `content/raw/{slug}/index.zh-cn.md` with this template:

```markdown
---
title: "{extracted title}"
date: {today YYYY-MM-DD}
draft: true
tags: [{auto-detected tags, 2-4 relevant tags}]
source: "{original URL}"
---

{summarized content in markdown, preserving key information, tables, code blocks}
```

5. Report: title, path, tags, word count

## Action: Collect from Text

1. Generate a kebab-case slug from the first meaningful sentence or user-provided title
2. Create directory: `content/raw/{slug}/`
3. Write `content/raw/{slug}/index.zh-cn.md`:

```markdown
---
title: "{inferred title}"
date: {today YYYY-MM-DD}
draft: true
tags: [{auto-detected tags}]
source: ""
---

{user's text, cleaned up minimally - preserve original intent}
```

4. Report: title, path, tags

## Action: Preview

1. Check if a hugo server is already running (check port 1313)
2. If not running, start: `hugo server -D --source {REPO_ROOT}` in background
3. Report the local URL (typically http://localhost:1313/)
4. Mention that `-D` flag shows all draft/raw content

## Action: Compile

1. Read all entries in `content/raw/` that match the given topic or tag
2. Read the existing `content/notes/` entries to avoid duplication
3. Synthesize the matching raw entries into a structured notes entry:
   - Extract core concepts and key insights
   - Organize with clear headings and structure
   - Add cross-references via tags
   - Cite sources from the original raw entries
4. Write to `content/notes/{topic-slug}/index.zh-cn.md`:

```markdown
---
title: "{topic title}"
date: {today YYYY-MM-DD}
tags: [{comprehensive tags}]
---

{structured knowledge entry with sections, key concepts, and source attribution}
```

5. Report: what was compiled, which raw entries were used, output path

## Action: Health Check

Scan `content/raw/` and `content/notes/` and report:

1. **Raw entries without tags** - list them
2. **Duplicate or overlapping topics** in raw/ that should be merged
3. **Raw entries ready to compile** - clusters of 3+ entries on same topic
4. **Notes entries that could become posts** - well-developed notes with enough depth
5. **Missing sources** - raw entries without `source:` field
6. **Stale entries** - raw entries older than 30 days that haven't been compiled

Format as a structured report with actionable suggestions.

## Action: List

1. Read all entries in `content/raw/`
2. Display as a table:

```
| # | Title | Tags | Date | Source |
|---|-------|------|------|--------|
```

## Slug Generation Rules

- Lowercase, hyphens only, no special chars
- Max 50 chars
- Derive from title or first sentence
- Examples: `understanding-rag`, `karpathy-knowledge-base`, `pdd-store-notes`

## Tag Detection Heuristics

Auto-detect tags based on content keywords:

| Content signals | Suggested tags |
|---|---|
| LLM, GPT, Claude, model, training | AI, LLM |
| React, Vue, CSS, frontend, component | 前端 |
| investment, stock, fund, BTC, crypto | 投资 |
| workflow, productivity, tools | 效率, 工具 |
| business, startup, revenue | 商业 |
| book, reading, review | 读书 |

Always limit to 2-4 tags. Prefer Chinese tags for zh-cn content.

## Important Notes

- All raw entries MUST have `draft: true` - never remove this automatically
- Only the user decides when to promote notes to posts
- Preserve original content when collecting - minimal cleanup only
- When compiling, always attribute which raw entries were used
