---
title: "The State Layer: The Same Fact Must Live in Exactly One Place"
description: "Part three of the five-layer constraints series (the state layer). Why state bugs pass the compiler and lint unseen, why every fact is listed before its schema is written (field, type, initial value, whether it may be absent, source of truth), why server data and client state live apart, and why persisted keys must be namespaced — the why and the how. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "The badge says 3, the cart says 2"
  - title: "Why this layer asks: is the data accurate?"
  - title: "Decision 1: list the facts first, then write the schema"
  - title: "Decision 2: one fact, exactly one source of truth"
  - title: "Decision 3: server data and client state live apart"
  - title: "Decision 4: persisted keys must be namespaced"
  - title: "How the machine verifies this layer"
  - title: "What this layer cannot do"
---

This is part three of the five-layer constraints series. Part one, [the language layer](/en/harness-layer-language/), governs whether the code is legally shaped; part two, [the styling layer](/en/harness-layer-styling/), governs whether the page draws from one set of design variables; this part governs whether the data is accurate. The overview post, [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), covered all five layers at once; this series takes them one at a time. The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

## The badge says 3, the cart says 2

Start with a concrete scene.

You ask an AI to add a cart badge to the page header, showing how many items are in the cart. It writes a badge component that keeps its own count: click "add to cart" on a product page, the count goes up by one. The cart page manages its own item list — quantities change there, items get removed there. Each side looks correct on its own.

Then the user changes a quantity from 1 to 2 on the cart page. The badge never hears about it; it still shows the old number. The user removes an item; the badge doesn't hear about that either. In the end the badge says 3 and the cart says 2 — both numbers claim to describe the same fact, "what is in the cart," and they disagree.

Which line of code holds this bug? None of them. Every file type-checks, every function does what its author meant, the compiler passes, lint is clean. The bug lives **between** the files: nobody ever decided where "what is in the cart" lives. The badge kept one copy, the cart page kept another, each updated on its own schedule. Divergence was only a matter of time.

The state layer's skill, `state-schema-first`, opens with exactly this: **state bugs are design bugs discovered late** — two components keep their own copy of the same fact, a persisted key collides with another feature's, and nobody can say what the initial value should be. Writing the schema first turns those into decisions made once, on paper, instead of bugs found in production.

## Why this layer asks: is the data accurate?

The first two layers cannot see this class of problem, and it is not for lack of effort — the problem is outside their jurisdiction.

The language layer sees shapes: the count is a number, the list is an array, all legal. It has no way to know the two describe the same fact. The styling layer sees appearance: the badge's spacing and color came from tokens, all legal. It does not care whether the number inside the badge is true.

So the state layer has one question: **is it accurate** — is the data on the screen the real data?

The overview post used a water-supply analogy for this layer: a city with a single road from the water plant to every house. You never guess where the water comes from; turn on the tap and it is there, and when something is wrong you know which road to inspect. The precondition is that there is exactly one water plant. If every house digs its own well, each with a different water level, "why is my water cloudy" becomes unanswerable.

As rules, that becomes four things: every fact gets its structure written down first, one fact gets exactly one home, server data and client state live apart, and a persisted key must say whose it is.

## Decision 1: list the facts first, then write the schema

`state-schema-first` works in two steps, and the order is not negotiable.

**Step one: list the facts.** Enumerate every piece of state the feature touches, one row per fact. No types yet — first answer "what data exists at all," not "what does it look like." For the cart, the list is roughly: the items, the selected coupon, which checkout step we are on, the address draft. A writer (human or AI) normally "discovers" state while coding: the count occurs to it when it reaches the badge, the step when it reaches checkout. Listing the facts moves that discovery to before the first line of code, and does it all at once.

**Step two: write the schema.** For each fact, pin down five things:

| Fact | Field | Type | Initial value | May be absent | Source of truth |
| --- | --- | --- | --- | --- | --- |
| Cart items | `items` | `CartItem[]` | `[]` | No | Server (query cache) |
| Selected coupon | `coupon` | `Coupon \| null` | `null` | Yes | Client store |
| Checkout step | `step` | `"cart" \| "pay" \| "done"` | `"cart"` | No | Client store |
| Address draft | `draftAddress` | `Address` | empty address | No | Persisted (localStorage) |

Of the five columns, "initial value" and "may be absent" are the most skipped and the most dangerous. Before the cart has loaded, is `items` "an empty array" or "no value yet"? If the badge component treats `undefined` as "still loading" and shows a spinner, while the cart page treats it as "the cart is empty" and shows an empty state — same fact, two assumed initial meanings — the page ends up half spinning, half declaring itself empty. Nobody wrote a wrong line; the decision was simply never made. Written into the schema, it is made once, and everyone reads it from there.

The "source of truth" column is the doorway to the next decision: every row must be fillable. If you cannot fill it in, that fact has no home yet — stop, and do not write code that uses it.

