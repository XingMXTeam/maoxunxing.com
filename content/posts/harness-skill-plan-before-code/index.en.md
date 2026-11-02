---
title: "Plan Before Code: Before the First Edit, Turn “Done” into a Checklist That Can Be Verified Line by Line"
description: "Part one of the general-purpose group in the Harness skill-by-skill series (plan-before-code). Why an AI that starts coding ten seconds after the request is where the disaster begins, why functional points must be written as input → action → validation → result instead of implementation tasks, and why every unknown has exactly two exits — ask, or write it down as an assumption. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "Coding in ten seconds, hitting a wall three hundred lines later"
  - title: "What this skill is: a planning discipline bound to no phase"
  - title: "How it works: seven steps, from a one-sentence goal to a criterion per point"
  - title: "Decision 1: functional points describe behavior, not tasks"
  - title: "Decision 2: an unknown has two exits — ask, or log it as an assumption"
  - title: "Decision 3: the plan goes before the code — and gets compared against it afterwards"
  - title: "Decision 4: the same discipline as write-dev-plan, at a different scale"
  - title: "What this skill cannot do"
---

The earlier articles in this skill-by-skill series covered skills bound to a phase — the authoring chain runs during Clarify, `implement-task` runs during Implement. This one opens the final group: seven general-purpose skills bound to no phase, each usable standalone on any task at any time. The first is `plan-before-code`, and it governs the thing that sounds least like engineering: **planning before you start.** The overview post is [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/); the system is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli), and this skill lives in the repo at `templates/skills/plan-before-code/`.

## Coding in ten seconds, hitting a wall three hundred lines later

Start with a concrete scene.

You say: add an export feature to the order list. The AI barely pauses before it starts writing: an export button, a format-picker dialog, a CSV generator utility, a progress bar. It flows. Three hundred lines go by.

Then it hits the wall. Export needs a permission field the API doesn't return. The exported columns are supposed to follow the finance team's template, which nobody ever showed it. And whether "export" means the current page or everything — it picked "everything" on its own, and at that data volume the job has to run asynchronously. Half of those three hundred lines are built on data that doesn't exist and decisions that were never made.

Ask it to summarize the plan and it will produce one — coherent, well-structured, and not matching the code. The plan says "check permissions first"; the code contains no such step. **That plan was not written before the code. It was reverse-engineered from the code.** A plan produced that way proves nothing, because it cannot disagree with the code — it was derived from it.

The skill's first line targets exactly this scene: "Never start from a vague sentence." What it blocks is the ten-second start: before the first line of code, negotiate what "done" looks like and write it down as a checklist a third party could verify one by one.

## What this skill is: a planning discipline bound to no phase

First, its relationship to the clarify chain, because the two are easy to confuse.

Clarify has a whole chain doing planning: the interview, the PRD, the dev plan (`write-dev-plan`). That is feature-scale planning, embedded in the state machine — heavy machinery. But a large share of real work never enters that pipeline: you ask an AI to change a page, add a small feature, fix something that touches several files. There is no clarify phase, no planner role — just one context and a one-line request.

`plan-before-code` extracts the same discipline into a lightweight version anyone (or any AI) can run standalone on any task: one plan, seven steps, no dependency on the kernel or on other files. Its own scope statement is explicit about when it applies and when it doesn't:

**Use it when:** a new feature, page, or flow is requested; the request is one line long and hides real decisions ("add a settings page", "make checkout faster"); the change touches more than one file, component, or data source; and one unusually honest trigger — **you catch yourself about to write code while the acceptance criteria only exist in your head.**

**Skip it for:** one-line fixes, pure renames, and changes where the user has already supplied a complete, testable spec. Writing a seven-step plan for a one-line fix is not discipline; it is ceremony — a distinction that will come back later.

## How it works: seven steps, from a one-sentence goal to a criterion per point

The workflow is seven steps, each with a concrete output — nothing as unverifiable as "think it through":

**Step 1: restate the goal in one sentence.** Who does what, and what changes for them. The output is one sentence the user can confirm or correct. Its job is to put "what I think you want" on the table — a misunderstanding corrected here costs ten seconds.

**Step 2: list the unknowns.** Scan the request for missing decisions: empty states, error handling, permissions, data source, edge cases. The output is a numbered list of questions.

**Step 3: resolve each unknown, or record it as an assumption.** Ask about the ones that change the design; write down assumptions for the rest, next to the plan. The output: every unknown is either answered or on paper as an assumption — there is no third state.

**Step 4: decompose into functional points.** Break the feature into FPs, each in the fixed format `input -> action -> validation -> result`. The skill's own example: "FP-1: user enters a non-empty title -> clicks Add -> title is trimmed and checked -> item appears in the list and the input clears." The output is a numbered list where **every item is independently testable**.

**Step 5: name the non-goals.** Write what this change will deliberately not do. The output is an explicit out-of-scope list — at least one item.

**Step 6: define "done" per FP.** For each functional point, state how completion is checked: a test, a manual step, a visible result. The output is a done-criterion per FP, not a single "it works."

**Step 7: confirm before building.** If any assumption is load-bearing — the whole design collapses if it is wrong — show the plan to the user, then stop. The approved plan is saved where the team keeps plans: a file, an issue, or the PR description.

What "finished planning" means is stated just as strictly in the skill's done criteria: **no code was written before the plan existed**, and every FP can be answered "pass / fail" by someone who did not write the code.

## Decision 1: functional points describe behavior, not tasks

