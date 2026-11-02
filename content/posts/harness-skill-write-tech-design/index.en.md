---
title: "write-tech-design: Make the Technical Decisions Once, Before Any Code Exists"
description: "One article per skill in the Harness series (write-tech-design, step four of the clarify authoring chain). The same feature gets built twice with two different architectures by two contexts — which line of code is wrong? None of them: nobody ever wrote the decision down. This skill produces tech-design.md and pages.json — stack, module boundaries, data flow, state ownership, decided once and recorded. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "Two contexts, two architectures"
  - title: "What this skill does"
  - title: "Before writing: the gate"
  - title: "The ten sections of tech-design.md"
  - title: "pages.json: decide now which pages evaluation will capture"
  - title: "Decision 1: decide up front, while changing your mind is cheap"
  - title: "Decision 2: reference, don't restate"
  - title: "Decision 3: no TODOs in the document"
  - title: "What it cannot do"
---

This is one article in the one-skill-at-a-time series. The five layers and five phases describe how the system runs; this series takes the 21 skills one by one — what problem each solves, concretely how. The overview is [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/); the phase as a whole is covered in [the Clarify phase](/en/harness-phase-clarify/). `write-tech-design` is step four of the clarify authoring chain, after write-quality-vision: the requirements are numbered, the "good" is written down as anchors, and this step decides how the feature gets built inside this repository. The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below can be found verbatim in the skill files in that repository.

## Two contexts, two architectures

Start with a concrete scene.

A feature gets built in two sittings. In the first, the AI on duty writes the list page: it fetches data through a query-cache library, and server data stays in the cache, out of global state. In the second sitting, a completely fresh context writes the detail page of the same feature: it hand-rolls a `useEffect` plus `fetch`, stuffs the data into a global store, and installs a state-management library on the way — with a perfectly coherent justification: the detail page needs state shared across components.

Looked at separately, neither is wrong. The code runs, the types pass, each side's tests are green.

Put together, it is an incident. The same data now has two homes: the list page updates it in the cache, the detail page reads it from the store and serves the old copy; there are two cache-invalidation strategies and nobody can say which one is in effect. The repository now carries two state solutions side by side, and nobody dares delete either, because nobody knows which side is live. At evaluation time the detail page keeps screenshotting stale data, and everyone assumes rendering is just slow.

Which line of code holds this bug? None of them. **What went wrong is that nobody ever turned "how do we fetch, where does state live, which library" into a single decision and wrote it down.** Every context was forced to decide on the spot, and on-the-spot deciding is coin-flipping — flip twice, and opposite results are not unlikely at all.

`write-tech-design` exists to take those decisions away from the moment: make them once, before the first line of code exists, record them in a file, and let every later context execute against the record instead of flipping again.

## What this skill does

It is run by the planner and produces two files:

- `tech-design.md` — the technical design. Which stack and dependencies, how the modules divide, how data flows, who owns state, what the interfaces look like, what happens on failure, what gets tested at which level, and how to start the app for evaluation — all decided here.
- `pages.json` — the page manifest: which pages evaluation will capture, their routes, and which element must appear before a page counts as rendered.

Its position in the authoring chain fixes the one question it may answer: **how it is built.** "What gets built" belongs to `write-prd` (the numbered requirements live there); "what counts as good" belongs to write-quality-vision (the anchors live there). The design may not quietly reach across and edit either — if it finds a problem upstream, the upstream file gets fixed. A downstream file unilaterally amending an upstream one breaks the clarify phase's coverage accounting.

## Before writing: the gate

There are preconditions to opening the document, in the skill's Gate section.

First, `prd.md` and `vision.md` must exist, and the clarification summary must be confirmed. The order is hard: if the requirements and the "good" are not settled, a technical design has nothing to attach to and can only spin.

