---
title: "The Clarify Phase: Write “Done” Down as a Countable Checklist"
description: "Part one of the five-phase series (the Clarify phase), opening the phase block. How a one-line request becomes a locked contract: the planner interviews until open questions hit zero, then authors seven contract files in a fixed order; why the coverage gate blocks all code until coverage is complete; and why an existing PRD is imported, never rewritten. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "One sentence: “finish the homepage”"
  - title: "Why the first phase writes no code"
  - title: "How clarify runs: interview first, then files"
  - title: "The coverage gate: incomplete coverage, no way forward"
  - title: "Decision 1: the exam is written before the test"
  - title: "Decision 2: with a PRD of your own, import — never rewrite"
  - title: "What this phase cannot do"
---

This is part one of the five-phase series. The five parts before it were the five layers of constraints — [the language layer](/en/harness-layer-language/), styling, state, engineering, aesthetics — which govern where code may go; this block covers the five phases, which govern how a job travels from one sentence to delivery. The overview post is [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/). The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

## One sentence: "finish the homepage"

Start with a concrete scene.

You tell an AI: finish the homepage of a to-do app. It works for six hours and delivers a remarkably complete page: a banner up top, statistics cards in the middle, a list with filtering and search, even an illustration for the empty state.

What you actually wanted was one small thing: open the page, type in an input box, press Enter, and a to-do appears in the list.

Not one line of the code is "wrong." The filter works, the search works, the statistics are accurate. What is wrong is the direction: it spent six hours building things you never asked for, and the one small thing you did ask for is a corner of the page. When was this error discovered? At acceptance — the most expensive moment possible. The six hours are spent; rework is not editing a few lines, it is starting over.

How many unspoken questions hide inside "finish the homepage"? Does a to-do have only a title, or also notes and a deadline? Does deletion need a confirmation, and can it be undone? Does the data survive a refresh? Is the list sorted newest first or oldest first? Every unasked question gets filled in by the model with its own default during generation. **A vague instruction is never executed; it is amplified.** Leave ten blanks and it flips ten coins for you — you can compute the odds of all ten landing your way yourself.

Clarify exists to move those ten coin flips to before any code is written: asked in a conversation, a question costs seconds; discovered at acceptance, a wrong answer costs hours.

## Why the first phase writes no code

Clarify is the first of the five phases, and it is worked by one role only: the planner. It writes no product code — not one line. Its only output is turning a one-line request into a locked contract.

"Locked" is the operative word. Requirements discussed in a conversation evaporate: the phases after this one — implement, evaluate, verify — are staffed by roles with completely fresh contexts. They were not at your conversation; they don't know what you "agreed on." All they can rely on is files. So the contract must land on disk, and it must land before any code exists — reverse the order and the contract degrades into a retroactive description of whatever the code already does. That is not a contract; it is documentation.

Which answers a question that comes up often: this system has no separate documentation phase. Documentation is not written at the end; it is this phase's output. Every contract file is written at the moment its decision is made, not reconstructed from memory afterward.

## How clarify runs: interview first, then files

Clarify has two steps, and their order is not interchangeable.

**Step one is the interview** (the `clarify-requirements` skill). The planner starts from your one-line request and keeps asking until the number of open questions reaches zero. Note the stopping condition: not when the planner "feels it's about enough," but when the count of unanswered questions equals zero — a state you can count.

What do the questions look like? They are the kind that, left unasked, will certainly be answered by a default: What does an empty list show? Newest first or oldest first? Can a deletion be undone? Which states must exist — loading, empty, error, no-permission; miss one and generation skips it, and evaluation finds a hole later. The interview asks about boundaries, not taste.

**Step two is writing the files**, seven contract files in a fixed order:

- `prd.md` — the requirements themselves. The core device is numbering: REQ-1, REQ-2, … one number per requirement, each written as one testable sentence. "Testable" means someone who took no part in building it can tell, from the sentence alone, whether it was done.
- `vision.md` — what "good" looks like, written as anchors. An empty list is not "clean and minimal"; it is "shows one sentence and an add button." Anchors are the ruler evaluation measures against later; adjectives cannot be a ruler.
- `tech-design.md` — the technical design: how it will be built, what existing pieces it uses, where its boundaries are.
- `pages.json` — the page inventory: which pages exist, their routes and states.
- `tasks.json` — the work split into tasks: an ordered work order.
- `rubric.json` — the score sheet: for each requirement, which checks apply, which are essential, and which quality item hangs on which anchor.
- `e2e-cases.json` — the end-to-end cases, required to span six categories, not just the happy path.

