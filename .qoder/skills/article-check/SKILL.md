---
name: article-check
description: "Quality checker for blog articles in maoxunxing.com. Validates that articles have proper references/sources for SEO, bilingual versions, correct frontmatter, and working links. Use when the user asks to check, review, or validate an article, or when running /article-check."
---

# Article Quality Checker

Audit blog articles for SEO quality, references, bilingual completeness, and structural correctness.

## Commands

| Trigger | Action |
|---|---|
| `/article-check` (no args) | Check ALL posts in content/posts/ |
| `/article-check {path}` | Check a specific article |
| `/article-check --fix {path}` | Check and auto-fix issues |

## Checklist

Run these checks in order and report results as a table:

### 1. References & Sources (SEO Critical)

- [ ] Article has a `## References` section at the bottom
- [ ] At least 3 external references with working URLs
- [ ] References include English-language sources (prefer authoritative: YouTube videos, official docs, research papers, major tech publications)
- [ ] Each reference has: source name, URL, and a brief description
- [ ] References are categorized (Primary Sources, Video, Analysis, Related)

**If missing**: Search the web for 3-5 relevant English sources. Prefer:
1. YouTube videos (highest engagement for SEO)
2. Official documentation or project pages
3. Major publications (VentureBeat, TechCrunch, Hacker News)
4. Community discussions (Reddit, DEV.to)
5. Academic papers or technical blogs

### 2. Bilingual Versions

- [ ] `index.zh-cn.md` exists
- [ ] `index.en.md` exists
- [ ] Both versions have matching heading structure
- [ ] Both versions have matching tags (translated)

**If missing**: Flag it and suggest running the `bilingual` skill.

### 3. Frontmatter Completeness

- [ ] `title` is present and descriptive (not generic)
- [ ] `description` is present, 50-160 chars (SEO meta description length)
- [ ] `date` is present and valid
- [ ] `tags` has 2-5 relevant tags
- [ ] `custom_toc` is present if the article has 4+ sections

### 4. Content Structure

- [ ] Article has at least 3 H2 sections
- [ ] No orphan H3 without a parent H2
- [ ] Code blocks have language annotations (```js, ```bash, etc.)
- [ ] Tables are well-formed markdown

### 5. Links

- [ ] No broken internal links (references to other content/ paths)
- [ ] External URLs are https (not http)
- [ ] No placeholder URLs (example.com, localhost, etc.)

## Output Format

```
Article: {title}
Path: {path}
Language: {zh-cn | en | both}

Quality Score: {X}/5

| Check | Status | Details |
|-------|--------|---------|
| References | PASS/FAIL | {detail} |
| Bilingual | PASS/FAIL | {detail} |
| Frontmatter | PASS/FAIL | {detail} |
| Structure | PASS/FAIL | {detail} |
| Links | PASS/FAIL | {detail} |

Issues Found:
1. {issue description + suggested fix}
2. ...

Suggested Actions:
- {actionable next step}
```

## Auto-Fix Behavior (--fix mode)

When `--fix` is specified:
- **References**: Search the web and add a References section with 3-5 English sources
- **Bilingual**: Invoke the `bilingual` skill to generate the missing version
- **Frontmatter**: Add missing `description` (auto-generate from content), fill missing `tags`
- **Structure**: Add language hints to bare code blocks
- **Links**: Replace http with https where possible

NEVER auto-fix without reporting what was changed.

## Batch Mode

When checking all posts (`/article-check` with no args):
1. Scan all directories in `content/posts/`
2. Run the checklist on each
3. Output a summary table:

```
| # | Article | Score | References | Bilingual | Frontmatter |
|---|---------|-------|------------|-----------|-------------|
```

Sorted by score ascending (worst first) so the user sees what needs attention.
