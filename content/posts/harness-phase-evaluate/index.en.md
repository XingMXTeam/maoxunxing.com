---
title: "The Evaluate Phase: The One Who Grades Can't Be the One Who Wrote It"
description: "Part three of the five-phase series (Evaluate). Why a model grading its own code always ends in full marks, why evaluation needs an evaluator in a fresh context, how the rubric's three item types are scored, why essential and pitfall vetoes can't be saved by a high total, and why a report is never edited once written — the why and the how. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "A perfect-score evaluation"
  - title: "Why the author can't grade their own work"
  - title: "Who evaluates: an evaluator in a fresh context"
  - title: "How the rubric scores: three item types"
  - title: "Vetoes: two ways to die that no total can save"
  - title: "Report discipline: never edited once written"
  - title: "After a failure: fix only the items named"
  - title: "It passed evaluation — why verify it again"
---

This is part three of the five-phase series. The overview post, [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), covered the shape of the whole system; this series takes the phases one at a time — why each exists, and concretely how it is done. The previous part was [Implement](/en/harness-phase-implement/): the developer finishes tasks one by one, each closed with a verified commit. This part covers the gate after Implement: **who decides whether the code is actually right.** The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

## A perfect-score evaluation

Start with a real failure, from this system's earliest evaluation setup.

Evaluation back then was simple: have the model read through the code it had just written and produce an evaluation. It awarded its own code 100 out of 100. A perfect score.

Then we actually ran the code: roughly thirty percent of it worked, and the end-to-end tests were wiped out completely.

The gap between 100 and thirty percent is not a gap in judgment. It is a gap in position. The context that wrote the code contains its reasons for every line — why this case is handled this way, why that edge case "should be fine." Ask that same context to review, and it does not read the code; it reads its own intentions. Intentions always look right.

## Why the author can't grade their own work

Anthropic makes the same point bluntly in their work on long-running harnesses: out of the box, Claude is a poor QA agent — it can see a real problem, talk itself into "this is not a big deal," and approve anyway.

That is not a personality flaw in any particular model. It is what the position produces. When the generator and the reviewer share one context, leniency is structural:

First, **it knows what the code "was meant to be."** Reviewing, it measures the code against its intentions instead of against the requirements. Wherever intention and code disagree, the intention silently fills the gap.

Second, **admitting an error means overturning its own fresh decision.** Every trade-off made during implementation came with a justification. Judging that trade-off wrong in review contradicts itself; going along with the original call — "acceptable" — is the path of least resistance.

Third, **it has no external anchor.** Its basis for "this function is fine" is its own understanding of the code — and the places where its understanding is wrong are exactly the places the code is wrong. Searching for a set of errors using the same understanding that produced them cannot find them; that is arithmetic, not effort.

The conclusion is a single rule: evaluation changes the person. And not by swapping in a stricter prompt — with the same context, a new prompt changes nothing. What has to change is the context itself: a completely fresh one.

## Who evaluates: an evaluator in a fresh context

The Evaluate phase is worked by the **evaluator**. It and the developer are two separate roles running in two contexts that never see each other.

The evaluator receives exactly three things:

- **rubric.json** — the scoring sheet written during Clarify, mapping every requirement to its checks;
- **the code** — the developer's final, committed state;
- **evidence it collects itself, on the spot** — the next section covers how.

It has no access to the developer's conversation. It knows nothing about the hesitations and trade-offs during implementation. Its entire knowledge of the code comes from the rubric and the evidence. That is deliberate: it does not need to understand why you wrote it this way. It only needs to judge whether what was written is right.

One more division-of-labor rule: **the evaluator may only report problems; it may never fix code on the side.** Detection and repair stay separate, and here is the full reason. The moment the evaluator touches the code, the evaluation becomes irreproducible: which version of the code does the report describe? Do the problems in the report still exist after its edits? Nobody can say. A report must correspond to one fixed, committed state of the code. Fixing belongs to the next loop back through Implement.

## How the rubric scores: three item types

The rubric's checks come in three types, each executed completely differently.

**command items: whatever a command can decide, a command decides.** Compilation, tests, grep, the five-dimension scan (`harness scan`) — each runs for real, and the exit code and output do the talking. "The project compiles" is verified by running `tsc` and checking that the exit code is 0, not by an evaluator's "looks compilable to me." Command items have no room for negotiation: exit code 1 means fail, and "close enough" does not exist.

