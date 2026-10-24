---
title: "From “It Runs” to Deliverable: Design Notes on a Frontend AI Collaboration System"
description: "The previous post covered why AI-written code needs a scene where mistakes surface; this one describes how I built that scene: five layers of constraints, an eight-stage pipeline, three ways to expose a Skill, and an evaluation system that never lets the model grade its own work."
date: 2026-10-23
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "1. Five Layers of Constraints: Lay the Tracks First"
  - title: "2. An Eight-Stage Pipeline: Split One Job into Eight Verifiable Steps"
  - title: "3. Three Ways to Expose a Skill: Put It in the Wrong Place and Even a Good Skill Gets Lost"
  - title: "4. Evaluation Must Be Deterministic: Never Let the Model Grade Itself"
  - title: "5. The Orchestrator: A Long Workflow Cannot Rely on the Model “Remembering”"
  - title: "6. Four Pits I Fell Into"
  - title: "7. A Four-Week Rollout Path"
  - title: "8. Limitations: I Know Exactly What It Cannot Measure"
  - title: "Closing Thoughts"
  - title: "References"
---

In my [previous post](/zh-cn/harness-engineering-ai-frontend/) (in Chinese), I covered the "why": the model is not incapable of writing code — it lacks a sense of the scene. It doesn't know when it is wrong, and it has no timely way to find out.

This post covers the "how".

Over the past stretch of time, I turned that idea into a working system: a frontend AI collaboration system. It is not a longer prompt. It is a set of interlocking designs: five layers of constraints govern where code may go, eight stages govern how a task gets carried through, evaluation governs what counts as correct, and an orchestrator governs how a long workflow avoids losing its memory halfway through.

The conclusion first, then the details. LangChain ran an experiment on Terminal Bench 2.0: with the model unchanged and only the surrounding Harness modified, the score rose from 52.8% to 66.5% — a gain of 13.7 percentage points, moving from outside the top thirty into the top five.

My own experience matches. The model did not get smarter. The room it has to make mistakes shrank, and the speed at which mistakes get caught went up.

What follows is organized as: the five layers of constraints, the eight-stage pipeline, how Skills are placed, how evaluation works, how the orchestrator runs, the pits I fell into, how to build it from zero, and where its boundaries are.

## 1. Five Layers of Constraints: Lay the Tracks First

I divide frontend constraints into five layers. From bottom to top: language, style, state, engineering, aesthetics.

Each layer answers one question. The language layer asks whether it is wrong. The style layer asks whether it is stable. The state layer asks whether it is accurate. The engineering layer asks whether it goes through. The aesthetics layer asks whether it is right. The order matters. If the code doesn't even compile, talking about visual fidelity is meaningless.

**Layer one: language constraints.** Pin everything down with TypeScript strict mode: explicit types, no slipping past with `any`, no silencing errors with type-ignoring comments. Types are documentation — a function signature should let a caller see at a glance what it returns and what can go wrong.

I think of this layer as a ruler with markings. Write something wrong and the ruler stops you on the spot; you don't have to wait until runtime to find out.

**Layer two: style constraints.** Colors, spacing, and font sizes all go through design tokens — no hard-coded values. Component styles are scope-isolated with CSS Modules. These rules don't live in reviewers' verbal reminders; they live in Stylelint and ESLint, and a violation turns red.

This layer is like a palette with only eight colors. The AI cannot pick a wrong color, because the wrong colors are not on the palette.

**Layer three: state constraints.** State gets an explicit structural definition: fields, types, initial values, and which fields are optional — all written down. Client state and server data are kept apart, with a single source of truth. Local storage keys must be namespaced, so you can tell at a glance which page and which kind of data a key belongs to, instead of an ad-hoc name shared across the whole site.

This layer is like a city with a single highway running from the water plant to every home. You never have to guess where the water comes from — turn on the tap and it's there — and when something breaks, you know which road to trace.

