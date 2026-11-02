---
title: "The Deliver Phase: Done Is a State Only the Kernel May Set"
description: "Part five of the Harness five-phase series (Deliver). Why the done state may only be set by the kernel, when evaluation passed, stable passes are met, and the delivery gate is green all at once; why the gate runs the project's own build, tests, and lint instead of inventing another set of checks; why the acceptance report must state what was never verified; how stable changes are folded into the project overview after done; and why Paused, the state entered when budgets run out, is more honest than a fake done — the why and the how. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "The rubric said 92. The project's build was red."
  - title: "Why only the kernel may set “done”"
  - title: "The delivery gate runs the project's own commands"
  - title: "The acceptance report is generated from the record"
  - title: "After done: folding what changed into the overview"
  - title: "Paused: when the budget runs out, the system stops and waits"
  - title: "What this phase cannot do"
---

This is part five of the five-phase series, and the last. Part one, [the Clarify phase](/en/harness-phase-clarify/), wrote "done" down as a contract before any code existed; part two, [Implement](/en/harness-phase-implement/), landed the code one task at a time; part three, [Evaluate](/en/harness-phase-evaluate/), had an independent evaluator score it against the rubric; part four, [Verify](/en/harness-phase-verify/), required a different evaluator, fresh evidence, and consecutive passes. This part covers the final step: when a feature earns the right to become done in the state file, instead of merely being called finished. The overview post, [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), covered the five layers and the five phases together; this series takes them one at a time. The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

## The rubric said 92. The project's build was red.

Start with a concrete scene.

The feature is status filtering for an order list. The developer finishes task after task; every task's code checks pass, and the kernel verifies each commit SHA. The evaluator scores the rubric item by item: every functional point covered, 92 points, pass. Verify brings in a second evaluator, regenerates all the evidence, and the feature passes two consecutive rounds. Every participant in the workflow reaches the same conclusion: it's done.

Then the delivery gate runs the project's own build command, and it is red.

The cause sits outside the feature. To add a sortable column, the developer modified a table component shared by the whole site and gave it a library that only runs in the browser. That component carries a dozen-plus pages, two of them purely server-rendered, and those fail at build time. The feature page itself runs fine in the development environment — nothing is wrong with it. What it did was break the project around it.

If "done" were declared by the developer when the task list emptied, or by the evaluator when she wrote down 92, this feature would have shipped carrying a red build. The evaluation was not wrong; it answered its question — does this feature meet its contract? The build answers a different question. The Deliver phase exists to put one more checkpoint between someone saying "finished" and the system recording "done" — a checkpoint that only accepts facts.

## Why only the kernel may set "done"

Three parties in the pipeline each hold part of the facts. None holds all of them.

The developer's record ends at the tasks: which task finished, under which commit SHA. When he says "done," he means the task list is empty — and by the design of the Implement phase he never saw the rubric at all, so he is in no position to judge whether the feature is acceptable.

The evaluator's record ends at the contract: rubric scores and evidence, item by item. But the rubric was written before the code existed; anything the contract forgot to mention, she has no basis to score. Whether the project still builds as a whole with this feature in it is also outside her checks.

Verify adds stability: a different person, fresh evidence, consecutive passes. That proves the evaluation verdict was not luck — but it still proves it only within the contract.

So "done" cannot be any party's conclusion. It is a state — the value of the phase field in `state.json`. Only the kernel may change that value, because only the kernel, at the moment of the change, holds all three records at once. Its transition rule is a conjunction, checked item by item against the record:

- The evaluation verdict is a pass;
- The stable-pass requirement is met;
- The delivery gate has just run, and it is green.

All three true at the same time, and the state moves from Verify to Done. Any one missing, and the state stays where it is — this state machine has no value called "mostly done."

A discipline follows from that rule: nobody may edit `state.json` by hand. Typing done into the phase field produces nothing but an edited JSON file, with no evaluation verdict and no gate result underneath it. The people who did the work supply claims; claims are inputs. The verdict happens only when the record is complete.

## The delivery gate runs the project's own commands

What does the delivery gate run? The answer is slightly unexpected: it runs none of the harness's own checks. It runs **the project's own** commands.

Each project writes its gate commands (`gateCommands`) into its configuration — usually the same ones its CI runs: `npm run build`, the full test suite, `npm run lint`. They are the project's own definition of what "shippable" means.

Why not replace them with the harness's checks? Because the harness has no say in how a project ships. The rubric is a contract written per feature; the scan is a general-purpose instrument; only the project knows its own release bar. What the harness does at this phase is not add another layer of opinion — it refuses, at the last moment, to let anything through whose own bar has not been met.

Two execution details matter. First, the gate **runs fresh**: it executes against the current tree of code just before the state transition. A green CI run from the morning does not count — the feature had not landed yet; that was a different tree. Second, its **scope differs from evaluation's**: the rubric answers "does this feature meet its contract," the gate answers "with this feature in it, does the project still build as a whole and still pass its own tests." Cross-feature damage — a shared component broken, a dependency change that breaks other pages — only appears in the second question. The red build at the top of this article fell through the gap between those two questions.

