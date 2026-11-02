---
title: "state-schema-first: The Facts Go in a Table Before Any Stateful Code Gets Written"
description: "A skill deep-dive (state-schema-first), from the general-purpose group. The state-layer post explained why the same fact must live in exactly one place; this one goes down into the working method itself: enumerate the facts before choosing any types, fill five columns per fact — field, type, initial value, whether it may be absent, source of truth — why the two most-skipped columns breed the bugs, and how the finished table gets diffed field by field by the scan. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "The badge says 3, the cart holds 2"
  - title: "What this skill is: an order of work"
  - title: "Step one: list the facts, don't touch types"
  - title: "Step two: five columns, filled in for every fact"
  - title: "After the shape: owner, storage, and who may change it"
  - title: "Decision 1: initial value and may-be-absent — the two columns everyone skips"
  - title: "Decision 2: even one little store gets a table"
  - title: "Decision 3: the finished table is there to be reconciled against"
  - title: "What this skill cannot do"
---

This is a post in the skill deep-dive series, covering `state-schema-first` from the general-purpose group. It has a ready-made companion: [The State Layer: The Same Fact Must Live in Exactly One Place](/en/harness-layer-state/) — that post covers the layer's rules: one home per fact, server data and client state living apart, namespaced keys for anything persisted. This post does not repeat the rules; it covers the order in which the rules get executed — what the person (or AI) doing the work writes first, what comes after, and what "finished" looks like. The overview post is [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/). The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

## The badge says 3, the cart holds 2

This scene was told in full in the state-layer post; here it gets one sentence. The header badge keeps its own counter, the cart page manages its own list, the user changes a quantity and deletes an item, and the badge hears about none of it — the badge says 3, the cart holds 2. No file is wrong; the compiler and lint both pass. What never happened is a decision about where the fact "what is in the cart" actually lives.

That post quoted this skill's opening line: **state bugs are design bugs discovered late** — two components keep their own copy of the same fact, a persisted key collides with another feature's, and nobody can say what the initial value should be. This post unpacks that line: how one skill turns those three "discovered late"s into decisions made once, on paper, before any code exists.

## What this skill is: an order of work

First, what it is. Not a library, not a framework feature — an order of operations that runs before code gets written. Its triggers are stated concretely:

- A new feature needs client state, a store, or a cache.
- Data will be persisted (localStorage, sessionStorage, IndexedDB, cookies).
- Server data and local edits must coexist — drafts, optimistic updates, offline queues.
- Debugging reveals components disagreeing about the same value.

That last one deserves a pause: the skill is not only a kickoff ritual, it is also a containment move. If two components are already arguing over the same value, the table was never written; the correct response is not to paste synchronization code over both sides, but to stop and write the table. Syncing the copies means admitting the problem and then making it permanent.

The full workflow runs seven steps, but the skeleton is two: **list the facts first, then write a schema row for each fact.** The remaining steps — assign owners, split server from client, namespace the keys, define transitions — are rules that revolve around the table. Here they are, step by step.

## Step one: list the facts, don't touch types

Step one has a single action: enumerate every piece of state the feature needs, one row per fact. The output is a fact list. **No types are chosen at this step.**

What is a "fact"? One thing the interface has to agree on everywhere. "Which items are in the cart" is a fact; the number on the badge is not another fact, it is a reading of that fact. Count "what data exists" first; worry about "what it looks like" second.

Why is the order enforced this strictly? Because without a list, state gets "discovered" while coding: writing the badge, you remember a counter; writing checkout, you remember a step indicator; writing refresh handling, you remember the draft was never persisted. Each discovery gets housed wherever is closest — one copy in a component, one in a store, one in localStorage. The badge and the cart disagree not because anyone wrote a wrong line, but because the facts were never counted in full: uncounted, nobody ever saw the whole set; never seeing the whole set, the relationship "the counter and the items are the same fact" never gets said out loud.

Listing facts is plain-language work — no technical decision is required — which is what makes it cheap: a feature usually comes to a dozen or so rows. And cheap is exactly why it goes first: of all the decisions in this workflow, the list is the one with the lowest cost of change. List it early and everything downstream gets cheaper.

