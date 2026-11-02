---
title: "bug-root-cause: Guarding the Crash Site Is the Most Common Fake Fix"
description: "A skill deep-dive in the Harness series (bug-root-cause, general-purpose group). Why the fastest fix is almost always a patch over the symptom — a null check where the value shouldn't be null, a retry where the call shouldn't fail — and why the bug just returns in a different costume; how this standalone root-cause method walks a broken value back to where it was born in eight steps: reproduce, bisect, build an evidence chain, one-sentence cause, fix at the origin, check the blast radius, lock it with a test. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "A null check where the crash appeared"
  - title: "What this skill does: walk the broken value back upstream"
  - title: "Eight steps: from reproduction to a written root cause"
  - title: "Decision 1: fix where the wrong value is born, not where it explodes"
  - title: "Decision 2: symptom patches compound"
  - title: "Decision 3: a tourniquet is allowed — it is not the fix"
  - title: "What this skill cannot do"
---

This is one entry in the skill-by-skill series, covering `bug-root-cause` — the general-purpose group's bug-fixing skill. It is bound to no phase; it applies to any bug in any context. The overview post, [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), covered the whole system's shape; this series takes the skills one at a time — why each exists, and concretely how it is done. The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below appears in the repository at `templates/skills/bug-root-cause/SKILL.md`.

It is the same method as [`systematic-debugging`](/en/harness-skill-systematic-debugging/), in a second form: that one is bound to the implement phase, writes its findings into the task report, and escalates to the orchestrator when its hypotheses run out. This one is the standalone version — no task, no report format, no orchestrator. Only the method remains.

## A null check where the crash appeared

Start with a concrete scene.

A user's profile page occasionally renders white. The error is precise: reading `profile.name`, where `profile` is null. The fix looks equally precise: guard the read, show a placeholder when `profile` is empty. The "fix" ships; the white screens stop.

Two weeks later, the settings page starts misbehaving: the same users have blank nicknames. Later still, the checkout page can't get the recipient's name and the flow stalls. Three defects, one source: a signup path skipped the step that creates the profile, so for those users the profile never existed at all. And by the product's own contract, a signed-in user **always** has a profile — it was never supposed to be null.

Look back at the first fix: it made nothing correct. It only silenced the first place that exploded, so the bad value kept traveling downstream and went off on the second and third screens in forms that look less like bugs — a blank nickname looks like a data issue, a stalled flow looks like a different feature's problem. If someone had asked one more question — "where did this value become null?" — none of the later three incidents would have happened.

Nobody asked. The crash site was right there, and the patch was right there with it.

The skill opens by ruling this out in so many words: **"The fastest fix is usually a patch over the symptom: a null check where the value shouldn't be null, a retry where the call shouldn't fail, a special case where the rule is wrong. The bug then returns in a different costume."**

## What this skill does: walk the broken value back upstream

Its self-definition is one sentence: **fix bugs at the root cause — reproduce, narrow, build an evidence chain, then change the cause; never patch the symptom.**

The skill lists four situations it is for: any bug whose cause is not already proven; a bug that "came back" after a previous fix; intermittent failures, race conditions, and "works on my machine" reports; and any fix you are about to make in code you don't fully understand yet. The converse also holds: a bug whose cause is already proven doesn't need it — when the compiler prints the line number, just fix it. The skill governs the class where the phenomenon is clear and the cause is not, and that is exactly where patches breed: the less you know about why, the stronger the urge to press on the one spot you can see.

Its division of labor with `systematic-debugging` follows from that: same method, but that one is an in-flow discipline, wired into task checks and task reports. This one is the out-of-flow tool, for any ordinary bug fix. None of the flow's enforcement is available to it — no kernel blocking your path, no report waiting to be filled. All it can rely on is a workflow ordered clearly enough that skipping a step feels wrong to the person skipping it.

## Eight steps: from reproduction to a written root cause

The skill's workflow has eight steps, each with a named output:

1. **Reproduce it.** Get a deterministic or near-deterministic reproduction: exact steps, input, environment, and observed vs. expected behavior. The output is a reproduction **someone else can run**. The load-bearing rule comes next: if you cannot reproduce it, gathering the reproduction is the task — do not start fixing. A fix with no reproduction cannot be verified; you can't even distinguish "fixed" from "didn't happen this time."
2. **Narrow the scope.** Bisect inputs, code paths, and history — disable halves, `git bisect`, strip the failing case down — until the smallest failing case remains. The output is a minimal failing example. The smaller the scope, the cheaper every later step; a bug that reproduces in ten lines doesn't ask you to read the whole repository.
3. **Build the evidence chain.** State hypotheses and test each one with an observation — a log line, the debugger, a failing test written for the purpose — keeping the hypothesis that survives contact with evidence. The output is the chain from symptom to cause, **each link observed, not "probably."** This step exists to block the most common self-deception: stopping at the first plausible explanation and coding the fix before any observation distinguishes it from the second plausible explanation.
4. **Name the root cause in one sentence.** The form is fixed: "X happens because Y, under condition Z." And the sentence must explain **every** observed symptom, including the intermittent ones — a cause that explains the main symptom but not the occasional one is usually just a downstream relative of the real cause.
5. **Fix the cause, at the cause.** Make the smallest change at the point where the wrong value, state, or assumption originates. The skill's test for the diff is vivid: **a diff that would look wrong if placed anywhere else.** If your change could sit equally well at the crash site, at the caller, or in a utility function, it probably hasn't landed on the cause yet.
6. **Check the blast radius.** Search for other callers, siblings, and copies of the same pattern, and state for each: fixed here, also affected, not affected (with how you checked). Fixing only the reported instance when the same defect lives in three sibling components — and not even checking — is an anti-pattern the skill names explicitly. Root-cause bugs rarely happen once; the place that produces the bad value usually feeds more than one downstream.
7. **Lock it with a test.** Add or identify the test that fails without the fix and passes with it. The test belongs at the level where the cause lives — if the cause is in data creation, the test belongs there, not on the final page asserting "doesn't render white"; the latter only proves the symptom got covered. If it genuinely can't be automated, write down why.
8. **Write it up.** Record root cause, evidence, fix, and blast radius in the commit message or the issue. The output: a future reader can audit the reasoning without redoing the investigation.