**Layer four: engineering constraints.** Directory structure and which modules may import each other are enforced by an architecture lint. File size and function length have caps — say, no source file over 300 lines, and functions kept to a readable length; exceed the cap and the code must be split. On top of that, pre-commit hooks and CI chain type checking, lint, build, and tests into one pipeline; fail anything and the change doesn't get in.

This layer is traffic rules plus traffic lights. It doesn't suggest that you not run the light — the intersection is designed so you can't.

**Layer five: aesthetics constraints.** Design tokens go one level up: colors, spacing, corner radius, shadows, and motion are all settled into tokens, high-frequency interface patterns are packaged as components, and screenshots are compared for visual regression.

This layer is Lego. Bricks of the wrong size simply don't exist, so there is little room to assemble it wrong.

One frontend-specific judgment deserves calling out here.

LangChain's general-purpose Harness has six layers: filesystem, sandbox, code execution, memory, context management, and orchestration. Mapped onto the frontend, I compressed several of them: filesystem, sandbox, and code execution are essentially absorbed by the engineering layer — a failed build is a failed sandbox, and passing lint means the code executes. Memory, on the frontend, is state, so it belongs to the state layer. Orchestration I pulled out entirely; it becomes the pipeline in the next section.

That compression frees up one layer, and I gave it to aesthetics.

This is not padding. The general Harness literature rarely discusses aesthetics, because for most tasks correctness is binary. The frontend is different. In image-to-code benchmarks such as Omni-I2C, the strongest current models reach visual fidelity in the seventy-percent range, while parameter-level precision sits at only around forty percent — and entity and layout errors account for more than sixty percent of all errors (source: the Omni-I2C benchmark, 2026). In other words, the functionality can be right while the page is still wrong. Whether users will use it depends, to a large degree, on this layer.

## 2. An Eight-Stage Pipeline: Split One Job into Eight Verifiable Steps

Tracks alone are not enough. You also need a timetable.

I split the full life of a requirement into eight stages: initialization → requirements clarification → code generation → documentation → evaluation → acceptance → release → evolution.

Initialization registers the task and creates a state record. Requirements clarification translates the requirement documents and design annotations into an executable plan. Code generation writes the code according to the plan. Documentation, after the code is written, works backward from the code to document what the feature does and what conventions it carries. Evaluation and acceptance are two layers of checking, which I'll detail below. Release follows the normal branch-and-merge flow. Evolution writes this round's failures and fixes back into the rules and Skills, so the next round avoids the same pit.

Placing documentation after code generation and before evaluation is deliberate. It can run in parallel with evaluation: evaluation reads code, not documents. And some problems — a missing text resource, say — are far faster to fix right there in the documentation stage than to send back through clarification and generation again.

The pipeline runs on three principles. All three were learned the hard way.

**Principle one: define what "done" looks like before writing any code.**

The plan produced by the clarification stage must contain a testable list of functional points. Not "build a to-do page," but broken down to this granularity: "Add a to-do — the user enters text, the input is validated as non-empty, the item is added to the pending list, the input box is cleared." Every item can be verified on its own: done or not, done right or not.

Anthropic has a finding I strongly agree with: the wording of the grading criteria doesn't just judge the output — it actively shapes the direction the generator moves in. Write "done" clearly, and the AI converges toward it as it writes.

The counterexample is the most common instruction of all: "Finish the homepage." The AI improvises freely for six hours; at acceptance time you discover the direction was wrong, and changing one sentence costs half a day of rework. Vague instructions are never executed. They are amplified.

**Principle two: detection and repair must be separated.**

The evaluation stage only reports problems. It is never allowed to fix code on the side. Repairs may only happen by retrying the code generation stage, or by following the acceptance stage's routing.

The reason is practical. Repair inevitably introduces new problems: evaluation fixes a style issue and breaks a type; fixes the type and drops a piece of copy. Worse, once evaluation touches the code, that evaluation can no longer be reproduced — you can't tell which version of the code the report was describing.