Files written does not mean clarify is over. There is a gate.

## The coverage gate: incomplete coverage, no way forward

At clarify's exit sits a coverage gate (clarify-done), checked mechanically by the kernel — not by the planner reporting "all done." For every requirement number, it checks for a landing spot in three places:

First, `rubric.json` must contain at least one essential check aimed at it — the core functional check. Without one, whether that requirement was built at all is a question nobody ever asks.

Second, at least one quality item anchored to something concrete in the vision; where one is genuinely unnecessary, a written waiver must be on file instead. The waiver has to leave a paper trail, because skipping is allowed — as a decision, never as an oversight.

Third, `e2e-cases.json` must contain cases covering it, and the case set as a whole must span all six categories.

If any number is missing any landing spot, the state machine refuses to advance to implement. Not a warning — a stop. Not one line of product code may be written.

Why this hard? Because a coverage gap is invisible. A requirement with no check aimed at it will not be missed later: implement works from the task list, evaluation scores from the rubric, and if it is in neither list, it effectively does not exist. The user discovers "this feature was never built" at acceptance — and you are back to the six-hour rework. The gate's essence is turning "every requirement is somebody's job" from a wish into arithmetic: the requirement numbers are the denominator, the three landing spots are the numerator, and if they don't reconcile, everything stops.

## Decision 1: the exam is written before the test

The rubric, `rubric.json`, is written during clarify, in the same batch as the requirements. There are two reasons for this timing.

One is a finding from Anthropic: **the wording of the grading standard does not merely judge the output — it shapes the direction the generator produces in.** Write "done" as a particular checklist and generation converges toward that checklist. Written first, the rubric is not only the exam paper; it is also the steering wheel.

The other reason is plainer: the requirements list is evaluation's exam paper, and an exam must be written before the test. Define "what counts as correct" after the code exists and the definition will inevitably describe whatever the code already does — the student writes their own exam, and everyone scores full marks. Pin the checklist before any code exists and evaluation earns the right to say "wrong," because the definition of "right" was written before the output existed.

This is also where numbering earns its keep: the REQ ids are the connecting key between the PRD and the rubric. With stable ids, "every requirement is checked" is a verifiable sentence. Without them, coverage is a feeling.

## Decision 2: with a PRD of your own, import — never rewrite

Not every request starts as one sentence. Often you already hold a finished PRD; it just has no numbering and no rubric. Early versions of this workflow could only treat such a document as reference material and have the planner rewrite it — and a rewrite always loses information. Change the wording and the original author's intent drifts.

There is now a dedicated import path:

```
harness new <feature> --prd <file>
```

The PRD lands in `prd.md` verbatim, not one character changed. The kernel does exactly one thing: it validates the numbering contract. It counts the sequence — given REQ-1, REQ-2, REQ-4, it reports a missing REQ-3 — and it **never renumbers and never rewords**. Renumbering would invalidate every place that already references the old ids; rewording would change the contract where you can't see it. Both are worse than a gap in the sequence.

How are gaps filled? Clarify still happens, but shrunk: no interview from zero, no rewrite — just two jobs. Confirm this PRD is the one you mean, and close the gaps one by one (missing numbers get numbers, missing quality anchors and cases are added in this phase, and the coverage gate still has to pass).

The judgment behind this path: a tool should adapt to the artifacts people already have, not demand they redo their work for the tool. A finished PRD is an asset — import it. A one-line request is a starting point — interview it. Different entrances, the same gate at the exit.

## What this phase cannot do

Boundaries, as usual, stated plainly.

Clarify guarantees that every requirement is written clearly, numbered, and covered by checks. It does not guarantee **that the requirements themselves are right**. A contract with one hundred percent coverage can describe the wrong product with great precision — the gate counts landing spots, not judgment. Whether this feature should exist, and what it is worth to its users, is not a question clarify answers for you; its whole job is making sure you see your own answers clearly before code exists. Change your mind after seeing them and the cost is editing a few lines of text — which is exactly the point of the phase.

Nor can it guarantee the quality of the implementation. A contract can be airtight and the builder can still ignore it — that belongs to the next part: the Implement phase, where every finished task must produce a commit record the kernel can verify as real.
