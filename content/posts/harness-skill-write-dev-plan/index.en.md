---
title: "write-dev-plan: The Plan Lives in a File, Not in Its Head"
description: "A skill deep-dive in the Harness series (write-dev-plan), step five of the clarify chain. Why a dev plan must be split into tasks small enough for one commit and verifiable on their own, why every task carries requirement ids and check commands, and why the plan is a file the kernel can reconcile against rather than a chat message — the why and the how. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "Day three: nobody can say where things stand"
  - title: "What this skill is: design in, task list out"
  - title: "How it works: two files, two readers"
  - title: "Decision 1: tasks sized to one commit"
  - title: "Decision 2: the plan is a file, not a conversation"
  - title: "Decision 3: granularity decides whether evaluation can reconcile"
  - title: "What it cannot do"
---

This is one of the skill deep-dives. The overview post, [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), covered the system's shape; earlier parts of the series took the five layers and the five phases one at a time, and this block takes the skills one at a time — why each exists, and concretely how it works. `write-dev-plan` is step five of the clarify chain, right after `write-tech-design`: the requirements and the technical design are settled, and this step turns the design into an executable task list. The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below can be found verbatim in the repository's skill files.

## Day three: nobody can say where things stand

Start with a concrete scene.

You ask an AI to build a feature. It says "no problem" and gets going. Day one, it reports it's building the data layer. Day two, the pages. On day three you ask: which step are we on? What's left?

It gives a perfectly plausible answer: data layer basically done, pages mostly done, integration and a few edge cases remaining. You press: what does "basically done" mean? It lists three points. You ask: yesterday you said there were five steps — what is the completion criterion for step four? It gives another explanation, and it doesn't quite match the version you heard the day before.

The problem is not its memory. The problem is that **the plan never left its context**. A plan that lives in a chat has no artifact anyone can reconcile against, no fixed definition of "done" for any step, and every time you ask, it regenerates an account on the spot. The regenerated account is always fluent. Fluent is not the same as consistent.

That is the one thing `write-dev-plan` exists to fix: **before the first line of code, put the plan into a file, split down to steps small enough to verify one by one.**

## What this skill is: design in, task list out

It sits in the middle of the clarify chain. The steps before it produce a numbered requirements document (`prd.md`), a quality vision (`vision.md`), and a technical design (`tech-design.md`). Those three answer "what" and "by what approach."

`write-dev-plan` answers what remains: **in what order, and cut how fine.**

Its output is two files: `tasks.json` and `plan.md`. The first is read by the kernel; the second by people — and by the scope guard. Details below.

The skill's own opening line sets the standard, and it is worth quoting exactly:

> Break the design into tasks a developer can finish, test and commit one at a time, in dependency order. A task the developer has to interpret is a task the evaluator will fail.

Note the last sentence. It prices vagueness up front: vagueness doesn't disappear, it travels — into the implement phase as a developer improvising, into evaluation as a failed verdict. Planning is where every "needs interpretation" gets eliminated in advance.

## How it works: two files, two readers

There is a gate before starting: `prd.md`, `vision.md`, and `tech-design.md` must all exist, with the summary confirmed. Missing one, this step may not begin — a plan cannot be built on a design that isn't settled yet.

### `tasks.json`: the list the kernel reads

```json
[
  {
    "id": "TASK-1",
    "title": "Notice list model: sort newest first, unread count",
    "requirements": ["REQ-1"],
    "checks": ["node --test test/notice-model.test.js"]
  }
]
```

Each task has only four fields, and every field earns its place:

- **`id` is unique and stable.** Later replans append new ids; they never renumber — other files already reference these ids, and renumbering breaks every reference.
- **`requirements`** lists the `REQ-n` ids from the PRD that this task advances. This thread is what makes reconciliation possible later; more in the last design section.
- **`checks`** are shell commands. The rule: every one of them must exit 0 before `harness task-done` accepts the task as complete. One more detail: use the task's own tests, not the whole suite — unless the task is the integration step itself. The full suite is slow, and it can't tell you which task the failure belongs to.

### `plan.md`: for people, and for the scope guard

The same task, in `plan.md`, must spell out four things:

```markdown
### TASK-1: Notice list model

**Goal** — what this task delivers, one sentence.

**Files**
- Create: `src/notices/model.ts`
- Modify: `src/notices/index.ts`
- Tests: `src/notices/model.test.ts`

**Contract**
- `sortNotices(list: Notice[]): Notice[]` — newest `createdAt` first; stable for ties.
- `unreadCount(list: Notice[]): number`

**Verify**
- Unit: `npx vitest run src/notices/model.test.ts` — expect 6 passing
- API / integration: N/A — pure module
```

Goal in one sentence, exact paths for files, exact signatures for the contract — down to the tie-breaking rule for equal timestamps — and exact commands **with expected results** ("expect 6 passing," not "run the tests").

At the end of `plan.md` there is one more section, written for a machine:

