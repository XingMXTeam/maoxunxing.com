---
title: "The Styling Layer: The Wrong Color Isn't on the Palette"
description: "Part two of the five-layer constraints series (the styling layer). Why AI-written pages each look fine alone but don't read as one product together; how design tokens shrink the option set until a wrong choice is impossible; and a quieter failure — an AI inventing token names that don't exist, while an undefined CSS variable fails in silence. Overview in “From ‘It Runs’ to Deliverable,” part one is “The Language Layer.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "Three pages, three blues"
  - title: "Why the second layer is the styling layer"
  - title: "Decision 1: every visual value comes from a token"
  - title: "Decision 2: a token's name must actually exist"
  - title: "Decision 3: styles must be scoped, and must render on the server"
  - title: "Decision 4: images and fonts are styling too"
  - title: "How the machine verifies this layer"
  - title: "What this layer cannot do"
---

This is part two of the five-layer constraints series. The overview post, [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), covers the whole system; part one, [The Language Layer: Code Should Be Stopped the Second It Is Written Wrong](/en/harness-layer-language/), covered compile-time constraints. This part covers styling: why values that look trivial — colors, spacing, radii, font sizes — get locked into a palette with only fixed options. The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

## Three pages, three blues

Start with a concrete scene.

You ask an AI to build a list page. The primary button is blue; it picks `#2563EB`. Looks good. Two days later you ask for a detail page, "consistent with the list page." It cannot see the earlier context — and even if it could, it would be estimating from memory — and it writes `#1D6FF2`. A few days after that, a settings page arrives with `#2B7FFF`.

Three blues. Individually, none of them is wrong. Put the three pages side by side and anyone can tell this is not one product; it is three contractors stitched together.

The same thing happens to spacing: card gaps of 14px on one page, 16px on another, 15px on a third; radii of 8 here, 10 there, 12 somewhere else. Every single difference is too small to file a bug over. Together they add up to one sentence: "this thing looks unpolished." And "unpolished" produces no error, no red squiggle, no tool notification — it exists only in the user's first impression.

## Why the second layer is the styling layer

The language layer guarantees that code is legally shaped: it compiles, it runs. It has nothing to say about whether ten pages look like one product, because that is not a shape problem.

The root cause here is specific: **an AI has no visual memory across contexts.** A human remembers "our button has always been that blue" because they wrote it last week. Every model generation is a fresh eyeball estimate. Ask for a hundred estimates and you get a hundred samples of drift. Telling it "be consistent" is useless — every time, it sincerely believes it wrote the same thing as last time.

So this layer's move is not "demand more care." It is **shrink the option set until a wrong choice is impossible**: colors, spacing, radii, shadows, and font sizes are defined in advance as one set of variables (design tokens); styling code may only draw from that set and may never invent a value on the spot. A palette with eight colors cannot produce a ninth, wrong one. This is not taste management; it turns consistency from a memory problem into a structural one.

And be clear about what this layer guarantees: **consistency, not beauty.** A token set can be consistently ugly. Whether it looks good is the fifth layer's problem — aesthetics. This layer only makes a hundred pages read as the work of one hand.

## Decision 1: every visual value comes from a token

The concrete rules live in the styling section of the stack pack (the standards file `harness init` installs into your project):

- Colors, spacing, radii, shadows, and font sizes are all distilled into tokens — CSS variables, or the UI library's theme configuration. Either source is fine; there may be only one.
- Components **may not contain raw color values** — no hex, no rgb written inline. To use a color, reference a token.
- Spacing and radii likewise: no hand-written "close enough" pixel counts.

Why so strict about raw values? Because a raw value fails in a sneaky way: `#2563EB` written inside a component renders **identically** to the brand blue in the token file. No reviewer spots it, no test fails; it slips in. Then the brand color gets adjusted globally: you change the token, the whole site updates — except this one component, still sitting on the old color, and you have no idea where it is. The scanner's verdict for this rule says it plainly: "A raw hex looks right and silently forks the palette — use a token."

In other words, the problem with a raw value is not that it is wrong. It is that it **forks**: from the moment it is written, that component has left the global styling system and started evolving on its own.

## Decision 2: a token's name must actually exist

Having shrunk the options, the AI finds a new way to fail: **inventing token names.**

It knows it should use a variable, and it roughly knows what variable names look like, so it writes `var(--color-brand-500)` or `var(--spacing-card)` — references that look entirely plausible, and that your token file has never defined. The cruelty of CSS variables is this: **referencing an undefined variable is not an error.** The browser treats the property as an empty value, and the element silently loses that piece of styling. The button has no background, the card has no padding; the page doesn't crash and doesn't throw — it just looks "somehow off," and it is miserable to debug, because the component code looks perfectly disciplined: it "used a token," by the book.

