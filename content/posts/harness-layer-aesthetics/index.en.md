---
title: "The Aesthetics Layer: The Feature Works, and the Page Is Still Wrong"
description: "Part five of the five-layer constraints series (the aesthetics layer), closing the five layers. Why a page can be wrong with every feature right; how visual regression actually runs (screenshots, baselines, pixel diffs); what each of the three UI deduction rules polices; why “what good looks like” must be written as anchors first; and the half that must be admitted — automation only measures half of it. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "A page with no errors anywhere"
  - title: "Why only the frontend has this layer"
  - title: "How the machine checks: baselines are not decoration"
  - title: "Three deduction rules, three different failure kinds"
  - title: "No anchors, no judgment"
  - title: "It only measures half"
  - title: "The five layers end here"
---

This is part five of the five-layer constraints series, and the last layer. The first four parts covered the [language layer](/en/harness-layer-language/), the styling layer, the state layer, and the engineering layer; the overview is [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/). The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

## A page with no errors anywhere

Start with a concrete scene.

An AI rewrites a notification list page to spec. Type check passes, lint passes, the end-to-end tests are all green, and every row of data is present. You open the page: the rows are crammed together, read and unread items look identical, the title and the timestamp are nearly the same size, and there is an unexplained slab of empty space at the bottom of the list.

Nothing errors anywhere. You cannot point at a line of code that is "wrong" either — the spacing is a `margin: 6px` it improvised, the font weight a default it settled for. The feature is entirely right, and the page is wrong.

The first four layers all govern things that can be judged right or wrong: types correct or not, tokens used or not, data accurate or not, structure compliant or not. This layer governs the part that cannot be judged that way: **whether the page looks like what it is supposed to look like.**

## Why only the frontend has this layer

The general harness literature rarely discusses aesthetics, for a simple reason: in most tasks, correctness is binary. Code runs or it doesn't, an answer is right or it isn't; there is no "seventy percent similar" state, so the constraint layers need no room for "looks like it or not."

The frontend has that state. In image-to-code benchmarks such as Omni-I2C, the strongest current models reach seventy-some percent on visual fidelity, only about forty percent on parameter-level precision, and entity and layout errors account for more than sixty percent of all errors. In other words, the mistakes models make most often are not in what the page does but in what it looks like: an element too many or too few, a position shifted, spacing off.

So one of the five layers is reserved for exactly this. A feature can work and the page can still be wrong — and whether people use the product depends largely on the page being right. This layer is not decoration; it is where the frontend parts ways with other domains.

## How the machine checks: baselines are not decoration

To make "looks like it" checkable, the first step is fixing what "it" is. My approach lives in the stack pack's visual regression section, and it is deliberately unglamorous:

The core routes are listed in the feature's `pages.json`; `harness capture` screenshots them one by one against a running build; `harness visual` then diffs the new screenshots against the baselines stored in `.harness/baselines/`, pixel by pixel (using pixelmatch).

Two design decisions in this deserve calling out.

**Having no baseline is recorded as `no-baseline`, explicitly not a pass.** Many visual regression tools silently adopt the first run's screenshots as the baseline, so the first run always "passes" — even when the page is wrong, the wrong look becomes the standard. Here it is the other way around: no baseline is no baseline. The state goes into the report where everyone can see it; it does not get to dress up as green.

**Adopting a baseline is an explicit, reviewed act.** When a page is fixed, the new screenshot necessarily differs from the old baseline. At that point the move is not clicking "accept new baseline" — it is a human looking at the difference, confirming "yes, this is what it should look like," and only then storing the new image as the baseline. A baseline is an approved standard, not the previous screenshot. Without this step, visual regression decays into "same as last time is fine" — and if last time was wrong, it stays wrong forever.

## Three deduction rules, three different failure kinds

In the scan's UI dimension, three rules relate directly to visuals, at 8 points each, and each polices a different kind of failure:

**`visual-diff`: the pixel difference ratio exceeds the allowed maximum (maxDiffRatio).** This is everyday drift detection: somewhere along the edits, the page quietly changed its look. The report does not just say "different"; it lays out the fork — either the change was intended, in which case it gets reviewed and the baseline is re-adopted, or the UI drifted, in which case the code gets fixed. A vague "slightly different" is not allowed to exist.

**`visual-size-mismatch`: the screenshot's dimensions no longer match the baseline.** This one is listed separately because a size change is not styling drift, it is a structural break: a column added, a block missing, a breakpoint landing wrong. It is handled completely differently from `visual-diff` — drift means adjusting styles, a structural break means going back to the layout — so the two must be reported separately, or real breaks drown in pixel noise.

**`blank-screenshot-evidence`: the screenshot file is too small to be a screenshot.** Evaluation requires screenshots filed as evidence. But if the page never rendered at all — white screen, build not up — the capture is a near-blank image with an abnormally small file size. This rule recognizes it by size and rejects "a blank page filed as evidence" outright. Even the evidence gets policed — because the moment evidence can be faked, every check upstream of it can be fooled by one fake image.

## No anchors, no judgment

A pixel diff can only answer "how far from the baseline." It cannot answer "is the baseline itself right." When the first baseline is created, on what grounds is that look declared correct?

On anchors. During Clarify, `prd.md` has a section called "what good looks like," and `vision.md` holds the fuller version. They are not allowed to say "clean and modern"; they must be written in measurable terms. For the notification list, the anchor reads like this:

> One notice per row, newest first; unread rows have a bold title and a dot; 12–16 px between rows; an empty list shows one sentence and a "Refresh" button.

With anchors like these, judgment becomes possible: a human reviewer checks against them item by item, and so does an evaluator agent when it scores. Without anchors, "does it look good" is everybody's opinion — a judge (human or AI) scoring "clean and modern" is scoring its own imagination, not your requirements.

So this layer's order is inverted: **write "right" down in words first, then measure the deviation in pixels.** The anchor is the standard, the screenshot is the evidence, the baseline is the approved portrait of the standard. Remove any one of the three and the visual check either cannot start, or starts and means nothing.

## It only measures half

This layer's boundary has to be stated as plainly as possible, because it is the easiest one to exaggerate.

Automation can check: whether tokens are used, whether scoping is correct, how far a screenshot sits from the baseline in pixels. It cannot check: whether the color pairing is harmonious, whether the spacing has rhythm, whether the type hierarchy is clear. Those judgments are only about half covered by automation today; the other half takes a human reviewing screenshots, or a separate judge whose score is deliberately calibrated toward suspicion — because a reviewer is naturally lenient toward the thing it reviews, a failure mode the evaluation phase gets its own article later in this series.

So the aesthetics layer has an awkward double identity: it is the most frontend-specific of the five layers, and also the weakest. The first four layers hand you deterministic verdicts; at this layer, half the verdict is "the machine reports a pixel distance, the rest is yours to look at." Admitting it is weak matters more than pretending it is solved — a green "visual check passed" badge backed by nothing but one pixel diff fools not just your users, but you.

## The five layers end here

That closes the five layers. The relay, in retrospect: the language layer guarantees the code is legally shaped, the styling layer guarantees visual values stay on the palette, the state layer guarantees the data is accurate, the engineering layer guarantees structure and process stay compliant, and the aesthetics layer guarantees the page does not drift far from its approved look. Each layer guarantees exactly one thing, and a machine checks each one — except the other half of the aesthetics layer, which is honestly left to humans.

But the five layers only govern where code may go. They say nothing about how a feature travels from one sentence to delivered. That is the phases' job. The next block of this series covers the five phases, starting with Clarify: why "done" must be written down as a countable checklist before the first line of code exists.
