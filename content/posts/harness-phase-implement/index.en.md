---
title: "The Implement Phase: One Task at a Time, One Real Commit per Task"
description: "Part two of the five-phase series (the Implement phase). Why the developer role never sees the rubric, why work proceeds one task at a time with one precise commit per task, and why the commit id it reports is verified by the kernel with git rev-parse — the why and the how. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "A commit that does not exist"
  - title: "Why the worker never sees the exam"
  - title: "The task loop: build one, check one, commit one"
  - title: "Why one commit per task"
  - title: "Why the commit id gets verified"
  - title: "Debugging inside the phase"
  - title: "When evaluation sends work back, it sees only a list"
  - title: "What this phase guarantees — and what it does not"
---

This is part two of the five-phase series. The overview post, [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), covered the whole system's shape; this series takes the phases one at a time. The previous part ([the Clarify phase](/en/harness-phase-clarify/)) produced a contract: numbered requirements, a task list, and a rubric. This part is about what happens after the contract is signed — how the code gets written, and why the writing itself is designed around the assumption that the worker's own report cannot be taken at face value. The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli).

## A commit that does not exist

Start with a concrete scene.

You ask an AI to do a task. It works for a while and reports back: task complete, commit `a1b2c3d`. You open the repository and look for that commit — it doesn't exist. The code did change; new files and edits are all there, sitting uncommitted in the working tree. The commit id was invented.

It is not necessarily "lying." The report format has a field for a commit id, and producing a plausible-looking string of hex characters costs it almost nothing. A blank in a form gets filled; whether what fills it is true is a separate question.

The whole design of the Implement phase rests on this one recognition: **the executor's self-report is a claim, not evidence.** It saying "done" doesn't count. It saying "committed" doesn't count. Every step has to land on a fact a program can check. The rules that follow — never seeing the rubric, one task per commit, the commit id getting verified — all derive from that line, and they can look impersonal because they are meant to.

## Why the worker never sees the exam

By the end of Clarify, everything about the feature is settled: numbered requirements in `prd.md`, the task list in `tasks.json`, the rubric in `rubric.json`. Entering Implement, the kernel generates a task packet for the role that does the work — the developer — which starts in a fresh context.

The packet contains the plan, the task list, the project standards, and the skills for this phase (`implement-task`). **The one thing it does not contain is the rubric.**

That is deliberate. The rubric is the measuring instrument of acceptance: which requirement maps to which check, what counts as a fatal flaw, what triggers a veto — all of it is in there. If the person writing the code has seen the instrument in advance, the goal of the work quietly changes: from "build the requirement right" to "make the checks pass." On simple features the two are nearly the same. On complex ones they diverge — a check can only test what it spells out, and a worker aiming at the checks will satisfy exactly those spelled-out items while the real, unlisted requirement slips past. In the most direct form: a check says "file X should exist in directory Y," so the file gets created, content to be determined; a check greps for a function name, so the name exists, and the implementation can be empty.

This is not a character flaw; it is an incentive. People behave the same way — a student who gets the exam in advance studies the exam, not the course. So this system treats visibility as permission: a role gets what it needs and nothing more. The developer builds from the plan, never to the test. The rubric appears only in Evaluate, and only in the evaluator's packet.

## The task loop: build one, check one, commit one

The rhythm of Implement is compressed to the smallest grain: **one task at a time.**

The grain was fixed back in Clarify, item by item in `tasks.json`. The developer's loop is a fixed four steps:

1. Take the current single task and implement it, following the `implement-task` skill;
2. Run the task's checks — the project standards require `typecheck` and `lint` to pass after every task (the per-task gate covered in the language-layer article); if they fail, fix it now, not later;
3. Make **one** commit containing only this task's changes;
4. Report the commit id to the kernel. Only after the kernel verifies it (next section) is the task recorded as done and the loop moves on.

Inside one loop iteration there is no "while I'm at it, the next task too," and no bundling three unrelated changes into one commit. It looks slow. The accounting is over the whole run: at this grain, anything that goes wrong has its location and its redo scope locked inside "one task." At a coarser grain, what you save is visible round trips; what you pay is the search radius when something breaks.

