---
title: "systematic-debugging: The Error Message Is Gone — That Is Not a Fix"
description: "A skill deep-dive in the Harness series (systematic-debugging, the debugging discipline inside the Implement phase). Why an AI's default debugging move is patching, and how twenty minutes can stack up three fixes nobody can explain; how this skill turns debugging from guessing into experiment in seven steps — reliable reproduction, one hypothesis at a time, a failure you can switch on and off at will, and a root cause recorded in the task report — rule by rule against the SKILL.md text. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "Twenty minutes, three “fixes”"
  - title: "What this skill does: debugging as experiment, not guessing"
  - title: "Seven steps: from reliable reproduction to a recorded root cause"
  - title: "Decision 1: why the model patches by default"
  - title: "Decision 2: silencing the alarm never counts as a fix"
  - title: "Decision 3: three failed hypotheses — escalate, don't improvise"
  - title: "What this skill cannot do"
---

This is one entry in the skill-by-skill series, covering `systematic-debugging` — the skill that governs debugging inside the Implement phase, used by the developer role when a task runs into a failure mid-flight. The overview post, [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), describes the shape of the whole system; this series takes the skills one at a time — why each exists, and concretely how it works. The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below can be found verbatim in `templates/skills/systematic-debugging/SKILL.md` in the repository.

## Twenty minutes, three "fixes"

Start with a concrete scene.

Halfway through a task, a check goes red: an end-to-end case fails — after the user submits an order, the new order doesn't show up in the order list; the case waits two seconds and declares failure.

The AI starts "fixing." First move: raise the wait in the case from two seconds to five. Green. A while later, another case goes red: the amount on the order detail page is occasionally off by one cent. It wraps the amount calculation in a rounding call. The red disappears. Later still, during integration, the page occasionally flashes an error; it wraps that request in a try-catch, the error gets swallowed, the page goes quiet.

Twenty minutes, three fixes, and every one of them made the red in front of it disappear. But one elementary question was never answered at any point: **why didn't the new order appear in the list immediately?**

The real cause may live in the data layer: after a successful submit, nobody invalidated the list's query cache, so the list kept reading data from before the submit. The five-second wait just got lucky whenever the cache happened to expire; the rounding pasted over an upstream precision problem; the try-catch swallows every future error of the same kind along with it. The symptom moved house three times, the bug itself never showed its face — and the code gained three changes nobody can explain.

The skill's first line is aimed at exactly this scene: **"No guess-and-patch. A fix you cannot explain is a second bug waiting."**

## What this skill does: debugging as experiment, not guessing

Its trigger is stated in its description: **when a task check, a test, or a remediation item fails and the cause is not obvious.** Failures with an obvious cause don't need it — a wrong import path, a mistyped name; the compiler has already written the cause on its face, and you just fix it. This skill is for the failures that are red with no visible reason.

Its place in the flow also differs from other skills: it is not a fixed stage of a phase, but a discipline inside the Implement phase — the moment the developer role falls into a "change something and see" loop, it switches to this skill's way of working.

It produces two things. One is a fix applied at the cause. The other is a single line recorded in the task report: `root cause: …`. The second matters as much as the first: if the conclusion of a debugging session lives only in the current context, the next context to pick up the task walks the whole road again.

A side note: bugs outside a harness task use `bug-root-cause`, the general-purpose version of the same method; this one is the in-task variant, wired into task reports and task checks.

## Seven steps: from reliable reproduction to a recorded root cause

The skill's workflow is seven steps, in an order that may not be shuffled:

1. **Reproduce reliably.** First find one command that shows the failure every time. If you can't reproduce it, you have no object to debug — only a rumor. If the failure itself is flaky, hunt the flakiness first: timing, execution order, or data is varying; pin down which, and the failure becomes stable.
2. **Collect evidence.** The full error, the stack, logs, inputs — plus the item most often skipped: **what changed since it last worked** (`git log -p`, `git diff`). "It used to work" means the cause is very likely inside that diff.
3. **One hypothesis at a time.** Write it down, design the observation that would **prove it wrong**, run it, and keep a short log: `hypothesis → test → result`. One at a time, because if you change three things at once and it passes, you don't know which one worked — you learned nothing. A falsifying observation rather than a confirming one, because evidence in favor of a guess is everywhere; the observation that can kill it is the one carrying information.
4. **Confirm the root cause.** The confirmation standard is one operational sentence: **you can make the failure appear and disappear on purpose.** Short of that, you hold a correlation, not a cause.
5. **Smallest fix, at the cause.** Where the cause is, there you edit — the smaller the change, the better; not a layer of paste where the symptom surfaced.
6. **Re-verify.** The order is pinned: the reproduction first — it must pass now; then the task's checks; then the wider suite the change could affect.
7. **Record.** One line in the task report: `root cause: …`. One line is enough, but it must exist.