Once the two are separated, every evaluation corresponds to one fixed report, and every failure's retry path is on record.

**Principle three: acceptance uses four gates, short-circuited in order.**

The acceptance stage has four gates: canRun (does it run), dataReady (is the data complete), usageRight (is everything used correctly), and featureWorks (does the feature work end to end). Behind each gate sit evaluation scores from several dimensions, and every dimension has its own passing line.

The key is the short circuit: if the first gate fails, the remaining three don't run at all. The work goes straight back for a retry.

This is not about saving time. The order itself carries the logic. If the code doesn't compile, checking whether the copy is complete or the components are used correctly yields nothing but noise. Confirm it runs first, and the later checks mean something. And if the first gate fails repeatedly, the problem is most likely not the code but the plan — that's the moment to stop and bring in a human, not to let it keep retrying.

A word on rhythm. The pipeline has three feedback loops. While code is being written, compiler and lint errors flow back in seconds — one line written, one line checked. When a feature is finished, a minutes-level loop opens the browser, looks at the result, and compares screenshots. At commit time, CI runs the full sweep — types, unit tests, end-to-end tests, visual regression — on a longer cycle. The earlier a loop, the cheaper it is. Whatever can be caught in seconds should never be left until commit time.

## 3. Three Ways to Expose a Skill: Put It in the Wrong Place and Even a Good Skill Gets Lost

In this system, each stage's capability is written as a Skill document: when to use it, the steps to follow, and the anti-patterns that are not allowed.

After writing more than twenty of them, I found a problem more fatal than content: **where a Skill sits, and how it gets loaded, decides whether it survives until the moment it is needed.**

The reason is context compaction. In a long conversation, the context is periodically compressed into a summary to free up space. Different carriers fare very differently under compression.

A Skill's name and one-line description are periodically re-injected, so they basically never get lost. But once a Skill's full text is pulled into the context, compression folds it into the summary, and the critical steps get sanded away. I measured this: a Skill injected on demand retains only a single-digit percentage of its full text after one compaction, and nothing after the second.

Content read directly from files does better: after the first compaction it survives almost intact, but the second compaction wipes it out just the same. Only what lives in project-level instruction files is reloaded every turn, untouched by compaction — but those files have to stay short, and process detail doesn't fit.

So I use three exposure modes, split by a Skill's size and frequency of use:

- **Direct embedding**: short and high-frequency, kept within two hundred lines. It sits closest to the model and triggers most reliably; the cost is the space it occupies.
- **Subagent reading**: medium-length Skills stay out of the main conversation. An independent subagent reads the full text in its own context and runs the whole process; the main conversation receives only the result.
- **Pre-read precise injection**: for long, low-frequency Skills, only the key sections marked "must-read" are pre-read into the main context, and the full text is left for a subagent to run.

There is also one hard cap: **no more than 12 globally registered Skills.**

The number 12 was found by trial. Every name and description in the global list is a fixed cost paid on every turn. Past a certain count, two things happen: the signal-to-noise ratio of each turn drops, and the model is more likely to pick the wrong name from a long list; and the total length swells, which makes compaction arrive earlier and more often — so the Skills you meant to make easier to use die faster instead. Once you're past a dozen or so, it's time to talk about demotion: a new Skill defaults to project level, and only one that users have directly triggered several times earns promotion to global.

A note on how the Skills themselves are written. Each does exactly one thing, in steps, and every step must have a verifiable output — "write a plan" is not a step; "produce a plan with a functional-point list" is. Each also carries at least three anti-patterns drawn from real failures. Not filler like "don't write bad code," but enforceable prohibitions like "when the requirements never mention an error code, never invent one." They average under a hundred lines each. Complex jobs are composed by the orchestrator, not by letting a single Skill grow long.

## 4. Evaluation Must Be Deterministic: Never Let the Model Grade Itself

