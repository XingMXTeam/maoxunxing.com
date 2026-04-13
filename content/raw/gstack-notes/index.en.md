---
title: "gstack: Garry Tan's Open Source AI Software Factory"
date: 2026-04-13
draft: true
tags: [AI, Agent, Tools, Claude Code, Automation]
source: "https://github.com/garrytan/gstack"
---

gstack is an open-source AI engineering workflow toolkit by Y Combinator president Garry Tan, built on Claude Code. Core thesis: **a single builder with the right tooling can move faster than a traditional team**. It turns Claude Code into a virtual engineering team -- CEO, architect, designer, QA, and release engineer each playing their role.

## Key Facts

- **23 Specialists** (slash commands)
- **8 Power Tools**
- Full sprint cycle: Think -> Plan -> Build -> Review -> Test -> Ship -> Reflect
- Stack: TypeScript, Bun, Playwright, Go Template, Shell
- Requirements: Claude Code, Git, Bun v1.0+
- License: MIT
- Version: 0.16.x

## Specialist Roles (Slash Commands)

### Product & Strategy

| Command | Role | Responsibility |
|---------|------|----------------|
| `/office-hours` | Product Advisor | Brainstorm product ideas, validate if worth building |
| `/plan-ceo-review` | CEO | Strategy, scope, ambition review |
| `/plan-eng-review` | Architect | Architecture review, lock in technical plan |
| `/plan-design-review` | Design Director | Review design aspects of a plan |
| `/plan-devex-review` | DevEx Reviewer | Developer experience review |
| `/autoplan` | Auto Review | Run all reviews automatically |

### Design

| Command | Responsibility |
|---------|----------------|
| `/design-consultation` | Design system, brand, visual identity |
| `/design-review` | Visual polish, design audit of live sites |
| `/design-html` | HTML design mockup generation |
| `/design-shotgun` | Batch design iterations |

### Development & Debugging

| Command | Responsibility |
|---------|----------------|
| `/investigate` | Debug bugs, errors, broken behavior |
| `/careful` / `/guard` | Safety mode, careful operations |
| `/freeze` / `/unfreeze` | Restrict edits to a specific directory |
| `/pair-agent` | Pair programming agent |

### Quality & Release

| Command | Responsibility |
|---------|----------------|
| `/qa` | Test sites, find bugs, QA testing |
| `/review` | Code review, check diffs, pre-landing review |
| `/ship` | Ship, deploy, push, create PRs |
| `/document-release` | Update docs after shipping |
| `/retro` | Weekly retrospectives, review shipped work |

### Auxiliary

| Command | Responsibility |
|---------|----------------|
| `/codex` | Second opinion, independent review (via OpenAI Codex CLI) |
| `/learn` | Learn new knowledge |
| `/gstack-upgrade` | Upgrade gstack itself |

## Browser Automation ($B Commands)

gstack includes a built-in Playwright-based headless browser, invoked via the `$B` prefix:

- **Navigation**: `goto <url>`, `back`, `forward`, `reload`
- **Reading**: `text`, `html [selector]`, `links`, `forms`, `data`, `accessibility`
- **Extraction**: `archive`, `download`, `scrape`
- **Interaction**: `click`, `fill`, `type`, `hover`, `scroll`, `select`, `upload`
- **Inspection**: `console`, `network`, `cookies`, `storage`, `perf`, `eval`
- **Visual**: `screenshot`, `prettyscreenshot`, `pdf`, `diff`, `responsive`
- **Tabs**: `newtab`, `closetab`, `tab`, `tabs`

### Snapshot Flags

- `-i` Interactive elements only
- `-c` Compact output
- `-d N` Depth limit
- `-s sel` Scope to CSS selector
- `-D` Diff vs previous snapshot
- `-a` Annotated screenshot

## Architecture

### Daemon Model

The browser runs as a persistent background daemon, auto-spawning on first use and shutting down after 30 minutes of inactivity. Session state is tracked via a secure local JSON file. The server binds strictly to localhost and requires Bearer token authentication for all requests.

### Element Targeting (Ref System)

Uses ARIA tree snapshots mapped to Playwright Locators, bypassing CSP and framework hydration issues without DOM injection.

### Design Principles

- All failure messages rewritten as actionable instructions for AI agents
- Crashes trigger immediate exit and clean CLI restart
- No WebSockets, MCP protocol, multi-tenancy
- macOS-only credential decryption

## Engineering Practices

### Code Quality

- Uses slop-scan to detect low-quality patterns in AI-generated code
- SKILL.md files generated from .tmpl templates -- never edit generated files directly
- Regenerate docs via `bun run gen:skill-docs`
- Compiled binaries in `dist/` must never be committed to git

### Git Discipline

- Each commit contains a single logical change (bisect-friendly)
- Release notes are branch-scoped, focusing on user-facing capabilities
- When debugging, never claim "not related to our changes" without verifying on the base branch first

### Testing

- `bun test` for quick local validation
- `bun run test:evals` for diff-based paid evaluation tests
- Evals run via independent `claude -p` subprocesses with incremental JSON persistence

## Conductor (Parallel Sprints)

Configured via `conductor.json`, supports multiple AI agents running sprint workflows in parallel:

```json
{
  "scripts": {
    "setup": "bin/dev-setup",
    "archive": "bin/dev-teardown"
  }
}
```

## Key Insights

1. **Role Separation**: Each slash command maps to a specialist role with clear boundaries, avoiding the chaos of an "omniscient agent"
2. **Full Lifecycle**: Covers the complete software development lifecycle from product ideation to post-ship retrospective
3. **Browser as Tool**: Built-in browser automation lets AI agents do visual QA, screenshot diffing, and form testing directly
4. **Defensive Engineering**: slop-scan detects AI code quality issues; freeze/guard mechanisms prevent accidental damage
5. **Eval-Driven**: Continuous verification of AI agent output quality through diff-based evaluation tests
