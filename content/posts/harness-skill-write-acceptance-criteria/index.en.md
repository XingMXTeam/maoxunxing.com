---
title: "Acceptance Criteria: What 'Correct' Means Must Be Decided Before Any Code Exists"
description: "A skill deep-dive in the Harness series: write-acceptance-criteria, step five — the last — of the clarify authoring chain. How rubric.json and e2e-cases.json are built before any code exists: four layers laid in a fixed order, five item kinds, three coverage lines, why waivers must state their reasons, and why the gate may only be passed by sharpening items, never by lowering levels. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "An exam written after the test"
  - title: "What this skill produces"
  - title: "Building the rubric: copy the requirements first, then lay four layers"
  - title: "Five item kinds: run what can be run, check what can be checked, judge only the rest"
  - title: "Exceptions must leave a name: waivers and not-applicable"
  - title: "E2E: six categories of journey, each with a floor"
  - title: "Three design details: wording, pitfalls, tightening only"
  - title: "Its limits"
---

This is a skill deep-dive in the Harness series, and the skill under the knife is `write-acceptance-criteria`. The clarify phase's authoring chain has five steps; the first four produce the PRD, the quality vision, the tech design, and the dev plan. This one is step five, the last: what it produces is the scoring sheet that the [Evaluate phase](/en/harness-phase-evaluate/) grades against directly. The overview post, [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), gives the shape of the whole system; this series takes the skills one at a time — why each exists, and concretely how it is done. The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

## An exam written after the test

Start with a concrete scene.

A feature is finished, and you ask the AI to "add the acceptance criteria." It reads through the code and rewrites the behavior the code already has into criteria, one by one: "submitting the form should save successfully" — that is what the code does; "the list should be sorted newest first" — that is how the code sorts. At acceptance time you tick them off one by one. Every single one passes.

None of those criteria is false, but together they verified nothing. The problem is not laziness; it is timing. **Criteria copied out of the code can only describe what the code already does.** Whatever the code missed, the criteria miss too — the exam's author never once saw "what this was supposed to be," only "what it happened to become." Let the student write the exam after the test, and the exam is guaranteed full marks and guaranteed zero information.

The entire reason `write-acceptance-criteria` exists is to nail exam-writing to the moment when no code exists yet: the only sources allowed are the requirements and the vision, and the candidate has not entered the room.

## What this skill produces

It turns the PRD and the quality vision into two files:

- **`rubric.json`** — the scoring sheet: what gets scored, how, and each item's level and evidence requirements;
- **`e2e-cases.json`** — the end-to-end case set: which user journeys must genuinely work.

The entry gate is hard: `prd.md`, `vision.md`, `tech-design.md`, and `tasks.json` must all exist, and the summary must already be confirmed by a human. Missing any one of them, this step does not start — the reasoning is plain: with requirements unsettled, the exam has no basis; with the vision unsettled, quality items have no anchor; with tasks not yet broken down, you don't even know the scope of what is being examined.

Once written, these two files are the Evaluate phase's entire basis: the evaluator scores item by item against the rubric and runs journey by journey against the e2e cases. Write them vaguely and evaluation can only be vague. So all the craft in this step goes into one thing: making every check executable and auditable.

## Building the rubric: copy the requirements first, then lay four layers

The build order is fixed — seven moves:

**Move one: copy the requirements.** The `REQ-n` ids and requirement sentences from the PRD are copied verbatim into the rubric's `requirements`. Copied, not rewritten — change one word and the requirement drifts; grading against a drifted version is grading against a different exam.

**Move two: lay L1 (correctness).** Every requirement yields at least one item, and at least one of them is marked `essential` — score 0 on that one and the whole feature fails (the veto rules are covered in the Evaluate post). When choosing item kinds, prefer `command` items that run a real test.

**Move three: lay L2 (robustness).** Items come from the error and edge paths written into the PRD, plus the error handling in the tech design; the skill names two failure classes that are easiest to forget: timing failures and permission failures.

**Move four: lay L3 (UI).** Items come from the vision's design intent and key screens. Every design reference in the vision (`REF-n`) yields at least one `important` or `essential` `judge` item, with `"anchor": "REF-n"` written into the item — what the anchor does is explained in the next section.

**Move five: lay L4 (interaction).** Items come from the vision's interaction model, checked one by one against an interaction-heuristics checklist (section 2 of `.harness/docs/evaluation-heuristics.md`) — not brainstormed from feel.

