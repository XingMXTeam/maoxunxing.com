---
name: bilingual
description: "Auto-detect and generate bilingual articles for the maoxunxing.com Hugo blog. When a new post or note has only one language version (zh-cn or en), automatically generate the missing counterpart. Use when the user creates, edits, or publishes any content in content/posts/, content/notes/, or content/raw/."
---

# Bilingual Article Generator

This Hugo blog requires all published content to have both `index.zh-cn.md` and `index.en.md` versions.

## When to Trigger

Activate automatically whenever:
- A new post/note/raw entry is created with only one language
- The user writes or edits content in `content/posts/`, `content/notes/`, or `content/raw/`
- The user explicitly asks for translation

## Detection Logic

1. After any content file is written, check the sibling directory:
   - If `index.zh-cn.md` exists but `index.en.md` does not -> generate English version
   - If `index.en.md` exists but `index.zh-cn.md` does not -> generate Chinese version
   - If both exist -> no action needed (unless user asks for update)

2. For `content/raw/` entries: only generate a second language if the user explicitly requests it. Raw entries are inbox items and bilingual versions are optional.

## Translation Rules

### Chinese -> English

- Preserve all frontmatter fields. Translate `title` and `description`.
- Keep `date`, `draft`, `tags` identical. Translate tag values to English equivalents (e.g., "知识管理" -> "Knowledge Management", "前端" -> "Frontend").
- Translate body content naturally, not word-by-word. Adapt idioms and cultural references for English readers.
- Keep code blocks, URLs, command-line examples unchanged.
- Keep technical terms in their original form (e.g., "Hugo", "LLM", "RAG").
- Preserve all markdown formatting, headings structure, and table layouts exactly.

### English -> Chinese

- Same rules as above, reversed.
- Translate tags to Chinese equivalents (e.g., "AI" stays "AI", "Frontend" -> "前端").
- Use natural Chinese writing style, not translationese.

## Output Format

The generated file MUST match the source file's structure exactly:
- Same heading hierarchy
- Same number of sections
- Same code blocks and tables (content translated where appropriate)
- Same frontmatter fields

## Template

```markdown
---
title: "{translated title}"
description: "{translated description}"
date: {same date}
draft: {same draft status}
tags:
  - {translated tags}
custom_toc: {translated if present}
---

{translated body content}
```

## Important

- NEVER auto-translate without the user knowing. After generating, report what was created.
- If the source article has a References section, keep all URLs identical. Only translate the descriptive text.
- `content/raw/` bilingual generation is OPT-IN only. Do not auto-generate for raw entries.
