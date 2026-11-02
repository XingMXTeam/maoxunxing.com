---
title: "Deterministic Evaluation: The Same Code Must Earn the Same Score Twice"
description: "A Harness skill deep-dive: deterministic-eval, the evaluator's working discipline in the evaluation phase. The same feature, code untouched, scores 88 on Monday and 71 on Tuesday — what broke is not the code but the evaluation, which is itself a random variable. How this skill replaces judgement with measurement: fix the checklist first, run don't read, cite evidence for every pass, mark what can't run as not-verified, and report only, never fix on the side. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "88 on Monday, 71 on Tuesday"
  - title: "What this skill replaces"
  - title: "Step one: fix the checklist first"
  - title: "Run it, don't read it"
  - title: "What can't run is “not verified”"
  - title: "Report only — no fixing on the side"
  - title: "Why reproducibility is the whole point"
  - title: "Its limits"
---

This is a skill deep-dive in the Harness series; the skill under the knife is `deterministic-eval`. It serves as the evaluator's working discipline in the [evaluation phase](/en/harness-phase-evaluate/): wherever a check's answer can be computed, it may not be reached by "looking." The overview post, [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), covered the whole system's shape; this series takes the skills one at a time — why each exists, and concretely how it is done. The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

## 88 on Monday, 71 on Tuesday

Start with a concrete scene.

The same feature, not one line of code changed. On Monday you have an AI evaluate it: 88 points, with a well-argued verdict — structure is clean, edge cases handled, only a few small issues left. On Tuesday a fresh context evaluates it again: 71 points. This time it fixates on an entirely different set of spots: inconsistent naming, an unhandled error branch, thin test coverage.

Neither evaluation lied. Every individual comment holds up. But you can make no decision with these two numbers. The 17 points between 88 and 71 are not a difference in the code; they are a difference in where the model's attention happened to land each time. **The ruler is measuring the state of the evaluator, not the state of the code.**

A ruler that gives a different reading every time measures nothing, no matter how many decimal places the reading carries. A score that cannot be reproduced is not a measurement; it is a horoscope — it looks like a number and behaves like chance.

`deterministic-eval` exists to eliminate exactly this kind of evaluation.

## What this skill replaces

The skill's opening line:

> An AI reviewer grading AI output is biased toward approval: it sees a real problem, talks itself into "that's probably fine", and passes the work.

The evaluation-phase article covered the positional problem: the author cannot grade their own work, so evaluation moves to an evaluator with a completely fresh context. But changing the person solves only half of it. The new evaluator is still a model, and the act of "read the code, form a judgement" is itself soft: this time it notices spot A, next time spot B; this time a trade-off reads as acceptable, next time it doesn't.

What this skill replaces is not the person but **the way conclusions are reached**: judgement is replaced with measurement. In its own words, every check is a command or a script with a binary outcome and a file:line citation.

It is used in four situations: before accepting AI-generated code into a branch or PR; after a generate/fix loop, to decide whether the loop is actually done; when a review comment would otherwise be "looks good to me"; and when setting up acceptance criteria for a new project or feature. What the four share: the conclusion feeds a decision — merge or not, stop or not, pass or not. A conclusion that feeds a decision must first be rerunnable.

## Step one: fix the checklist first

The first step of the workflow is not running checks. It is **writing the checklist down before looking at any results**.

The list holds items like these: typecheck passes, lint passes; banned patterns absent — `any`, type errors suppressed with `@ts-ignore`; required patterns present — every storage key namespaced, every user-visible string externalized. Each item must name the exact command or query. "Check whether there are any lazy shortcuts in there" is not an admissible item.

Neither the order nor the granularity is ceremony. Each has its reason.

Writing it first keeps the standard from moving with the results. Fix the checks after seeing the code, and whoever fixes them — human or model — will unconsciously set the bar where the code happens to clear it: the exam written after the test is always passed (that disease got its own article, [on acceptance criteria](/en/harness-skill-write-acceptance-criteria/)). A checklist written before the code is seen has had no chance to make allowances for it.

Writing it down to the command level makes each check rerunnable verbatim. A `grep` command, a `tsc` command: run it today or tomorrow, in this context or another, and it asks the same question. "Take a look at the types" is a fresh act of interpretation on every run — that is exactly where the randomness leaks in.

## Run it, don't read it

With the list fixed, step two is execution: **run, don't read.**

Execute each check and take the hard outputs: compiler and linter exit codes; `grep`/AST queries for whether a pattern is present or absent; the test suite's real pass/fail counts. The output is raw results, not impressions.

The evidence discipline is the same one from the evaluation phase, applied at the granularity of a single check: every check marked "passed" records where its evidence lives — the file:line of the match, the command and its exit code. **No check is marked passed without a citation.** The citation is more than bookkeeping: it lets any third party rerun the same command at the same place and reconcile the result on the spot.

