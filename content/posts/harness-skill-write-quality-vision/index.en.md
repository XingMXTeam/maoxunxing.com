---
title: "write-quality-vision: Turning “Feels Right” into Anchors an Evaluator Can Score"
description: "Part of the Harness skill deep-dive series (write-quality-vision, third link of the clarify chain). How a page passes every functional check and still feels wrong; why vision.md admits exactly three kinds of anchor (REF/ANTI/RL); what makes a quality item scoreable, and why “smooth” and “premium” don't qualify. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "Every function works, and it still feels wrong"
  - title: "What vision.md is: a contract for “feel”"
  - title: "Three kinds of anchor: REF, ANTI, RL"
  - title: "What makes a quality item scoreable"
  - title: "Why it is written before code, by the planner"
  - title: "Requirements with no quality surface: the waiver must be written too"
  - title: "What this file cannot do"
---

This is one part of the Harness skill deep-dive series: 21 skills taken one at a time — why each exists, and concretely how it works. This one is the third link of the clarify chain, after the [Clarify phase](/en/harness-phase-clarify/) interview and the requirements list written by `write-prd`, before technical design. The series overview is [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/). The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

## Every function works, and it still feels wrong

Start with a concrete scene.

You ask an AI to build a notification list page. At acceptance you walk the requirements one by one: the list loads its data, correct; clicking an item marks it read, correct; the unread count updates live, correct; paging, filtering, sorting — all correct. Every functional check gets its tick.

Then you open the page and frown. Loading flashes a full-page white screen. When the list is empty, there is a large blank void in the middle and nothing else. The error message says just "Error". Rows are packed together, and title and timestamp are set in sizes you can't tell apart. Your verdict is two words: **feels wrong.**

Here is the problem: those two words cannot be sent back as rework. You say it feels wrong; the AI says every requirement was implemented — and you are not arguing about the same thing. It holds a requirements list, every item done. You hold an expectation that was never written down: the page should feel *put together*. That expectation lives in no file, so it does not exist inside the process. It exists only in your mood at acceptance time.

`write-quality-vision` exists to fix exactly this: **before any code is written, break "put together" into checkable sentences and pin them into a file.**

## What vision.md is: a contract for "feel"

The skill is the planner's second authoring step (after `write-prd`, before tech design), and it produces one file: `.harness/tasks/<feature>/vision.md`.

The skill file positions it in one sentence, and it is the right one: **`vision.md` is the bridge between "what the user expects it to feel like" and "what the evaluator will score."** Later, in the rubric, there is a class of items called judge items — items an evaluator scores by looking at evidence. The rule: every judge item must cite an anchor from `vision.md`; one that doesn't is rejected by the kernel. The evaluator may not score from its own taste. Every point it awards must trace back to a sentence written in this file.

The raw material is regulated too. Before writing, two things must exist: `prd.md`, and a confirmed clarification summary. Then the planner reads two sources — `quality-expectations.md` from clarification (the quality expectations captured in the interview) and the PRD's "What good looks like" section. The hardest sentence in the skill file: **everything in the vision comes from the user's answers — you do not invent taste.** The planner here is a transcriber, not a designer.

## Three kinds of anchor: REF, ANTI, RL

The core of `vision.md` is three anchor types, in a fixed syntax, one per line, parsed by the kernel:

```
REF-1: <positive reference — what is good about it, and where to see it>
ANTI-1: <anti-reference — what to avoid, and why>
RL-1: <red line — never acceptable> (check: screenshot|dom|command)
```

Each type governs a different thing:

**REF is a positive reference**: a concrete source (a product, a page, a design file) plus what is good about it. Rule 2 is strict: a link without "what is good about it" is not an anchor. An evaluator holding a bare link cannot score against it; holding "this list's line height and whitespace ratio — one row per notice, scannable without effort" — that it can compare.

**ANTI is an anti-reference**: what to avoid, and why. REF says where to go; ANTI says which ditch not to fall into — a certain kind of flashy animation, a certain density of piled-up information. Without ANTI, generation drifts toward the model's most common "looks like it tried hard" output.

**RL is a red line**: a never-acceptable outcome, and each one must declare how it is checked — `screenshot`, `dom`, or `command`. A red line checked by screenshot obliges its judge item to cite a real PNG as evidence.

The counts have a hard floor, enforced by the kernel at clarify-done: at least 1 REF, at least 1 ANTI, at least 2 RL, and every RL carries its `(check: …)`.

The rest of the file gives the anchors context. A **positioning** section: the level (MVP, polished, or production), a priority ordering (e.g. "correctness > interaction > visual > performance"), and a one-sentence tone ("a dense, calm work tool; information first"). A **design intent** section: visual direction, density, interaction model, and a key-screens table — one row per screen with the user goal, the target state, and which anchor it hangs on. Finally, the **rubric mapping**: design intent becomes L3 items, the interaction model becomes L4 items, each RL becomes a pitfall item (or an essential judge item citing it), and each REF enters the comparison in every full evaluation. The mapping is written here, so the rubric is this file's downstream — not a fresh invention.