**Move six: lay the pitfalls.** Every `RL-n` in the risk list becomes at least one `pitfall` item, or an essential judge item anchored on it; every anti-pattern in the vision (`ANTI-n`) deserves a pitfall too. Why this gets its own move is covered below.

**Move seven: cross-check the three coverage lines:**

- every REQ → at least one L1 essential;
- every design intent → at least one L3/L4 item;
- every RL → a pitfall, or an anchored essential judge item.

If any of the three lines is broken, the rubric is not finished. If the user asked for production level, quotas also go into `policy` (minimum essential and pitfall counts per layer, for instance).

## Five item kinds: run what can be run, check what can be checked, judge only the rest

Rubric items come in five kinds, divided by how hard the verdict is:

| Kind | What it decides | How |
| --- | --- | --- |
| `command` | tests, Playwright specs, scripts | actually runs; exit 0 = met |
| `file` | a deliverable exists and is not a stub | checks `path`, size at least `minBytes` |
| `grep` | a pattern must be present, or must never appear | searches `path` for `pattern`; `expect` says present or absent |
| `scan` | a sensor dimension clears a bar | the `dimension` score is at least `minScore` |
| `judge` | what only an evaluator can see | judged from evidence; must carry an anchor |

The first four are machine-decided: an exit code, a byte count, a pattern hit, a dimension score — no room for negotiation. Only the fifth is left to judgment: whether a layout matches the design intent, whether an empty state's copy tells the user what to do next — there is no exit code for such things. But a judge item is not a license for the evaluator to improvise. It has two hard constraints:

First, **it must carry an anchor.** The `anchor` field states which earlier decision it hangs on: a design reference from the vision (REF-n), an anti-pattern (ANTI-n), or a risk item (RL-n). A quality judgment with no anchor is taste; a judgment with an anchor is auditing — checking whether the implementation delivered the intent that was written down at the time. "Every judge item's anchor exists" is one of this skill's explicit done criteria.

Second, **it must leave an evidence path.** Judge evidence lives at a fixed location, `.harness/tasks/<feature>/evaluation/judge-<id>.json`; evaluation writes it there, and a post-mortem can dig it out and re-check the verdict against it.

One rule applies to every item regardless of kind: each carries an `id`, a `requirement` (which requirement it examines), a `layer` (L1–L4), a `level` (essential / important / optional / pitfall), and a `description` — **stating the observable behavior and the threshold**. "Login works correctly" is not an admissible item; "submitting a wrong password stays on the login page and shows an error message" is — visible, countable. An item written unobservably guarantees that evaluation degrades into "looked at it, seemed fine."

## Exceptions must leave a name: waivers and not-applicable

The coverage lines are hard, but reality has genuine exceptions: a pure back-end-logic requirement with no quality surface to judge; a feature with no interface at all, where L3 simply does not apply. The skill's handling of exceptions is not "quietly skip it" — it is **leave a name**:

- a requirement that honestly has no judge item → a `qualityWaivers` entry, with the reason;
- a whole layer that does not apply → a reason in `policy.layerNA.<L>`;
- an E2E category that does not apply (next section) → an entry in `e2eCategories.na`, with a reason.

One rule covers all three: **a waiver is allowed; the reason must be written down; silently lowering a minimum is never allowed.** Why so touchy about "silently"? Because once lowering a standard requires no record, it happens at the most convenient moment — when time is short, when the gate won't pass. With a name attached, a waiver is an auditable decision: a post-mortem can see who let this one through, and why. Without one, it is indistinguishable from rewriting the exam to fit the answers.

## E2E: six categories of journey, each with a floor

`e2e-cases.json` is an array of cases; each carries an `id`, a `category`, a `mapsTo` (which REQ it verifies), a `route`, `steps` (the actions, one by one), and `expect` (what each step should show). The six categories each have a minimum count:

| Category | Minimum | What it proves |
| --- | --- | --- |
| core | 2 | the main journey works end to end |
| negative | 2 | bad input, empty data, no permission, network failure — nothing collapses |
| boundary | 1 | large data, extreme input, pagination edges, concurrency |
| crossFeature | 1 | an action here is visible where it should be elsewhere |
| persistence | 1 | data survives reload / reopen |
| uiJourney | 1 | loading, empty, feedback, responsive behavior |

Two details deserve calling out.

