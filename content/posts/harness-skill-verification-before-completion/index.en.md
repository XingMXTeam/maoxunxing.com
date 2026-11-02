---
title: "verification-before-completion: The Words “It's Done” Need Evidence That Was Just Produced"
description: "Part twenty-one of the Harness skill deep-dives (verification-before-completion), closing the series. Why “all tests pass” can describe a version of the code that no longer exists, the skill's five-step gate, what explicitly does not count as evidence, and why this is the same rule as task SHA verification, evaluation evidence freshness, and Verify's stable passes — at four different scales. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "“Done — all tests pass”"
  - title: "What this skill is: a rule about claims"
  - title: "How it works: the five-step gate"
  - title: "Design 1: one rule, four scales"
  - title: "Design 2: the cost of checking falls on the claimant"
  - title: "What this skill cannot do"
  - title: "Closing: thirty-one parts, one move"
---

This is part twenty-one of the skill deep-dives, and the last one. The two earlier series — five constraint layers, five phases — covered the system's structure; this series takes apart the 21 skills that make it up, one per part: why each exists, and concretely how it is done. The overview post is [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/). The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

This skill is the last of the general-purpose group: `verification-before-completion`. The [Verify phase](/en/harness-phase-verify/) article mentioned it in passing — the Verify principle shrunk to the scale of a single task. This part gives it the full treatment, and the series ends with it. That placement is not an accident: it is the smallest rule in the whole system, small enough to govern nothing more than how one sentence gets said.

## “Done — all tests pass”

Start with a concrete scene.

A developer hands off its work. The report reads smoothly: "Task complete, all tests passing." Numbers, tone, format — everything in place.

One thing about it is wrong: the tests were indeed run, and they were indeed all green — but that was **before** the last three edits. After the test run, it changed a condition in one component and adjusted copy in two places. None of the edits was large; none of them looked capable of affecting the tests. The report quotes the earlier all-green result.

Where is the error? The report is not a lie; it is **stale**. That green run proves the code as it stood before the edits passed the tests. The code after the edits has never been verified by anything. The report's fluency and confidence are genuine — they just describe a version of the code that no longer exists.

And this kind of error is hard to catch. The report reads exactly like a proper receipt: a conclusion, with numbers. To expose it, the reader has to dig through command history and compare timestamps — all the cost sits on whoever checks. The cost of saying the sentence was zero.

This skill governs exactly that moment: before the words "it's done" are spoken, they pass through a gate.

## What this skill is: a rule about claims

`verification-before-completion` does not belong to one role; it binds all of them — developer, evaluator, planner. Whoever is about to state a conclusion is subject to it.

Its scope is wider than expected. Not just success claims like "done" or "passing" — **failure claims need evidence too**. Saying "this test fails" requires output from this run, not "it was failing last time." The skill's opening line is the whole rule in one sentence:

> A claim without fresh evidence is a guess. Evidence expires the moment the code changes.

Note the word "expires." Evidence is not a true/false problem; it is a freshness problem. It was true once, and the moment the code changes, the thing it proves is a different thing. The rule does not assume anyone is lying — nobody lied in the scene above. It assumes something else: **between a conclusion and the evidence behind it, a single code change is enough to void the conclusion automatically**, no accusation required.

The skill also names its points of application precisely: right before `task-done` and `remediate-done`, right before writing judge evidence, right before reporting to the orchestrator. Four points, all of them moments when a sentence is about to become a record.

## How it works: the five-step gate

The procedure has five steps; the skill calls it "the gate." Before any claim of success **or** failure:

1. **Name the command that proves the claim.** Order matters: command first, conclusion second. If you cannot name the command behind "the tests pass," the claim is a guess by definition.
2. **Run it in full, now — after your last edit.** "In full" is the key phrase: the entire suite, not the subset you judge relevant. "After your last edit" is the second lock; this is where quoting an old result stops working.
3. **Read the whole output and the exit code.** Running without reading is not running. The summary line, the failure count, the exit code live in the output, not in your impression of it.
4. **Check the output actually says what you are about to say.** If you are about to claim "42 tests, all passing," the output must actually read 42 passed, 0 failed — not "the command I ran usually prints that." If the output and the claim disagree, the claim changes, not the wording.
5. **Only then make the claim, quoting the numbers.**

Step five's "quoting the numbers" is where the gate lands. A proper receipt looks like this: "`npm test`: 42 passed, 0 failed, exit code 0; HEAD at `a1b2c3d`." It takes the cost of checking off the reader: the numbers are right there, and anyone who wants to re-verify can follow them back.

Different roles owe different evidence for their claims; the skill tabulates it:

| Role | Claim | Required evidence |
| --- | --- | --- |
| developer | task / fix done | the task's checks + its tests, fresh, with counts; `git rev-parse --short HEAD` |
| evaluator | API behavior verified | the real request and response, captured this run |
| evaluator | a journey works / a page looks right | a real browser run this session: Playwright spec output and `harness capture` screenshots (manifest status `pass`) |
| planner | contract complete | `harness clarify-done` / `replan-done` output |

Conversely, the skill explicitly lists what is **not evidence** — and the list says more about what it defends against than the procedure does:

