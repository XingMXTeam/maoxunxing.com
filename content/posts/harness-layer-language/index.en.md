---
title: "The Language Layer: Code Should Be Stopped the Second It Is Written Wrong"
description: "Part one of the five-layer constraints series (the language layer). Why the first layer must be compile-time, what TypeScript strict mode actually pins down, why any and @ts-ignore are backdoors to be sealed, and why type checking belongs after every task — the why and the how. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-01
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "A bug that explodes at 2 a.m."
  - title: "Why the first layer has to be the language layer"
  - title: "Decision 1: strict mode fully on, no cherry-picking"
  - title: "Decision 2: seal the backdoors — how any and @ts-ignore are governed"
  - title: "Decision 3: type checking after every task, not in CI"
  - title: "Decision 4: the function signature is a contract for the next AI"
  - title: "How the machine verifies this layer"
  - title: "What this layer cannot do"
---

This is part one of the five-layer constraints series. The overview post, [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), covered all five layers at once, at a density that was too high; this series takes them one at a time — why each layer exists, and concretely how it is done. The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

## A bug that explodes at 2 a.m.

Start with a concrete scene.

An AI writes you a price-formatting function: it takes a price and returns a string with two decimals. Inside, it calls `price.toFixed(2)`. In the demo data the price is the number `19.9`, and everything runs fine. After launch, some backend endpoint changes the price field to the string `"19.9"` — one pair of quotes in a JSON payload. The page doesn't complain, the function doesn't complain, until a user opens that page: `toFixed` doesn't exist on a string, and the whole page goes white.

When was this bug born? Not the day the API changed its field. Earlier: **at the moment the function accepted a parameter and nobody specified what it was allowed to receive.** In JavaScript that is perfectly normal — a parameter is just a name, anything can be shoved into it, and a wrong thing explodes not when written but when run, preferably when nobody is watching.

The language layer exists to do exactly one thing about this: turn "explodes at runtime" into "explodes at writing time."

## Why the first layer has to be the language layer

The five layers are ordered language, styling, state, engineering, aesthetics. The order is not by importance; it is by **feedback speed**.

The language layer's instrument is the compiler, and it has three properties no other layer has.

First, **speed**. A type check takes seconds or milliseconds; it can run the moment a function is finished. Style checks wait for files to take shape, evaluation waits for a feature to be written, visual comparison waits for a page that opens — all slower.

Second, **precision**. A compiler error points at a file, a line, a column, and tells you what it expected and what it got. It never says "this code feels off"; it says "line 42: this position needs a number, you gave it a string."

Third, **if it fails, everything downstream is noise**. Code that does not compile makes styling and state verdicts meaningless — the code cannot run at all. So the language layer goes first not because it matters most, but because it is the precondition for the other four to mean anything.

For AI-written code this matters more, not less. A human writer keeps a mental note — "this value might be empty." A model doesn't; its default assumption is that the world is normal: fields always exist, types always line up. You cannot fix that by reminding it to be careful. You fix it by having the compiler block the road at the exact moment it writes something wrong.

## Decision 1: strict mode fully on, no cherry-picking

TypeScript's `strict` is not one switch but a bundle of seven or eight: `strictNullChecks` (null and undefined are their own types and cannot impersonate others), `noImplicitAny` (if a type can't be inferred, that's an error, not a silent any), and more.

My rule: **all of it on, nothing switched off selectively.**

Why? Because whoever cherry-picks switches off whichever flag is most "in the way" — and the one most in the way is usually the most valuable. Take `strictNullChecks`. With it off, `user.profile.name` is always legal, even when profile is null half the time. With it on, the compiler forces you to answer a question before accessing: what happens when profile is empty?

That question is exactly the one an AI skips. It writes for the happy path: the user exists, the order exists, the API response exists. In the real world, half the bugs live in "doesn't exist": not logged in, deleted, still loading, request failed. Strict mode's value is turning "did you think about the missing cases" from an experience question into a compiler interrogation, one case at a time. The interrogation is annoying. Every question in it is a future 2 a.m. incident.

## Decision 2: seal the backdoors — how any and @ts-ignore are governed

Strict mode alone is not enough, because TypeScript leaves backdoors:

- Writing `any` tells the compiler "don't look at this part."
- A forced assertion (`as SomeType`) says "it is what I say it is."
- An `@ts-ignore` above an error line mutes that error entirely.

These are dangerous for humans and fatal for AI, because of how an AI behaves: its drive is to get the task to pass. When a type error blocks the road, fixing the type properly means understanding where the data comes from and where it goes — expensive. Pasting an `@ts-ignore` on the error line costs one comment. Leave the backdoor open and it will choose the cheap path every time, righteously — after all, the code "compiles now."

In my system the governance has three tiers, deliberately not a flat ban:

Tier one, **the standards**: the stack pack (the standards file `harness init` installs into your project) states it plainly — no `any`, no `@ts-ignore`, unless a comment right there gives the reason. Note the "unless": real projects have legitimate cases, like a third-party library with missing types. Ban them absolutely and the writer switches to sneakier workarounds (a detour through `unknown` into the target type). An exception that must state its reason turns sneaking into an auditable record.

Tier two, **the scan**: the structure dimension of `harness scan` actually counts. Source is masked first — string and comment contents are blanked, so "discussing @ts-ignore in a comment" doesn't score as using it — then occurrences of `: any`, `as any`, and `@ts-ignore` / `@ts-nocheck` are counted and deducted per occurrence. Its verdict text is blunt: "Every `any` is a place the compiler was told to look away"; "Silencing the compiler is not fixing the error."

Tier three, **evaluation**: if a feature used a suppression to get a check to pass, the rubric's pitfall items trigger a veto — that is cheating, not a deduction.

One logic runs through all three tiers: **the strength of a constraint must match the payoff of bypassing it.** Standards remind, scan deductions cost, evaluation vetoes are the red line.

## Decision 3: type checking after every task, not in CI

Many teams have type checking — lying in CI. Code gets pushed, a pull request opens, the pipeline runs for five minutes, it comes back red, someone goes back and fixes it. That feedback loop is far too long.

In my workflow the order is nailed down (it lives in the stack pack, as gate items):

- **When a task is finished, `typecheck` and `lint` must pass** before the task may be recorded as done.
- **Before evaluation, `build` must pass** — because a whole class of errors (Next.js server/client boundary violations, for instance) only surfaces at build time; the type checker cannot see them.

Why this fine-grained? Because repair cost grows exponentially with distance. A type error fixed the moment it is written, while the context is still warm, costs one signature change. The same error discovered at evaluation time has a dozen tasks built on top of the wrong signature; fixing one place ripples through all of them. And there is a second, more practical point: **who fixes it determines how well it gets fixed.** Fixed immediately, the fixer (human or AI) knows why the code was written that way. Fixed several phases later, it is usually a different, fresh context that can only guess intent from the error message — and guessed fixes are where new bugs come from.

This is what "the shortest possible feedback loop" looks like in this system when it stops being a slogan: a command pinned into a task's definition of done.

## Decision 4: the function signature is a contract for the next AI

The language layer has one softer rule: **a function signature must say everything** — parameter types, return type, the possible failure modes — readable from the signature alone, without opening the implementation.

For human-written code this is the old "types are documentation" refrain. In this system it has a new reason: **the next reader of your code is another AI with a completely fresh context.** It does not have your earlier conversation. It doesn't know what this function "by convention" returns. All it can rely on is the signature and the types. If the signature promises a `User` and the function can actually return `null` for "not found," the reader will cheerfully access `.name` — and it explodes at runtime. A lying signature is worse than no signature.

Two concrete requirements follow. First, returns may not be vague: if something can fail or be absent, the type says so (return `User | null`, or a result type with an explicit error branch); the caller is never expected to "just know." Second, no dumping-ground parameter objects: a function declares the fields it needs instead of accepting one giant object that has everything — with the latter, the type system can check nothing, because on paper everything is "legal."

## How the machine verifies this layer

Rules in a document are wishes. This layer is enforced in three machine-checked places:

First, **the task gates**: the typecheck/lint/build commands above are commands the kernel actually runs when advancing state. Fail, and the workflow stays where it is, with the failure reason recorded in the state file.

Second, **the scan's measured mode**: when a project configures a compile command, `harness scan` really runs `tsc` and takes the exit code and diagnostics as evidence — which line, which error, into the report. Without a configured compile command, the scan falls back to static inference (counting `any`, counting suppressions, looking at structure) and the report states that this dimension ran on a static basis. Measured and inferred are different things; reporting them as one is lying — part seven of this series (why scores lie) is devoted to that.

Third, **evaluation's command items**: in every feature's rubric, "it compiles" is always a command check, never an evaluator's "looked fine to me."

## What this layer cannot do

Boundaries, stated plainly so nobody over-trusts it.

The language layer catches only **shape errors**: wrong type, possibly null, wrong argument. It cannot catch "the shape is perfect and the meaning is wrong" — a price computed 10% off is still a number and sails through; user B's id passed where user A's belonged is still a string. Those are caught by the layers and phases after this one: the state layer governs where data comes from and whether it's right; evaluation governs whether the feature does what it should.

So the five layers are a relay: the language layer guarantees "this code is legally shaped," and the following layers guarantee, in turn, "the data is accurate, the feature is correct, the page looks right." The next part covers the styling layer — why something as seemingly trivial as colors and spacing gets locked into a palette with only fixed options.
