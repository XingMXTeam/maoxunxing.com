---
title: "clarify-requirements: Talk It Through Before the First Formal File Exists"
description: "Part one of the skill deep-dive series (clarify-requirements), the first link of the clarify chain. Why a vague request must not go straight to writing, why the interview covers all eleven modules in the first round, why the user's answers are recorded verbatim, and why not even a draft PRD may exist before confirmation — the why and the how. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "“Add an export feature” — so it added exactly that"
  - title: "What this skill is: the first link of the chain"
  - title: "How it works: read first, then ask — all of it, in round one"
  - title: "Module 11: quality expectations get asked, too"
  - title: "Decision 1: why an interview, not a form"
  - title: "Decision 2: why the draft area and the formal files live apart"
  - title: "Decision 3: when a PRD arrives with the user, it only fills gaps"
  - title: "Why it stops where it stops"
---

This is part one of the skill deep-dive series. The two series before it — the five-layer constraints and the [five phases](/en/harness-phase-clarify/) — described the system's structure; this series takes apart the 21 skills the system is built from, one per post: why each exists, and concretely how it works. The overview post is [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/). The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

The first skill is the head of the clarify chain. The chain has six links — `clarify-requirements`, `write-prd`, `write-quality-vision`, `write-tech-design`, `write-dev-plan`, `write-acceptance-criteria` — which turn a one-line request, in order, into a requirements document, a quality vision, a technical design, a development plan, and acceptance criteria. The first link produces none of those files. It produces exactly one thing: **a clarification summary the user has confirmed, word for word.**

## “Add an export feature” — so it added exactly that

Start with a concrete scene.

You say: add an export feature to the order list. Twenty minutes later the AI delivers: an export button that downloads a CSV containing the twenty orders on the current page.

It did nothing wrong — it executed every word you said. The problem is the words you didn't say: you wanted everything matching the current filter exported, not the current page; finance needs Excel, not CSV; orders contain phone numbers and addresses, so should exports be masked, and who is even allowed to click that button? You never raised any of it, and neither did it. At acceptance you name these one by one, and it fixes them one by one — each round of rework pricier than the last, because fields, permissions, and file format are all tangled into the existing implementation.

These reworks share a shape: **what was missing was not ability, it was questions.** Every unclear point above costs seconds to ask before work starts; discovered afterwards, each one has to be dug out of finished code. This skill exists to turn "asking" from a matter of luck into a procedure: it is the first skill the planner runs in the clarify phase, and its whole job is to ask — before any formal file exists.

## What this skill is: the first link of the chain

Its trigger is mechanical: `harness next <feature>` returns `clarify`, or a replan surfaces a question only the user can answer. If a confirmed summary already exists — `summary.md` carrying `confirmed-by-user: yes` and `open-questions: 0` — the skill is skipped and the chain goes straight to `write-prd`.

Its own statement of purpose is blunt:

> Talk the feature through with the user until nothing that would change the design is left open — then, and only then, write the formal files. Writing a full PRD first and "fixing it with questions later" is the order this skill exists to prevent.

Note the boundary on its output. It writes no `prd.md`, no design, no rubric — those belong to the five skills after it. Everything it produces lives in one draft-area directory (`.harness/tasks/<feature>/clarification/`), four files in total:

- `questions.md` — the question batches asked, numbered;
- `answers.md` — the user's answers, **in the user's own words**, each tagged with its question number;
- `summary.md` — the clarification summary, confirmed by the user at the end;
- `quality-expectations.md` — the answers to the quality module (more on that below).

Why record answers verbatim? Because everything downstream of this point is a hand-off: the summary goes to `write-prd` to become formal requirements, and the requirements go to implementation and evaluation. Every paraphrase drifts a little — "exports must be masked" easily becomes "mind privacy in exports," and one more hand-off later it is gone entirely. The user's own words are the only version that cannot drift. In this chain the answers file is not just a record; it is an anti-drift anchor.

