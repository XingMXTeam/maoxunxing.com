---
title: "E2E Testing: Green Proves Nothing — the Journey Has to Work in a Real Browser"
description: "A skill deep-dive in the Harness series: e2e-testing, the evaluation-side execution skill. The cases were authored before any code existed, by write-acceptance-criteria; this skill takes e2e-cases.json at evaluation time and walks every journey in a real browser: start the app, run the scripted cases, capture pages with harness capture and actually look at every screenshot, run at least three exploratory probes, and score the judge items with cited evidence. Why assertions must pin to what the user can see, why weakening a failing case is the same act as silencing the compiler, and why an environment that cannot run a browser makes the evaluation blocked rather than approximate. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "A test suite that is all green while the product is broken"
  - title: "What this skill is: walk the journeys again, in a real browser"
  - title: "How it works: eight steps, from starting the app to writing the report"
  - title: "Detail 1: assertions pin to what the user can see"
  - title: "Detail 2: weakening a failing case is the same act as silencing the compiler"
  - title: "Detail 3: every case carries its REQ id, so a failure has an address"
  - title: "Its limits"
---

This is a skill deep-dive in the Harness series; the skill under the knife is `e2e-testing`. The previous part, [write-acceptance-criteria](/en/harness-skill-write-acceptance-criteria/), covered how the exam is written before any code exists — `rubric.json` and `e2e-cases.json`. This part covers who executes that exam at evaluation time, and how: `e2e-testing` is the evaluator's browser manual. It takes the case set, walks every user journey in a real browser, one by one, and turns what it sees into scores, findings, and improvement suggestions for the exam itself. The overview post, [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), gives the shape of the whole system; this series takes the skills one at a time — why each exists, and concretely how it is done. The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

## A test suite that is all green while the product is broken

Start with a concrete scene.

A to-do app's end-to-end suite is entirely green: the login case passes, the create-task case passes, the delete-task case passes — thirty-odd cases, not one red. A human opens the app and clicks through it: create a task, and it doesn't appear in the list; refresh, and it appears — twice.

Why was the suite green? Read the assertions. The create-task case asserts "the endpoint returned 200 after submit" — the endpoint did return 200; the frontend just dropped the response data when rendering. To keep itself stable, the list case mocks the entire backend and asserts "three rows appeared in the list region" — the mock always serves three rows, while the real endpoint returns a paginated object, the component finds no array to read, and renders blank. A few more cases wait on an idealized selector mentioned in a code comment; the element was later renamed, the selector never matches, so the assertion becomes "some text appears on the page" — and there is always some text on a page.

None of these cases is lying: everything they assert really happened. The problem is that they all assert **things the code says about itself** — which function was called, what status code came back, whether some node exists in the DOM — and not one of them asserts **what the user can see**: click create, and the list gains a row, whose content is exactly what was just typed.

A green light, here, only proves the tests are testifying on their own behalf. This skill exists to take the word "prove" back: the venue of proof is a real browser, the object of proof is the user journey, and the material of proof is screenshots and artifacts — not the code's account of itself.

## What this skill is: walk the journeys again, in a real browser

First, its position. The cases in `e2e-cases.json` were written during the clarify phase by `write-acceptance-criteria`: six categories (core, negative, boundary, crossFeature, persistence, uiJourney), each with a floor; every case carries `mapsTo` (which requirement it verifies), `route`, `steps`, and `expect`; and core and negative each contain at least one case marked `blocking: true`. Question-setting happens before code. `e2e-testing` sets no questions; it is the executor — at evaluation time (both the evaluate and the confirm pass use it), it runs the case set against **the real, running application**, case by case, leaving evidence for each.

It also "maintains" the case set, but in a deliberately restrained way, as we'll see: it may file suggestions for improving it; it may not rewrite the exam itself.

There is exactly one tooling path, with no IDE dependency: everything a browser does goes through Playwright — scripted cases run as `@playwright/test` specs, page screenshots come from `harness capture` (Playwright underneath), and free exploration uses Playwright directly (or a Playwright MCP server if the host provides one). And the skill states one sentence flatly: if Playwright cannot be installed in the environment, the evaluation is **blocked** — report it. **Never substitute API calls, unit tests, or reading the source for a browser journey.** The language-layer part of this series had a line: silencing is not fixing. This is the same discipline from the other side: when real evidence cannot be obtained, report "not verified" — never pass off something else as verification.

## How it works: eight steps, from starting the app to writing the report

