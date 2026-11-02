---
title: "i18n-extract: No User-Visible String May Be Hardcoded"
description: "A Harness skill deep-dive: i18n-extract, a general-purpose skill. Sweep hardcoded user-visible strings out of components and behind keys, then verify completeness in both directions for every locale: why extraction must be a sweep and not a spot fix, why keys name meaning and place rather than wording, and why a key missing in one locale is a defect, not a TODO. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "The English version shipped — with three Chinese strings on the page"
  - title: "What this skill is"
  - title: "How it works: six steps, from conventions to per-locale verification"
  - title: "Decision 1: extraction is a sweep, not a spot fix"
  - title: "Decision 2: a key and its translations live and die together"
  - title: "Decision 3: what must NOT be extracted"
  - title: "The machine backstop"
  - title: "What it cannot do"
---

This is a skill deep-dive in the Harness series; the skill under the knife is `i18n-extract`. It is not part of the clarify chain and not bound to any single phase — it belongs to the general-purpose group: used when adding internationalization, when auditing copy before a release, and before copy is handed to translators. The overview post, [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), describes the shape of the whole system; this series takes the skills one at a time — why each exists, and concretely how it is done. The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

## The English version shipped — with three Chinese strings on the page

Start with a concrete scene.

A product ships an English version. Before launch, everyone clicked through it: home page in English, list page in English, settings in English. The day after release, a user's screenshot arrives — three Chinese strings sitting in the English UI: one in an empty state ("暂无数据", "no data yet"), one in a delete-confirmation dialog, one in a form validation message.

And something uglier elsewhere: a button printed not with text but with `checkout.submit.label` — the name of a key. That button's code had been converted to call the translation function long ago, but nobody ever created the entry in the resource file. At runtime the lookup came back empty, so the key introduced itself.

These two failures share one property: **neither is a mistranslation.** The three Chinese strings were never extracted — written straight into components during development, while everyone's attention was on the main flow; the strings hiding in empty states and dialogs are precisely the ones nobody "noticed." The button is the mirror image: extraction was done, the resources never followed.

The skill's first line names this kind of failure: **internationalization breaks quietly.** A hardcoded string ships in one language, a component calls a key that was never added to the resource file, and nobody finds out until a user screenshots it. Hardcoding raises no error. A missing key raises no error — at runtime it just falls back. No light anywhere in the system turns on for it.

## What this skill is

`i18n-extract` does two things, and the source is explicit that they come as a pair: **extraction and completeness checking — either one alone leaves the failure mode in place.**

- Extract without verifying, and you get that button: translation calls everywhere in the code, a few entries missing from the resources, key names printed on the UI.
- Verify without extracting, and you get the three Chinese strings: no amount of resource completeness saves them, because they never entered the resource system at all. Verification checks key-to-entry correspondence; it cannot see a string hardcoded inside a component.

So the skill's output is not "translated." It is two countable conclusions: zero hardcoded user-visible strings in the audited scope, and every translation call resolving to an existing key in every shipped locale. If you can count it, you can call it done.

## How it works: six steps, from conventions to per-locale verification

The workflow is a fixed six steps, each with a definite output.

**Step 1: fix the conventions first.** Before touching any file, confirm three things from the codebase: how resource files are laid out, the key naming pattern (e.g. `namespace.section.key`), and how code calls translations. The output is the conventions, written down; if none exist, propose them and get agreement before touching files. Why first? Extraction is a bulk operation — get the convention wrong and hundreds of keys inherit the mistake.

**Step 2: scan for hardcoded strings.** Systematically search the target code for user-visible literals: JSX text, button labels, placeholders, aria-labels, toast and error messages. The output is a file:line hit list. Note the exclusions: non-visible strings — class names, test IDs, log messages — don't count; they are not copy (Decision 3 below goes into why).

**Step 3: extract with stable keys.** Move each string into the resource file under a key that names its location and meaning, and replace the literal with the translation call. The output is resource entries and call sites pairing up one-to-one: one string, one key; one key, one meaning.