The one rule I hold most firmly in this whole system: **after the code is written, judging right from wrong must be done by code, not by a model.**

Anthropic said it bluntly in their work on harness design for long-running applications: an out-of-the-box Claude is a terrible QA agent. It can see a real problem, then talk itself into believing "it's not a big deal," and approve its own work anyway.

This is not a defect of any particular model. It is decided by position. Make the generator double as the reviewer, and it will naturally be lenient with itself.

So my evaluation is split into five dimensions, every one of them judged deterministically:

- Structure: does the code type-check and compile, is anything bypassing checks with ignore rules, do imports respect the architecture constraints, are files and functions within length limits. This uses compiler exit codes and syntax-tree scans.
- Data: are all text keys present, is the state structure closed, do local storage keys follow the namespacing convention. This compares the keys used in code against the key set in the resource files.
- Logic: walk the functional-point list from the clarification stage, item by item, and check that the code contains the corresponding implementation and key branches. This is why functional points must be written before the code — they are the exam paper for evaluation, and writing the questions after the exam would be pointless.
- UI: do styles go through component scoping, are colors and spacing using variables rather than hard-coded values, is responsive behavior covered.
- End-to-end: actually run the tests, count passes and failures, and check whether the main flows are covered.

Every check must produce evidence: exactly which file, which line. Without evidence, it does not count as a pass. I do not accept "looks fine" in an evaluation report — that is precisely the thing this whole system exists to eliminate.

Each dimension runs alone, in its own independent subagent context. The one running structure cannot see the conclusions of the one running data, so nothing primes the judgment — a problem found earlier should not sway how a later dimension is scored.

Finally, the rule for reports: once an evaluation report is written, it is never modified. If code is regenerated and re-evaluated, that produces a new report; the old one stays. That is what makes a post-mortem able to answer one crucial question: was the cause of this failure already flagged in the previous report? If it was, the problem is in routing and repair. If it wasn't, the problem is in the evaluation itself. Without the archive, that account can never be settled.

## 5. The Orchestrator: A Long Workflow Cannot Rely on the Model “Remembering”

What happens if all eight stages run inside a single main conversation?

Entering each stage means loading that stage's full Skill text into the context. Eight of them add up to over a thousand lines, and by the fifth stage the context inevitably triggers compaction. And once compaction hits, the constraints and conclusions of the first four stages are sanded down into a few sentences in a summary — the more critical the detail, the cleaner it is lost.

I measured this with a probe method: at the start of the workflow, plant a set of key rules as probes, and at the end of each stage, spot-check how many of those rules are still remembered. In main-conversation mode, by the fifth stage the information retention rate is down to around 40%.

The fix is to move the workflow out of the conversation and hand it to an orchestrator: a deterministic program with very plain logic.

Each stage is dispatched to an independent subagent. The subagent gets a brand-new context, loads only its own stage's Skill, and takes only the inputs its stage needs. When it finishes, it writes its results into a state file and exits.

Stages don't pass information by "remembering." They pass it through the state file. The state file is the pipeline's single source of truth: the orchestrator reads it to decide the next step, and each stage writes to it only at its own boundaries, never midway. It looks like this (simplified):

```json
{
  "feature": "todo-app",
  "phase": "evaluation",
  "history": [{ "phase": "code generation", "status": "passed" }],
  "artifacts": { "plan": "...", "evalReport": "..." },
  "verdict": { "passed": false, "firstFailGate": "canRun", "retryCount": 1 }
}
```

When acceptance fails, the orchestrator routes by which gate failed: it can't run, so back to code generation; data is incomplete, so back to code generation with the resources filled in; the feature doesn't work but the code itself is fine, so it may be an environment problem — hand it to a human. Retries have a cap too; exceed it and everything stops, rather than letting it spin forever in a dead end.

In this mode, the main conversation sees only whether each stage passed or failed, and its context stays far cleaner. Measured with the same probe method, by the fifth stage the information retention rate reaches around 95%.