## Decision 1: fix where the wrong value is born, not where it explodes

The skill's skeleton is one governing rule: **reason from first principles and fix at the cause; do not patch over the symptom.**

Why the insistence on location? Because the crash site is the place in the whole system with the least information. By the time the value arrives there, it is already broken; all you can do there is defense — null checks, fallbacks, catches. And defense changes what the bad value does next, not why it exists. The skill lists guarding the crash site as its first anti-pattern, with the reason stated plainly: you add `?.` or a null check where the value arrived already broken, **so the real corruption continues silently upstream** — more silently than before, because you've now muffled the last place that was still crying out.

Fix at the origin and the arithmetic inverts: change one place and everything downstream heals. Create the profile correctly at signup and the profile page, settings page, and checkout problems disappear together — no defensive lines on three screens. The further your fix sits from the cause, the more patches you need; the number of patches is itself a measure of your distance from the cause.

## Decision 2: symptom patches compound

The largest cost of a symptom patch is not paid now. It is paid later.

Every patch is a special case: this value may be null here, that call may fail there, this rule doesn't count under that condition. Once written into the code, special cases become terrain. The next bug's investigation has to route around them — is this new behavior a new problem, or a side effect of some old patch? The next person editing nearby code first has to work out what each special case is defending against, and why it was added is usually recorded nowhere (the blast-radius and write-it-up steps exist largely to fight this).

The compounding has a direction, too. A patch lets the bad value live longer and travel further; the more ground it covers, the more places later readers are tempted to add one more patch of their own — because by then the origin is wrapped in so many layers that touching it looks more expensive than adding another. The codebase slowly becomes a set of fortifications, each of which genuinely stopped something once, with nobody able to say what the original bad event was. Root-cause fixing looks slow because its first steps are the expensive ones. Patching looks fast because it bills you on every occasion from then on.

## Decision 3: a tourniquet is allowed — it is not the fix

One boundary needs stating, so the skill isn't read as dogma: when users are being hurt right now, stop the bleeding first. A null check that keeps the page from rendering white, a fallback that lets the flow complete — as a **tourniquet**, this is the right move.

But a tourniquet and a fix are two separate accounts, and the skill's logic concedes nothing here:

- The mitigation must be **labeled and temporary.** What it buys is time, not a verdict on the bug. The issue stays open, the root-cause investigation is still owed, and the change itself should be recorded as "mitigation, not a fix."
- It must never be allowed to pass itself off as the fix. The moment that null check gets treated as "fixed," the investigation never happens, and the bad value is produced upstream forever and intercepted downstream one screen at a time — which is exactly how the opening scene was made.

The test that separates the two is simple: after the mitigation, can you state the root cause in one sentence? If not, this bug has not been fixed. It has been held down.

## What this skill cannot do

Boundaries, stated plainly.

First, it is helpless against a bug that can't be reproduced and can't be made reproducible. Without step one's reproduction, the other seven steps hang in the air. What's missing then is observability — logs, monitoring, replayable inputs — which is a different job, and this skill can't do it for you.

Second, it guarantees that what you found and changed is the cause; it does not guarantee the code is now bug-free. However thoroughly you check the blast radius, it only covers copies of the same pattern; a correct fix here says nothing about an independent second cause next door. It buys a final answer for this bug, not immunity for the area.

Third — the practical one — it is slow. Reproduce, bisect, evidence chain, one-sentence cause: against a patch racing toward a release, that start is visibly more expensive. So the skill scopes itself tightly on purpose: bugs with proven causes shouldn't go through it, and genuinely simple errors should just be fixed from the message. It asks for only one thing: when you're about to edit code you haven't understood, or take a second swing at a bug that already came back once, don't reach for the fastest kind of fix.

What comes after the fix is outside this skill: how trustworthy the claim "it's fixed" itself is — a reproduction that no longer fails is evidence, but whether it's enough, and what a harder standard looks like, is the subject of the next entry, `verification-before-completion`.
