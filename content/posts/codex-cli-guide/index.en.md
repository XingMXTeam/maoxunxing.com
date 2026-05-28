---
title: "OpenAI Codex CLI guide: install, AGENTS.md, permissions, and automation workflows"
description: "A practical Codex CLI guide for frontend engineers and AI coding practitioners, covering install, AGENTS.md, permissions, skills, subagents, and common pitfalls."
date: 2026-05-27
tags:
  - AI Coding
  - Codex
  - OpenAI
  - CLI
  - Agent
  - Tutorial
custom_toc:
  - title: "Why Codex CLI is worth learning now"
  - title: "What Codex CLI actually is"
  - title: "How to install Codex CLI"
  - title: "How to use AGENTS.md"
  - title: "How to think about permissions, skills, and subagents"
  - title: "My recommended onboarding path"
  - title: "Common pitfalls"
  - title: "Who Codex CLI is for"
  - title: "References"
---

In the latest wave of AI coding tools, terminal agents have moved beyond "generate a few lines of code" and into a much more serious category: they can read repositories, edit files, run commands, and validate results.

If you keep seeing `Codex`, `Claude Code`, and `Gemini CLI` on X, GitHub, and developer forums, that is not random. As of **May 27, 2026**, the GitHub star counts for the three representative terminal agents are already high:

- `anthropics/claude-code`: 127k stars
- `google-gemini/gemini-cli`: 105k stars
- `openai/codex`: 85.9k stars

What makes `openai/codex` worth a dedicated guide, at least for me, is that it is not just a terminal chat UI. It is steadily turning into a full workflow system around **AGENTS.md, permission boundaries, skills, subagents, MCP, and cloud tasks**.

If you are a frontend engineer, an indie hacker, or someone already using Cursor or Claude Code, this guide is meant to answer four concrete questions:

1. What is `Codex CLI` actually for?
2. How is it different from a chat model or an IDE copilot?
3. How should you think about `AGENTS.md`, permissions, skills, and subagents?
4. What are the common mistakes when you first adopt it?

## Why Codex CLI is worth learning now

I picked this topic for more than novelty.

