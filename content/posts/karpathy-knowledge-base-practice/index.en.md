---
title: "Practicing Karpathy's Personal Knowledge Base Method with a Git Repository"
description: "Build a three-layer knowledge pipeline (raw, notes, posts) with Git + Markdown + LLM, inspired by Karpathy's LLM Wiki method."
date: 2026-04-09
tags:
  - AI
  - Knowledge Management
  - Methodology
  - Hugo
custom_toc:
  - title: "Karpathy's Method"
  - title: "Why Not Obsidian"
  - title: "Three-Layer Pipeline"
  - title: "Step-by-Step Setup"
  - title: "Compiling with LLM"
  - title: "Daily Workflow"
---

## What Karpathy Shared

{{< youtube VRub1w-APTc >}}

Andrej Karpathy recently shared a practical approach on [X/Twitter](https://x.com/karpathy/status/2039805659525644595) and published a complete [LLM Wiki Gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f): using LLMs to build personal knowledge bases for research topics. The core workflow:

1. Dump source files (articles, papers, screenshots) into a `raw/` directory
2. Use an LLM to "compile" them into structured Markdown knowledge entries
3. Browse everything in Obsidian
4. Query the knowledge base — the LLM searches and answers autonomously
5. Periodically run LLM "health checks" to fix contradictions and fill gaps

His knowledge base has grown to ~100 entries and 400K words. No RAG needed — the LLM maintains indexes and summaries to handle all queries.

**In one sentence**: raw materials in, structured knowledge out, LLM does the heavy lifting.

## Why Not Obsidian

Karpathy uses Obsidian as his viewer. But if you already have a Hugo blog repository, you don't need any extra software:

| Need | Obsidian Approach | Hugo Repo Approach |
|------|-------------------|-------------------|
| View Markdown | Obsidian editor | `hugo server -D` local preview |
| Link knowledge | `[[]]` backlinks + graph | Hugo tags + Algolia search |
| Publish output | Requires extra export | Remove `draft: true`, push |
| Version control | Needs Obsidian Git plugin | It's already a Git repo |
| Multi-device sync | Obsidian Sync or iCloud | `git pull` |
| Search | Built-in Obsidian search | `grep` / Algolia / LLM |

The key advantage: **knowledge refined into articles publishes directly — zero migration cost**. One repo, full pipeline from collection to publication.

## Three-Layer Knowledge Pipeline

Build three content tiers inside your repository:

```
content/
  raw/        <- Inbox: see something good, dump it here
  notes/      <- Knowledge base: LLM-compiled structured entries
  posts/      <- Blog: polished, published articles
```

### raw/ — Zero-Friction Inbox

This is the system's entry point. Key principle: **don't fuss over formatting or classification — just capture it**.

Each raw entry is a Markdown file with frontmatter:

```markdown
---
title: "Some article about RAG pipelines"
date: 2026-04-09
draft: true
tags: [AI, RAG]
source: "https://original-url"
---

Paste the original text / summary / screenshot / notes here. Whatever is fastest.
```

`draft: true` ensures these materials never appear on your live blog — only visible locally with `hugo server -D`.

### notes/ — Compiled Knowledge Entries

When `raw/` accumulates enough material on a topic, let the LLM:

- Merge and synthesize related materials
- Extract core insights
- Add structured summaries
- Tag with cross-references

Turning `raw/` fragments into complete knowledge entries in `notes/`.

### posts/ — Published Blog Articles

When a `notes/` entry reaches sufficient depth and you're ready to write a full article, polish it, remove `draft: true`, and publish.

**Flow is always one-directional**: raw -> notes -> posts. Materials only get more refined, never regress.

## Step-by-Step Setup

### Step 1: Create the raw directory

```bash
mkdir -p content/raw

cat <<'EOF' > content/raw/_index.md
---
title: "Raw"
description: "Knowledge inbox"
draft: true
---
EOF
```

### Step 2: Add a Hugo archetype template

Create `archetypes/raw.md`:

```markdown
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
tags: []
source: ""
---
```

Now `hugo new raw/topic-name/index.md` auto-generates entries with the template.

### Step 3: Configure Hugo permalinks

Add `raw` to the permalinks section in `config.toml`:

```toml
[permalinks]
raw = "/:slugorcontentbasename/"
```

### Step 4: Start collecting

See a good article or have an idea? Create a raw entry immediately:

```bash
hugo new raw/interesting-topic/index.md
```

Paste in the content. No formatting needed, no perfection required — raw state is fine.

## Compiling with LLM

This is the heart of Karpathy's method and the highest-value step.

### Materials -> Knowledge Entries

Have the LLM read multiple related materials from `raw/` and synthesize a `notes/` entry:

> "Read all raw entries tagged with AI, synthesize them into a structured knowledge entry under content/notes/ai-fundamentals/. Requirements: extract core concepts, add cross-references, cite sources."

### Knowledge Entries -> Blog Posts

When a notes entry has accumulated enough depth:

> "Based on the knowledge entry in content/notes/ai-fundamentals/, write a developer-facing blog post for content/posts/. Requirements: include opinions, real examples, and actionable advice."

### Health Checks

Periodically audit the knowledge base:

> "Scan all entries in content/raw/ and content/notes/. Find: 1) duplicate topics that should merge 2) entries missing tags 3) raw materials ready to compile into notes"

### Automate with a Qoder Skill

Take it further with a Qoder Skill — one sentence does it all:

- `/kb collect https://example.com/article` — fetch and create a raw entry
- `/kb collect I learned today that LoRA fine-tuning's key is...` — quick-capture a thought
- `/kb compile AI` — compile AI-related raw materials into a notes entry
- `/kb preview` — start local preview with all materials visible
- `/kb check` — LLM health check

## Daily Workflow

The visual flow:

```
See a great article / Have an insight
       |
       v
  /kb collect "content"     <-- One sentence, zero friction
       |
       v
  content/raw/xxx/          <-- Auto-created, draft:true
       |
       v (accumulate enough)
  /kb compile "topic"       <-- LLM synthesizes
       |
       v
  content/notes/xxx/        <-- Structured knowledge entry
       |
       v (polish & refine)
  content/posts/xxx/        <-- Published blog post, draft removed
       |
       v
  git push -> live on the web
```

The entire process:
- **Collection**: Zero friction, one sentence
- **Compilation**: LLM handles the grunt work
- **Publishing**: Remove `draft: true`, push to deploy
- **No extra software**: Git + Hugo + LLM, that's it

## Comparison with Karpathy's Original

| Aspect | Karpathy's Version | This Approach |
|--------|-------------------|---------------|
| Storage | Standalone knowledge repo | Embedded in blog repo |
| Viewer | Obsidian | hugo server -D |
| Raw materials | raw/ directory | content/raw/ (draft) |
| Compilation | LLM generates .md | LLM generates notes/ |
| Output | Markdown/Marp/charts | Directly published as blog posts |
| Search | Custom search engine | grep + Algolia + LLM |
| Health checks | LLM audit | Same LLM audit |

The biggest difference: Karpathy's knowledge base is standalone — output requires manual migration. In this approach, the knowledge base and blog are unified. Collection to publication happens in one repository, with zero migration cost.

## Summary

The core of Karpathy's method isn't about which tools you use — it's about establishing a **"collect -> compile -> output"** knowledge pipeline and letting the LLM handle compilation and maintenance.

If you already have a blog repository, you can implement this method right inside it: add `content/raw/` as an inbox, use `draft: true` to control visibility, and let the LLM drive the flow from raw materials to knowledge to published articles.

No Obsidian. No Notion. No new software. One Git repo is your knowledge base.

---

## References

### Primary Sources

- **Andrej Karpathy's original post** — [X/Twitter thread on LLM Knowledge Bases](https://x.com/karpathy/status/2039805659525644595) — The original announcement describing the raw/ -> wiki compilation workflow.
- **LLM Wiki Gist** — [github.com/karpathy/442a6bf...](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f) — Karpathy's complete LLM Wiki pattern specification, defining the three-layer architecture (source materials, AI-generated wiki, configuration).

### Video Explainers

- [How to Build a Personal LLM Knowledge Base (Karpathy's Method)](https://www.youtube.com/watch?v=VRub1w-APTc) — Step-by-step walkthrough of implementing Karpathy's method.
- [How To Do PHD-Level Research with AI (Karpathy's LLM Wiki)](https://www.youtube.com/watch?v=FR9USL0yj3I) — Deep dive into using the LLM Wiki pattern for academic-level research.
- [Karpathy's LLM Wiki: The End of Forgotten Knowledge](https://www.youtube.com/watch?v=RQsLXmenr48) — Analysis of the LLM Wiki pattern as an alternative to traditional RAG retrieval.

### Analysis & Community

- **VentureBeat** — [Karpathy shares 'LLM Knowledge Base' architecture that bypasses RAG](https://venturebeat.com/data/karpathy-shares-llm-knowledge-base-architecture-that-bypasses-rag-with-an) — Industry analysis of why this approach works without complex RAG pipelines.
- **MindStudio** — [What Is Andrej Karpathy's LLM Wiki?](https://www.mindstudio.ai/blog/andrej-karpathy-llm-wiki-knowledge-base-claude-code/) — Practical guide to building an LLM Wiki with Claude Code.
- **Antigravity Codes** — [Karpathy's LLM Knowledge Bases: The Post-Code AI Workflow](https://antigravity.codes/blog/karpathy-llm-knowledge-bases) — Technical breakdown of the workflow as a "post-code" paradigm.
- **Reddit r/ObsidianMD** — [Implemented Karpathy's LLM knowledge base workflow in Obsidian](https://www.reddit.com/r/ObsidianMD/comments/1sdbq01/implemented_karpathys_llm_knowledge_base_workflow/) — Community discussion on Obsidian-based implementations.

### Related Concepts

- **DEV Community** — [A Personal Git Repo as a Knowledge Base Wiki](https://dev.to/adam_b/a-personal-git-repo-as-a-knowledge-base-wiki-j51) — Using plain Git + Markdown as a personal wiki, the foundational approach this article builds upon.
- **Hacker News** — [Repurposing Hugo as a wiki](https://news.ycombinator.com/item?id=38795735) — Discussion on using Hugo for wiki-style knowledge management.