## Decision 2: one fact, exactly one source of truth

Once the list exists, the rule follows: **the same fact is decided in exactly one place; everywhere else either reads it or derives from it — nobody keeps a second copy.**

The badge count is the canonical case. The count is not an independent fact; it is a derived value of the items — however many items there are, that is the count. It should never be "maintained" by anyone, only computed. Whoever stores the count as its own piece of state plants the badge-says-3-cart-says-2 landmine, because code that updates the items has no automatic reason to also update a separately stored count; keeping two copies in sync depends on every mutation entry point remembering to change both, and one day a new entry point arrives.

This rule matters especially for AI-written code. When an AI writes a new component, it cannot see — and does not care — what existing components are storing; its most natural move is to keep a local copy of whatever it needs. Human review catches this only occasionally, and at AI output volumes "occasionally" is not a control. Writing "one fact, one source" into the schema and the standards removes the choice at generation time: a new component that needs a fact first looks up where it lives, then goes and reads it. It does not set up a second home.

## Decision 3: server data and client state live apart

The "source of truth" column exposes a split: some facts live on the server, some on the client. The two kinds must not share a house. The stack pack (the standards file `harness init` installs into your project) states it concretely in its state section:

- **Server state stays on the server**, or in a query cache. User profiles, orders, cart items — the authoritative version lives server-side. The client may fetch and cache them to render, but it may not copy them into a client store and treat them as its own data: the copy starts going stale the moment it is made, and nobody owns re-syncing it. "The user logged out and the header still shows his avatar" is what an unsynced copy looks like from the outside.
- **Client state is local first.** Whether a dialog is open, what is typed into an input, which tab is selected — the server has no version of these facts and needs none. They live in the component by default, get lifted when they genuinely need sharing, and enter a global store only when they must survive across routes. Run the order backwards — everything into the global store from the start — and the store becomes a junk drawer anyone can mutate and nobody owns.
- **A store declares its state type and initial value in one place** — the schema table from decision 1, landed in code; ten components do not each define the same store's shape for themselves.

The test for which kind a fact is takes one sentence: **does the server hold an authoritative version of it?** If yes, it is server state, and the client only ever holds a cache. If no, it is client state, and it settles following the local-first ladder.

## Decision 4: persisted keys must be namespaced

One class of state goes to disk: drafts that must survive a refresh, user preferences. They are written to localStorage, and localStorage is a global, flat key-value space — **every key ever written by every feature of this app, across every version, sits in the same drawer.**

A key without a namespace is loose in that drawer. Imagine two features both using the key `draft`: one stores a half-written article (an object), the other stores a checkout form (a different set of fields). The user writes the article, saves the draft, then goes to check out. The checkout page reads `draft`, `JSON.parse` succeeds — the key is right, the JSON is legal — but the fields are all the other feature's, and the page proceeds with data that doesn't belong to it. It doesn't even crash, because the shape "looks" plausible.

So the stack pack requires persisted keys in the shape `<app>.<feature>.<field>` — which app, which feature, which field, written into the key itself. The address draft's key is `shop.checkout.draftAddress`, not `draft` and not `address`. The key is its own ownership declaration: collisions are excluded at naming time, and when data needs deleting you can tell whose you may delete and whose you must not touch.

## How the machine verifies this layer

Enforcement lives mostly in the data dimension of `harness scan`, in three concrete jobs:

First, **key namespacing**. There is a rule literally named `storage-key-namespace`: every storage key found in the code that is not in a `{page}.{entity}.{field}` shape is recorded as a violation, at 5 points each. Bare keys get named one by one in the scan report — they do not wait for a human reviewer to happen to notice.

Second, **a field-by-field diff against the data spec**. When the project provides a data spec, the scan diffs the fields the code actually uses against the spec, field by field: a field in the code that the spec doesn't have, or a spec field the code never writes, both come back as reported differences. The schema is not a document written once and shelved; it is the ledger the code is reconciled against.

Third, **state-structure closure**. Every state field the code reads or writes must have an entry in the schema, and every field the schema declares must actually be used by the code. An excess on either side means the decisions on paper and the reality in code have drifted apart — and the state layer's entire value rests on the two not drifting.

## What this layer cannot do

Boundaries, stated plainly. The state layer guarantees: every fact has one home, one shape, one written-down initial value, and what the screen reads is that one true copy — accurate, and nothing more.

It says nothing about how the code itself is organized. The facts can be unique while the code that reads and writes them is scattered across forty files importing each other at random; the schema can be perfect while a single file grows to three thousand lines nobody dares touch. Those are questions of whether the code connects and can be maintained — outside this layer's jurisdiction. The next part covers the engineering layer: who may import whom, how long a file may grow before it must split, and how those rules get wired into commits and pipelines so there is no way around them.