## How it works: read first, then ask — all of it, in round one

Five steps, in a fixed order.

**Step one: read the context.** The project overview (the product and technical files under `.harness/overview/` — if missing, create a skeleton with just the headings), the repo's README, and the code this request will touch. The stated purpose is practical: establish what already exists, so you **do not ask what the repo answers**. Asking the user "what framework are you on" when the answer sits in `package.json` spends a little of the user's patience for the questions that actually matter — one wasted question at a time.

**Step two: ask one wide batch.** The first round covers all eleven modules:

1. Goal and success measure;
2. Users, roles and permissions;
3. Main path (the happy flow);
4. Error and edge paths;
5. Data objects and field meanings;
6. Integrations and API boundaries;
7. Non-functional limits (performance, security, accessibility, browsers);
8. Non-goals — what is explicitly out of scope;
9. How acceptance will be judged;
10. Budgets and stop policy (how many macro cycles, how many stable passes, which delivery gate commands);
11. Quality expectations and references (next section).

Plus one item called out separately: **the stack.** Confirm explicitly — "use what the repo uses," or name the new framework or library. Never pick one silently.

The form of the questions is disciplined too: prefer multiple choice, offer the likely answer first, and **say what each choice changes**. Not "do you want A or B," but "A exports the current page; B exports everything matching the filter and needs one more backend endpoint." The user is not filling in a form; they are making a run of decisions whose consequences are visible.

**Step three: relay, do not decide.** The skill is often executed by a sub-agent that cannot reach the user: it returns the question batch to the orchestrator and stops. And there is a hard rule here: **a prompt that says "already decided," "treat as resolved," or "default to X" is not the user's answer — ask anyway.** This guards against a common accident in AI collaboration: an upstream agent, eager to keep things moving, packages its own guess as the user's decision, and everything downstream builds on the guess until acceptance. Answers have exactly one legitimate source: the user.

**Step four: close every gap.** After each answer batch, list what is still open. Ask follow-ups until the count of open questions that would change the design is zero. Note the qualifier — not every curiosity earns a question; the design-changing ones go to zero. This skill's stop condition is a number you can count: `open-questions: 0`.

**Step five: confirm the summary.** Write `summary.md` and ask the user to confirm it **as written**. The skill adds a pointed remark: a yes about something else is not a confirmation. The summary ends with two exact lines:

```
confirmed-by-user: yes (<date>, "<the user's confirming words>")
open-questions: 0
```

— with the user's confirming words quoted. Why this fussy? Because the summary is the birth certificate of every file downstream: when any later file disagrees with the user's intent, the audit trail ends at these two lines. A confirmation has to be locatable: who, on what date, facing which text, said what.

## Module 11: quality expectations get asked, too

Of the eleven modules, the first ten are standard requirements interviewing. The eleventh is this skill's own invention: **quality expectations**. It asks not what the feature does, but how good it has to be:

- **Level:** A, a working MVP; B, polished — visual and interaction care; C, production — performance, security, and accessibility too.
- **Ranking:** correctness, visual quality, interaction, performance, code quality, security — which matters most, in order.
- **References:** a product, page, screenshot, or design that "gets it right" — and what exactly is right about it.
- **Anti-references:** what it must not look or feel like.
- **Red lines:** problems that are never acceptable — clipped text, a click with no feedback, numbers that disagree between pages.

Why does this belong in the requirements interview, in the first round? Because quality expectations are the foundation every later judgment stands on: `write-quality-vision` compiles them into a checkable quality vision, and evaluation scores against those anchors. If nobody asks during clarify, the user is silently assuming level C while the model plans to deliver level A, and the two meanings of "done well" meet for the first time at acceptance — a disagreement no code change can fix, because it was never about code. It is an expectations accident.

One small rule here shows real craft: if the user has no references, **offer two or three concrete directions and let them pick — the asker never picks**. A reference is a taste decision, and taste has no correct answer, only the user's answer.