This step also names a specific fraud: reporting "tests pass" for a run that only collected the tests without executing them, used cached results, or silently skipped the failing suite. All three produce a green conclusion over an unmeasured reality. So the words "tests pass" must point back to one real run's counts — how many ran, how many passed, how many failed.

Why distrust "reading" so much? One of the skill's anti-patterns puts it bluntly: reading the diff and writing "LGTM" because the code style looks plausible — **plausibility is exactly what generated code is best at.** Reading gets you plausibility. Running gets you facts.

## What can't run is “not verified”

Not every check can run in every environment. Some need a browser, some need credentials, some need a real service stood up. A checklist will always have a few items that can't execute here and now.

The skill's rule for that case: mark it **"not verified"** — never passed, and never silently dropped from the list. The run ends with an explicit not-covered list, so what went unmeasured sits in plain sight.

This rule matters for reproducibility too. For scores to be comparable, two evaluations must cover the **same surface**: a 20-item checklist on Monday and a 17-item one on Tuesday can manufacture a score difference all by themselves, from the three vanished items, and nobody will see where it came from. With "not verified," every check stays on the books forever, in one of three fixed states — pass, fail, not-verified. The score then describes "how the measured part did," and the unmeasured part is listed separately instead of posing as foundation underneath the score.

## Report only — no fixing on the side

The reporting discipline has three rules, each more counterintuitive than the last.

**Report only.** Produce the report and stop. Do not edit the code you just evaluated, even for a "one-line obvious fix." The reason was laid out in the evaluation-phase article: the report must describe the code as it was when checked. Fix while you measure, and the final score belongs to no version of the code that ever existed.

**No softening failures.** With a deadline near, reclassifying a failed check as a "warning" is banned. In the skill's words: if a check is wrong, change the checklist openly — don't bend results. Changing the checklist is an above-board version change; every later evaluation runs against the new list. Reclassifying is a private deal: this one score benefits, and the price is that no two scores are comparable ever again.

**Route the failures back, in order.** When the report is done, hand each failure to whoever owns fixing — the generator, a human — with the failing evidence attached, listed in dependency order: compile errors before style issues. Foundation before walls; reverse the order and the wall-fixers do their work on a collapsing foundation.

The skill's done criteria are those four things on paper: a report exists listing every check as pass, fail, or not-verified; every pass cites file:line or a command exit code; the evaluated code was not modified during evaluation; failed checks are listed in fix order with their evidence attached.

## Why reproducibility is the whole point

Strip the rules down and one word carries all of them: reproducibility. It earns this much machinery because everything a score is used for stands on it.

**Attribution.** An evaluation says 71; a fix round happens; the next evaluation says 88. If the evaluation itself cannot be reproduced, you cannot know whether those 17 points are the code improving or the evaluator simply not noticing the old problems this time. If score movement can't be attributed, the score can't tell you whether a fix round worked — and the generate/fix loop has no trustworthy stopping condition.

**Comparison.** With the checklist fixed, the commands fixed, and the three-state accounting fixed, only one variable remains between two evaluations: the code itself. Only then does comparing across features work — feature A at 92, feature B at 85, fix B first — and comparing across time work: 78 before the refactor, 90 after, so the refactor actually improved something. Subtracting one irreproducible score from another yields noise.

**Reconciliation.** Every pass carries its command and citation, which means conclusions can be re-checked by a third party instead of resting on the evaluator's say-so. It is the same idea as verifying commit claims in the implement phase: **a claim is an assertion; evidence is a fact.**

One honest problem remains: not everything can be computed. Whether an empty state's copy tells the user what to do next, whether a layout matches the design intent — there is no exit code for these. This skill's stance is not to pretend they don't exist but to **quarantine** them: in this system they live in the rubric's judge items, which may only score against anchors cited from the quality vision (`REF-n`), with the evidence format pinned down — screenshots captured on the spot, verdict files at fixed paths. Taste cannot be compiled, so anchors and evidence formats shrink its range of motion to the minimum; outside the fence, everything that can be computed is computed.

## Its limits

Boundaries, stated plainly.

First, it guarantees only that the same checklist gives the same answer. It does not guarantee **the checklist asks the right questions**. If an entire class of problem never made it onto the list — nobody wrote "error responses have a consistent shape" as a check — the evaluation will miss it stably and precisely, run after run. Determinism amplifies the quality of the checklist; a wrong checklist gets a very stable wrong answer. Asking the right questions is the acceptance-criteria step's job, not this one's.

Second, it does not replace judge items, or the manual items reserved for humans. Whether a product trade-off is right, whether the copy is good — some of that judgment is irreducibly human. What this skill can do is strip away everything a machine can answer, so human judgment is spent only where judgment is actually needed — not on "is there an `any` in this file," a question a command should have answered.

Run under this skill, an evaluation produces an evidence-backed list of failures. What happens next — fix only the named items, rerun the identical checklist, and let the score move only when the code did — is the next article's subject: `fix-from-report`.