## Step two: five columns, filled in for every fact

With the list complete, write the schema — a structural definition per fact. The form follows the project's idiom: a TypeScript type, a JSON schema, or a table. The one criterion: **a reviewer can read it without opening component code.**

Each fact gets five things written down: field name, type, initial value, whether it may be absent, and — the subject of the next section — its source of truth. Filled in for the cart's facts, it looks like this:

| Fact | Field | Type | Initial value | May be absent | Source of truth |
| --- | --- | --- | --- | --- | --- |
| Cart items | `items` | `CartItem[]` | `[]` | No | Server (query cache) |
| Selected coupon | `coupon` | `Coupon \| null` | `null` | Yes | Client store |
| Checkout step | `step` | `"cart" \| "pay" \| "done"` | `"cart"` | No | Client store |
| Address draft | `draftAddress` | `Address` | Empty address | No | Persisted in localStorage |

What each column is actually deciding:

- **Field name and type** decide "what it looks like." This is what most people think the whole schema is.
- **Initial value** decides "what the first frame shows" — what the interface puts on screen while the real data has not arrived yet.
- **May be absent** decides "is missing legal" — do we stop and wait for it, or treat its absence as a normal state and move on.
- **Source of truth** decides "who has the final say," and it is the next section's main character.

The initial-value and may-be-absent columns get a section of their own below (Decision 1); they are where the trouble concentrates. First, the table has three more gates to pass.

## After the shape: owner, storage, and who may change it

**Owner: the source-of-truth column gets exactly one entry per fact.** The candidates are five: server, store, URL, form state, or derived-from-X. The badge count must pick the last one: it is a derived value of the items — computed, never stored. And if filling in the table reveals a fact with two would-be owners, the rule is: **redesign it now, do not synchronize it later.** The skill is blunt about synchronization code: scatter the same fact across component state, a global store, and localStorage, then add an effect to "keep them in sync," and the sync code is itself an admission — the schema was never decided.

**The split: mark which facts are cached copies of server data and which exist only locally.** Their lives are different: a cached copy expires, gets invalidated, gets refetched; a local fact — a dialog being open, the text in a draft — the server does not have and does not need. The split must be explicit in the schema, not left for the reader to intuit. One anti-pattern gets named here: modeling server data as local state and hand-rolling refetch, staleness, and error flags — the project's data layer already does that work; the hand-rolled version is worse, and it comes with an extra copy to maintain.

**Storage: facts that persist get namespaced keys.** The shape is `{app}.{feature}.{field}` — which app, which feature, which field, written into the key itself, like `shop.checkout.draftAddress` for the address draft. If the shape may evolve, add a version segment. And writing the key list is not the end: check it against keys already in the codebase, one by one, for collisions. Bare keys like `draft` or `settings` are an explicit anti-pattern — localStorage is one flat drawer shared by the whole app; a key that doesn't collide today collides next year, and when it does, nothing throws: the reader just parses a value whose shape belongs to another feature and runs on with it.

**Transitions: for each fact, write down who may change it and when** — as actions and events, not "anywhere." This column exists for the post-mortem: when a value turns out wrong, "how did it become this value?" has to be answerable from the code. A fact anyone can change at any time is, when it breaks, a case with no suspect.

Only after these gates does code get written. And one closing rule applies while writing it: **components consume the schema; they do not extend it ad hoc.** Discover a missing fact halfway through a task and the correct move is to go back to step one, add its row, fill in the columns — not to add a field in the component and move on. A field added in place has no initial-value decision, no owner, no reconciliation; it is "discovered while coding" sneaking back in.

## Decision 1: initial value and may-be-absent — the two columns everyone skips

Of the five columns, field name and type never get skipped: skip them and the code doesn't run. The ones that get skipped are initial value and may-be-absent — because skipping them costs nothing visible. The code still gets written, still runs. What actually happens is quieter: the decision is handed to every component that reads the fact, and each of them guesses.

What are they guessing about? Whether "not here yet" and "empty" are the same thing. While the cart items are still loading, is `items` `[]` or `undefined`?