First, **negative has the same floor as core — 2 — and each of the two categories needs at least one `blocking: true` case** (fail it and delivery is stopped). That ratio is not arbitrary: an AI writing test cases has the same habit as an AI writing code — it defaults to the happy path. Two for the main journey and two for the failure paths uses a quota to pin "the bad cases get verified too" to the same rank as "the good cases work."

Second, **every uiJourney case's `route` must already exist in `pages.json`**; if it doesn't, the planner adds the page to `pages.json` on the spot (it is the planner's file to maintain). A case referencing a page the plan doesn't know about means either the plan missed a page or the case drifted — either way it gets reconciled here, in Clarify, not discovered as a mismatch during evaluation.

## Three design details: wording, pitfalls, tightening only

**Detail one: the exam's wording shapes the candidate.** Anthropic found in their harness work that the wording of scoring criteria steers the direction of the generator's output. It is not hard to see why: in this system, requirement sentences are copied verbatim from the PRD into the rubric, and the PRD is simultaneously the developer's basis for working. A requirement written as "the list should be fast," versus an essential item written as "first-screen list rendering under a stated threshold, with command evidence," aims the generator at completely different targets. That is why this step keeps insisting that descriptions state observable behavior and thresholds: vagueness does not stay in the rubric — it rides the chain down into the code and resurfaces at evaluation time as an argument.

**Detail two: pitfalls are named in advance, not summarized afterward.** A pitfall item's verdict runs backwards: **it passes when the defect is absent.** Why list the ways to die before any code exists? Because the collapses you can think of afterward are mostly the ones that already happened — the `@ts-ignore` silencing an error, from the Evaluate post, is exactly that kind of case; adding the check after it has already slipped through once is locking the door after the theft. RL and ANTI are risks and anti-patterns listed during Clarify, facing the PRD and the tech design; turning each of them into a pitfall converts "known ways to die" into standing sentries — checked on every evaluation round, not remembered after an incident. The coverage line "every RL must land somewhere" is the net that keeps this from leaking.

**Detail three: there is exactly one road through the gate, and it only goes tighter.** With both files written, you run `harness clarify-done <feature>`, and it lists every gap. The skill's repair instruction comes in exactly one flavor: **fix each gap by adding items or sharpening existing ones — never by deleting a requirement or lowering a level to make the gate pass.** The reason needs little explanation: a level is a judgment about importance made at exam-writing time; revising that judgment at the moment the gate won't pass is moving the pass line because someone failed. There is a legitimate front door for revision later: on replan, accepted refinement suggestions get applied here (a sharper description or threshold, a new verification method, a new item, a new level), E2E cases get added for whatever the evaluator's exploratory testing turned up, and the decisions are recorded in `replan-decisions.json`. But the direction is constrained — as the Evaluate post laid out, refinement suggestions from the evaluator may only tighten; loosening requires a human's approval. When the exam-writer and the candidate belong to the same system, "tightening only" is the last gate against self-leniency.

## Its limits

Finally, what this step cannot guarantee.

First, **it guarantees coverage, not judgment.** All three coverage lines green, every anchor present, every quota met — that proves every requirement has someone checking it and every risk has a sentry. Whether the checking is any good depends on how sharply the items are written, and "sharp" itself has no machine check — `clarify-done` verifies structure. That is why the system keeps the replan loop: blind spots exposed during evaluation flow back in as new items and new cases, so the exam gets more accurate round by round instead of pretending to be perfect the first time.

Second, **it faithfully amplifies upstream errors.** REQs are copied verbatim from the PRD; if the PRD got a requirement wrong, this exam will examine the wrong thing with total rigor — and the more rigorous it is, the more confidently wrong the result. Whether the requirements themselves are right is the business of the earlier steps in the authoring chain; this step's job is only to turn "what was agreed" into checkable items.

Third, **judge items are still judgment in the end.** Anchors and evidence keep judgment on auditing rails, but the L3/L4 quality scores are ultimately given by an evaluator, not by an exit code. The system's stance is to put judgment in a cage — not to pretend judgment can be abolished.

With this step done, the clarify authoring chain is complete: requirements, PRD, vision, tech design, dev plan, acceptance criteria — every file that has to exist is on disk, `clarify-done` passes, and only then does the state machine release the Implement phase. The next block takes apart the implement-side skills, starting with `implement-task` — how a developer holding a task packet actually finishes one task, and finishes it verifiably.
