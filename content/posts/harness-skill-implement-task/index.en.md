---
title: "implement-task: One Task, from a Failing Test to a Real Commit"
description: "A skill deep-dive (implement-task), the first of the implementation group. Why executing a task starts with a test that fails, why the declared scope is a permission rather than a suggestion, why drive-by refactors are a violation, and why an impossible task must stop and report instead of improvising — the why and the how. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "Sent to fix a bug, it refactored half the project on the way"
  - title: "What this skill is: exactly one task at a time"
  - title: "Before starting: read the contract, not the exam"
  - title: "How it works: red, green, refactor, commit, record"
  - title: "Decision 1: scope is a permission, not a suggestion"
  - title: "Decision 2: why “while I'm here” is banned"
  - title: "Decision 3: if it can't be done, stop and report — no improvising"
  - title: "What this skill cannot do"
---

This is a post in the skill deep-dive series. The six skills of the clarify chain — the group that turns a one-line request into a contract — were covered earlier; this post starts the implementation group: the phase where code actually gets written after the contract is signed. The overview post is [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), and the Implement phase as a whole is covered in [The Implement Phase](/en/harness-phase-implement/). This post drills into a single skill: `implement-task`, the developer role's core skill. The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

## Sent to fix a bug, it refactored half the project on the way

Start with a concrete scene.

The task is stated plainly: the order list computes the wrong total when a coupon is applied — fix it. The AI takes the task and gets to work. It opens the order component, decides the date utility is a mess, and rewrites it. Passing the list page, it figures a "recently viewed" widget would round things out, and adds one. The shared table component's API annoys it, so that changes too. Two hours later it delivers: six files, four-hundred-plus lines of diff, and the coupon bug is indeed fixed in the main flow — except one coupon combination still computes wrong.

It wasn't lazy; if anything, it was over-diligent. Every individual change is defensible on its own. The problem: **the task's boundary was treated as a suggestion.** Of those four hundred lines, which ones are the bug fix? Nobody can say. Evaluation reports "the coupon edge case fails," and whoever fixes it has to fish through a refactor, a feature addition, and a fix, all tangled together. And the date-utility rewrite has no requirement behind it, no test contract, no acceptance — it rode into the codebase inside a commit that was supposed to be a few dozen lines.

`implement-task` exists to turn "boundary" from a reminder into a sequence of machine-backed actions: one task, starting from a failing test, ending with a single commit containing only that task — no drifting in between.

## What this skill is: exactly one task at a time

When the Clarify phase ends, the plan is already decomposed: `tasks.json` lists the tasks one by one, each stating the files it may touch, its contract (what "done" looks like), and its checks. When `harness next` returns `implement-task`, this skill fires — executed by the developer role, **exactly one of those tasks at a time**.

Its self-definition, the skill's own first sentence, is the whole workflow compressed: "One task, start to finish: failing test, code, passing test, commit, record. The kernel accepts the task only with passing checks and a commit SHA that exists."

Note the "exactly one." This is not an efficiency fetish. A task is the smallest unit of account in this system: one task maps to a set of requirement ids, one commit, one round of checks. Enlarge the grain — three tasks in one pass, five changes in one commit — and every downstream step (evaluation pinpointing a failure, rolling back, remediating) loses its coordinates. The skill's first principle follows: **the task's boundary is the work's boundary; crossing it is not diligence, it's an incident.**

## Before starting: read the contract, not the exam

Before touching code, it mandates reading five things, no skipping:

1. The task packet from `harness packet <feature>`: task id, title, the requirements it serves.
2. The task itself in `plan.md` / `tasks.json`: files, contract, checks.
3. `tech-design.md`: the stack and the boundaries — as we'll see, this file doubles as a whitelist.
4. `.harness/standards.md`: the project standards.
5. `vision.md`: the target state of the screens this task touches, and every red line (RL-n). The skill's wording is to "code against the red lines on purpose" — write while actively thinking about what must not happen, rather than letting evaluation catch it later.

One file it explicitly does **not** read: `rubric.json`, the scoring sheet. The phase post gives the full argument: the developer builds to the plan and the vision, not to the test; an implementer who has seen the measuring instrument will quietly retarget from "make the requirements right" to "make the checks pass."

The reading order is itself a design: first what the task demands (the contract), then where the fences are (design and standards), then what the screens should look like and what must never happen (vision and red lines). Everything except how it will be graded.

## How it works: red, green, refactor, commit, record

Eight steps, each with a checkable output:

**Step 1: write a failing test.** Not just any test — the test the task's contract implies. Run it, and **watch it fail for the right reason**. The output of this step is the failing output itself. Why can't the order be reversed? The anti-pattern list says it plainly: code first, then a test that merely restates the code. That kind of test is a mirror — it reflects whatever the code does and can never go red. Letting the test fail once, first, is how you prove it actually tests something: when the feature is absent, it fails.

**Step 2: minimal code.** Make that test pass "and nothing more." Minimal is not corner-cutting; it is discipline. Every extra line sits outside the contract, with no test guarding it and no requirement waiting for it.

**Step 3: green.** Run the test plus the task's own `checks`. All pass — on **fresh output**. The anti-patterns call this out explicitly: claiming completion from a test run that predates your last edit is banned. Evidence must be younger than the code; otherwise you've proven the previous version was fine.

**Step 4: refactor.** Tidy up without changing behavior, then re-run. Refactoring sits between "green" and "commit" precisely because the tests are now a safety net: break something and you know immediately.

