---
title: "The Verify Phase: Passing Once May Just Be Luck"
description: "Part four of the five-phase series (the Verify phase). Why one evaluation pass is not proof: Verify must be run by a different fresh evaluator context, all judge-item evidence is regenerated from scratch with stale evidence scoring zero automatically, and the feature must pass a configured number of consecutive times — the mechanical differences from Evaluate, and why each one exists. Overview in “From ‘It Runs’ to Deliverable”; previous part: the Evaluate phase."
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "It passed — and yet it didn't"
  - title: "Why evaluate twice"
  - title: "Difference one: a different, fresh evaluator"
  - title: "Difference two: all evidence regenerated, stale evidence scores zero"
  - title: "Difference three: consecutive stable passes, not one pass"
  - title: "The same principle at the scale of a single task"
  - title: "What this phase cannot do"
---

This is part four of the five-phase series. The overview post, [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), covers the whole system; the previous part, [the Evaluate phase](/en/harness-phase-evaluate/), covered how evaluation works — deterministic items run as commands, judgment items scored by an evaluator from evidence. This part covers Verify: evaluation already said "pass," so why isn't that the end — why judge it again, with a different judge? The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

## It passed — and yet it didn't

Start with a concrete scene.

A feature passed its evaluation. One of the judgment items: when the data is empty, the page must show an empty-state message. The evaluator scored it from a screenshot — the empty state was right there in the picture, so it marked a pass.

The problem: that screenshot had been taken during an earlier run. Afterwards the developer had changed the component — the condition that decides the empty state moved. In the changed code, a genuinely empty page shows a loading spinner that spins forever and never reaches the empty state. But the old screenshot was still sitting in the evidence folder, its picture unchanged, and the evaluator ticked the box against it.

Nobody cheated. No step was deliberate: the screenshot was real, only expired; the evaluator looked carefully, only at evidence that happened to still match. **This pass was genuine, and it was luck** — change the data, the timing, or how leniently the evaluator reads that item, and it could just as well have failed. And nothing in the word "pass" tells you which kind of pass it was.

## Why evaluate twice

The Evaluate phase answers one question: "Right now, by this evaluator, looking at this evidence — does it pass?"

That question has a hidden defect. A judgment item is scored by *reading and deciding*, and reading has leniency variance. The same item — "does the copy explain what to do next?" — can be waved through in one context state and flagged in another. Add evidence that may be stale, or may coincidentally match (the test account happened to have no data, so the empty state "looked" right), and **a single pass mixes three things together: the feature is correct, the evidence is correct, and this particular judgment was correct.** If any one of the three held by luck, the verdict still reads "pass."

Think of a student who scores high on one mock exam. You cannot conclude they learned the material — three answers may have been guesses. Give them a different paper, on another day, graded by another teacher, and a second high score is when "they learned it" starts to be credible.

Verify is the second exam. It is not Evaluate run again — an identical re-run would copy the same leniency and the same stale evidence, and the luck along with it. It differs from Evaluate in three mechanical ways, and each one targets a specific kind of luck.

## Difference one: a different, fresh evaluator

Verify's evaluator must be a fresh context, and **it must not be the context that produced the Evaluate verdict.** That is a hard requirement, not a preference.

Why? The first evaluator has already participated in this feature: it watched the developer's fixes land, it knows why each item was changed, and its scoring is anchored by its own earlier judgment — a human grading a paper twice tends to agree with their first grading, and a model does too. Worse, it is lenient toward *intent*: knowing what the code was trying to do, it rounds ambiguous readings in the author's favor.

The fresh evaluator knows none of that. It receives the rubric and this round's newly generated evidence, like a second inspector who never signed the first report: what the first report said does not enter its judgment. Only what it waves through counts as independently confirmed.

## Difference two: all evidence regenerated, stale evidence scores zero

When Verify starts, the evidence for every judgment item is **regenerated from scratch**: screenshots retaken, probes re-run. Nothing left over from the Evaluate phase may be reused.

And this does not rest on anyone's diligence. Evidence files carry timestamps: **any evidence older than the previous evaluation scores 0, automatically.** Nobody has to accuse it of being stale; the system rules on the timestamp.

Why go this far? Because stale evidence is the cheapest source of a false pass, and it is silent. Evidence sits in a folder; if a new round forgets to regenerate it, the round reads last run's files, the pipeline flows on without a hiccup, and the scores look great — that is exactly how the opening scene happened. Making "old" a mechanical fact judged by timestamps deletes this whole class of luck from the process: evidence is either from this round, or it is a zero. There is no middle state.

## Difference three: consecutive stable passes, not one pass

The last difference: the feature must achieve a configured number of **consecutive stable passes** before Verify is complete. Any failure in between resets the count to zero and routes the feature back through Evaluate and Implement, like any other failure.

The word "consecutive" does the work. If a judgment item has a real chance of being waved through leniently on any given read, one pass proves little; three passes in a row — by independent evaluators, each looking at freshly generated evidence — multiply the "it was luck every time" probability down.

Consecutive counting also catches a different animal: flakiness. An item that passes, then fails, then passes again would slip through under "best score wins" or "average the attempts." Under a resetting counter it counts as not done — and that oscillation is itself information: something in the implementation, or in the item, is unstable, and the right response is to fix it, not to hope for the next pass.

Command items (compilation, tests — the exit code decides) are deterministic, so re-running them in Verify is a cheap formality. The three mechanical differences concentrate their force on the judgment items, because variance lives only there.

## The same principle at the scale of a single task

Shrink Verify's principle down to one task and you get what the `verification-before-completion` skill governs: **before claiming "done," produce verification evidence generated in the current context.**

"I fixed it." "The tests should pass." "It ran fine a while ago." Those are claims, not evidence. The skill's requirement is concrete: a completion claim must come with a command actually run in this round and its actual output. Citing a previous run, or "the code looks right," does not count.

It is the same sentence at two sizes: a feature may not treat one pass as proof, and a task may not treat "should be fine" as a receipt. **"It works" is a claim, and a claim needs a receipt produced on the spot.**

## What this phase cannot do

Boundaries, stated plainly.

First, Verify raises the cost of getting through by luck; it does not make judgment infallible. Two independent evaluators are still the same class of model reading the same rubric, and they can share a **blind spot**: a button whose colors are ugly but violate no written rule gets waved through by both. That is precisely why the aesthetics layer still keeps half of its judgment as human review — independence removes individual leniency, not collective blindness.

Second, every extra pass costs real time and tokens. So the number of consecutive passes is a configuration item — a trade of cost for confidence, not a number where bigger means better. Core features on the critical path can be configured for more passes; a peripheral feature needs one. The count belongs in config, not in anyone's beliefs.

Only after Verify completes does a feature qualify for the final phase: Done — where the kernel, not the people who did the work, sets the state after the delivery gate passes. The next part covers the Done phase.