Second, read three things before writing: `.harness/overview/technical.md` (the project's existing technical picture — current modules, established choices), `.harness/standards.md` (the stack-pack standards, the five-layer constraints as they land in this project), and the existing code the feature will touch.

Third, one governing principle, verbatim from the skill: **"Follow the codebase's existing patterns; a new pattern needs a reason the user agreed to."** Why charge for a new pattern? Because a repository's consistency is itself an asset: every extra pattern is one more thing every later reader of the code must learn, and one more guess at every junction. A new pattern is not forbidden — someone has to sign for it. Its cost is paid by everyone who comes after, so the decision cannot be made for free by whichever context happens to be on duty.

## The ten sections of tech-design.md

The design has a fixed ten sections. What each one pins down:

1. **Stack and key dependencies** — what is used, and it must be what clarification confirmed ("as the repo," or the explicit new choice). This section carries a hard rule: **the developer may not add anything not named here.** The "installed a state library on the way" from the opening scene is exactly what this rule blocks.
2. **Architecture overview** — where the feature lives; a diagram in text is enough, no ceremony.
3. **Modules and boundaries** — the new and changed modules, what each owns, what may import what. This is where the engineering layer's constraint (import direction) lands for one feature.
4. **Data flow and state** — sources, stores, the state shape. The state shape is not invented here; it points back to `state-schema-first` (list the facts first, then write field, type, initial value, and source of truth for each). Loading, empty, error, and no-permission states all get an assigned destination in this section.
5. **API / interface contracts** — endpoints or function signatures, with request, response, and error shapes. The language layer called the signature a contract written for the next AI; the contract text is produced here.
6. **Error handling** — per failure mode: what the user sees, what is retried, what is logged. "Handle errors properly" is not an executable sentence and is not allowed to stand in for this section.
7. **Test strategy** — unit, component, API, E2E: what is tested at which level, assigned in advance, so that during implementation no layer assumes another layer covered it.
8. **Run instructions** — the command that starts the app for evaluation, its URL, and the frontend working directory. This section is written for the evaluation phase: the evaluator is a fresh context, and on arrival it needs to know how to get the app running.
9. **Risks and trade-offs** — the options considered and why this one. The reasoning behind a decision must leave a trace: without it, the next context sees an "odd choice," its first instinct is to overturn it and start over, and the decision effectively never happened.
10. **Overview deltas** — what the project overview will need updated once the feature lands, listed here for `sync-overview` to apply after delivery. This skill never writes to the overview itself; it only registers the deltas.

## pages.json: decide now which pages evaluation will capture

The second output is easily mistaken for a testing accessory. It is actually part of the design: **what evaluation will use as evidence is decided at design time, not inferred later from test cases.** The skill says it is written from the PRD's key screens and the app's router — "not from test cases, which do not exist yet."

A minimal one looks like this:

```json
{
  "baseUrl": "http://localhost:5173",
  "viewport": { "width": 1280, "height": 800 },
  "pages": [
    { "name": "notices", "route": "/notices", "waitFor": "[data-testid=notice-list]" },
    { "name": "notices-empty", "route": "/notices?fixture=empty" }
  ]
}
```

Each rule has a specific accident it prevents:

- `name` is kebab-case and unique; `route` starts with `/` and is unique — the manifest itself is first of all a ledger that can be checked.
- `waitFor` must be a selector that only exists once the page has rendered. Without it, the capture tool can fire before the data arrives and record a loading screen as evidence — fake evidence, with every score downstream built on it.
- Cover every key screen in `vision.md`, plus the states that have their own URL or fixture switch (empty, error). The `notices-empty` entry above switches to the empty state via a query parameter and gives it its own page: an empty state is not the sentence "when the list has no data" — it is a face evaluation will look at on its own.
- If several apps or route sets could apply and you cannot tell which: **ask the user once.** No guessing.
- No UI in the feature: skip the file, and write `ui-evidence: N/A — <reason>` in section 7. Skipping must be on the record, never silent.

And the file is not done when written: `harness capture` validates it, and if it fails validation, the capture step does not run at all.

## Decision 1: decide up front, while changing your mind is cheap

Why fill in all ten sections before any code? Run the costs. Changing a decision during clarify means editing a few lines of a document. Changing the architecture halfway through implementation means rewriting finished tasks and re-testing everything. Discovering after delivery that two state solutions coexist means a long-term debt nobody dares touch.

And "decided once" is not only about money; it is about drift. The context that makes a decision will disappear — that is the basic premise of this system, where every phase and every task is picked up by someone new. **A decision made by something that disappears only counts if it lands in a file.** Section 9's requirement to record trade-offs and reasons is the same point: a decision recorded without its reasoning has a shelf life of exactly one context.

## Decision 2: reference, don't restate

Notice how this design is written: it invents almost no constraints of its own. Standards are read from `.harness/standards.md` (the five layers already live there), the state shape points back to `state-schema-first`, requirements point back to PRD numbers, "good" points back to vision's anchors, the project's current state points back to the overview.

On top of those existing decisions it does exactly one thing: **make them concrete.** For this feature, it is this module and these files — one of the skill's rules reads: "Name the exact files that will change; the dev plan's tasks reuse them." When write-dev-plan breaks the work into tasks next, it takes this file list as raw material.

Why not copy the relevant constraints into the design, for reading convenience? Because every copy is a second source of truth. The standards change; the copy in the design doesn't; sooner or later the two disagree, and the next reader has no way to know which one governs. A reference keeps exactly one truth, at the cost of one extra hop — a good trade.

## Decision 3: no TODOs in the document

The rule, verbatim, is short: **"No TODO / TBD. A genuinely unknown choice goes back to the user."**

The reasoning is the same as clarify's ban on open questions: a blank in a document does not stay blank — it gets filled by whoever executes, with a default. A blank in requirements gets filled with a feature default; a blank in the design gets filled with an architecture default, and a wrong architecture default has a far larger blast radius than a wrong feature. The two architectures in the opening scene trace back, in the end, to the "state solution" cell being left empty at design time and filled once by each of two implementing contexts.

A companion rule governs the choices themselves: **prefer the simplest boundary that can be tested in isolation.** Where a boundary is drawn decides the cost of every test layer after it: a cohesive boundary can be covered by unit tests; a leaky one leaves only the most expensive option, E2E, to catch things. Simple is not laziness — it is leaving evaluation a cheap road.

## What it cannot do

Boundaries, stated plainly.

First, it guarantees that the decisions **were made once, written down, and carry their reasons** — it cannot guarantee the decisions are right. Pick the wrong stack and all ten sections, filled in perfectly, will not save you; judgment is outside this skill's range. What it eliminates is two specific accident classes: nobody deciding, and the same decision being made twice with two different outcomes.

Second, it does not sequence the work. The design answers "what is the structure," not "what comes first, what comes next." Mixing order into the design bends the design to accommodate the order; splitting the work into tasks is the next step's job.

The step is done when the Done Criteria hold — all sections present, the stack section matching clarification, `pages.json` validating and covering every key screen (or the N/A stated). Next: write-dev-plan — the structure is settled, and now it gets cut into an ordered work order, `tasks.json`.