The supporting skill for this phase is `ship-checklist`: a checklist worked through around the gate — are the gate commands still the project's current ones, did the build run against the final code, has the report been generated. It makes no judgments; it only prevents omissions.

## The acceptance report is generated from the record

When the state becomes done, the system generates an acceptance report with `harness report`. It is not a summary the developer writes at the end — a summary relies on memory, and memory edits toward the favorable. The report is generated from the state file and the evaluation records, in three parts:

- **What shipped**: the feature name, the task list, the commit for each task;
- **The scores**: the evaluation's item-by-item results, and Verify's stable passes;
- **What was never verified**: waived manual items, skipped judge items, dimensions the scan could not measure.

The third part is the design point of the whole report. In a report that only lists good news, a reader cannot tell "checked, no problem" apart from "never checked." After delivery those two carry completely different risk: the first can be used with confidence; the second needs someone watching it. Stating the unverified puts the residual risk on the table instead of in someone's memory.

Because the report is generated from the record, it is also reproducible: run `harness report` against the same record next week and you get the same report. It is a view of the record, not a narrative somebody wrote.

## After done: folding what changed into the overview

The old eight-stage flow had a dedicated documentation stage, sitting after code generation, that reverse-engineered the feature into documents. The five-phase flow removed it — not because documentation stopped mattering, but because its place moved: `prd.md`, `tech-design.md`, and the rest of the contract files were already written during Clarify. The documentation exists from day one; there is nothing to write up after the fact.

What remains after done is one documentation action: the planner runs `sync-overview` and folds the changes this feature brought into the project's overview files. The folding has a filter: **only stable changes go in** — product and technical facts that actually shipped and stayed. "The order list supports status filtering, implemented as server-side filtering" is the level of statement that belongs there. Unshipped attempts and abandoned approaches do not.

Why insist on "stable"? Because the overview is where the next feature's Clarify phase starts: the planner reads it first and writes the new contract on top of it. Mix in half-finished experiments and discarded designs, and the next feature's contract sits on a foundation with fiction in it. A current overview, on the other hand, saves the next clarification from archaeology: starting an "export orders" feature, nobody has to dig through the code to find out whether filtering exists — the overview already says.

In this system, documentation is not a phase. It is the sediment the workflow leaves at every delivery boundary.

## Paused: when the budget runs out, the system stops and waits

Not every feature reaches done. This pipeline has one more exit, called Paused.

Evaluation fails, and the feature goes back to Implement to be fixed and re-evaluated — that loop has a cycle cap. Retries on a single task have one too. The budgets exist to prevent loss of control: without them, one stuck item can drag the whole pipeline into an endless loop. When a budget is exhausted and the feature still has not passed, the kernel does not set done and does not keep pushing. It sets the state to Paused and stops, waiting for a human.

It stops with the evidence in hand: the state file records which item it was stuck on, how many cycles it used, and the last evaluation's verdict. The human who picks it up does not face a half-run pile of code and an archaeology project; they make a decision from the record — the plan was wrong, so split the feature and start it over; the contract was unreasonable, so amend the rubric and record the waiver; or this feature waits, and something else goes first. Once the decision is made, the workflow can resume from Paused.

Paused exists to prevent two worse endings. The first is the **infinite loop**: the same item "fixed" a dozen times, each attempt slightly different, money and context burning, the code getting messier with every round, and no moment at which anyone is plainly told "this road is closed." The second is **quiet bar-lowering**: after enough failures, the standard is relaxed a little, unannounced, until the feature passes — what ships is unverified work, and no record anywhere says the bar ever moved. Paused forces "could not finish" into the open as a state. If the bar is going to move, a human signs for it, on the record.

So Paused is not a failure state. It is the most honest sentence this pipeline can produce: under the current contract and the current budget, this could not be finished. That sentence is itself a useful delivery.

## What this phase cannot do

Boundaries, stated plainly.

First, the gate's ceiling is the ceiling of the project's own commands. A project with near-zero test coverage gets a green gate that means very little. Done certifies "every check this system runs has passed," not "this feature is correct" — the strength of the checklist itself is decided back in Clarify, when the contract is written, not here.

Second, listing the unverified is not verifying it. After done, watching that unverified list remains a human's job. What the Deliver phase changes is where the burden sits: from "did anyone ever check?" to "the unchecked is all listed here — handle it."

The five phases end here: Clarify, Implement, Evaluate, Verify, Deliver. But the phases are only the skeleton. The actual work inside each phase is done by skills the roles invoke — the authoring chain in Clarify, `e2e-testing` in Evaluate, `ship-checklist` in this phase. The next series takes the 21 skills one at a time, starting with the source of the whole flow, `clarify-requirements`: the quality of the questions it asks decides the quality of every contract that follows.