This failure is specific to AI. A human goes to the token file and confirms the name. A model's pattern is "generate a name that follows the naming convention and is probably right" — and a probably-right name, for a CSS variable, is the same as a nonexistent one.

So this layer has a dedicated check: the scan reconciles every `var(--x)` used across the project against the variables defined in the token source, and **reports any use of an undefined one**. The verdict is equally blunt: "An undefined token renders as an empty value." What this rule checks is not taste but referential truth — the same class of question as the language layer's "does this variable exist," except CSS never checks it itself, so the tooling has to.

## Decision 3: styles must be scoped, and must render on the server

Tokens govern values. Scope governs who a style can affect.

An AI writing styles likes to reach for a global selector: to make this button red, it adds a rule for `.btn` — a class the whole site shares, so three unrelated pages turn red with it. This pollution throws no errors either; its blast radius is just larger. So the rule: component styles go through CSS Modules (`*.module.css` / `*.module.scss`), with class names scoped at build time — or through the project's existing CSS-in-JS solution. Both share one precondition:

**Styles must render correctly on the server.** In Next.js's App Router, CSS-in-JS needs a registry that collects the styles and ships them with the server-rendered HTML. Skip it and the page runs naked for one frame before the styles land — users see a flash, and the layout jumps. For an AI, "works in local dev" and "works on first server render" are different claims; this one goes into the standards rather than being learned by stepping on it.

On the same line: inline styles. `style={{ color: ... }}` is the fastest thing to write and the AI's favorite, but it bypasses both gates at once — the value is raw, and reuse is zero. The rule: **inline styles are allowed only for values that can only be computed at runtime** (a width percentage derived from data, say); everything else goes through a style file. The scan counts inline styles per file and reports past a limit: "inline styles are how generated UI drifts apart."

## Decision 4: images and fonts are styling too

This section is easily mistaken for an asset concern. Every failure in it is a styling failure.

Images: they must go through `next/image`, with explicit size and `alt`. Size matters because the browser needs to know how much room the image will occupy before it loads; without it, the layout is built as if the image were zero-height, and when the image arrives everything below it gets shoved down — layout shift, the paragraph the user was reading jumps away. `Alt` deserves its own sentence: in my scan rules a missing `alt` is a standalone check, with the verdict "alt is part of the UI contract" — it is not a courtesy to search engines; it is interface completeness for screen-reader users and for when the image fails to load.

Fonts: load them through `next/font`, so the build arranges them on the server side, instead of fetching a font file from a third party at runtime and swapping it in — at the swap, the whole page re-typesets itself in a new face, which is layout shift again. Fonts and images share one logic here: **both arrive after the page has rendered, and anything that arrives late shoves the layout that was already settled.** This layer's job is to nail down their size and place at the moment the code is written.

## How the machine verifies this layer

This layer is enforced by the scan's UI dimension — four rules, all actually checked, none eyeballed:

- **`raw-hex-colors`**: counts raw hex colors outside the token files, with a per-file limit (`maxRawHexPerFile`); past it, it reports, with the "silently forks the palette" verdict attached;
- **`unknown-design-token`**: reconciles every referenced `var(--x)` against the definitions in the token source, and reports undefined ones;
- **`too-many-inline-styles`**: counts inline styles per file and reports past the limit;
- **`img-missing-alt`**: reports images with no `alt`.

Alongside them sits the standards layer: the token source, the scoping approach, and the inline-style exception are written into the standards file; the planner cites it in the tech design, and the evaluator checks against it. The language layer's three-tier logic applies here too — standards remind, scan deductions cost, and faking your way past evaluation with raw values is the evaluation layer's account to settle.

## What this layer cannot do

Boundaries, as usual, stated plainly.

This layer guarantees **consistency and non-drift**: one blue, everywhere; spacing from a single scale; every referenced name real. It does not guarantee the token set itself is beautiful — set an ugly scale and the whole site will be uniformly ugly. And it does not guarantee the page is arranged well: broken layout, muddled hierarchy, the important thing not standing out — those belong to the aesthetics layer and to evaluation.

There is one more thing it cannot do: **it cannot make the data right.** Render a page with perfect consistency, and if the numbers on it are wrong or the state is stale, the consistency makes the error look more credible. That is the next part's problem — the state layer: state defined before use, data with a single source, and why it is trickier than styling.