**Step 1: start the app.** Bring the application up following the "Run instructions" in `tech-design.md`. It does not start → that is the first finding; record it, don't route around it and test other things. If the app won't even launch, every "pass" after it has no foundation.

**Step 2: run the scripted cases.** Every case in `e2e-cases.json` must end with a result: PASS, FAIL, or SKIP — and a SKIP needs a reason. A failed blocking case is a blocking finding: this one doesn't pass, the feature doesn't move on. The six categories each earn their keep here: core proves the main journeys complete; negative proves bad input, empty data, missing permissions, and network failure don't collapse anything; boundary probes large data volumes and extreme inputs; crossFeature verifies that an action taken here really shows up where it should appear; persistence verifies data survives a refresh or a reopen; uiJourney verifies interface states — loading, empty, feedback. When the cases were authored, the quotas governed *whether* a category exists; at run time, the categories govern *what a failure in this class means*.

**Step 3: capture.** `harness capture <feature> --run-id c<cycle>-<n>` screenshots the core pages one by one, and the run's status must be `pass`. One prohibition deserves its own sentence: evidence runs **must not use `--allow-fallback`** — a degraded capture cannot serve as evidence, because you don't know whether you photographed the product or the fallback page. When visual baselines exist, run `harness visual <feature>` to compare; when they don't, write `no-baseline` honestly. In the skill's own words: `no-baseline` is not a match — "we never compared" must never be phrased as "it matched."

**Step 4: look at every screenshot.** Capturing and archiving is not the job — open every PNG, and for each page write a short structured verdict: hierarchy, color and contrast, spacing and alignment, overflow, states, and the gap to each reference in the vision (each REF-n). Measure what can be measured, with `page.evaluate` inside the page. Screenshots are evidence meant to be looked at; stored but unlooked-at is the same as never captured.

**Step 5: explore.** Beyond the scripted cases, run at least three probes from the heuristics document: double submit, very long input, browser back/forward, refresh mid-edit, actions in an odd order, two tabs at once, a simulated slow network. The scripted cases verify "what we agreed to verify"; the probes verify "what nobody thought of" — real users do not follow the steps.

**Step 6: score.** For every judge item, write its evidence JSON: `score` is 1, 0.5, or 0; `note` says why this score; `artifacts` lists the credentials (screenshots, spec output, API logs); `heuristics` cites the heuristic ids used. Any red-line item checked by screenshot must have a real PNG in its `artifacts` — saying "I looked" does not count.

**Step 7: file suggestions for the exam itself.** When execution reveals an item that is hard to score, impossible to prove, a defect no item covers, or a level set wrong, add `rubricRefinementSuggestions` to the report — typed `refine`, `add-verification`, `add`, or `regrade` respectively.

**Step 8: write the report.** Produce `evaluation/eval-<cycle>.md` in a fixed structure: the case results table (case, category, blocking, result, evidence), the judge-item scoring table, the point-by-point comparison against the references, the exploratory findings table, the findings list, and the rubric-refinement table. The report written, the work is done — and the skill explicitly forbids running `harness eval`: aggregation and state transitions are the kernel's job, not the evaluator's.

Three rules run through all of it. One: **never edit product code, never edit the rubric** — findings are recorded, never fixed on the spot; this is the evaluator-doesn't-play discipline. Two: **never read the developer's working traces** — `developer/**`, `failure-log.md`, and commit messages are all off-limits, because evaluation answers to the product and the exam only; an evaluator who has seen the development process will unconsciously grade the intentions along with the outcome. Three: **a confirmation pass starts from zero** — a new capture, new evidence files; the previous round's screenshots and verdicts may not be reused. Evidence must be freshly collected, in this round, against this round's code.

## Detail 1: assertions pin to what the user can see

Back to the opening scene: an all-green suite over a broken product — the disease is where the assertions sit. This skill nails the assertions down in three places.

The first is **the cases' expectations themselves**. The `expect` in the case set states what the user should see after each step — a new row in the list, the badge count up by one, the empty state showing its guidance copy. Execution checks against these visible outcomes, not against status codes. An endpoint returning 200 while the page never updates is a FAIL under this standard, with no room to negotiate.

The second is **the form evidence takes**. Judge-item scores must attach `artifacts`; a verdict has to land on a screenshot you can open, on a spec run's real output. "I read the source, the logic is correct" is not a legal form of evidence in this skill at all — the tooling section says it up front: reading the source doesn't even qualify as a substitute for a browser journey.

