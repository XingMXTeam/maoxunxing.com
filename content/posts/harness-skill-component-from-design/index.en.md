---
title: "component-from-design: Never Transcribe a Mockup by Feel — Write the Numbers Down First"
description: "A Harness skill deep-dive (component-from-design), from the general-purpose group. Why AI implementations of a design are always 'close, but off everywhere,' why every spec value gets mapped to a token name before any code is written, why 'no raw hex or px in the new styles' is the acceptance test, and why a mockup shows one state while a component must survive all of them — the why and the how. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "Recognizably it, measurably wrong everywhere"
  - title: "What this skill is: the design system as the only source of visual values"
  - title: "How it works: copy the numbers, then write code, then reconcile"
  - title: "Decision 1: 'looks close' is not a criterion — the reconciliation is"
  - title: "Decision 2: tokens are the bridge between the mockup and the code"
  - title: "Decision 3: the mockup shows one state; the component must survive all of them"
  - title: "What this skill cannot do"
---

This is one of the skill deep-dives, from the general-purpose group — the skills not bound to a single phase, the ones you reach for in everyday work. The overview post is [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/). This article drills into one skill only: `component-from-design`, which governs the everyday act of building a component from a design spec, a mockup, or a screenshot. The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); the skill lives in the repo at `templates/skills/component-from-design/`, and every rule quoted below is from its text.

## Recognizably it, measurably wrong everywhere

Start with a concrete scene.

You hand an AI the mockup of a card component and tell it to build that. Half an hour later it delivers, and you open the page: at first glance, that's the card. The structure is right, the hierarchy is right, every piece of text sits where it belongs.

Then you start measuring. The design puts 12px between the title and the body; it wrote 10px. The card's padding is 16px in the mockup; it wrote 14px. The design has exactly one blue for primary elements; it used three — one for the heading, one for the button, one for links. To the eye they're all "blue"; a color picker says three different hex values.

Each deviation, taken alone, has a ready excuse: 2px off, nobody can see it; the color is close, users can't tell. Added together, the page and the mockup are separated by dozens of "invisible" differences. And they compound: the next component drifts a little further from this one, and three months later the product and the design system are two different things — with no single page anyone can point to as where it started.

Where was this bug born? Not in any particular line of code. In the order of operations: **it wrote the code first, and the numbers were filled in by feel as it went.** The color was the blue it "remembered," the spacing a number that "felt about right," the font size pulled from training data. Feel has no scale on it, so everything lands a little off.

## What this skill is: the design system as the only source of visual values

`component-from-design` states its premise in its opening line: generated UI drifts — the AI reaches for a hex value that looks close, a spacing that feels right, a font size from memory; **each choice is almost right, and the sum is a UI that matches nothing.** The skill exists to make the design system the only source of visual values.

Notice what it constrains: not taste, but **provenance**. It doesn't care whether your component is beautiful. It cares about one thing: can every color, spacing, and type value in the code be traced back to a token name in the design system? If it can, the implementation can be reconciled against the spec. If it can't, it's an improvisation — and even when an improvisation happens to land on the right number this time, it will land wrong on the next component.

Its scope is wider than "building a component from scratch": creating a component from a spec, mock, or screenshot; restyling an existing component to match the design system; reviewing generated UI that "looks slightly off" everywhere. Especially — the skill's own emphasis — when working in a repo that already has design tokens: drifting in a repo that has tokens is drift with no excuse.

## How it works: copy the numbers, then write code, then reconcile

The workflow is six steps, and the order is not negotiable.

**Step 1: read the token source first.** Open the project's token definitions — a variables file, a theme object, a design-token package — and list the tokens this component needs: colors, spacing steps, font sizes, radii, shadows. The output is a token shortlist. This step carries a key instruction: **if a needed value has no token, flag it now instead of inventing one mid-build.** Gaps surface at the start, not smuggled into the code.

**Step 2: map spec values to tokens.** Before writing any styles, translate every visual value in the spec into a token name, producing a mapping like "card padding 16px -> var(--spacing-4)". This step is the pivot of the whole skill: **translate first, code second.** What about values that don't map? The skill's wording: unmapped values are questions for the designer or the user, not invitations to hardcode. The correct resolution of a gap is to ask or report — not to type in the closest number and stay silent.

**Step 3: reuse before creating.** Before writing a new component, check the component library for an existing component or variant that covers the need. The output is a recorded reuse decision — reused X, or built new because Y. One anti-pattern calls this out directly: building a fresh button, card, or modal when the library already ships one, because writing it felt faster than reading the library's API. Reusing an existing component means reusing tokens and states that are already reconciled — it is more "like the design" than anything you write fresh.

**Step 4: write styles with tokens only.** Every color, spacing, and type value in the new code references a token or an existing component's API. The done criterion is executable: **search the new styles for raw hex and px values, and — apart from exceptions the system itself permits, such as 1px borders — it should return nothing.** Note the nature of this test: it isn't "does it look right," it's a search you can run. If the search finds something, the work isn't done; there's no negotiation.

