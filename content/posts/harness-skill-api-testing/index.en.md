---
title: "API Testing: A Page That Looks Right Proves Nothing About the API"
description: "A skill deep-dive in the Harness series: api-testing, the evaluation-side API probe. Why a page rendering correctly cannot prove the API is fine, why the contract must be checked from outside with real requests (success, every documented error, boundaries, permission denied, malformed input), what each case must record, how the probe log becomes evidence for judge items, and why a contract mismatch and a missing contract are two different verdicts. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "The page looks fine; the API is broken"
  - title: "What this skill is"
  - title: "How it works: cases from the contract, every one a real request"
  - title: "What each case must leave behind"
  - title: "Decision 1: why probe instead of reading the handler"
  - title: "Decision 2: the shape of an error is part of the contract"
  - title: "Decision 3: probes run fresh — old captures are not evidence"
  - title: "What it cannot do"
---

This is a skill deep-dive in the Harness series; the skill under the knife is `api-testing`. It works on the evaluation side — it is one of the tools in the evaluator's hand during the [Evaluate phase](/en/harness-phase-evaluate/): when a task or requirement has an API contract in the tech design, the evaluator uses this skill to check that API. The overview post, [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), covered the whole system's shape; this series takes the skills one at a time — why each exists, and concretely how it is done. The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

## The page looks fine; the API is broken

Start with a concrete scene.

A list page. During a field rename, the endpoint's serialization gets broken: whenever the list actually contains data, the API returns a 500. The frontend is written properly — a failed request lands in a catch block, and the catch block renders the empty state. So the page opens to a clean "No data yet," illustration and all, looking exactly like a legitimate empty list.

The evaluator opens the page, takes a screenshot: nothing wrong. The feature checklist goes item by item — the list opens, the empty state exists, the loading spinner exists. Everything passes.

Except real users' lists are not empty. The API simply never delivered their data. The 500 was swallowed by the frontend's error handling, and swallowed gracefully — so gracefully that from the page alone there is no trace of it.

Failures of this kind share one property: **they don't live in the page; they live behind it.** Verify the page as carefully as you like and you will never reach them. Someone has to walk around to the API side, send a request with their own hands, and look at what actually comes back.

## What this skill is

`api-testing` defines itself in two sentences at the top of the skill:

> Check the contract from outside, with real calls. The developer's report is not evidence; your own requests are.

What it verifies is **the API or data-layer behavior a feature depends on**. It runs during evaluation, and only when the tech design (`tech-design.md`) defines an API contract for the feature. It takes three inputs:

- The "API / interface contracts" section of `tech-design.md` — what requests and responses are supposed to look like; this is the standard.
- The `prd.md` requirements and `e2e-cases.json` cases that depend on the API — which features this interface is feeding.
- **The running app or API**, started the way `tech-design.md` says — with no live service, this skill has nothing to work on.

What it produces is not a sentence like "the API is fine." It produces a per-case probe log (saved to `.harness/tasks/<feature>/evaluation/api-<cycle>.md`), cited from the `artifacts` of the judge items it supports — evidence an evaluation score can be re-checked against.

## How it works: cases from the contract, every one a real request

The workflow has five steps, and none of them is optional.

**Step one: list the cases from the contract.** Not "test whatever comes to mind" — expand the contract into a checklist: the success cases, every documented error, the boundaries (empty, max length, pagination edges), permission denied, and malformed input. No category may be skipped — especially the last two, because the cases that explode when nobody is watching are precisely those two.

**Step two: execute each case as a real request.** With `curl`, `fetch`, or Playwright's `request` context, against the actually running service. The skill states this bluntly: **mocked transports are not evidence.** A mock answers whatever you told it to answer; verifying a contract against a mock is letting the exam's author sit the exam.

**Step three: record each case and give it a verdict** — the next section details what gets recorded.

**Step four: the log is saved and cited.** The log goes to the path above, with the cycle in its name — evaluation cycle N gets cycle N's log — and is then cited in the `artifacts` of the judge items it supports. Between evidence and score there must be a traceable line.

**Step five: split the bad news in two.** Problems the probes find come in two kinds, handled completely differently:

- **Contract mismatch**: the contract said it, the implementation didn't do it. This is a finding with a severity, recorded in the evaluation; the feature goes back for rework.
- **Missing contract**: the design never said what some error is supposed to look like. That is not the code's fault; it is a hole in the contract — recorded as a refinement suggestion (`add-verification`), sent back to the clarify side to complete the contract, rather than letting the evaluator invent a standard on the spot and score against it.

