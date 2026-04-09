---
title: "用 Git 仓库实践 Karpathy 的个人知识库方法：零软件依赖的完整方案"
description: "受 Andrej Karpathy 启发，在已有的 Hugo 博客仓库中建立 raw -> notes -> posts 三层知识管道。不依赖 Obsidian 或任何额外软件，仅用 Git + Markdown + LLM 完成从素材收集到知识沉淀的完整闭环。"
date: 2026-04-09
tags:
  - AI
  - 知识管理
  - 方法论
  - Hugo
custom_toc:
  - title: "Karpathy 的方法"
  - title: "为什么不用 Obsidian"
  - title: "三层知识管道"
  - title: "实操步骤"
  - title: "用 LLM 编译知识库"
  - title: "日常工作流"
---

## Karpathy 说了什么

{{< youtube VRub1w-APTc >}}

Andrej Karpathy 最近在 [X/Twitter](https://x.com/karpathy/status/2039805659525644595) 上分享了一个实用方法，并发布了完整的 [LLM Wiki Gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)：用 LLM 为研究方向搭建个人知识库。核心流程是：

1. 把各类源文件（文章、论文、截图）丢进 `raw/` 目录
2. 用 LLM "编译"成结构化的 Markdown 知识条目
3. 用 Obsidian 查看和浏览
4. 对知识库提问，LLM 自主检索并回答
5. 定期让 LLM 做"健康检查"，补全缺失、修正矛盾

他的知识库已有 100 篇词条、40 万字，无需 RAG，LLM 通过维护索引和摘要就能处理所有查询。

**一句话总结**：原始素材进，结构化知识出，全程 LLM 驱动。

## 为什么不用 Obsidian

Karpathy 用 Obsidian 作为查看器。但如果你已经有一个 Hugo 博客仓库，完全不需要引入额外软件：

| 需求 | Obsidian 方案 | Hugo 仓库方案 |
|------|-------------|-------------|
| 查看 Markdown | Obsidian 编辑器 | `hugo server -D` 本地预览 |
| 知识关联 | 双链 `[[]]` + 图谱 | Hugo tags 系统 + Algolia 搜索 |
| 发布输出 | 需要额外导出 | 去掉 `draft: true` 直接发布 |
| 版本管理 | 需要 Obsidian Git 插件 | 天然就是 Git 仓库 |
| 多设备同步 | 需要 Obsidian Sync 或 iCloud | `git pull` |
| 搜索 | Obsidian 内置搜索 | `grep` / Algolia / LLM |

核心优势：**知识沉淀后直接变成博客文章，没有搬运成本**。一个仓库，从收集到发布全链路打通。

## 三层知识管道

在仓库里建立三个内容层级：

```
content/
  raw/        <- 收件箱：看到好东西，随手丢进来
  notes/      <- 知识库：LLM 编译整理后的结构化条目
  posts/      <- 博客：打磨后的正式文章
```

### raw/ —— 零摩擦收件箱

这是整个系统的入口。关键原则：**不纠结格式，不纠结分类，先收进来再说**。

每个 raw 条目就是一个带 frontmatter 的 Markdown 文件：

```markdown
---
title: "某篇关于 RAG 的文章摘要"
date: 2026-04-09
draft: true
tags: [AI, RAG]
source: "https://原始链接"
---

这里粘贴原文/摘要/截图/笔记，怎么快怎么来。
```

`draft: true` 保证这些素材不会出现在线上博客中，只在本地 `hugo server -D` 时可见。

### notes/ —— 编译后的知识条目

当 `raw/` 里某个主题积累了足够多的素材，让 LLM 帮你：

- 归纳合并相关素材
- 提取核心观点
- 补充结构化摘要
- 添加关联 tags

从 `raw/` 的碎片变成 `notes/` 里一篇完整的知识条目。

### posts/ —— 正式博客文章

当某个 `notes/` 条目足够厚实，你觉得可以写一篇完整文章了，再打磨润色，去掉 `draft: true`，发布到博客。

**流转方向始终是单向的**：raw -> notes -> posts。素材只会越来越精炼，永远不会倒退。

## 实操步骤

### 第一步：创建 raw 目录结构

```bash
# 创建目录和索引文件
mkdir -p content/raw

# content/raw/_index.zh-cn.md
cat <<'EOF' > content/raw/_index.zh-cn.md
---
title: "原始素材"
description: "知识收件箱"
draft: true
---
EOF
```

### 第二步：添加 Hugo archetype 模板

在 `archetypes/raw.md` 创建模板：

```markdown
---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
draft: true
tags: []
source: ""
---
```

以后用 `hugo new raw/topic-name/index.zh-cn.md` 就能自动生成带模板的新条目。

### 第三步：配置 Hugo permalinks

在 `config.toml` 的 permalinks 部分加上 raw：

```toml
[languages.zh-CN.permalinks]
raw = "/:slugorcontentbasename/"
```

### 第四步：收集素材

看到好文章、好想法，立刻创建一个 raw 条目：

```bash
hugo new raw/interesting-topic/index.zh-cn.md
```

然后把内容粘进去。不需要排版，不需要完美，原始状态就好。

## 用 LLM 编译知识库

这是 Karpathy 方法的核心，也是最有价值的环节。

### 素材 -> 知识条目

让 LLM 读取 `raw/` 里的多个相关素材，合并整理成一篇 `notes/` 条目：

> "请阅读 content/raw/ 下所有带 AI tag 的素材，归纳整理成一篇结构化的知识条目，放到 content/notes/ai-fundamentals/ 下。要求：提取核心概念、补充关联关系、标记来源。"

### 知识条目 -> 博客文章

当某个 notes 条目积累到足够深度：

> "请基于 content/notes/ai-fundamentals/ 的知识条目，写一篇面向开发者的博客文章，放到 content/posts/ 下。要求：有观点、有案例、有实操建议。"

### 健康检查

定期让 LLM 审计知识库：

> "请检查 content/raw/ 和 content/notes/ 的所有条目，找出：1) 可以合并的重复主题 2) 缺少 tags 的条目 3) raw 中已经可以编译到 notes 的素材"

### 用 Qoder Skill 自动化

更进一步，可以创建一个 Qoder Skill，只需一句话就能完成上述所有操作。例如：

- `/kb 收集 https://example.com/article` —— 自动抓取文章，创建 raw 条目
- `/kb 收集 我今天学到了 LoRA 微调的关键是...` —— 把想法快速记录为 raw 条目
- `/kb 编译 AI` —— 把 AI 相关的 raw 素材编译成 notes 条目
- `/kb 预览` —— 启动本地预览，查看所有素材
- `/kb 检查` —— LLM 健康检查

## 日常工作流

一图胜千言：

```
看到好文章/冒出好想法
       |
       v
  /kb 收集 "内容"      <-- 一句话收集，零摩擦
       |
       v
  content/raw/xxx/     <-- 自动创建，draft:true
       |
       v (积累到一定量)
  /kb 编译 "主题"       <-- LLM 归纳整理
       |
       v
  content/notes/xxx/   <-- 结构化知识条目
       |
       v (打磨润色)
  content/posts/xxx/   <-- 正式博客文章，去掉 draft
       |
       v
  git push -> 线上发布
```

整个过程：
- **收集阶段**：零摩擦，一句话搞定
- **编译阶段**：LLM 负责脏活累活
- **发布阶段**：去掉 `draft: true`，push 即发布
- **无额外软件**：Git + Hugo + LLM，仅此而已

## 与 Karpathy 方法的对比

| 环节 | Karpathy 原版 | 本文方案 |
|------|-------------|---------|
| 存储 | 独立知识库仓库 | 博客仓库内嵌 |
| 查看器 | Obsidian | hugo server -D |
| 原始素材 | raw/ 目录 | content/raw/ (draft) |
| 编译 | LLM 生成 .md | LLM 生成 notes/ |
| 输出 | Markdown/Marp/图表 | 直接发布为博客文章 |
| 搜索 | 自建搜索引擎 | grep + Algolia + LLM |
| 健康检查 | LLM 审计 | 同样 LLM 审计 |

最大的差异在于：Karpathy 的知识库是独立的，输出需要额外搬运；而本方案知识库和博客是一体的，从收集到发布在同一个仓库内完成，没有搬运成本。

## 总结

Karpathy 的知识库方法核心不在于用什么工具，而在于建立 **"收集 -> 编译 -> 输出"** 的知识流转管道，并让 LLM 承担编译和维护的工作。

如果你已经有一个博客仓库，完全可以在里面实现这套方法：加一个 `content/raw/` 作为收件箱，利用 `draft: true` 控制可见性，用 LLM 驱动素材到知识再到文章的流转。

不需要 Obsidian，不需要 Notion，不需要任何新软件。一个 Git 仓库，就是你的知识库。

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