## What makes a quality item scoreable

The anchor syntax is just format. The real bar is rule 1 and rule 3.

Rule 1: **concrete over adjectives.** The skill file's positive example is "Card gap 12–16 px, secondary text on the neutral-600 token"; the negative example is "should look nice". Why do adjectives fail? Because the scorer is not you — it is an evaluator with a completely fresh context. It was not in the clarification. It does not know what your "premium" looks like. Two evaluators can understand "premium" in opposite ways, so the same code passes this round and fails the next — the score becomes a coin flip. "12–16 px" is different: you measure it, and it is either in range or it is not.

Rule 3 governs red lines: **every red line is detectable** — visible in a screenshot, findable in the DOM, or verifiable by a command. The skill file's own pair of examples is blunt: "should feel fast" is not a red line; "no click without visible feedback within 100 ms" is. The first is a wish. The second is a fact you can check with a stopwatch and a screenshot.

So words like "smooth", "premium", and "polished" are not rejected on aesthetic grounds. They are rejected on **decidability**: written into `vision.md`, an evaluator cannot cite them — or rather, it can cite them and still not determine true from false — and they end up as noise in the evaluation phase. A quality item's entry ticket is not that it reads beautifully. It is that a stranger, holding the item and a piece of evidence, can say "done" or "not done."

The notification page from the opening, rewritten as anchors, looks roughly like this: the empty state hangs on a REF — "an empty list shows one sentence of explanation and one primary button, following this product's empty-state handling"; the white flash is an RL — "loading shows a skeleton, never a full-page blank (check: screenshot)"; "Error" is an RL — "error messages include an actionable next step; no context-free raw error strings (check: dom)". Written this way, acceptance is no longer the two words "feels wrong" — it is three numbered items, reconciled one by one.

## Why it is written before code, by the planner

The ordering and the authorship are both part of the design.

**Why before code.** A quality bar set after the code exists is no longer a bar; it is a ratification of whatever got built — the page already looks like this, and whoever writes the standard will unconsciously write it around the result. Anchors written first keep the right to say "no" at evaluation time. This is the same logic as clarify's exam-before-the-test rule: the PRD governs whether the functions are right; the vision governs whether they are good enough.

**Why the planner.** Because only the planner holds the user's actual words. It just ran the interview; `quality-expectations.md` is its own notebook. Have the implementer write it and it writes its own taste. Have the evaluator write it and the athlete is also the referee. But the planner has its own overreach to guard, and rule 4 guards it: when the user offered no references and the planner proposed directions, **only the direction the user picked in clarification may enter the file**. Proposing is allowed; deciding on the user's behalf is not.

## Requirements with no quality surface: the waiver must be written too

Not every requirement has a quality surface. For something like "rotate logs daily" — a purely internal requirement — forcing the planner to attach a visual anchor just makes it invent one.

The system does not wave such requirements through. It requires a **written waiver**: a `qualityWaivers` entry in the rubric, with the reason this requirement has no quality surface spelled out. The coverage gate enforces it: every requirement either carries a quality item hanging on an anchor, or carries a waiver with a reason.

What is the difference? A missing item is an omission — silent, and later nobody can tell whether the requirement was assessed and found not to need a quality item, or simply forgotten. A waiver is a decision — with a reason, on record, reviewable. **The system is not afraid of you saying "this one doesn't need it." It is afraid of you saying nothing.**

## What this file cannot do

Boundaries, stated plainly.

First, **it cannot amplify taste the user never expressed.** One done criterion reads: nothing in the file lacks a source in the user's answers. If the interview never touched it, it is not in `vision.md`; a shallow interview produces a shallow file. The ceiling of this file is the quality of the clarification, not the planner's imagination.

Second, **it only covers quality that can be stated.** What fits into a reference, an anti-reference, or a red line can enter the file. Some quality is real but resists being turned into a detectable sentence — a subtle wrongness in the overall feel, for instance — and the anchor system cannot carry it. That residue still needs a human eye at acceptance. `vision.md` fishes as much scoreable quality as possible out of "feel"; it does not declare feel abolished.

Third, **a feature with no UI switches anchor kinds.** Rule 5: an API-only feature keeps the positioning, red-line, and mapping sections, writes API quality anchors instead (consistent error shape, actionable messages), and states `ui-vision: N/A — <reason>`. Same principle as everywhere else in this system: "not applicable" is acceptable — written down. Left blank is not.

By this point the clarify chain has answered two questions: what to build (the PRD), and what "good" means for it (the vision). The next part is `write-tech-design`: before anyone starts, "how we intend to build it" also becomes a file that has to pass review.

[END OF FILE]