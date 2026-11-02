---
title: "fix-from-report: The Report Is the Work Order — Fix What It Names, Nothing Else"
description: "A skill deep-dive (fix-from-report, the developer-side remediation skill). Why fix rounds so easily make things worse; why the evaluation report is the complete work order and anything off-list is a new feature request; why the developer never sees the full rubric and never edits the report; why every fix starts with a reproduction and ends with one precise commit — traced rule by rule to the SKILL.md source. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "A fix round that made things worse"
  - title: "What this skill does: the report is the work order"
  - title: "Inputs: symptoms only, never the grading sheet"
  - title: "Seven steps: reproduce, root-cause, smallest fix, proof"
  - title: "Design 1: anything off the list is a new feature request"
  - title: "Design 2: disputes go through appeal, never through editing the report"
  - title: "Design 3: fixing this way is what makes the loop converge"
  - title: "What it cannot do"
---

This is one entry in the skill-by-skill series, covering `fix-from-report` — the developer-side remediation skill, the one in use when evaluation sends a feature back. The previous article, [the Evaluate phase](/en/harness-phase-evaluate/), covered how the report is produced and why only the open items come back; this one covers what happens once the list arrives. The overview post is [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/). The system is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below can be found verbatim in the repository at `templates/skills/fix-from-report/SKILL.md`.

## A fix round that made things worse

Start with a concrete scene.

The evaluation report comes back: forty items, eleven failed. The developer takes the report and starts fixing.

One round later, the tally: of the eleven, he fixed six. He missed three — halfway through a fix, another problem pulled him off course. Two more he believes were judged wrongly; he wrote long replies arguing each one and touched no code. And along the way he "improved" twelve places the report never mentioned, each defensible on its own.

The next evaluation: the three missed items are still open. The two argued items are still open. And two of the twelve side improvements broke items that had previously passed. The open set shrank from eleven to seven — but two of the seven are brand new, created by the fix round itself. The evaluate–fix loop has a hard budget of rounds (the Evaluate article covers this); this round burned one without cleanly shrinking the problem.

The failure is not craftsmanship. It is the absence of a boundary. Listed items get missed, unlisted ones wander in, disagreed ones get stalled by argument. **A fix round without a boundary introduces more change than it removes.**

`fix-from-report` exists to draw that boundary. The first line of SKILL.md: the evaluation failed and named open items — "Fix those — only those — and prove each fix changed the behavior."

## What this skill does: the report is the work order

In the Harness flow, a failed evaluation does not send the feature back with a vague "redo this." The kernel hands the developer the open-items list. `fix-from-report` is triggered when `harness next` returns `remediate`, and its job is one sentence: **take every item on the list — reproduce it, find the root cause, apply the smallest fix, prove it worked, commit it precisely. Nothing off the list gets touched.**

Its division of labor with `implement-task` matters. `implement-task` builds the feature from the plan; its input is the plan and the tasks, and it has the room to make judgment calls that building requires. `fix-from-report` closes named problems from a report; its input is the report. A fix round's entire legitimacy comes from that report — any action beyond it has no standing in this round.

## Inputs: symptoms only, never the grading sheet

What the developer receives comes from `harness packet <feature>`, in two parts: `items` — the ids of the failed items (rubric item ids, or `gate:<command>`); and `findings` — the **observed symptom** for each item.

Notice what is not in the packet: the full `rubric.json`. The skill states it flatly: "You still do not read `rubric.json`; the finding tells you the symptom."

This is the same rule as the Implement phase: the worker never sees the exam. Only the granularity differs — after evaluation, the developer may know *which* items failed and *what the symptom was*, because without that there is nothing to fix. But the full grading sheet — how leniently the passed items were judged, what each item weighs — stays hidden. Symptoms are a repair necessity; the grading sheet is an invitation to game it: fix the high-weight items first, coast on the loosely checked ones.

Beyond the packet, the inputs are three sets of files: the original tasks in `plan.md`, plus `tech-design.md`, `vision.md` and `.harness/standards.md` — the intent and the standards from when the work was planned; and the developer's own earlier reports under `developer/`. That last one deserves a moment: the developer in the fix round is not necessarily the context that wrote the code — it may be a completely fresh one. Its "memory" is not in its head; it is in these files: what the task said, what the earlier reports recorded, what the symptom is this time. Contexts can be swapped out. The work order and the archive cannot be lost.

One item type is special: `gate:<command>`. It is not a rubric item; it means the delivery gate failed at that command. The handling is different, and simpler: run the command, read the first failure, fix that.

## Seven steps: reproduce, root-cause, smallest fix, proof

The workflow is seven steps, walked once per item:

1. **Reproduce.** Produce something that shows the symptom: a failing test, a command, a script. Can't reproduce it? The skill's rule: record exactly what you tried and report that item `blocked` — do not "fix" blind.
2. **Root cause.** Follow the `systematic-debugging` discipline: one hypothesis at a time.
3. **Smallest fix.** Remove the cause, nothing more. Widen the scope only when correctness requires it — and say why.
4. **Prove it.** The reproduction now passes; the task's checks and the affected tests pass — with fresh output in hand. Not "I ran it earlier," but run now, read now.
5. **Commit precisely.** `git add` only the paths of this fix; the commit message is `fix(<item ids>): <cause>` — the item ids and the root cause go into the message.
6. **Report.** Append to the relevant `developer/<TASK-ID>-report.md`: the item, the root cause (one line), the fix, the SHA, the test result counts.
7. **Record.** `harness remediate-done <feature> --sha <sha>` — register the round's fix with the kernel.

The rules section has only three entries, each harder than the last:

- **No fix without a reproduction; no commit without fresh passing output.**
- **Never commit unrelated files; never `git add -A`.**
- **A fix that is not committed is not a fix** — `remediate-done` needs the SHA; without a commit hash, in the kernel's eyes this round does not exist.

One more rule hides inside step seven: **do not run `harness eval` yourself.** Whether the fix worked is judged by a fresh evaluator — in the skill's words, "a fresh evaluator judges the fix." The fixer grading their own fix is the self-awarded perfect score from the Evaluate article, committed again in a different phase.

## Design 1: anything off the list is a new feature request

Why is the scope locked down this hard? Because **the boundary of the fix is the boundary of the evaluation** — the Evaluate article made this point; here is what it means operationally.

Every item on the list was judged by the evaluator on evidence: there is a symptom, there is a location. If fixes touch only those places, the next evaluation reconciles cleanly — this item closed, that item's evidence changed — one to one.

Off-list changes get no such treatment. A function you "improved while you were in there" was not examined by this round's evaluation; if it breaks something, the break surfaces a round later, or after release — and by then nobody can say whether the fix round introduced it or it was always there. So every off-list edit in a fix round injects unexamined change into the system. The change itself may be a good idea; the fix round is the wrong place for it. If a place genuinely needs changing, that is a new feature request: clarify it, plan it, let it be evaluated — do not smuggle it through inside a fix commit.

So "fix only what is named" is not red tape; it is bookkeeping: **the report is the complete work order — not one item more, not one item less.** One less — a missed item, an argued item stalled — is unfinished work. One more — a side improvement — is work nobody accepted.

## Design 2: disputes go through appeal, never through editing the report

Sooner or later the fixer meets an item they believe was judged wrong. What exits does this skill leave for that?

First, look at the exits it does not leave. The report itself may not be edited — evaluation reports are immutable once written, a discipline from the Evaluate phase, and the fixer has no authority to change a word of it. Items may not be skipped unilaterally either: the Done Criteria are explicit — every listed item is either reproduced, root-caused, fixed and re-tested, or reported `blocked` with what was tried. There is no third option called "I think this item is wrong, so I'm not fixing it."

So where does the disagreement go? Upward — it is never settled inside the fix round. When the evaluator believes the rubric itself is off, the channel is a rubric-refinement suggestion to the planner, and it may only tighten; loosening requires a human (the rule from the Evaluate article). On the fixer's side, the counterpart is honesty in the other direction: an item that cannot be reproduced is recorded as `blocked`, with the attempts on file, for a higher level to rule on. And if the rounds run out without convergence, the kernel sets the feature to `paused` and waits for a person — decision rights sit with humans, not with the fixer's debating skill.

The reason is the same one that justifies the rubric's existence: if the party doing the work can argue items off the list while doing the work, evaluation degrades, sooner or later, into another self-awarded perfect score. **The standard may only be changed upstream of the work, and the change itself must leave a record and an approval.** Inside the fix round, the only legitimate form of dissent is a `blocked` backed by evidence of what was tried.

## Design 3: fixing this way is what makes the loop converge

Evaluate → fix → evaluate again is a loop. A loop's worst failure is not slowness; it is oscillation — fixed this round, broken next round, items bouncing between open and closed, never converging. Nearly every rule in this skill is a damper on that loop:

- **Locked scope.** Only named items are touched; everything else stays put — so an already-closed item cannot be reopened by an off-list edit. The regression in the opening scene, "side improvement breaks a passing item," has no way in under this rule.
- **Closing an item takes evidence at both ends.** Reproduce first — proof it was actually broken. Run the reproduction again after the fix — proof it is actually fixed. There is no state called "should be fixed now": the reproduction going from red to green is the item's closing certificate.
- **One precise commit per item.** The commit message carries the item ids and the cause. The next evaluator lines the report up against the commits, item by item; if a fix introduced a regression, the culprit is exactly one commit, located and revertible to the item level.
- **A different judge.** The fix is re-judged by a fresh evaluator; the fixer's self-assessment enters no conclusion. Every round of the loop runs on new, external evidence, never on a participant's declaration — commit hashes are verified, test output must be fresh, the judge is swapped. It is one principle across the whole system.

Together: each round, the open set may only shrink — or hold at `blocked`, awaiting a human ruling. It may never grow because of the fixing itself. That is convergence: not a promise that one round fixes everything, but a guarantee that every round genuinely has fewer problems than the one before.

## What it cannot do

Boundaries, stated plainly.

First, it cannot rescue a wrong rubric. If an item itself mismatches the real requirement, the fixer has no authority under this skill to change it: fix it, or report `blocked` and wait for the planner and a human to rule. Until that ruling arrives, the item keeps blocking the loop — a deliberate cost. Better a loop stalled awaiting judgment than a worker quietly relaxing the standard.

Second, it depends on the quality of the findings. Reproduction is only possible if the evaluation's symptoms are concrete: which page, what action, what was expected, what actually happened. A vague symptom leaves the fixer two bad options — report `blocked`, or guess at the location, and guessed fixes are the ones most likely to fix the wrong place. This skill can guarantee "fix according to the report"; it cannot guarantee the report was well written. That is the responsibility of the Evaluate phase and the rubric.

Third, it is responsible only for the list. A defect the rubric never covered is, by design, invisible to this skill — it fixes *the problems that were named*, not *all problems*. Quality beyond the list rests on the rubric being complete when it was written back in Clarify, and on Verify's independent re-examination — not on the fix round's initiative.

Once fixing converges and re-evaluation passes, the feature still faces one last pre-delivery check. The next article covers [`ship-checklist`](/en/harness-skill-ship-checklist/): the checklist that may only be worked item by item, never from memory, before anything ships.
