---
title: "Sync Overview: Long-Term Memory Accepts Only Changes That Have Settled"
description: "A skill deep-dive in the Harness series: sync-overview, the delivery-side skill that closes the loop. After a feature reaches done, it folds the product and technical changes that have actually settled into product.md and technical.md under .harness/overview/ — why deltas are registered during clarify but written only at delivery, why the overview has many readers and exactly one writer, what may never be written into it, and why even 'no change' gets a dated line. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "A map three versions out of date"
  - title: "What this skill is"
  - title: "How it runs: one sync in five steps"
  - title: "Decision 1: deltas are registered at design time, written at delivery time"
  - title: "Decision 2: many readers, exactly one writer"
  - title: "Decision 3: merge, don't append; summarize, don't transcribe"
  - title: "Two small rules: 'no change' still leaves a line; undecided never becomes fact"
  - title: "Its limits"
---

This is a skill deep-dive in the Harness series, and the skill under the knife is `sync-overview`. It is the last of the implementation/evaluation/delivery group: the [Deliver phase](/en/harness-phase-deliver/) mentioned it in one sentence — after a feature reaches done, its changes settle into the overview — and this article expands that sentence. The overview post, [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), gives the shape of the whole system; this series takes the skills one at a time — why each exists, and concretely how it is done. The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

## A map three versions out of date

Start with a concrete scene.

Over the past month the project shipped three features in a row: notifications were pulled out of individual pages into a shared message-center module; permission checks moved from the frontend to the server; export gained an asynchronous job queue. All the code is live, all the evaluations passed.

But the project's overview files were never touched. They still say: notifications are handled inside each page, roles are checked in the frontend, export is a synchronous endpoint.

Now a fourth feature starts. Its planner is a fresh context, and by the rules it reads the overview first — that is the project's official memory, in writing. It believes what it reads. Then it writes a tech design on top of that memory: the new notification reuses the old "each page handles its own" pattern, permissions are designed as a frontend check. The design itself is tidy and internally consistent.

What is wrong is not the design; it is the memory the design was built on. **A stale map is worse than no map**: with no map, you go and read the code; with a stale map, you stop reading — you think you already know.

`sync-overview` exists so this never gets the chance to accumulate: after every feature is delivered, memory is reconciled with reality.

## What this skill is

The skill's own definition of the overview runs like this: **the overview is the project's long-term memory — what the product can do and how it is put together, at a level someone new could read in five minutes. Every planner reads it before clarifying; only this skill writes it.**

Concretely it is two files, under `.harness/overview/`:

- **`product.md`** — capability areas, users and roles, scope boundaries, open directions;
- **`technical.md`** — modules and their boundaries, data sources, cross-cutting constraints, architecture direction.

The trigger is nailed down to exactly two cases:

- a feature reached `done` (`harness report <feature>` shows phase done), and the planner runs it before starting the next feature;
- a replan changed a module boundary or a capability area.

The reverse is equally explicit: **never during clarify or authoring.** Those steps may register changes; they may not write them. That is Decision 1, below.

In one sentence, the job is this: fold the changes a just-delivered feature actually settled — product side and technical side — into those two files, so the next feature's clarify starts from current truth instead of a stale snapshot.

## How it runs: one sync in five steps

The workflow is five steps, and none of them is improvisation:

1. **Read the inputs**: both overview files, plus the feature's `prd.md` and `tech-design.md` (specifically their "Overview deltas" sections), plus the final evaluation report.
2. **List the changes**: added, changed, retired — once down the product side, once down the technical side.
3. **Write each change as one short line** in the right section. When an existing line already covers it, merge rather than append.
4. **If there is no stable change**, add a dated line: "no overview change (<feature>)". The skill's next sentence is blunt: never invent one to look busy.
5. **Anything still undecided** may be written as a "direction under discussion" — never as a fact.

The output back to the orchestrator is fixed in shape too: 3–10 change lines, whether a module boundary changed (yes/no), and the feature it came from.

The done criteria fit in one line: **both files updated (or a dated "no change" line), summary-level only.**

There is also a "never write" list, pinned down as hard as the workflow:

- task ids, case ids, rubric ids, commit SHAs;
- commands, request/response bodies, file-by-file change lists;
- copies of PRD or tech-design sections.

None of these is useless; each has its own home. Ids and SHAs live in the state file and the evaluation reports; file-by-file lists live in the commit history. The overview keeps the shape, not the addresses.