**judge items: where judgment is genuinely needed, it may only rule on fresh evidence.** Some things no command can decide: whether the empty-state copy explains what to do next, whether the layout matches the design intent. The evaluator scores these — but the evidence must be **collected on the spot**: open the page with Playwright now and screenshot it now; probe the real endpoint with a real request now and read the response. Scoring from "I read the code, looks fine" is forbidden — that is exactly the road that led to the perfect-score evaluation. Evidence older than the previous evaluation is void on arrival: an old screenshot proves something about old code, and says nothing about the version in front of you.

**manual items: reserved for humans.** Some judgments automation should not touch — whether a feature's trade-offs fit the product intent, for example. These items are explicitly marked for a person. The system does not pretend to measure them.

Across all three types runs one evidence rule: **every check must produce evidence — which file, which line, which screenshot, which command output. No evidence, no pass.** Not a deduction — the item simply does not count as passed. The sentence "looks fine" is banned from evaluation reports by name.

## Vetoes: two ways to die that no total can save

The rubric computes a total score at the end. But in two situations, no total, however high, saves the feature.

**The first: an essential item scores 0.** Items marked essential in the rubric are the feature's load-bearing walls — "order status updates correctly after payment," say. Suppose a feature totals 92, a handsome number, but the evidence for that essential item shows: payment completed, order status still sitting at pending. That item scores 0, and the whole feature fails outright. The 92 describes the average quality of everything else; it cannot paper over the fact that the core function does not work. It is the driving test rule: a high total does not survive running a red light. Some errors do not participate in averages.

**The second: a pitfall item is triggered.** Pitfalls are a pre-written list of cheats and collapses — pasting an `@ts-ignore` over a type error to silence it, for instance. If the scan finds one, the feature fails on the spot, before scoring even starts. The logic mirrors the first veto: if "passing" a check by bypassing it could be averaged away by other items' scores, the system would be paying a bounty for cheating.

So the total's job needs stating precisely: it describes the quality gradient of a codebase **that has not been vetoed** — useful for comparison and for ordering repairs. It is not the line between life and death. The two veto rules are.

## Report discipline: never edited once written

Once an evaluation report is written, it is never edited. A re-evaluation produces a new report; the old one stays exactly as it was.

This discipline exists so a later account can be settled. When a feature breaks after shipping, pull its evaluation reports and compare:

- If an old report **already warned** about the problem and nobody acted, the failure is in routing and repair: evaluation was right, and the process dropped its finding.
- If **no report ever mentioned** the problem, the failure is in evaluation itself: the rubric has a blind spot, and the item list needs a new entry.

Without immutable reports, this account can never be settled. A record that keeps being rewritten cannot tell you whether something "was never found" or "was found and quietly deleted." Immutability is what makes a post-mortem an evidence exercise instead of an argument.

## After a failure: fix only the items named

When evaluation fails, the kernel does not send the feature back with a generic "redo it." It returns the feature to Implement together with an **open-items list**: exactly the items that failed this round — not one more.

The developer repairs them with the `fix-from-report` skill, under a strict rule: **fix only the items named.** No opportunistic refactoring, no "while I'm here" improvements outside the list. The reason is mechanical: changes outside the list were never inside this evaluation's scope, so if one of them breaks something, the next report has nothing to compare against — you cannot tell whether it was newly introduced or was always there. The boundary of the fix is the boundary of the evaluation.

One special case: the evaluator concludes that **the rubric itself is wrong** — an item does not match the real requirement. It still may not edit the rubric. It files rubric-refinement suggestions for the planner to rule on, and the direction is locked: **suggestions may only tighten, never loosen.** Loosening a standard requires a human's approval. This guards against self-leniency at the meta level: if the examining side could make the exam easier while examining, evaluation would eventually decay into another perfect-score ritual.

Finally, every loop has a budget cap: the number of evaluate–fix round trips is fixed in advance. Exhaust the budget without passing, and the kernel sets the feature to **Paused** and waits for a person to decide — whether the requirement itself is wrong, or the implementation route needs replacing. Nothing retries forever inside a dead end.

## It passed evaluation — why verify it again

Passing evaluation does not ship the feature. One pass is a limited amount of evidence: the judge items rest on evidence collected this once, the command items ran against this one version of the code. It proves that this time, everything lined up. Whether that was stability or a lucky sample is undecidable from a single pass. Only a different person, regenerating all the evidence from scratch, passing several rounds in a row, turns a pass into something stable.

That is the next phase: Verify. Evaluate solved "the grader must be an outsider"; Verify solves "once is not a pattern." The next part covers how Verify changes the person, regenerates the evidence, and how many consecutive passes it demands before letting go.