Step 4 carries the easiest rule to violate and the most important one: functional points may not be written as implementation tasks.

- ❌ "Create component X", "add hook Y" — those are tasks; they describe **your work**.
- ✅ "User enters a non-empty title -> clicks Add -> … -> item appears in the list" — that is a functional point; it describes **observable behavior**.

Why does the difference matter? A task can only be graded by the person doing the work: the component exists, so the task is "done" — whether anything happens when a user clicks is not in the task. A functional point hands the grading away: anyone — the user, a test, another AI — can open the page, perform the steps, and call pass or fail.

Underneath this rule sits an old problem: **self-report is not evidence.** The phase series kept returning to the same structure — the developer may not grade itself, evaluation runs in a fresh context — and the root is here. Writing FPs as behavior settles "who judges, and by what" at planning time, leaving no door open for self-grading later.

## Decision 2: an unknown has two exits — ask, or log it as an assumption

Requests are always missing information. What the empty state says, whether a permission failure hides or disables, how many times a failed request retries — none of that is in a one-line request. But all of it must be in the code: when execution reaches that line, something has to happen.

So unknowns never disappear; they only change form. **Either they surface during planning — asked, or written down as assumptions — or they get silently invented during coding.** The skill's anti-patterns name this directly: inventing missing requirements silently — picking your own error code, empty-state copy, or permission rule because the spec didn't mention it, instead of asking or logging an assumption.

Why is silent invention dangerous? Because it disguises itself as settled. Later readers of the code — including whoever accepts the work — see an empty state handled and assume it was specified. Nobody asks who chose that copy. An assumption written in the plan behaves the opposite way: it literally says "this is my guess," visible when the user confirms the plan and available when the result is checked. **Both are guesses. A written-down guess can be corrected; an unwritten one hardens into fact.**

That is why step 3 allows no third state. An unknown either gets promoted to an answer or demoted to a recorded assumption. Left hanging in between, it eventually surfaces from inside the code — with no record of who decided it.

## Decision 3: the plan goes before the code — and gets compared against it afterwards

Back to the opening scene: why doesn't a plan written afterwards count?

Because a plan's entire value is in its **order**. Written before the code, a plan is a prediction: which files I will touch, what I will do first, how each step will be checked. Predictions can be wrong — halfway in, you discover the data doesn't exist and step 3's premise collapses. At that point the skill demands a stop: revise the plan, write the discovery into it, instead of finishing the code quietly and then editing the plan until it matches. A plan that disagrees with reality is the most valuable signal in the whole process — it marks a place where your model of the system is wrong, and that error costs one line of text to fix now, or an afternoon at delivery time.

Conversely, a "plan" written in the same message as the code is not a plan. It is narration: the model explaining what it is doing while it does it. Narration always matches the code, because it never had to commit to anything in advance. The mark of commitment is **falsifiability** — the plan says "FP-3 uses the existing permission field," you open the API, there is no such field, and the plan is refuted on the spot. That possibility of being proven wrong, in public, is the line between a plan and a narration.

One last anti-pattern guards the far end: treating the plan as ceremony — producing a beautiful plan, then coding something else and never comparing the result against it. A plan that is never checked against the outcome is equivalent to no plan; only the confirmation in step 7 and the line-by-line comparison against the FPs afterwards give the sheet of paper its force. A ceremonial plan is worse than none, because it convinces everyone the planning step happened. Discipline has a credibility budget, and ceremony spends it.

## Decision 4: the same discipline as write-dev-plan, at a different scale

Readers of the clarify-chain articles will ask: `write-dev-plan` already decomposes a PRD into tasks — isn't this skill a duplicate?

No. They are the same discipline at two scales:

- `write-dev-plan` works at **feature scale**: its input is a confirmed PRD and tech design, its output a task list, embedded in the state machine, serving a multi-role pipeline.
- `plan-before-code` works at **task scale**: its input is one sentence from a human, its output one FP checklist, running standalone, serving any single bout of work.

They share one core: define "done" up front as items a third party can verify one by one, force the unknowns onto paper, write the non-goals down. Only the weight differs. A feature in the pipeline deserves the full clarify chain; a quick page change does not — but the discipline "checklist first, code second" should not be waived just because the task is small. Small tasks drift too, and they can drift away an afternoon just as well.

That is also why this skill sits in the general-purpose group: it does not depend on the state machine existing. Projects without Harness, one-off tasks with no clarify phase, can use it directly — one plan, seven steps, nothing else required.

## What this skill cannot do

Boundaries, stated plainly.

First, it cannot guarantee **the plan is right**. The goal sentence can be restated wrong, an FP list can omit a key behavior, an assumption can guess backwards. The plan can be perfectly well-formed and wrong. What the skill guarantees is that the error is *visible*: it lies on paper, where the confirmation step and the final comparison have a chance to catch it. It does not guarantee the error isn't there.

Second, it cannot prevent **execution drift**. When plan and code disagree, someone — a human, or evaluation — has to do the comparing. This skill only produces the ledger that makes comparison possible; the comparison itself belongs to `verification-before-completion`, a later article in this group.

Third, it has an explicit **out-of-scope zone**: one-line fixes, pure renames, fully specified changes. Skipping it there is correct behavior, not laziness. Apply heavy process to trivial changes and people learn to perform all process hollowly — a discipline's credibility is a real resource, and ceremony spends it.

The next article covers `context-map`: there is a step before planning — knowing where this code sits in the whole system and what it touches. A plan answers "what will be done"; a map answers "where, and whose toes are in the way."