- **A run from before your last edit.** Stale evidence — the protagonist of the opening scene.
- **"It should work" / "probably fine" / a reading of the source.** A conclusion reached by reading code is inference, not a run result; generated code's greatest talent is reading plausibly.
- **An API response offered as proof of what the page shows.** Evidence must be the same kind as the claim: what a page looks like can only be proven by the page's own evidence (screenshots, a browser run). A healthy API response does not entail a healthy render.
- **A capture run with status `fallback` or `fail`.** Output from a screenshot pipeline that did not itself complete cannot prove a page is fine.
- **Another agent's report of a result you did not observe.** Retelling is not evidence. If every link in a chain says "the previous link verified it," it is possible that no link ever did.

One easily missed division of labor: when a check or an evaluation fails, it is the **kernel** that appends to `failure-log.md` — not any role. No role writes a success there, and no role edits it. Custody of the failure record and the burden of proof for claims are kept in separate hands.

## Design 1: one rule, four scales

On its own, this skill looks like a work habit. Set it back into the whole system and it turns out to be the **smallest unit** of everything else — the same rule recurring at different scales:

- **Task scale (this part):** the words "it's done" require output produced after the last change.
- **Commit scale:** when a developer claims a task is done, it reports a commit SHA, and the kernel resolves it with `git rev-parse` — a SHA that does not exist is rejected on the spot. "I committed it" is also a claim, and it must point at something.
- **Evaluation scale:** an evaluator's judge conclusions must cite evidence captured fresh this round — screenshots, real request/response pairs. Old evidence does not count. The object is a whole feature; the rule is identical: the evidence must be younger than the last change.
- **Feature scale (the Verify phase):** passing evaluation is still not enough — all evidence is regenerated, a different evaluator re-judges, and the feature must pass a configured number of consecutive times. This is the same rule at its largest size: one fresh body of evidence proves "right now"; consecutive repetitions are what suppress "it was luck."

Four scales, one sentence: **a conclusion must be able to point at the check that produced it, and that check must have happened after the thing being checked stopped changing.** The layers are this logic unfolded over code structure, the phases are it unfolded over process, and the 21 skills are it unfolded over each concrete action.

## Design 2: the cost of checking falls on the claimant

Why is the rule designed as "the claimant produces the proof" rather than "the skeptic does the checking"?

Because in AI collaboration the two acts have wildly asymmetric costs. Generating the sentence "all tests pass" is nearly free — it does not even require intent: a model can carry the result of a previous run into this report with no loss of fluency. Checking a claim costs real work: find the command, re-run it, compare timestamps, read the output. **Left alone, the system's natural state is more and more claims, checked less and less** — because the cheap act always wins.

The gate moves the cost. The speaker pays first: run the command, read the output, copy the numbers into the receipt. Once paid, the claim becomes cheap to audit — a reader only has to see that the numbers and the command line up. The rest of the system leans the same way: the task packet hides the rubric from the developer so it cannot skip the cost of understanding the requirements; evaluation reports are append-only so nobody can skip the cost of facing an earlier verdict. This skill governs the smallest scale; the direction is unchanged.

One more detail: the gate does not distinguish success claims from failure claims. Why must failure be proven too? Because an unevidenced "this test fails" is just as expensive — it sends whoever picks it up to fix a bug that may not exist, or loops a feature that actually passed back into rework. Misreported failure and misreported success burn the same resource: everyone downstream's trust in the reports.

## What this skill cannot do

Boundaries, stated plainly.

First, it guarantees **that a claim has evidence produced on the spot** — not that the check behind the evidence asked the right questions. You can honestly run a suite that tests the wrong things, quote real numbers, and report a true but irrelevant conclusion. What the suite should test belongs to the acceptance-criteria step; this skill does not reach into it.

Second, it defends against staleness and secondhand reports, not against **a broken or dishonest collection step itself**. A screenshot pipeline reporting `fallback` is excluded by rule, but if a checking tool itself fabricates its numbers, this rule cannot detect it — that is what the tool's own validation, and Verify's independent re-runs, are for.

Third, it costs something. A command run and an output read before every conclusion adds up across hundreds of handoffs a day. Its trade-off is fixed in the design: the gate applies only at the four points where a conclusion is stated — not to every progress message along the way. **Conclusions are what is expensive, not talking.**

## Closing: thirty-one parts, one move

This is part 31. Five layers, five phases, 21 skills — the disassembly is complete.

Look back across the 31 parts and they are all the same move, repeated at different scales: the language layer hands "are the types right" to a compiler, judged the moment code is written; the state layer pins "where does the data live" into a table written before the code; the Evaluate phase hands "was it built right" to someone who took no part in building it, judging from fresh evidence; Verify then suppresses "was it luck" with consecutive passes. This part's skill is the same move at its smallest size — **even the two words "it's done" need output that was just produced to stand on**.

One sentence for the whole system: **replace trust with a check you can point at.** Wherever the old arrangement was "it says it's done, so it's done," the new one is "it says it's done; the evidence is in this command's output, and these are the numbers." The shape of the check varies with scale — compiler, scanner, evaluator, fresh context, repeated rounds — and what never varies is the binding between conclusion and evidence, and the requirement that the evidence be younger than the conclusion.

That is also why the word "careful" appears nowhere in this system as an instruction. Telling an AI "be careful" treats hope as a mechanism. Turn every conclusion into a gate with a cost, stamp every pass with a timestamp and numbers, and carefulness stops being an attitude — it becomes a by-product of the process.

The full arc is in the overview post, [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), and the system itself is open source at [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli). The series ends here.
