---
name: syndicate
description: "Generate cross-posting templates for dev.to and CSDN from blog articles. Reads the article, finds related posts for internal links, converts Hugo shortcodes, and outputs platform-ready markdown with proper canonical URLs and backlink structure. Use when the user wants to syndicate, cross-post, or distribute an article to dev.to or CSDN."
---

# Content Syndication Generator

Generate platform-ready cross-posting templates from Hugo blog articles with proper backlink structure.

## Repository Path

This skill operates on the maoxunxing.com Hugo blog repository:

```
REPO_ROOT = the directory containing this .qoder/ folder
```

All paths below are relative to REPO_ROOT.

## Commands

| Trigger pattern | Action |
|---|---|
| `/syndicate {path}` | Generate both dev.to + CSDN templates for the article |
| `/syndicate {path} devto` | Generate dev.to template only |
| `/syndicate {path} csdn` | Generate CSDN template only |
| `/syndicate list` | List all posts ranked by syndication priority |

If the user gives just a slug (e.g., `node-event-loop-cpu-spike`), resolve it to `content/posts/{slug}/`.

## Action: Generate Templates

### Step 1: Read the source article

1. Determine the article directory from the user's input.
2. Read `index.en.md` (for dev.to) and `index.zh-cn.md` (for CSDN).
3. Extract from frontmatter: `title`, `description`, `date`, `tags`, `images`.
4. If one language version is missing, report it and generate only for the available language.

### Step 2: Find related articles for internal links

This is the key step that makes each template unique. Internal links (backlinks in the article body) are the most durable form of backlink.

1. Read the article's `tags` array.
2. Scan ALL other posts in `content/posts/*/` and read their frontmatter.
3. Score each other post by tag overlap with the current article:
   - Each shared tag = 1 point
   - Bonus +1 if the other post has a `## References` section (indicates quality)
   - Bonus +1 if the other post covers a related technology (e.g., Node.js article links to React SSR article if both have "Web Development" tag)
4. Select the top 3 related articles (must have at least 1 shared tag).
5. For each related article, compose a natural one-sentence recommendation that explains WHY the reader should click. Do NOT use generic phrases like "check out my other article." Instead, connect it to the current article's content. Example:

   Good: "If you're hitting similar performance issues with message queues, my [Frontend Tracking Guide](https://maoxunxing.com/spm/) covers how SPM parameters interact with async event pipelines."

   Bad: "You might also like my [Frontend Tracking Guide](https://maoxunxing.com/spm/)."

### Step 3: Convert Hugo shortcodes

Apply these conversions to the article body:

| Hugo syntax | dev.to replacement | CSDN replacement |
|---|---|---|
| `{{</* img src="X" alt="Y" */>}}` and variants | `![Y](https://maoxunxing.com/{slug}/X)` | Same |
| `{{</* img src="X" alt="Y" maxWidth="Z" align="W" caption="C" */>}}` | `![C](https://maoxunxing.com/{slug}/X)` | Same |
| `{{</* youtube ID */>}}` | `{% youtube ID %}` | `[Watch on YouTube](https://youtube.com/watch?v=ID)` |
| `{{</* gallery */>}}...{{</* /gallery */>}}` | Convert each image to markdown image | Same |
| `<!--more-->` | Remove | Remove |
| Relative image paths (e.g., `image.png`, `./image.png`) | `https://maoxunxing.com/{slug}/image.png` | Same |
| `custom_toc` in frontmatter | Remove entirely | Remove entirely |
| `images` in frontmatter | Use first image as `cover_image` for dev.to | Remove |

### Step 4: Generate dev.to template

Write to `scripts/templates/devto-{slug}.md`:

```markdown
---
title: "{title from EN frontmatter}"
published: true
description: "{description from EN frontmatter}"
tags: {pick up to 4 tags from: the article's tags mapped to dev.to popular tags}
canonical_url: https://maoxunxing.com/{slug}/
cover_image: {absolute URL to first image if exists, otherwise omit this line}
---

> This article was originally published on **[maoxunxing.com](https://maoxunxing.com/{slug}/)**. Follow me there for more deep dives on {main topic of article}.

---

{converted EN article body - all shortcodes converted, all image paths absolute}

---

## Related Reading

{3 natural internal link paragraphs from Step 2, each linking to https://maoxunxing.com/{related-slug}/}

---

*Felix Mao | [maoxunxing.com](https://maoxunxing.com) | [@maoxunxing](https://twitter.com/maoxunxing) | [GitHub](https://github.com/XingMXTeam/)*
```