The difference is not in the model. It is in where the information lives. Put it in the conversation, and it gets compacted along with the conversation. Put it in files and program variables, and it doesn't.

## 6. Four Pits I Fell Into

**Pit one: evaluation started out as model judgment.**

The first version of evaluation had the model read the code and write conclusions. It gave itself full marks — a claimed 100 — while in reality only about thirty percent of the code was usable when actually run, and the end-to-end tests were wiped out entirely.

The root cause is the self-leniency described in section four. The fix was to rewrite all five dimensions as deterministic checks, every one of them landing on a concrete command and a file line number.

The lesson in one sentence: a lint error is not just an error — it is simultaneously a repair instruction for the model. The more specific the report, the more precisely it fixes things.

**Pit two: registering every Skill globally.**

The thinking at the time was convenience — put them all up in one go. The result was that no task could run for long: once the global list swelled, compaction arrived earlier and more often, and after two compactions the evaluation stage dropped straight to zero across the board.

The root cause is in section three: global registration carries a fixed cost. The fix was to press the global set strictly back under the cap and move the rest back to project level, where the orchestrator invokes them when needed.

The lesson in one sentence: global slots are a hard constraint, not a directory. Before adding a new one, think about which one gets demoted.

**Pit three: running the whole pipeline in the main conversation.**

The symptom is the first half of section five: by the fifth stage, the rules established in the earlier stages had mostly been eaten by compaction, and the later stages were effectively working from gut feeling inside an amnesiac context.

The fix was to write the orchestrator and move the stages into independent subagents.

The lesson in one sentence: never stack workflow content in the main context. Any design that runs a long workflow inside one long conversation will collapse somewhere in the middle — it is only a question of when.

**Pit four: a bug in the orchestrator's state machine skipped several stages outright.**

On the first end-to-end run, only four of the eight stages actually ran; initialization, code generation, and evaluation were mysteriously skipped, while the workflow reported that everything was fine.

The root cause was the "which stage runs next" logic: when a stage had never run and its history was empty, the code misjudged that as "already passed, advance" — and skipped its way forward.

The fix was to split the decision into three explicit steps: first, check whether the stage failed and still has retries left — if so, stay on this stage; then check whether it has never run — if so, run this stage; only then check whether it passed — and only advance if it did.

The lesson in one sentence: unit tests cannot catch this kind of state-machine bug. Each stage tests fine in isolation; what is wrong is the handoff between stages. It only becomes trustworthy after a real end-to-end run.

## 7. A Four-Week Rollout Path

None of this needs to land all at once. My own order took four weeks, each week addressing one class of problem:

| Week | Goal | Key deliverables |
|---|---|---|
| Week 1 | Nail down the language and engineering layers | Turn on type strict mode and ban the bypass patterns; write the architecture lint and the size lint; wire all checks into pre-commit hooks. When the AI writes code, errors are intercepted within seconds, with repair hints attached |
| Week 2 | Write Skills for the key stages | Three core stages embedded globally, a few long workflows placed at project level. Say "build a new feature" and it can walk from clarification through generation |
| Week 3 | Bring up evaluation and acceptance | Land the five dimensions one by one; once aggregated, connect the four-gate short-circuit acceptance. Generation is no longer the finish line — passing the gates is |
| Week 4 | Bring up the orchestrator | Write the state file and stage routing; fill in the release and evolution stages; give the orchestrator a smoke mode that doesn't depend on the conversation environment. Take one small feature and run all eight stages end to end |

The state after four weeks: the net addition of code is actually small — a little over a thousand lines of rules, Skills, and orchestration logic — in exchange for a noticeably shorter development time on every feature after that. The slow part is the one-time system building. The fast part is everything that follows.

If you only take one thing, take week one. Constraints don't need a complete system to start working: strict mode plus two lints can, this very afternoon, make the AI commit one whole category of mistakes less often in your project.