```markdown
## Editable scope
- `src/notices/**`
- `test/notices/**`
```

This section is read by the scope guard (`harness scope`): during implementation, only files under these paths may be touched. Where the plan reaches is where the permission reaches — the plan is not only instructions, it is also the authorization.

The writing rule overall is strict, and the skill states it bluntly: **exact paths, exact signatures, exact commands with expected results. No TODO, TBD, "as needed", "etc."** Those words are laziness in a human's plan; in a plan for an AI they are entry points — it will improvise underneath them, in directions nobody can predict in advance.

## Decision 1: tasks sized to one commit

The size standard comes with a concrete number: **each task is small — one commit, roughly ≤ 300 changed lines — and verifiable on its own.**

Why cut that small? Three practical payoffs.

First, **verification travels with the task.** Each task carries its own checks; the implement phase runs them when the task is done, and only a green run may be committed — that is the task loop described in [the implement phase article](/en/harness-phase-implement/). If a task spans five or six files of two different natures, its checks can no longer test "its own thing," and verification collapses back into "run everything at the end."

Second, **a failure redoes a small amount.** Evaluation sends one task back, and what gets thrown away is one commit's worth. It sends back a 2,000-line task, and the whole feature starts over.

Third, **order can follow dependency instead of whoever thought of what first.** The skill requires dependency order: data and contracts first, UI after, integration last, and a task never depends on a later one. Only when tasks are small can the dependency graph actually be drawn; a big task hides an unwritten sub-order inside itself, and halfway through execution someone discovers "we need that other thing first" — the plan gets rewritten live, on the work site.

One more rule that is easy to miss: **loading, empty, error, and no-permission states are tasks (or parts of one), not afterthoughts.** These are exactly the states an AI skips — it writes the happy path by default. Written into the task list, they get ids and checks, and skipping them means an unfinished task that reconciliation will catch. Left out of the list, they live forever in "will add later."

## Decision 2: the plan is a file, not a conversation

Why insist on two files? Why can't the planner state the plan in conversation and the developer carry on?

Because every phase in this system runs in a **fresh context**. The developer in the implement phase did not attend the clarify phase's conversation; files are all it gets. A plan that stays in the chat is a plan that is lost at the exact moment implementation begins — the developer can only guess from task titles, or quietly re-plan on its own, which is no longer the same plan.

Written into files, the plan gains a second identity: **it is the record the kernel reconciles against.**

- Whether a task counts as done is checked against the `checks` in `tasks.json`, not taken from the executor's say-so.
- Whether a change stayed in bounds is checked by the scope guard against the Editable scope section at the end of `plan.md`.
- Whether a requirement got dropped is checked by matching the PRD's `REQ-n` list against the `requirements` fields of all tasks.

Each of these needs the plan to exist in a structured, stable form. A chat transcript has no fields, no stable ids, and cannot be read in by a command and verified item by item.

There is a companion rule: **task details stay in the plan — never in `.harness/overview/`.** The overview is the project's long-term record of stable product and technical facts; the task list is one feature's temporary ledger, archived when the feature ships. Stuff temporary detail into the long-term file and the overview rots a little with every feature, until every later feature reads a "current state of the project" laced with the previous feature's construction notes.

## Decision 3: granularity decides whether evaluation can reconcile

Finally, this skill's relationship to evaluation — the hardest reason for cutting this fine.

Evaluation speaks in requirement ids: REQ-3 is not done right, here is the evidence. Then comes the repair question: which change corresponds to REQ-3?

When the granularity lines up, the ledger is already there. Every task declares in `tasks.json` which `REQ-n` ids it advances, and every commit corresponds to exactly one task. Evaluation names REQ-3, and following the `requirements` fields leads straight to the tasks and the commits; the repair scope is circled on the spot. Make tasks big — one task carrying six requirements, one commit carrying 2,000 lines — and an evaluation finding cannot land on a specific change; repair degrades into searching a haystack. The implement-phase article made this point from the commit side: one commit per task makes each commit a reconcilable unit of evidence. The **size** of that unit is decided here, in this step.

The skill's done criteria are built around reconciliation too. Two hard lines:

- **Every `REQ-n` in the PRD appears in at least one task.** A requirement no task claims will never be implemented, and nothing will complain about it anywhere — it surfaces only at acceptance, shaped like a missing feature. This check can run the moment the plan is written, not at the end.
- **`tasks.json` and `plan.md` agree on ids and titles.** The two files are one plan written two ways, one for the kernel and one for people. If they disagree, one of them is already stale, and every reconciliation downstream is built on the mismatch.

## What it cannot do

Boundaries, as usual, stated plainly.

`write-dev-plan` guarantees a plan that is **executable and reconcilable**: tasks small enough, order legal, every requirement claimed, every task with an explicit completion test. It does not guarantee the plan is **right** — if the technical design picked the wrong route, cutting it finer only executes the wrong route very neatly. That belongs to the previous step, `write-tech-design`, and to the quality of the requirements from clarify, not to this skill.

It also does not set acceptance criteria for tasks. A task's checks answer "is this task finished?" They cannot answer "is this feature correct, and is it good enough?" That is the next step's job: `write-acceptance-criteria` turns the PRD and the quality vision into the acceptance criteria and rubric the evaluation phase will use — the next article takes it apart.