**dev.to tag mapping rules:**
- dev.to allows max 4 tags, all lowercase, no spaces
- Map common tags: "Web Development" -> "webdev", "JavaScript" -> "javascript", "Node.js" -> "node", "React" -> "react", "AI" -> "ai", "CSS" -> "css", "Performance" -> "performance", "Performance Optimization" -> "performance", "Docker" -> "docker", "Algorithm" -> "algorithms", "Data Structures" -> "datastructures", "Career" -> "career", "Coding" -> "coding", "Architecture" -> "architecture", "TypeScript" -> "typescript"
- If a tag doesn't map, lowercase it and remove spaces
- Always include one broad tag like "webdev", "javascript", or "programming" for discoverability

### Step 5: Generate CSDN template

Write to `scripts/templates/csdn-{slug}.md`:

```markdown
# {title from ZH-CN frontmatter}

> **本文首发于 [maoxunxing.com](https://maoxunxing.com/zh-cn/{slug}/)**，转载请注明出处。更多{main topic in Chinese}深度文章，欢迎访问我的博客。

**标签**: {tags from ZH-CN frontmatter, comma-separated}

---

{converted ZH-CN article body - all shortcodes converted, all image paths absolute, iframes replaced with links}

---

## 延伸阅读

{3 natural internal link paragraphs from Step 2, Chinese versions, each linking to https://maoxunxing.com/zh-cn/{related-slug}/}

---

**作者**: Felix Mao (毛毛星)
**博客**: [maoxunxing.com](https://maoxunxing.com)
**GitHub**: [github.com/XingMXTeam](https://github.com/XingMXTeam/)
**Twitter**: [@maoxunxing](https://twitter.com/maoxunxing)
```

**CSDN-specific conversions (in addition to Step 3):**
- Remove all `<iframe>` tags and replace with plain links
- Ensure no HTML `<script>` tags remain
- CSDN supports standard markdown tables but NOT Hugo table shortcodes

### Step 6: Report

After generating, output a summary:

```
Generated syndication templates:
  dev.to:  scripts/templates/devto-{slug}.md
  CSDN:    scripts/templates/csdn-{slug}.md

Backlink structure:
  Layer 1 (canonical):  https://maoxunxing.com/{slug}/
  Layer 2 (header):     "Originally published on maoxunxing.com"
  Layer 3 (internal):   3 links to related articles

Related articles linked:
  1. {title} -> https://maoxunxing.com/{related-slug}/
  2. {title} -> https://maoxunxing.com/{related-slug}/
  3. {title} -> https://maoxunxing.com/{related-slug}/

dev.to tags: {tag1}, {tag2}, {tag3}, {tag4}

CSDN checklist:
  [ ] Publish article
  [ ] View source -> search "canonical" -> verify it points to maoxunxing.com
  [ ] If not, the header link is your primary backlink (already included)
```

## Action: List Posts by Syndication Priority

When the user runs `/syndicate list`:

1. Scan all posts in `content/posts/*/`
2. Score each post for syndication value:
   - +3 if has real-world code examples or production case studies
   - +2 if has data/metrics (performance numbers, before/after comparisons)
   - +2 if topic is trending (AI, LLM, performance, modern frameworks)
   - +1 if has both EN and ZH-CN versions
   - +1 if has a References section
   - -2 if very short (< 500 words estimated by line count < 50)
   - -1 if topic is too generic ("What You Need to Know About X")
   - -1 if purely a listicle or collection of links
3. Output a ranked table:

```
| Rank | Slug | Title | Score | Platform | Reason |
|------|------|-------|-------|----------|--------|
| 1 | node-event-loop-cpu-spike | Node.js CPU Spike... | 8 | dev.to | Real production case, code + data |
| 2 | karpathy-knowledge-base-practice | Karpathy's KB... | 7 | dev.to | Trending topic, unique angle |
| ... | | | | | |
```

## Important Notes

- NEVER modify the original article files. Only write to `scripts/templates/`.
- Always use absolute URLs for images: `https://maoxunxing.com/{slug}/{image}`
- The `canonical_url` in dev.to frontmatter is the MOST important backlink. Double-check it uses the correct slug.
- For EN articles, link to `https://maoxunxing.com/{slug}/` (no language prefix, EN is default)
- For ZH-CN articles, link to `https://maoxunxing.com/zh-cn/{slug}/`
- Internal links in the EN template should point to EN versions (no prefix). Internal links in the CSDN template should point to ZH-CN versions (`/zh-cn/` prefix).