## What each case must leave behind

Every case is recorded in a fixed format, five fields:

- Method + path;
- Request body / params;
- Expected status and shape;
- Actual status and body (trimmed to what the verdict needs);
- Verdict: pass, or not.

Why this detailed? Because the evaluation's standing rule is **no evidence, no pass.** A line like "checked the pagination endpoint, works fine" leaves a reviewer nothing to re-check: which page was requested? How many items were expected? How many came back? It all rests on the recorder's say-so. Lay out these five fields and anyone holding the contract can re-judge the case from the log alone.

The actual body is trimmed so a huge response doesn't bloat the log; but expected and actual must appear as a pair. Actual without expected, and the reader doesn't know what you compared against. Expected without actual, and you're back to the old problem — a report standing in for evidence.

## Decision 1: why probe instead of reading the handler

The most challengeable choice here: doesn't reading the code tell you how the API behaves? The handler function is right there — what it returns, when it errors, all readable. Why send real requests?

Because **reading code reads intent; a real request reaches fact** — and between the two sits an entire chain: whether the route is mounted, whether middleware intercepts, whether the auth configuration is right, whether serialization drops a field, which database the environment variables point at. None of that is inside the handler function, and every link in it can make the real response diverge from the code's intent. In the opening scene, the handler code itself may be completely correct; what broke was the serialization configuration downstream of it.

This is the Evaluate phase's master principle applied at the API boundary: the evaluator may not take the evaluated party's account as evidence. The handler code *is* the API's account of itself. A request goes out and a response comes back — that is the API doing something in front of the evaluator, at evaluation time, which cannot be faked.

Two independence rules come with it. First: **do not use the developer's scripts as the proof.** The developer has self-test scripts; run them and everything is green — green over *their* set of cases, and the category they never covered may be exactly the broken one. Your own requests, with the case list rebuilt from the contract, are how this skill stays independent. Second: **do not modify product code or data fixtures to make a case pass.** A probe measures; it does not repair the thing it measures into passing — touch the code and this cycle is no longer measuring the code that was delivered.

## Decision 2: the shape of an error is part of the contract

This skill spends more ink on errors than on success: every documented error gets its own case, and boundaries, permission denied, and malformed input are all mandatory.

The reason is that the frontend's error states are **built on the contract's error shape**. The design says "invalid parameters return 422, with a body carrying `code` and `message`," and the frontend writes its form-error rendering against exactly that shape. If the real API returns something else — the framework's default HTML error page, or field names that don't match — the frontend can't get what it is waiting for: at best the error message never appears, at worst rendering itself throws. Success path correct and error shape wrong is, for the user, "the page whites out when I submit" — indistinguishable from the API being down entirely.

So what an error looks like is not garnish; it is half the contract. The other half of the logic is in step five: if the design never specified an error shape, that is a hole in the contract, to be filled in the contract — not a verdict the evaluator improvises. An improvised standard produces scores that change with whoever holds them.

## Decision 3: probes run fresh — old captures are not evidence

The `<cycle>` in the log's filename is not decoration: every evaluation cycle, the probes run again and produce that cycle's own log.

Why can't last cycle's log be reused? Because last cycle's log proves "under that cycle's version of the code, with that data, the API responded this way." The code has changed, the fixtures have changed; the old response proves nothing. If API testing accepted replayed captures, it would degenerate into another form of self-report — just with history as the reporter instead of the developer.

This matches the whole system's stance on evidence freshness: screenshots are taken on the spot, probes are fired on the spot. Half of evidence's value is its content; the other half is that it was produced by this cycle, this version of the code.

## What it cannot do

Boundaries, stated plainly.

First, **an API case proves the API — never a browser journey.** That is a rule written into the skill itself. A perfect API can still be wired into the wrong place on the page, bound to the wrong component's state — that is end-to-end testing's territory, outside this skill's range. And the converse holds too: a page that looks right proves nothing about the API, which is the opening scene.

Second, **it verifies "does the implementation match the contract," not "is the contract right."** If the design specified the wrong response shape, the probes will faithfully pass the wrong shape. It can find holes in the contract (missing) and deviations in the implementation (mismatch); whether the contract itself is correct is a clarify-phase and human question.

Third, **it fixes nothing.** It produces evidence and findings; a mismatch goes back to the implement phase to fix, a missing contract goes back to the clarify side to complete. The probe itself changes neither code nor fixtures.

The next deep-dive is `deterministic-eval`: evaluation contains another class of check that neither an exit code nor a single API response can settle — that skill covers how those judgments are made.