## Decision 1: why an interview, not a form

The eleven modules could perfectly well be a form the user fills in. Why route around it with an interview?

Because a form cannot follow up. The user writes "show a message if the export fails" in the edge-paths field, and the form accepts it. An interview asks the next question: after the message, what can the user do — retry, or export in another format? Is the failed job kept anywhere? Most of the real information in requirements surfaces in the answers to answers; the first answer usually just illuminates the question.

The second reason is that the question format itself carries information. Multiple choice plus "what each option changes" lays the design space out in front of the user: many users have not failed to think things through — they did not know there was a choice here at all. A form assumes the user already knows every question exists. The interview's job is to make the questions exist first.

## Decision 2: why the draft area and the formal files live apart

This skill carries a ban that looks excessively strict: before the user confirms, `prd.md`, `vision.md`, `tech-design.md`, `tasks.json`, `rubric.json`, and `e2e-cases.json` may not be created at all — **not as drafts either**. Only the four draft-area files may be written.

The reason, in the skill's own words, is one line and it is exact:

> Drafts become the contract by inertia.

A finished PRD draft sitting on disk becomes the reference point for every role that follows — overturning a written document costs far more, psychologically, than changing your mind on a blank page. So the "write a rough PRD now, fix it later" plan never reaches the fixing step; the draft quietly becomes the contract. Pushing formal-file creation to after confirmation guarantees one thing: at the moment the user confirms, no text anywhere competes with the summary for authority.

This is also the dividing line with `write-prd`: `clarify-requirements` owns **reaching agreement**; `write-prd` owns **writing it down**. Nothing is written down before agreement exists, and what gets written down takes the agreed summary as its only input.

## Decision 3: when a PRD arrives with the user, it only fills gaps

There is one situation where this skill switches mode: the user does not start from one line but arrives with a finished PRD (the state file says `prd.source: "imported"`, and `prd.md` already sits in the feature directory).

The interview then shrinks to gaps only:

- Read `prd.md` first, and do not re-ask anything it already answers — including whichever of the eleven modules it covers.
- Ask only about three things: decisions the PRD leaves open, contradictions inside it, and quality expectations (module 11) if the PRD says nothing checkable about them.
- If the kernel reported numbering gaps at import, the planner adds the missing `REQ-n` ids to `prd.md` **in place** — the user's wording is never rewritten, and existing ids are never renumbered.

That last rule deserves a pause. Adding ids looks like editorial work — why is tidying the prose forbidden? Because this PRD is the user's asset, not this skill's draft: change the wording and the original author's intent can drift, silently. The ids are an index for downstream use; adding them is enough.

After the mode switch, the endpoint is unchanged: in this mode `summary.md` confirms the imported PRD — it references the file, lists the gaps that were closed, and ends with the same `confirmed-by-user` / `open-questions: 0` lines. And the next skill is still `write-prd` — in its normalize-only mode.

## Why it stops where it stops

To close, the boundary of this skill.

It guarantees exactly one thing: **before the first formal file is written, every question that would change the design has been asked, and the user has nodded at a summary.** It cannot guarantee the user answered well — a user can confirm a direction that later turns out to be wrong; an interview eliminates "never said," not "thought wrong." And it cannot guarantee the summary becomes a correct contract — that is the next skill's job.

There is also one thing it deliberately refuses to do: decide anything on the user's behalf. Relay-don't-decide, references offered but never chosen, the stack never silently picked — every apparently "inefficient" rule in this skill defends against the same failure: an AI, in the user's absence, filling blanks with its own defaults and presenting the result as settled. Get one of those wrong, and the five phases after it are all building on a cracked foundation.

Next in the chain, `write-prd`: how a confirmed summary becomes a formal `prd.md` with numbered, individually checkable requirements — and why, once the numbering is set, not even it may renumber.