**Step 5: self-check against the spec.** Compare the result with the design: render a screenshot if the tooling allows, or walk the structure element by element — order, hierarchy, states. The output is a checked list of elements and states (default, hover, disabled, empty, error), with mismatches fixed or reported. What gets compared, and how, is the next section's subject.

**Step 6: report the gaps.** List every spec value that had no token, and how each was resolved: a new token proposed, the closest token used with approval, or left as a flagged exception. The done criterion, in the skill's words: **no silent improvisations.** A gap is not frightening; a gap that was quietly filled is — because the next person to read that code will copy the improvised number as if it were an official value of the design system.

## Decision 1: "looks close" is not a criterion — the reconciliation is

Why is this skill so unforgiving about "close enough"? Its sharpest anti-pattern gives the reason: using a one-off pixel value because "16px vs the token's 15px is invisible" — **ten invisible deviations are exactly how design drift happens.**

That sentence deserves unpacking. A single deviation genuinely is invisible; that's not an illusion. But "invisible" argues for this instance's visual impact — it proves nothing about whether the practice is sound. Writing a one-off value declares "this value is decided by me, on the spot." An on-the-spot decision can't be reviewed by a second person, and it can't be updated in bulk when the design system changes: the designer revises the primary color, every token reference across the site changes with it, and the one hardcoded blue sits there, a fossil.

So the skill replaces the acceptance test wholesale. It doesn't test "does it look alike"; it tests "does it reconcile." There are two ledgers. One is static: search the new styles for raw values; nothing found, pass. The other is dynamic: compare the implementation against the spec element by element and state by state, checking items off or flagging them. In front of those two ledgers, "looks very much like it" is not evidence — it is precisely the cover drift travels under, because drift always arrives looking very much like it.

## Decision 2: tokens are the bridge between the mockup and the code

One level deeper: why tokens at all, instead of copying the mockup's numbers into the code verbatim? Copy 16px as 16px and the value matches exactly — reconciled, no?

The number matches, but what you copied is a one-time coincidence. The 16px in the mockup is not an isolated number; it's one step of the design system's spacing scale — in the designer's mind it's "spacing step four," shared by every card on the site. Writing `var(--spacing-4)` says "I used step four of the scale"; writing `16px` says "this spot happens to be 16." Today both render identically. Tomorrow the designer tightens the whole scale by one step, and the first follows automatically while the second stays put.

There's another layer: token names are the vocabulary design and engineering share. In review, "this card's padding is wrong — spacing-4, not spacing-3" is a sentence both sides understand identically. "Should be 16, not 12" is an argument about numbers, not about craft. Step 2's mapping table is, in essence, a translation made before any code exists: the mockup speaks in numbers, the code speaks in token names, and the mapping is the translation draft. Translate while coding, and the mistranslations grow straight into the code.

## Decision 3: the mockup shows one state; the component must survive all of them

The last design detail hides in the final anti-pattern: **checking only the default state** — the spec's hover, disabled, and empty states are where token discipline usually breaks first.

The reason is plain. A mockup usually depicts the default state: the frame where data is full, everything is clickable, nothing has gone wrong. Building from it, the AI has a reference for the default state and its values stay disciplined; for the hover color, the disabled grey, the empty state's illustration spacing, the mockup either doesn't show them or shows them on another page that never reached the model — and that's where improvisation starts. It starts, of course, exactly where users form their sense of whether a product feels finished: a button with no press feedback, a dead-white empty list, an error rendered as one line of undesigned red text.

So step 5's checklist names the states one by one — default, hover, disabled, empty, error — none skippable. A state the mockup doesn't draw is not a state that doesn't exist; it's a gap to flag at the start, handled the way steps 1 and 6 handle every gap: mark it, report it, either get the spec completed or derive it from tokens and record the derivation. The same master rule as everywhere in this skill: **gaps are allowed; silent improvisation is not.**

## What this skill cannot do

Boundaries, stated plainly.

First, it governs the provenance of values, not the quality of the design. If the design system's tokens are ugly, components built faithfully from them will be uniformly ugly — this skill guarantees fidelity, not taste.

Second, it depends on a token source existing and being trustworthy. If a project has no design tokens at all, or its token file is itself a sediment of historical improvisations, step 1 has nothing to stand on — that's a "build the design system first" problem, not a component problem.

Third, screenshot comparison and structured walkthroughs alike measure the difference between implementation and spec. They cannot detect the difference between the spec and real use — type that's too small on a real device, contrast that fails in sunlight. That's outside this skill's instruments.

Within the Harness division of labor, this skill guards one stretch: implementation faithful to spec. Copy that needs internationalizing, and the state and data questions beyond the component, belong to other skills — the next article covers `i18n-extract`: why the text in a UI should never be hardcoded into the component in the first place.