## Decision 1: deltas are registered at design time, written at delivery time

The core arrangement in this skill is that "noticing a change" and "writing it into memory" happen at two different moments.

During clarify, `prd.md` and `tech-design.md` each carry an "Overview deltas" section: if this feature ships as designed, what will change in the overview — registered there, at design time. Step 1 of the sync reads exactly those sections; the skill never has to archaeology its way through the code, because the ledger was kept while the design was written.

But a registration is only a registration: at that moment, not one line of it may be written into the overview. Why? Because at clarify time a change is still an **intention**. The feature may be bounced in evaluation, rerouted by a replan, cut in half, or land in a different shape than designed. Writing intentions into long-term memory lets plans impersonate facts — and memory's entire value is that it only states facts.

Only when the feature actually reaches done, and the final evaluation report says what was really delivered, is the account settled: registered deltas are checked against the outcome, what settled gets written in, what didn't is discarded.

A river carries a great deal past. Only what settles becomes the riverbed. The overview is the riverbed, not the flow.

## Decision 2: many readers, exactly one writer

Many readers use the overview: every feature's planner reads it before clarifying. It has exactly one writing entry point: this skill, and it runs only at the delivery boundary.

The obvious alternative — whoever changes something updates the overview as they go — fails in two places.

First, **half-states**. Halfway through a feature, the system sits in an intermediate shape: some modules changed, others not yet. Fold that into the overview and you have written down a system that never existed at any single moment.

Second, **collisions**. Two features in flight, both touching the same module boundary, each folding in its own half: the "memory" becomes a collage of two intentions, neither of which is a fact.

One writer, one moment — the delivery boundary, when the feature's final shape is already a recorded fact — keeps every line of the overview traceable to something that actually shipped. A paused feature, a discarded approach: neither leaves a single line behind.

## Decision 3: merge, don't append; summarize, don't transcribe

Half of the overview's value is its **size**: readable in five minutes. Written append-only, a few features turn it into a changelog — and a changelog is precisely what a planner at clarify time cannot use. It needs "what does the system look like now," not "what happened, in order."

So step 3 merges first: if a new change fits into an existing line, that line is edited; only a genuinely new capability area or module earns a new line. Memory stays at a constant altitude while its content tracks reality.

The "never write" list governs the other face of the same thing: **altitude**. Ids, SHAs, commands, payloads, file-by-file lists are records from the detail layer. Copy them into the overview and it degrades from a map into an archive index — the reader must learn to query the archive before they can start reading the map. The overview answers "what exists, and where are the boundaries"; detail lives permanently in the contract files and the code, and the overview does not transcribe a word of it.

## Two small rules: 'no change' still leaves a line; undecided never becomes fact

Steps 4 and 5 look like edge cases. They block the two most common ways a memory rots.

One is **ambiguous silence**. If nothing is written when nothing changed, the next reader cannot tell "this feature was synced, and there really was no change" from "nobody ever synced this feature." A dated "no overview change" line turns "nothing happened" from a default into a recorded decision — and it closes the road to inventing a change to look busy: when "no change" can be written openly, there is no reason to fabricate one.

The other is **discussion hardening into fact**. An architecture direction not yet decided gets written into the overview "for the record" — and by the time the next planner reads it, the label has fallen off in transmission and the discussion is being used as settled architecture. So undecided things may be written, but only wearing their label: direction under discussion, nothing more.

## Its limits

Boundaries, stated plainly.

First, **it keeps the map current; it cannot make the map good.** If the overview was drawn wrong in the first place — module boundaries in the wrong place, capability areas split awkwardly — `sync-overview` will faithfully keep a bad map up to date. Redrawing the map is an architecture decision, made by people; it is not a sync step.

Second, **its input is only what the ledger holds.** Its sources are the deltas registered at design time plus the final evaluation report. A change nobody registered, that the evaluation report doesn't mention, will not be discovered by patrol — this skill reconciles accounts; it does not audit the codebase.

Third, **the summary altitude is deliberate information loss.** "Notifications moved into the message center" fits on one line; how the message center works inside does not. What the overview saves you is the archaeology — it tells you which code and which contracts to read. It does not save you the reading.

With this, the implementation/evaluation/delivery group of skills is fully taken apart. One group remains in this series: the general-purpose skills, bound to no single phase — starting with `plan-before-code`, and why "plan before you code" is, in the general case too, a skill written down as a file rather than a spoken reminder.