If the table says "initial value `[]`, may not be absent," the semantics are settled: it is always an array, and empty means the cart is empty. "Still loading" is not this fact's business at all — it is a different fact (a loading-status field) that should have been listed back in step one. If the column is left blank, the badge component can read `undefined` as "not loaded yet" and show a spinner, while the cart page reads it as "cart is empty" and shows an empty state. Same page: half spinning, half declaring emptiness. Nobody wrote a wrong line; the decision was simply never made, so every reader made it privately, and they didn't make it the same way.

With AI writing the code this is sharper still: a model writes as if the world is always normal — the data is always there, the fields always exist. These two columns are, in effect, two forced questions: what shows before the data arrives, and is absence a legal state? Neither question is hard to answer. The hard part is that nobody asks. The columns are the asker — and they ask once, so every component reads the same answer.

## Decision 2: even one little store gets a table

The standard objection: it's one little store, three fields — is a list and a table really necessary?

Cost first. Listing the facts and filling in five columns for a small feature takes minutes. The bugs this prevents — two copies out of sync, a persisted key colliding, initial semantics guessed three different ways — are discovered in production, where reproducing and tracing them costs hours. It is the same trade the language layer makes: swap an expensive discovery for a cheap decision.

Then the "little" part. Stores do not stay little: a toggle this month, two more fields and persistence next month, a second page reading it the month after. By then the table exists anyway — as code, scattered across the assumptions of several components, with no single copy you can pull out and look at. Writing it on paper while it is still small is the only cheap moment to do it.

And one more argument, for the next reader. Whoever picks this code up next is usually a fresh-context AI, or yourself in three months. A table that can be read without opening component code is the only fast way to check "which facts exist in this system, and where does each one live." The skill's done criteria say it plainly: the implementation matching the schema is **verified by reading both, not by memory.** Without the table, the other side of that reconciliation doesn't exist — all you can say is "should be fine."

## Decision 3: the finished table is there to be reconciled against

This table is not a document to be written and shelved; it is the reference the data dimension of `harness scan` reconciles against. The state-layer post covered the scan's three jobs; all three bite directly on the table:

First, **the field-by-field diff**: once the project provides its data spec — the table, landed as a spec — the scan compares the fields the code actually uses against it, one by one. A field in the code that the spec doesn't have, or a field in the spec the code never writes, comes out as a reported difference.

Second, **naming bare keys**: a rule literally called `storage-key-namespace` checks every storage key in the code against the `{page}.{entity}.{field}` shape; each violation is recorded and costs 5 points. The key list written in the workflow above is exactly its comparison list.

Third, **closure in both directions**: every state field the code reads or writes must have an entry in the schema; every field declared in the schema must actually be used in the code. A field extra on either side means the paper decision and the code reality have drifted apart.

That is why "components do not extend the schema ad hoc" is more than discipline: whoever bypasses the table and adds a field in code has simply scheduled that field to appear in the next scan as a difference. The table's entire value rests on one property — when the paper decision and the code disagree, the disagreement gets found. A table nobody checks is the same as no table.

## What this skill cannot do

Boundaries, stated plainly.

First, it guarantees each fact one home, one shape, one written-down initial value; it does not guarantee you **listed the right facts**. A fact omitted in step one will not surface just because the table is tidy — the table will be complete, self-consistent, and wrong. Which data a feature needs is a requirements and design question; the table can only pin the answer down, it cannot think it up for you.

Second, it is a method, and on its own it has no enforcement. What makes it hard to bypass is the surrounding machinery — standards that state it, scan deductions that price skipping it, evaluation vetoes behind that (the language-layer post laid out this three-tier logic). Method without verification is the first thing skipped when a deadline bites; this skill shares that fate with every process document ever written, and it cannot defend itself.

Third, it governs where data lives, what shape it has, and who may change it — not whether the business outcome is right. The count can have exactly one home and the total can still be computed 10% wrong; the item shape can be perfect while the checkout flow is missing a step. Those belong to the evaluation phase.

The next post covers `component-from-design`: when the design is already fixed, how a component gets built without drifting from it.