## 8. Limitations: I Know Exactly What It Cannot Measure

**First, the aesthetics layer can only be half measured.**

What automation can check: whether variables are used, whether scoping is right, how far a screenshot has drifted from the baseline. But "is this color pairing tasteful," "does the spacing have rhythm," "is the type hierarchy clear" — automation currently covers only about half of those judgments. The other half still takes screenshots plus human review, or a score from an independent reviewing agent — and that score must be deliberately calibrated toward suspicion, or it repeats the self-leniency mistake.

This is also why I call aesthetics the frontend-specific layer and, at the same time, the weakest of the five. Admitting it is weak matters more than pretending it is solved.

**Second, orchestration is limited by the tool platform.**

The pattern of independent subagents plus scripted orchestration can currently run in full mainly inside one tool; most other common AI coding environments don't yet support the same orchestration primitives. My compromise is to write the orchestrator as a standalone command-line program: in environments that support it, it connects to subagents and runs in real mode; in environments that don't, it falls back to simulation mode, so at least the state-file structure and stage routing can be validated without locking the design to one tool. But the experience gap is real, and there is no glossing over it.

**Third, constraints have a shelf life.**

This system is not build-it-once-and-forget-it. Every time the model is upgraded, you should run an ablation: remove one constraint and watch whether results get better or worse. Some constraints patch a model's current shortcomings; once the model closes the gap, the guardrail becomes an obstacle. There is also a subtler effect — a model overfits to the tools and harness it has used for a long time, so swapping out one part of the workflow can make results worse rather than better. That, too, can only be found by measurement, never by reasoning about it.

The broader industry background is not encouraging either: one survey found that among heavy users of AI coding tools, close to seventy percent report that AI-generated code carries at least a fifty-percent chance of causing a deployment problem, and around half feel code quality is declining. Speed arrived first; the delivery system didn't keep up. This harness addresses the share inside my own projects — it is not some universal remedy.

## Closing Thoughts

Back to the line from the beginning: don't look for a smarter horse; build a better track.

Models will change, and change fast. But looking back, the real core of this system is not any particular number or tool. It is five compensating designs: define "done" before starting, separate detection from repair, hand over context passively wherever possible, split long workflows into independent contexts, and trust only deterministic evidence for evaluation.

What they compensate for is not the model's intelligence but its structural shortcomings: it doesn't know what it doesn't know, it will talk itself into believing everything is fine, it cannot remember long workflows, and it can be drowned by context. Those shortcomings won't disappear just because the model gets one size bigger, so this design won't expire quickly either. What expires is individual constraints — and that is exactly what regular ablation is for.

I extracted the evaluation piece of this and turned it into a small open-source tool, ai-code-gate (github.com/XingMXTeam/ai-code-gate): five-dimension scoring plus four-gate short-circuiting — a simplified version of the evaluation and acceptance sections of this post. It runs directly in your own projects; if you want to read the code, it's there.

The previous post was about why a scene is needed; this one is about how the scene is built. If there is a next one, I want to write about the evolution stage: how a system turns every failure into one of its own rules, instead of relying on a human writing up a post-mortem that ends up filed away in a document.

## References

- LangChain, "The Anatomy of an Agent Harness" — the six-layer anatomy of Agent = Model + Harness, and the Terminal Bench 2.0 numbers
- Vercel, "AGENTS.md outperforms skills in our agent evals" — the controlled experiment on passive injection vs. active retrieval
- OpenAI, "Harness engineering: engineering in the agent-first world," and the Codex team's zero-handwritten-code internal practice (as surveyed by Yage.ai)
- Anthropic, "Harness design for long-running application development" — harness design for long-running applications, and the reviewer self-leniency problem
- The Omni-I2C benchmark (2026) — visual fidelity and parameter precision of mainstream models on image-to-code tasks
- Fred Brooks, "No Silver Bullet" (1986) — the distinction between essential and accidental complexity