**Step 5: states.** If the task renders data, the loading, empty, error, and no-permission states must all exist and be tested. This is the same judgment as in the language-layer post: an AI writes the happy path by default, while half of real-world bugs live in "doesn't exist." This step nails the four "doesn't exist" cases into the task's definition of done instead of leaving them as post-launch patches.

**Step 6: commit precisely.** The skill spells the commands out:

```bash
git status --short
git add <exact paths of this task>
git commit -m "feat(<TASK-ID>): <title>"
git rev-parse --short HEAD
```

Add the task's exact paths one by one — **never `git add -A`, never `git add .`**, never commit unrelated files. The message carries the task id, and right after committing you take the real SHA from `git rev-parse` — the next step reconciles against it, so it comes from git, not from memory.

**Step 7: report.** The report goes to `.harness/tasks/<feature>/developer/<TASK-ID>-report.md`: what changed (the file list), the commit SHA, the test command and its result counts, decisions made within the contract, and anything that could not be done. One detail is worth pausing on: **the evaluator never sees this file.** It exists for the next developer and for remediation. That is deliberate — evaluation's independence rests on never reading the implementer's self-report. The report is a handover note, not evidence.

**Step 8: record.** Run `harness task-done <feature> <TASK-ID> --sha <sha>` and let the kernel accept it: checks passed, and the SHA actually exists. If it rejects — a check failed, a SHA does not verify — fix the cause and repeat from the failing step. The skill's last word on this is blunt: "do not fake the SHA." (Why this rule exists is told in the phase post, in the story of the commit that wasn't there.)

## Decision 1: scope is a permission, not a suggestion

The hardest boundary in this skill hides inside reading item three: anything not named in `tech-design.md` — a framework, a store, a runtime, any package — is **off limits**. The prescribed response is not "try not to add it"; it is: stop, and report `blocked`.

Why so absolute? Because adding a dependency is not an implementation detail; it is a design decision. The technical design was made by the planner. The moment an implementer improvises a dependency in, the object evaluation later scores has quietly become a different system: what the design never named, the rubric naturally has no check for, so it sails through acceptance unexamined. The last anti-pattern on the list is exactly this: "A new dependency because it was convenient."

Seen from the other side: the task's file list plus the design's whitelist together define **the permission scope of this piece of work**. Permission means unlisted defaults to forbidden — not "allowed, we'll sort it out later." In human teams this runs on tacit understanding; with an AI it has to be written as a rule, because its default tendency points the other way: facing an obstacle, it would rather expand its toolbox than stop and ask.

## Decision 2: why “while I'm here” is banned

Anti-pattern number two: "'While I'm here' changes to other tasks' files."

Drive-by refactoring is a virtue among human engineers. In this system it is a violation, for three stacked reasons.

First, **the accounts stop reconciling**. One task, one commit, commits mapped to requirement ids — that is the coordinate system for the whole workflow. A drive-by change has no requirement id and no test contract; whichever commit absorbs it, that commit's account is muddied.

Second, **acceptance gets bypassed**. Evaluation is organized by feature and task: these requirements correspond to those checks. A file changed outside every task's contract has no checks written for it — it enters the codebase having passed no gate at all. The rewritten date utility in the opening scene is precisely this: it might be correct, but "might be correct" never went through a single door.

Third, **rollback breaks**. When something goes wrong, the unit of retreat is the commit. A commit that braids a fix together with a refactor forces a bad choice: revert everything (including the fix that worked) or hand-pick lines out — and hand-picking is itself a new, unaccepted change.

So the rule is not "never improve code." It is "improvements go through the process": notice a problem elsewhere, write it down, and it becomes another task with its own contract and acceptance. The opposite of "while I'm here" is not indifference; it is a queue.

## Decision 3: if it can't be done, stop and report — no improvising

A task can turn out to be impossible as written: the contract assumes a component the technical design never named, an API doesn't match its documentation, or finishing it would require something outside the whitelist. The usual instruction to an AI is "handle it flexibly" — which is exactly where drift begins.

This skill's prescription is to stop: report `blocked`, state clearly why it cannot be done, and hand it back to the kernel and the planner. If the contract is wrong, the planner is the one who fixes contracts. An implementer who improvises a detour makes the task look "done" in the short run, while actually converting a planning error into an undocumented implementation deviation — which surfaces at evaluation or in production, costs multiples more to trace, and has no findable origin, because the origin was an improvisation nobody recorded.

The same logic applies mid-task: if a test or check fails and the cause is not obvious, the skill does not sanction guessing and patching on the spot. It switches to another skill — `systematic-debugging` — and follows a root-cause process. That is the subject of the next post.

## What this skill cannot do

Boundaries, stated plainly.

This skill guarantees one thing: **a single task is executed within its contract, leaving verifiable evidence** — a test that went red before it went green, changes inside the declared scope, one real commit. It cannot guarantee the plan itself was right: if the tasks were decomposed wrongly or the contract is skewed, it will execute the wrong plan very properly. That is the clarify chain's problem to solve. Nor does "all the task's checks pass" equal "the feature is right": task-level checks are a gate, and whether the feature does what it should is decided later, when evaluation scores it item by item against the rubric.

It behaves like a strict construction crew: builds to the drawings, logs every step, takes no off-drawing work, and stops the job to report when a drawing is wrong. Whether the drawings are right, and whether the finished building passes inspection, is not theirs to decide — but without this layer, even perfect drawings don't guarantee the building matches them.
