---
title: "ship-checklist: Before You Say “Done,” Actually Check Every Item"
description: "Part thirteen of the skill deep-dive series (ship-checklist), the first of the delivery pair. Why a feature that passes evaluation can still die on an unconfigured environment variable, why this checklist makes no judgments and only prevents omissions, what its seven steps actually check, and why “should be fine” is banned from the delivery note — the why and the how. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "All green — until release day"
  - title: "What this skill is: a checklist that makes no judgments"
  - title: "How it works: seven steps, each with an output"
  - title: "Decision 1: why a checklist, not more intelligence"
  - title: "Decision 2: evidence expires, and verdicts may not be vague"
  - title: "What it cannot do"
---

This is part thirteen of the skill deep-dive series. The two series before it — the five-layer constraints and the five phases — described the system's structure; this series takes apart the 21 skills the system is built from, one per post: why each exists, and concretely how it works. The overview post is [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/). The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

The delivery group has two skills: `ship-checklist` and `sync-overview`. This post covers the first. In the [delivery phase](/en/harness-phase-deliver/) post it got one paragraph — a checklist worked through item by item around the gate, making no judgments, only preventing omissions. This post unfolds it: which seven things it actually checks, and why the "checklist" form — the dumbest-looking form there is — is the point.

## All green — until release day

Start with a concrete scene.

A payment feature is finished. Every task completed, typecheck green, evaluation scores it high against the rubric, a second evaluator re-verifies it in the confirmation phase. The code itself is beyond reproach.

On release day, production throws errors: every payment call fails. The cause is not in the code — the new feature reads an environment variable, `PAYMENT_API_KEY`, which the developer set in the `.env` on their own machine. The code, the tests, and the evaluation all ran on that machine, so everything was green. Nobody added the key to the production configuration, and that was in nobody's scope to check: the type checker cannot see environment variables, the rubric has no item for "this key exists in the production config," and evaluation never goes near deployment settings.

There is a whole family of these: a database migration written but never run; documentation links still pointing at a route that was renamed; a leftover `console.log` printing user data into the logs. They share one property — **none of them lives in the feature; all of them live around it.** And not one of them is "didn't know how." Every one is "forgot."

Evaluation answers the question "is this feature right?" Release day fails on a different question: "is everything that was supposed to come with it actually there?" This skill owns the second question.

## What this skill is: a checklist that makes no judgments

Its opening line:

> "Done" is a claim, and claims need evidence. Code that typechecks on your machine, in your head, is not done.

It positions itself as the final gate between "I wrote it" and "it is finished." Its stated occasions are broad: before declaring any task, feature, or fix complete; before opening or merging a pull request; after a long session, when the changes have outgrown your memory of them; when handing work to another person or agent for review.

Note the division of labor with evaluation. Evaluation is judgment: does the feature meet the contract, is the quality up to the bar — scored, with vetoes. This checklist **makes no judgments at all**. Whether the feature is any good, it does not say. It verifies one thing only: the items that need no judgment but are fatal when skipped — was each one actually checked?

So its output is not a score but a table: every item either run, read, or explicitly marked not run — with the reason. There is no third state. "Pretty sure I checked that" has no cell in this table.

## How it works: seven steps, each with an output

The workflow has seven steps, and each one ends by naming its output — after checking, you hold something in your hand, not an impression.

**Step 1: types and lint, in full.** Run the project's typecheck and lint commands in full, not only on changed files (unless the project defines that as the gate). Output: both exit clean, or the failures listed.

**Step 2: the tests that exist, actually run.** Run the test suite or the subset the project defines, and record real counts — passed, failed, skipped. The output is the numbers from **this run** — never from memory, never from a previous run. Tests executed three edits ago describe code that no longer exists.

**Step 3: build the way CI builds.** Run the production build; the output is the build result. The skill states this one explicitly: a dev-server smoke test is not a substitute if CI builds. The environment variable from the opening scene surfaces exactly here — the dev server ran fine locally, while bundling, asset handling, and environment variables are things only a real build touches.

**Step 4: read your own complete diff as a reviewer would.** Not a glance at the file list — the whole diff, line by line. You are hunting four things: stray debug output, commented-out code, unrelated changes, and accidental file modifications. The output is "found and removed," not "looked fine."