**Step 4: verify completeness in both directions.** Forward: for every translation call in the code, does the key exist in the resource file? Backward: for every key in the resource file, does anything call it? The output is two lists — **missing keys, which must be zero**, and unused keys, which are reported, not auto-deleted (another branch may use them, or they may be genuinely dead; that is a human's call).

**Step 5: check every locale, not just the default.** Repeat the existence check against each shipped locale file, and report the missing counts per locale. The wording here is hard: a key missing in one locale **is a defect, not a TODO**. Because at runtime it won't error; it will fall back — to the default language, or to displaying the key itself — and the user finds out before you do.

**Step 6: run the app surface.** Where feasible, load the affected screens in a non-default locale and look for raw keys or fallback text that slipped through. The output is the list of screens checked — or an explicit "not run" note. Faking a check is not an option.

Six steps done, measure against the done criteria: zero hardcoded strings remaining in scope, missing count zero in every locale, unused keys listed in the report, keys consistently following the namespace convention.

## Decision 1: extraction is a sweep, not a spot fix

Why must step 2 be a *scan*, rather than "extract a string when you spot one"?

Because the missed string is, by definition, the one nobody noticed.

Spot-fixing runs on discovery: whoever spots an untranslated string extracts it. But hardcoded copy lives exactly where attention doesn't: empty states, error toasts, validation messages, permission-denied notices. The titles and buttons on the main path are visible to everyone and were extracted long ago; what remains is all on the side paths. The skill's anti-pattern list calls this out by name: **extracting only the visible happy path and leaving error toasts, empty states, and validation messages hardcoded — those are the strings users screenshot.** When something goes wrong, the screen in the user's screenshot is always the error screen.

So the unit of extraction is not the sentence; it is the scope: a feature area, a group of pages, swept whole, finished when the hit list reaches zero. A sweep is unglamorous, but it converts "did we miss any?" from a luck question into a counting question: how many hits remain is right there to see.

## Decision 2: a key and its translations live and die together

Two disciplines hide inside the extraction step. Break either, and the damage is worse than not extracting at all.

**First: keys name meaning and place — never wording.**

The anti-pattern is using the English sentence as the key: `"Click here to continue"` as the key name. It feels convenient — read the key, know the meaning. Then the first copy edit arrives. The text changes from "Click here to continue" to "Continue," and either the key changes with it — orphaning every call site — or it doesn't, and the key now disagrees with the displayed text forever, misleading the next reader. In the source's words: **keys name meaning and place, never wording.** Wording changes; meaning and place don't. A key must be anchored to the thing that stays still.

**Second: a new key and its entry in every locale land in the same change.**

This is step 5, applied in advance. Write the call in code today and "fill in the resources later," and you have manufactured that key-named button by hand. The atomicity rule: call site, default-locale entry, and every other locale's entry arrive together, in one change. If a locale has no translation yet, that gets an explicit placeholder recorded as a defect — never expressed by "absent from the file," because at runtime the two states are indistinguishable; all you see is the fallback.

A related rule: **never concatenate translated fragments.** `"You have " + n + " items"` slices a sentence into pieces and assumes every language orders subject, count, and noun the same way. Switch languages, the order changes, and the assembled result is ungrammatical. The proper form is a parameterized message: the whole sentence as one entry, the variable as a placeholder inside it, so the translator can move the placeholder where their language needs it.

## Decision 3: what must NOT be extracted

Sweep indiscriminately and you pollute the resource file with a second class of string: things that were never copy.

The skill draws the line in step 2: class names, test IDs, and log messages are excluded, per project convention. Consider why. Class names and test IDs are identifiers read by machines; put them in a resource file and a translator will earnestly "translate" a `submit-button` — and the real risk is someone editing the translation and breaking styles and tests along with it. Logs are read by developers; a log line should be fixed in one language at the moment it is written — logs that follow the user's locale can't be searched or aggregated.

The boundary, stated plainly: **i18n governs what the user can see, not every string in the code.** Draw the extraction scope wrong and both sides suffer — miss what should be extracted and you get an incident; extract what shouldn't be and you get noise. Enough noise, and nobody trusts the resource file or reads the verification report.

## The machine backstop

The six steps are executed by a person (or an AI), and people miss things in a sweep. The system keeps a machine backstop behind them: the data dimension of `harness scan` includes an `i18n-missing-key` check — a key referenced in code but missing from some locale file is counted and deducted (6 points each).

The division of labor between the two: steps 4 and 5 are the active, pre-release verification, and their target is zero; the scan is a passive checkup that can run any time, catching what changed *after* the last verification — someone wrote a new call and never created the entry. One is the checklist before you walk out the door; the other is a smoke alarm. An alarm is no substitute for the checklist, but without it, everything that changed since the last check is nobody's job.

## What it cannot do

Boundaries, stated plainly.

First, it governs **existence**, not **translation quality**. Keys all present and copy clumsy — it calls that a pass. Whether the wording is good is the translator's craft; the most this skill guarantees is that the list the translator receives is complete.

Second, it cannot reach **copy that doesn't live in the code**: error messages returned by a backend, operational copy stored in a database, text baked into an image. None of those are in scan range; each needs its own rules in its own system.

Third, its conclusions hold only for the **audited scope**. Sweep the checkout, skip settings, and the hardcoded strings in settings do not disappear on their own. A human draws the scope — and a region left outside the boundary is exactly as dangerous as the string left unnoticed inside it.

Underneath it all, this skill deals with a peculiar kind of failure: no error, no crash, no log line — it surfaces only in a user's screenshot. There is no clever way around that. You turn "every word the user can see" into a countable asset, and then you count, regularly. The next deep-dive covers `bug-root-cause`: the bug has already happened — how do you force yourself to find the root cause before reaching for a fix, instead of pressing the symptom down first?