First, there is a clear **trend signal**. OpenAI published [Codex for (almost) everything](https://openai.com/index/codex-for-almost-everything/) on April 16, 2026, framing Codex as more than a code writer. The message was that developers increasingly use it to understand systems, gather context, review work, debug issues, and keep longer-running tasks moving. Then OpenAI published [Running Codex safely at OpenAI](https://openai.com/index/running-codex-safely/) on May 8, 2026, focusing on sandboxing, approvals, network policy, and telemetry. On May 14, 2026, it followed up with [Work with Codex from anywhere](https://openai.com/index/work-with-codex-from-anywhere/), expanding the story to remote and cross-device workflows.

Second, there is a strong **search-intent signal**. When people search for `Codex CLI`, they usually are not looking for product news. They are trying to solve practical questions such as:

- `Codex CLI install`
- `Codex CLI AGENTS.md`
- `Codex CLI permissions`
- `Codex CLI vs Claude Code`
- `Codex CLI tutorial`

That matters because these are durable queries. They can keep bringing in traffic long after launch-day news fades out.

## What Codex CLI actually is

The official definition is straightforward: `Codex CLI` is OpenAI's coding agent that runs locally in your terminal. It can **read, change, and run code** in the selected directory, and it is **open source**, built in Rust.

That is a very different category from traditional code completion.

Older copilot-style tools were mostly:

```txt
You write
→ the model suggests
```

Codex CLI is closer to:

```txt
You define the goal
→ it inspects the repo and instructions
→ it reads files, runs commands, and proposes changes
→ it returns diffs, results, and risks
```

I think it helps to understand it in three layers.

### 1. It is not just a chatbot

A regular chat model can answer questions, but it does not know your local repository layout and it cannot act directly on your machine.

Codex CLI matters because it can:

- read the active project context
- execute commands inside an allowed boundary
- make concrete changes under project-specific instructions

### 2. It is not just a terminal copilot

Many people install a terminal agent and initially treat it like "chat, but in the shell." That misses the bigger point.

The real value is the execution stack around it:

- instruction inheritance with `AGENTS.md`
- permission control with `read-only`, `workspace`, and `danger-full-access`
- reusable workflows via `Skills`
- parallel delegation via `Subagents`
- external tool access via `MCP`

That stack is what separates a workflow agent from a model that merely answers prompts.

### 3. It is increasingly covering the full development loop

Current Codex docs already position it across:

- local interactive development
- local code review
- web search
- cloud tasks
- integrations such as GitHub, Slack, and Linear

So if you are an engineer, what you are really learning is not a command. You are learning a working model.

## How to install Codex CLI

The official docs offer several installation paths. On macOS and Linux, the simplest is:

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

If you prefer package managers, you can also use:

```bash
npm install -g @openai/codex
```

or:

```bash
brew install --cask codex
```

Then run:

```bash
codex
```

On first launch, Codex will usually ask you to authenticate. The official docs support two common paths:

- sign in with your ChatGPT account
- configure an API key

If you already have ChatGPT Plus, Pro, Business, Edu, or Enterprise, the docs explicitly say those plans include Codex. For most individual developers, **signing in with ChatGPT is the simplest starting point**.

## How to use AGENTS.md

If you remember only one concept from this article, I would make it `AGENTS.md`.

This is one of the most important persistent-context mechanisms in Codex.

The official docs are very clear: **Codex reads `AGENTS.md` files before doing work**. It does not only read one file, either. It builds a layered instruction chain from:

1. your global `~/.codex/AGENTS.md`
2. the repository root `AGENTS.md`
3. any closer instruction files along the path to your current working directory

Files closer to your current directory override broader guidance.

That is a big deal because it means you no longer need to repeat the same setup in every session:

- read the project before editing
- avoid unrelated changes
- run the right checks after edits
- keep away from specific paths
- follow this repository's style and workflow

You can encode those expectations into the repository itself.

### A practical AGENTS.md baseline

For a personal project, I would start with a small, stable instruction set:

```md
# Repository expectations

- Read the existing files before making assumptions.
- Prefer minimal diffs.
- Run formatting checks after editing content files.
- Do not touch deployment config unless explicitly asked.
- For Hugo posts, keep EN and ZH-CN versions aligned.
```

The value is not in making it long. The value is in making it reusable.

### When to add nested AGENTS.md files

As a repository grows, do not force every rule into the root.

For example:

- `content/posts/` can have writing-specific rules
- `layouts/` can have Hugo template rules
- `scripts/` can have automation conventions

The Codex docs support nested `AGENTS.md` and `AGENTS.override.md` files, which is exactly the right model for large repositories. The closer the rule is to the actual work, the more reliable the behavior tends to be.

This is also why I think good AI coding is increasingly about **context systems**, not just prompt quality.

## How to think about permissions, skills, and subagents

The biggest discomfort people feel with terminal agents usually comes down to two questions:

1. Will it change too much?
2. Will it run commands I did not intend?

Codex's answer is not "trust the model." The answer is to define boundaries first.

### Permissions are not an extra feature

The official `Permissions` docs describe built-in profiles such as:

- `:read-only`
- `:workspace`
- `:danger-full-access`

My recommendation is simple:

- start with `read-only`
- move to `workspace` once you trust the repository workflow
- use `danger-full-access` only when you intentionally want that much power

If you treat a terminal agent as a real actor instead of a fancy autocomplete engine, this progression matters. Before you optimize for speed, you need to establish a trust boundary.

### Skills are how repeated workflows become reliable

The official docs define `Skills` as reusable workflows that package instructions, resources, and optional scripts.

That is a great fit for:

- structured content generation
- repeatable code review flows
- common scaffolding or debugging patterns

If you already think in terms of rules, templates, and workflows from tools like Cursor or Qoder, the value of skills clicks quickly.

At a high level, skills turn this:

```txt
re-explain the task every time
```

into this:

```txt
invoke a proven workflow
```

### Subagents are powerful, but easy to overuse

`Subagents` are another major capability. The official docs say Codex can spawn specialized agents in parallel for exploration, testing, log analysis, and similar tasks.

My rule of thumb is:

- do not use subagents for small tasks
- use them for multi-angle analysis
- be cautious with multiple agents editing code at once

Parallelism does not only add speed. It also adds coordination cost. The docs explicitly recommend **read-heavy** tasks over **write-heavy** tasks for parallel agent work.

So a more stable pattern is:

- one agent reviews failing tests
- one agent inspects logs
- one agent analyzes code structure
- the main thread synthesizes the outcome

That is usually much more reliable than letting several agents edit overlapping files simultaneously.

## My recommended onboarding path

If you are just getting started with `Codex CLI`, I do not recommend jumping straight into "fully automated development."

A steadier path looks like this.

### Step one: use it as a high-quality repository reader

Start with tasks like:

- summarize the directory structure
- explain a module
- find the entry point of a flow
- identify which files a feature will likely touch

At this stage, the goal is not code output. The goal is to observe how it understands your system.

### Step two: add AGENTS.md

Once its baseline understanding looks solid, encode your project expectations into `AGENTS.md`.

That way, the next task does not begin from scratch.

### Step three: grant only workspace-level write access

Use write access first on low-risk tasks:

- copy changes
- small refactors
- styling fixes
- test additions
- documentation updates

Avoid giving it broad change scope too early.

### Step four: turn recurring work into skills

Examples:

- generate a bilingual blog draft
- run an SEO content check
- validate Hugo post metadata and formatting
- review a frontend change set

Once those workflows are encoded, the productivity gain is much larger than ad hoc prompting.

### Step five: introduce subagents and cloud tasks later

These features are useful, but stronger capabilities depend on stronger boundaries.

If you do not yet have a stable instruction model, permission setup, and validation flow, do not optimize for maximum automation first.

## Common pitfalls

### 1. Codex feels like chat in the shell

That usually means the problem is not the model. The problem is missing executable context.

What you often need is:

- the right working directory
- a clear `AGENTS.md`
- permissions that let it act
- a concrete goal and a clear validation target

### 2. It changes too much

That is usually caused by:

- a task that is scoped too broadly
- no explicit "minimal diff" expectation

The fix is straightforward: put "make the minimum necessary change," "read before editing," and "do not refactor unrelated code" into `AGENTS.md`.

### 3. Starting with too much permission

This is a common mistake. Bigger permissions feel faster, but they also make the tool harder to trust when you are still learning how it behaves.

Start with `read-only`, then `workspace`, and only later consider broader access.

### 4. Asking it to do too much in one shot

A terminal agent is not magic just because it has tools.

A better pattern is:

```txt
clarify the scope
→ break the task into verifiable steps
→ define the expected output for each step
```

That is also where my own AI coding practice keeps moving: **define the goal and boundary first, then let the agent execute**.

## Who Codex CLI is for

I think `Codex CLI` is worth learning soon if you are in one of these groups:

- you already use Cursor or Claude Code and want to understand OpenAI's agent workflow model
- you often read, refactor, debug, or review inside local repositories
- you want to turn project conventions into a reusable context system
- you want AI to move from "answering questions" to "executing bounded tasks"

If you only write scripts occasionally, or you are not ready for AI to interact with files and commands, there is no need to force the shift yet.

But if you are already in the **AI coding workflow** phase rather than the "help me write a few lines" phase, terminal agents like Codex are hard to ignore.

## Conclusion

I see `Codex CLI` as a useful signal for where AI coding is heading. The competition is no longer only about who writes code faster. It is increasingly about who can complete workflows reliably under constraints.

In that frame, five things matter much more than a clever prompt:

- how instructions are inherited
- how permissions are isolated
- how workflows are reused
- how parallel tasks are coordinated
- how validation and auditability are handled

`AGENTS.md`, `Permissions`, `Skills`, and `Subagents` are the skeleton of that model.

If you are exploring `Codex CLI` right now, I would not stop at installation. After you get it running, do one concrete thing next: **write a solid `AGENTS.md` for one real project**.

That is still the highest-leverage step I have seen so far.

## References

- [Codex CLI - OpenAI Developers](https://developers.openai.com/codex/cli)
- [GitHub - openai/codex](https://github.com/openai/codex)
- [Custom instructions with AGENTS.md - OpenAI Developers](https://developers.openai.com/codex/guides/agents-md)
- [Permissions - OpenAI Developers](https://developers.openai.com/codex/permissions)
- [Agent Skills - OpenAI Developers](https://developers.openai.com/codex/skills)
- [Subagents - OpenAI Developers](https://developers.openai.com/codex/concepts/subagents)
- [Codex for (almost) everything - OpenAI](https://openai.com/index/codex-for-almost-everything/)
- [Running Codex safely at OpenAI - OpenAI](https://openai.com/index/running-codex-safely/)
- [Work with Codex from anywhere - OpenAI](https://openai.com/index/work-with-codex-from-anywhere/)
- [GitHub - anthropics/claude-code](https://github.com/anthropics/claude-code)
- [GitHub - google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)