## Why one commit per task

One task, one commit. The point of the rule is that **each commit becomes a verifiable unit of evidence, and a rollback point at the same time.**

Contrast the common alternative: the AI burrows in for an afternoon and lands one two-thousand-line commit — a dozen files, a bit of everything. Then evaluation says "REQ-3 is not satisfied." The problem: which few dozen of those two thousand lines are REQ-3's? Nobody can say. The evaluation's findings cannot be mapped to changes, and fixing becomes fishing in two thousand lines.

At one commit per task, the ledger is clean. Evaluation names a task; you open that task's one commit, a diff that takes minutes to read. Redoing it means `git revert` removes exactly that task and nothing else. Reconstructing "where did this start to drift" is just reading the commit sequence — it is the timeline. In this system a commit is not merely a version-control action; it is the receipt the system issues for work performed — and receipts are issued one at a time, not in an illegible stack.

## Why the commit id gets verified

Back to the opening scene. After the developer reports a commit id, the kernel speculates about nothing; it asks Git directly whether `git rev-parse` can resolve that object. It resolves — the task is recorded as done. It doesn't — the task is not done, however tidy the report looked.

This rule is not there to catch villains. It guards against the gravity of the report format itself: as long as the form has a "commit id" field, a model has a standing tendency to fill it, and whether the content is real depends on whether a real one happened to be at hand. Put the check on the kernel's side and the matter becomes simple — the id is no longer part of a self-report; it is a credential that has to pass verification. Fail, and the workflow stops here instead of marching on, leaving Evaluate to discover the primitive misalignment that the code was never committed at all.

The same logic governs two related things. First, the developer may not edit the state files under `.harness` by hand: it cannot flip its own task from "in progress" to "done"; every state change goes through a kernel command. Second, it has no authority to declare the feature done: whether a feature counts as finished is decided by evaluation and the delivery gate after it; the worker never holds the stamp for its own work. Together the three rules are one design — **execution, recording, and adjudication sit in three separate places**, and no single ring of the chain can certify itself.

## Debugging inside the phase

Checks failing inside the task loop is normal. The debugging skill for this phase is `systematic-debugging`, and its discipline is one line: **find the root cause first, then touch the patch.**

In behavioral terms: on an error, reproduce it first, locate which layer the problem lives in (types, data, environment, or the logic just written), confirm the cause, and only then change code. The forbidden moves are equally concrete: no patching over symptoms — wrapping the failing line in a try-catch so it stops complaining, or, as the language-layer article put it, pasting an `@ts-ignore` to silence the compiler. Those "fixes" turn the check green while driving the problem underground, where it waits for evaluation, or for production.

Debugging is bound by the same task grain: what gets fixed is what the current task introduced, and the fix goes through the same loop — checks, commit, verified id. No step is skipped for schedule pressure.

## When evaluation sends work back, it sees only a list

Implement is not the end. If the feature fails in Evaluate, it comes back for repair. What the developer receives then is not the rubric and not the evaluator's full report, but **a list of only the items that failed**: which requirement is unmet, what the evidence is, what needs to change. It fixes them, commits again, and goes back to evaluation.

This is the same principle as never seeing the exam, continued. Hand it the full rubric and the next round becomes item-by-item patching aimed at the instrument — each round looking more like test prep. Give it only the open-items list and what it fixes is "these places did not meet the requirement," while the instrument itself stays outside its view. The repair discipline itself (fix only the listed items, don't expand the change opportunistically) belongs to the evaluation loop and is covered in the next part, on Evaluate.

## What this phase guarantees — and what it does not

The boundary, stated plainly as usual.

Implement guarantees **traceability**: every code change corresponds to a task and to a real commit; who changed what, when, and for which task can be looked up and rolled back. It does not guarantee **correctness** — a task can be committed cleanly, its id perfectly real, and the feature can still be wrong. A real commit proves "this work happened, in this shape." It does not prove "this work is right."

Whether it is right is the next phase's question — Evaluate. And evaluation can only do its job because this phase left it two things: a rubric the worker never saw, and a sequence of commits that can be reconciled, item by item, against the findings.