The third is **screenshots actually being looked at**. Step 4 makes opening every PNG and writing a structured verdict an unskippable part of the flow, with each gap named against a REF-n. A whole class of visual problems — text overflow, insufficient contrast, an empty state that's just white — does not exist in the DOM or in any assertion; it exists only in front of eyes (or an evaluator who looks seriously). Writing "look" into the procedure as a step that cannot be skipped is an admission that this class of problem is only catchable by looking — followed by mandating the look.

## Detail 2: weakening a failing case is the same act as silencing the compiler

When a case goes red, the cheapest fix within reach is always to edit the case: loosen the assertion a little, swap the unmatchable selector for a permissive one, skip this one for now. The language-layer part described how an AI, facing a check that blocks the road, chooses the cheap path — an `@ts-ignore` pasted over an error line costs one comment; loosening an assertion costs one line of code, and it turns green immediately, with exactly the same sense of accomplishment.

This skill blocks that path from three directions.

First, **by permission**: the evaluator never edits product code and never edits the rubric. The case set belongs to the rubric system; the right to set questions sat in the clarify phase, and the right to change them has its own separate process. The executor holds no pen — there is nothing to weaken with.

Second, **by trace**: every case must produce a result, every SKIP must carry a reason, all of it written into a fixed-structure report. Skipping a case stops being a silent deletion and becomes an account that has to be explained in public.

Third, **by providing a legitimate road**: discovering that the exam itself has a problem — an item that can't be proved, a defect with no item, a wrong level — is not forbidden to raise; it goes through `rubricRefinementSuggestions`, numbered by the kernel and handled in later cycles. And critical and major findings must map to a rubric id or an `add` suggestion, so every important problem has somewhere to land next round. The exam *can* change — but it changes with a name attached and a number assigned, never edited by the candidate, in the exam hall, mid-exam.

The same logic governs unstable cases. The tooling section has a line that is easy to slide past: when one approach fails (a flaky selector, a timeout), **switch approach instead of re-running the same failing command.** Both halves of that sentence have to be read. One half forbids treating "re-run it until it passes once" as a pass — a green produced by re-running proves nothing. The other half locates which layer the failure lives in: an unstable selector is a defect in the test approach, to be fixed on the spot by switching to a different way of locating the element — the defect stays visible, instead of being diluted by retries into "it goes red occasionally." A single pass might be luck; elsewhere this evaluation system specifically taxes luck (the confirm phase), and here it first cuts off the most common source of luck: buying a pass with retries.

## Detail 3: every case carries its REQ id, so a failure has an address

The acceptance-criteria part explained that every case carries `mapsTo`, naming the requirement it verifies. This skill is the consuming end of that design: the report gives every case one line with its result, and critical and major findings must map to a rubric id (or an `add` suggestion) — a finding phrased as "found a fairly serious problem," with no owner, is not allowed to exist.

Why insist on addresses? Because the report's reader is not a collector; it is the next round's fixer. If a FAIL says only "the checkout case failed," the fixer has to guess which requirement it corresponds to, which criterion governs it, and what to watch while fixing. With the REQ id and rubric id attached, the failure lands directly on one line of the contract: the requirement says this, the criterion says that, the evidence is this screenshot. And retrospectives can run the query in reverse: a requirement that keeps failing — is the implementation unstable, or is the criterion itself badly written? The answer to the latter feeds straight back into step 7's refinement suggestions. Cases, criteria, and requirements share one numbering system; an evaluation system becomes auditable, instead of remaining a pile of standalone conclusions.

## Its limits

Boundaries, stated plainly.

This skill executes and maintains; it does not author. The quality of the evidence is decided upstream: a journey nobody wrote a case for, it cannot invent on the spot — at most, the exploratory probes might trip over it, and a refinement suggestion carries it into the next cycle. A weak case set run with perfect discipline still yields a weak evaluation; the discipline guarantees "what was agreed to verify was honestly verified," not "everything that matters was verified."

It is also expensive, by design. Real browser, full journey walks, every screenshot opened and assessed, at least three probes, all of it repeated from zero in the confirm round — none of that is cheap. This is the slowest, heaviest layer of the whole evaluation, which is precisely why the faster layers (types, scans, unit-level command items) filter ahead of it, and it is reserved for the question only it can answer: can a user, in a real browser, actually get this done?

And it covers only what a browser journey can reach. Whether an endpoint's response shape drifts from the contract when you drive it directly, whether an error payload is shaped the way was agreed — those are not settled by walking the UI; that is the neighboring skill's territory. The next part in this series takes up `api-testing`: end-to-end proves the journeys work; API testing proves the contracts hold.
