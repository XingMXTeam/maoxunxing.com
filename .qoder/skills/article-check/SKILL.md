---
name: article-check
description: "Quality checker for blog articles in maoxunxing.com. Validates article tone, SEO, bilingual versions, frontmatter, structure, and links. Use when the user asks to check, review, or validate an article, or when running /article-check."
---

# Article Quality Checker

Audit blog articles for tone consistency, SEO quality, references, bilingual completeness, and structural correctness.

## Commands

| Trigger | Action |
|---|---|
| `/article-check` (no args) | Check ALL posts in content/posts/ |
| `/article-check {path}` | Check a specific article |
| `/article-check --fix {path}` | Check and auto-fix issues |

## Voice Standard

All Chinese articles should keep a calm, natural, experience-sharing tone.

The target style is:

- Like a knowledgeable friend sharing real practice, not an official tutorial.
- Clear, direct, and restrained.
- Has personal judgment and experience, but does not exaggerate.
- Avoids heavy marketing copy, AI-summary style, and overly formal report language.
- Keeps paragraphs complete and information-dense, without excessive line breaks.
- Explains technical steps by saying why they matter and where people may get stuck.

Prefer expressions like:

- “我最近试了一下……”
- “这个地方其实不复杂，但有几个点容易踩坑。”
- “我个人会更建议……”
- “这个问题排查起来会比较烦。”
- “简单说就是……”

Avoid overusing expressions like:

- “完整实践指南”
- “全面解析”
- “赋能”
- “范式转移”
- “底层逻辑重构”
- “助力技术人成长”
- “本文将系统介绍”
- “综上所述”
- “打造闭环”
- “突破提升”

## Checklist

Run these checks in order and report results as a table:

### 1. Tone & Voice

- [ ] Chinese content reads like calm personal experience sharing
- [ ] Intro starts from a real problem, personal observation, or practical context
- [ ] No obvious official tutorial, marketing, or AI-summary tone
- [ ] Claims are restrained and do not overpromise
- [ ] Paragraphs are not cut too碎 and do not rely on excessive bullet lists
- [ ] Technical content explains why steps matter and where people may get stuck

**If tone is off**: Rewrite the intro, description, section transitions, and conclusion first. Do not rewrite code blocks, factual tables, or technical details unless necessary.

### 2. References & Sources (SEO Critical)

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

### 3. Bilingual Versions

- [ ] `index.zh-cn.md` exists
- [ ] `index.en.md` exists
- [ ] Both versions have matching heading structure
- [ ] Both versions have matching tags (translated)

**If missing**: Flag it and suggest running the `bilingual` skill.

### 4. Frontmatter Completeness

- [ ] `title` is present and descriptive (not generic)
- [ ] `description` is present, 50-160 chars (SEO meta description length)
- [ ] `date` is present and valid
- [ ] `tags` has 2-5 relevant tags
- [ ] `custom_toc` is present if the article has 4+ sections

### 5. Content Structure

- [ ] Article has at least 3 H2 sections
- [ ] No orphan H3 without a parent H2
- [ ] Code blocks have language annotations (```js, ```bash, etc.)
- [ ] Tables are well-formed markdown

### 6. Links

- [ ] No broken internal links (references to other content/ paths)
- [ ] External URLs are https (not http)
- [ ] No placeholder URLs (example.com, localhost, etc.)

## Output Format

```
Article: {title}
Path: {path}
Language: {zh-cn | en | both}

Quality Score: {X}/6

| Check | Status | Details |
|-------|--------|---------|
| Tone | PASS/FAIL | {detail} |
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
- **Tone**: Rewrite the intro, description, section transitions, and conclusion toward the calm experience-sharing style. Preserve technical facts, code blocks, tables, and links.
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
| # | Article | Score | Tone | References | Bilingual | Frontmatter |
|---|---------|-------|------|------------|-----------|-------------|
```

Sorted by score ascending (worst first) so the user sees what needs attention.