## Decision 1: why the model patches by default

This skill exists because the model's default debugging behavior is precisely the opposite of the seven steps: it lunges at the symptom.

The reason is in the signal structure it faces. The loudest signal in a debugging session is the error message, and "make the error message go away" is a result that is immediately visible and immediately checkable; "find the root cause" is slow and produces no visible progress along the way. So the cheapest path is always the same: operate near the line that reported the error, and make that line quiet.

But symptom and cause usually live in different places. The list shows stale data; the cause is cache invalidation after the submit. The amount is off by a cent; the cause is a field's type somewhere upstream. The error message is smoke; the fire is elsewhere. Fan the smoke where it's thickest and the smoke clears — the fire doesn't.

Worse, the bill arrives later: every unexplained patch is itself an unverified change. The widened timeout slows the whole suite down from then on; the catch-everything try-catch swallows all future errors of that kind, so the next bug doesn't even get to make a sound. That is what "a fix you cannot explain is a second bug waiting" refers to — not a figure of speech, but literally: you have planted another one.

## Decision 2: silencing the alarm never counts as a fix

Beyond the seven steps, the skill carries three hard rules. The first names the forbidden zone directly:

**Never silence the symptom and call it fixed** — the three examples given are catch-and-ignore, a skipped test, and a widened timeout.

What these share: none of them changes the behavior of the thing being tested; they only change how much of it you can see. Catch-and-ignore means the error still happens, just with nobody informed. Skipping or deleting the failing test is removing the alarm while the room keeps burning. Widening a timeout redefines "slow" as "normal." Pasting an `@ts-ignore` over an error line is the same move in the language layer — all of them make the check shut up rather than make the error go away. And inside this system such a move has a harder consequence downstream: getting a check to pass by suppression triggers a pitfall veto in the evaluation rubric.

Rule two: **never mix unrelated changes into a debugging commit.** A fix must be readable on its own and revertible on its own; fold in a drive-by refactor or reformat, and when something breaks later, nobody can tell which lines were "the fix."

Rule three concerns where the hypothesis log and the reproduction case end up: they are not disposable scaffolding. After the fix, the reproduction command is the first thing re-run — it turns from a tool for finding the bug into the evidence that the bug is dead. And since task checks re-run again and again, if the same root cause ever revives, the same checks catch it on the spot. The one-line root-cause record serves the same purpose: it turns this debugging session into a conclusion that can be handed over, instead of a process that evaporates with the context.

## Decision 3: three failed hypotheses — escalate, don't improvise

Buried in the seven steps' rules is the one most easily missed: **after three hypotheses fail, step back.**

Step back and do what? Re-read the contract and the tech design — because the bug may not be in the code; it may be in the plan. Code that faithfully implements a wrong design fails in ways no code-level hypothesis will ever hit.

The prescribed move then is to report it to the orchestrator rather than rewriting the design yourself. The boundary is deliberate: the developer role's authority is fixing the implementation, not amending the contract. If it quietly edits the design, it moves the error from the code layer into the plan layer with nobody aware it happened — evaluation downstream scores against the old contract, and the books never balance again. Escalating is how an error gets handled in the layer where it lives.

## What this skill cannot do

Boundaries, stated plainly so it isn't misused.

First, it is helpless against a failure that cannot be reproduced. If a failure occurs only in one specific environment and cannot be constructed locally, step one has nothing to stand on — what is missing there is not debugging discipline but observability: the failure first has to become visible in reproducible form. The next article, on `e2e-testing`, covers exactly that end of the problem: turning a feature's real behavior into checks that can run again and again, so that when a failure appears, it arrives with its reproduction attached.

Second, it guarantees finding the cause, not that the cause is fixable. The root may sit inside a third-party library, a backend endpoint, a contract you have no authority to change — the skill can turn "we don't know why" into "we know why, and why it can't be fixed here," but it cannot manufacture authority.

Third, it costs. Walking all seven steps is slower than three patches — much slower. That is precisely why its trigger is limited to causes that are not obvious: fix what you can see directly; save the experiment for what you can't.