**Step 5: write the blast radius list.** Enumerate what this change can affect: shared components touched, public APIs changed, other pages or features consuming the modified code. Output: a written list where each item gets a disposition — exercised, reasoned safe, or flagged as a risk. Three choices, no blanks.

**Step 6: acceptance criteria, one by one.** Walk the original plan or request item by item and mark each met, not met, or descoped with the requester's agreement. The output requirement is blunt: **no criterion left at "probably done."**

**Step 7: an honest summary.** The delivery note states what shipped; the check results, with numbers; what was **not** verified, and why; and the known risks. The standard for this one is nicely put: a reviewer should be able to trust the summary without re-running anything to check your honesty — only to check your work. The note earns that trust by listing what was not done alongside what was.

## Decision 1: why a checklist, not more intelligence

None of these seven steps requires brilliance. Anyone capable of building the feature knows how to run a typecheck and read a diff. So why write them into a skill and work through them item by item?

Because the root cause of this class of failure is not ignorance — it is omission. The person who forgot the environment variable knows perfectly well that environment variables need configuring. They forgot at 1 a.m., at the end of a long session, with all their attention on the feature's logic. And "more intelligence" does not cure omission: no amount of judgment spontaneously reminds you of a thing nobody mentioned.

Pilots use pre-flight checklists not because they cannot fly. Quite the opposite: every item on the list is something they have done thousands of times. The checklist guards against exactly that — the one time "I've done this a thousand times" becomes a reason to skip on feel, and the one rushed moment where the order slips. For an AI executor this holds even more strongly: the model's characteristic failure is not inability, it is **confidently believing it did everything**. A checklist is indifferent to confidence. It asks: did it run, and what were the numbers?

So the form is the design: the things that must happen before "done" get moved out of the executor's memory into an external structure that does not depend on state of mind. Read alongside evaluation, the pair is complete — evaluation guards judgment, the checklist guards memory. Two failure sources, two instruments.

## Decision 2: evidence expires, and verdicts may not be vague

The skill lists four anti-patterns, and all four aim at the same target: **vagueness**.

The first: reporting "tests pass" from a run that happened before your last three edits. The skill's phrasing: **evidence expires the moment code changes.** Hence the order hard-coded into its done criteria — typecheck, lint, tests, and build all run after the final edit, with results and counts recorded. Checked-then-edited is the same as never checked.

The second: treating a green typecheck as a green build. Bundling, asset handling, and environment variables only fail in the real build — the opening scene is this anti-pattern's case study.

The third: quietly narrowing the definition of done. Skipping the slow suite "just this once," then writing the summary as if it ran. This is the worst of the four: the first two are lapses; this one disguises a lapse as completion. The checklist's whole apparatus — every item marked run or not run, not-run demands a reason — exists to leave this move nowhere to hide. You may skip, but you skip in front of the reviewer.

The fourth: burying an unverified item in prose. Write "should be fine in production" in a paragraph and the reader slides past it; nobody registers that something went unchecked. List it under "not verified" and the reviewer can weigh the risk themselves. **Naming it hands the decision back to the reader**; burying it makes the decision secretly, on everyone's behalf.

## What it cannot do

Boundaries, stated plainly.

First, **it can only check what is on the list.** If the project has no test suite, step 2 is "ran it: zero tests," and the checklist cannot conjure a suite into existence. It guarantees that the listed items were checked, not that the list contains everything worth checking. New entries come from humans adding them after new incidents; the list does not grow by itself.

Second, **it does not judge quality.** Whether the feature is good, whether the page looks right — that is the rubric and evaluation. A fully green ship-checklist means the delivery actions were complete, not that the thing delivered is excellent. Reading it as the latter is using the wrong scale on the wrong instrument.

Third, **it constrains structure, not honesty itself.** It can require a "not verified" section in the summary; it cannot stop the summary's author from hiding something in it. What it can do is raise the cost of dishonesty: every item demands numbers and dispositions, and fabricated specifics are easier to catch than vague prose.

Once delivery is done, one thing remains: the product and technical changes this feature settled need to be folded into the project's overview files, so the next feature's clarify phase starts from current fact rather than a stale map. The next post covers the delivery pair's second skill, `sync-overview`.
