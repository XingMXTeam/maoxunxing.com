---
title: "From “It Runs” to Deliverable: Design Notes on a Frontend AI Collaboration System"
description: "The previous post covered why AI-written code needs a scene where mistakes surface; this one describes how I built that scene: five layers of constraints, a five-phase state machine with three roles, an evaluation system that never lets the model grade its own work, and a kernel that runs long workflows on a file-based state machine. The system is open source (frontend-harness-cli), and every mechanism described here can be found in the repository."
date: 2026-10-23
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "1. Five Layers of Constraints: Lay the Tracks First"
  - title: "2. Five Phases, Three Roles: The Workflow Is a State Machine, Not a Document"
  - title: "3. Designing the Skills: From Stage Documents to Artifact Contracts"
  - title: "4. Evaluation Must Be Deterministic: Never Let the Model Grade Itself"
  - title: "5. The Kernel: A Long Workflow Cannot Rely on the Model “Remembering”"
  - title: "6. Four Pits I Fell Into"
  - title: "7. Adoption: Three Steps Now"
  - title: "8. Limitations: I Know Exactly What It Cannot Measure"
  - title: "Closing Thoughts"
  - title: "References"
---

In my [previous post](/zh-cn/harness-engineering-ai-frontend/) (in Chinese), I covered the "why": the model is not incapable of writing code — it lacks a sense of the scene. It doesn't know when it is wrong, and it has no timely way to find out.

This post covers the "how".

Over the past stretch of time, I turned that idea into a working system: a frontend AI collaboration system. It is not a longer prompt. It is a set of interlocking designs: five layers of constraints govern where code may go, a five-phase state machine governs how a task gets carried through, evaluation governs what counts as correct, and a kernel governs how a long workflow avoids losing its memory halfway through.

> **Revision note (Nov 2026)**: This post was first published in October 2026 and described an early shape of the method — eight stages, one Skill per stage. Since then I rewrote the whole system as the open-source tool [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli) and kept iterating. The workflow changed shape: stages became kernel states, skills are now named after the artifacts they produce, and acceptance is a rubric with veto power. This revision replaces every mechanism with the open-source version's current form; the design thinking, the measured data, and the post-mortems remain as they were. Every mechanism described below now has a corresponding implementation in the repository.

The conclusion first, then the details. LangChain ran an experiment on Terminal Bench 2.0: with the model unchanged and only the surrounding Harness modified, the score rose from 52.8% to 66.5% — a gain of 13.7 percentage points, moving from outside the top thirty into the top five.

My own experience matches. The model did not get smarter; the space in which it can go wrong got smaller, and mistakes surface faster.

What follows, in order: the five layers of constraints; the five phases and three roles; how the Skills are organized; how evaluation works; how the kernel runs; the pits I fell into; how to adopt it; and where its boundaries are.

## 1. Five Layers of Constraints: Lay the Tracks First

I divide frontend constraints into five layers. From the bottom up: language, styling, state, engineering, aesthetics.

Each layer answers one question. The language layer asks: is it wrong? The styling layer: is it stable? The state layer: is it accurate? The engineering layer: does it connect? The aesthetics layer: is it right? The order is not negotiable. If the code does not compile, talking about visual fidelity is meaningless.

**Layer one, language constraints.** TypeScript strict mode, nailed down: explicit types, no escaping through `any`, no type-suppression comments papering over errors. Types are documentation — a function signature should tell the caller at a glance what it returns and what can go wrong.

I think of this layer as a ruler with markings. Write something wrong and the ruler stops you on the spot; you don't need to wait until runtime to find out.

**Layer two, styling constraints.** Colors, spacing, and font sizes all go through design tokens — no hard-coded values; component styles are scope-isolated with CSS Modules. These rules don't live in code-review reminders; they live in Stylelint and ESLint, and violating them turns the build red.

This layer is a palette with only eight colors. The AI cannot pick the wrong color, because the wrong colors are not on the palette.

**Layer three, state constraints.** State needs an explicit structural definition: fields, types, initial values, which fields may be absent — all written down. Client state and server data stay separate; one source of truth. Local-storage keys must be namespaced, so you can tell at a glance which page and which kind of data a key belongs to, instead of an improvised name shared by the whole site.

This layer is a city with a single road from the water plant to every house. You never guess where the water comes from; turn on the tap and it's there, and when something breaks you know exactly which road to inspect.

**Layer four, engineering constraints.** Directory structure and which modules may import which are enforced by an architecture lint; file size and function length have caps — a source file stays under roughly 300 lines, functions within readable length, and anything over gets split. On top of that, pre-commit hooks and CI chain type checking, lint, build, and tests into one pipeline; nothing gets in unless the pipeline passes.

This layer is traffic rules plus traffic lights. Not advice against running a red light — an intersection designed so you can't.

**Layer five, aesthetics constraints.** One step above design tokens: colors, spacing, radii, shadows, and motion are all distilled into tokens, high-frequency interface patterns are packaged as components, and screenshot comparison provides visual regression.

This layer is Lego. Bricks of the wrong size simply do not exist, so the room to assemble something wrong is small.

One frontend-specific judgment is worth calling out.

LangChain's general-purpose Harness has six layers: file system, sandbox, code execution, memory, context management, orchestration. Mapped onto the frontend, I compressed the first few: file system, sandbox, and code execution are effectively absorbed by the engineering layer — a failed build is a failed sandbox, passing lint means the code executes; memory, on the frontend, is state, so it belongs to the state layer; orchestration comes out on its own and becomes the state machine below.

The compression freed one layer, and I gave it to aesthetics.

That is not padding. The general Harness literature rarely discusses aesthetics, because in most tasks correctness is binary. The frontend is different. In image-to-code benchmarks such as Omni-I2C, the strongest current models reach seventy-some percent on visual fidelity, only about forty percent on parameter-level precision, and entity and layout errors account for more than sixty percent of all errors (source: the Omni-I2C benchmark, 2026). In other words, the feature can work and the page can still be wrong — and whether people will use it depends largely on this layer.

In the open-source version, these five layers land in two places: the rules and stack packs that `harness init` installs into your project per stack (Next.js, React, Vue, Node), and the five-dimension scan in evaluation that checks them back, item by item. Writing a constraint down and having someone verify it are two different things; you need both. Next, how a task flows.

## 2. Five Phases, Three Roles: The Workflow Is a State Machine, Not a Document

Tracks laid, you need a timetable. The early version split a request into eight stages, each written as a Skill for the model to follow. When I rewrote the system as open source, I overturned exactly that: **a phase should not be a document; it should be a state in code.** A document relies on the model remembering to obey it; a state is enforced by a program. This was the single most important change of shape in the whole system.

A feature now lives through five phases, driven by the kernel's state machine:

**Clarify → Implement → Evaluate → Verify → Done**, plus a **Paused** state it can enter at any time.

The work is not done by "the model in the main conversation" but by three roles, each with its own context, input packet, and permission boundary:

- **The planner** appears only in Clarify. It interviews a one-line request until open questions hit zero, then produces the contract files in a fixed order: `prd.md` (every requirement numbered), `vision.md`, `tech-design.md`, `pages.json`, `tasks.json`, `rubric.json`, `e2e-cases.json`. If you already have a finished PRD, that works too: `harness new <feature> --prd <file>` imports it verbatim — not one requirement number changed — and clarifying shrinks to confirming and filling gaps.
- **The developer** works in Implement, one task at a time: implement it, run its checks, make one precise commit. It has one deliberate permission design — **it never sees the rubric**. It builds from the plan, not to the test.
- **The evaluator** appears in Evaluate and again in Verify, and the two appearances must be **different fresh contexts**. It scores the work against the rubric, item by item, handing over evidence only — it is never allowed to fix code on the side.

The pipeline follows three principles, all learned the hard way.

**Principle one: define what "done" looks like before writing any code.**

Clarify ends with a coverage gate: every numbered requirement must have at least one essential check, one quality item anchored to something concrete (or a written waiver), and end-to-end cases across six categories. Coverage incomplete, the state machine does not release the feature — not one line of code gets written.

Why so strict? Anthropic has a finding I strongly agree with: the wording of a rubric does not merely judge the output, it actively shapes what the generator produces. Write "done" clearly and the AI converges toward it as it writes. The counterexample is the most common instruction of all — "finish the homepage." The AI improvises for six hours, and at acceptance time you discover the direction was wrong. A vague instruction is never executed; it is amplified.

**Principle two: detection and repair must be separate.**

Evaluation only reports problems; it never fixes code as it goes. Fixes happen back in Implement, and only for the open items the evaluation report listed.

The reason is practical. A fix inevitably introduces new problems: evaluation patches a style and breaks a type; fixes the type and drops a copy string. Worse, once evaluation has touched the code, that evaluation can no longer be reproduced — you can't tell which version of the code the report describes. Separated, every evaluation corresponds to one fixed report, and every failure's retry path is on record.

**Principle three: vetoes outrank totals, and stability outranks a single pass.**

Rubric items come in three kinds: command (run for real), judge (scored from evidence), manual. Two kinds carry veto power: **an essential item scoring 0 fails the whole feature outright; a triggered pitfall item (say, a type-suppression comment used to bypass a check) fails it too — no matter how high the total score is.**

Passing evaluation is still not the end. In Verify, a second, independent evaluator regenerates every judge item's evidence **from scratch** — evidence older than the previous evaluation scores 0 — and the feature must pass a configured number of consecutive rounds. One pass can be luck; a different person, fresh evidence, several rounds in a row — that is stability.

One more hard check, tied to tasks: when the developer claims a task is done, it must report the commit SHA, and the kernel verifies with `git rev-parse` that the commit actually exists. A SHA that doesn't resolve means the task is not done. This rule sounds funny until you know why it exists: models do "claim" commits they never made.

For readers of the earlier version, a translation table — where did the eight stages go? Init became the `harness init` command. The docs stage disappeared: the contract files are written during Clarify, the artifacts are the docs, and at Done, sync-overview folds the stable conclusions into the project overview. Publish became the delivery gate (your own build, tests, and lint must all pass). Evolution split into two guarded loops, covered in section 5. The remediation loop lives between Evaluate and Implement. The stages did not disappear; they went from "a process to memorize" to "states you never have to think about."

## 3. Designing the Skills: From Stage Documents to Artifact Contracts

This section gets extra room, because the Skills are where the system changed the most — enough that it deserves saying out loud: **from the classic eight stages to the current CLI, the stages disappeared, yet the Skills grew from 14 to 21, and every one of them got shorter.** That is not a numbers game; the division of labor changed. In the early shape, one Skill was one stage — `ait-clarify`, `ait-generate`, `ait-evaluation` — each 100 to 230 lines, carrying its own triggers ("use me when the user says 'make a plan'"), remembering who ran before it, and conducting an entire stretch of the workflow. It was both the manual and the process itself.

In the new design, two of the Skill's powers were taken away: **sequencing belongs to the kernel, judgment belongs to evaluation, and a Skill keeps exactly one thing — the craft of producing one artifact.** None of the 21 Skills is named after a phase. Clarify is an authoring chain (`clarify-requirements` → `write-prd` → `write-quality-vision` → `write-tech-design` → `write-dev-plan` → `write-acceptance-criteria`); Implement has `implement-task` and `systematic-debugging`; Evaluate has `e2e-testing`, `api-testing`, `deterministic-eval`, `fix-from-report`; Delivery has `ship-checklist` and `sync-overview`; plus a set of general crafts (`component-from-design`, `state-schema-first`, `i18n-extract`, and more). The average is around 70 lines; the shortest is under 40.

### Anatomy of a Skill

Take `write-prd` as the specimen. A new Skill has five parts, and every part has a contractual flavor:

**The description line is an interface declaration.** It reads: "Harness planner, authoring step 1. Use only after clarify-requirements finished with confirmed-by-user: yes and zero open questions." Role, position, precondition — one sentence, written for the kernel and the roles to read, not as advertising copy for humans.

**A Gate.** Before entering the Skill, check the files: does the confirmed clarification summary exist? Are its markers right? Has the project overview been read? If a condition fails, stop and return to the previous Skill. The old shape triggered when the model "felt it was time"; the new preconditions are facts that can be checked one by one.

**An artifact structure (the output contract).** The nine sections of `prd.md` are fixed: problem, users and scenarios, user stories, numbered requirements, non-functional requirements, "what good looks like," non-goals, success measures, overview deltas. The critical line: the requirement ids `REQ-n` are **copied verbatim into rubric.json** and become the denominator of evaluation. A Skill's output is no longer "a document for the next person to read" — it is "a contract for machines to consume." Write it vaguely and the coverage gate stops you on the spot.

**A mode check.** A capability the old Skills simply did not have: the same Skill first reads the state, then decides how to work. If `state.json` marks this feature's PRD as user-imported, `write-prd` switches to normalize-only mode — fill numbering gaps, report missing sections, **never renumber, never reword**. Different entry, different discipline, same file.

**Rules and Done Criteria.** The Rules are concrete prohibitions ("one requirement, one testable sentence"; "no implementation detail in the PRD"). The Done Criteria are checkable exit conditions ("all nine sections present, numbering continuous, no TODOs"), and the last line names the next Skill — as a hint only. The real order is decided by the kernel's state; the Skill does not get a vote.

### Why it is designed this way

Five decisions, with their reasons.

**One: split by artifact, not by phase.** A phase is a process concept, and a unit cut that way cannot be accepted: has "run the clarify phase" been done? Nobody can judge that. An artifact is a physical thing: "prd.md, nine sections, continuous numbering" can be judged. Small grain buys two more things — when something fails you can locate which craft failed, and composition gets flexible: `implement-task` is reused by every feature, `fix-from-report` is reused across phases, instead of a copied variant living inside every stage document.

**Two: strip process knowledge out of the Skills.** The old shape's biggest lesson is pit two in section 6: order written in documents, executed by the model's good behavior, fails at the seams — inevitably. In the new shape a Skill declares only its own gate and its done criteria; "what runs next" is ruled by the state machine. It is moving the traffic rules out of the driver's handbook and into the signal system: the handbook still states the rules, but what makes you stop is no longer your memory.

**Three: make the output contractual, so downstream can verify it mechanically.** A `REQ-3` is born in the PRD, becomes a check item in the rubric, a line of evidence in the evaluation report, and part of the denominator in the coverage gate. The chain only lines up if the source Skill's output is structured enough. Good prose is useless in a Skill; being consumable is everything. That is the deepest difference between documentation written for AI and documentation written for humans.

**Four: package by role — visibility is permission.** At `harness init`, Skills are packed into each role's task packet: the planner gets the authoring chain, the evaluator gets the evaluation Skills, and **the developer's packet contains no evaluation Skills at all** — the same design as its never seeing the rubric. The old shape was a global registry: every Skill visible to everyone, every turn of conversation paying context cost for the whole list — I even had to impose a hard "no more than 12 global Skills" cap to rescue it. The new shape turns that problem from quota management into packaging: there is no global list; each role simply has its few Skills at hand while it works.

**Five: Skills get evaluated too.** The system keeps a golden set (the cases behind `harness skills eval`): standard tasks that periodically score the Skills, with regressions raising alarms. In the old shape, Skill quality was judged by feel, and "evolution" meant a human editing documents after a post-mortem. The new shape manages Skills like code — contracts, gates, regression tests. Rules expire as models improve (section 8 covers ablation); without regression tests you would not even notice when a Skill started holding you back.

One more problem solved along the way: **host portability.** The old Skills were bound to one tool's ecosystem — triggers and question tools were that vendor's conventions. The new Skills reference only files and state — which path the summary lives at, which field in the state file — never a host-specific capability. The same Skill therefore installs into Claude Code, Codex, or any runtime that can read files, with `init` rendering the host's shell around it. Each Skill also ships a Chinese reading copy (`SKILL.zh-CN.md`): humans review in Chinese, the English file is the one that executes — the human-facing and machine-facing versions, formally separated.

Side by side, the difference is plain:

| | Classic eight stages (ait) | The CLI now |
| --- | --- | --- |
| Count and grain | 14 Skills, 100–230 lines each | 21 Skills, 38–134 lines each |
| Named after | Phases (ait-clarify) | Artifacts (write-prd) |
| Who sets the order | The Skill documents, executed by the model | The kernel state machine |
| Trigger | User phrasing / events, global registry | Loaded per role task packet |
| Output | A document for the next phase to read | A contract consumed by rubric and gates |
| Visibility | Global, with a count cap | Packaged per role; the unneeded is invisible |
| Quality assurance | Manual post-mortems, hand-edited evolution | Golden-set regression evaluation |
| Host | Bound to one tool's ecosystem | References only files and state; cross-runtime |

One old lesson survives, relocated rather than refuted: context gets compacted, and process detail that lives in the conversation dies. So a Skill must be a file on disk, handed back to the role by its task packet at every step — never something anyone, model included, is expected to "remember." The previous version of this post titled this section "put it in the wrong place and even a good Skill gets lost." The new design simply concedes the point, and makes "putting it in the right place" the installer's job instead of the user's virtue.

## 4. Evaluation Must Be Deterministic: Never Let the Model Grade Itself

The one rule I hold hardest in the whole system: **after code is written, judge correctness with code wherever possible, not with a model.**

Anthropic puts it bluntly in their work on long-running harnesses: out of the box, Claude is a poor QA agent. It can see real problems, talk itself into "these are not a big deal," and approve its own work anyway.

That is not a defect of any particular model; it is a property of the position. Make the generator its own reviewer and it will be lenient with itself by construction. So evaluation is split into two layers:

**Layer one, rubric evaluation — did this feature get built right?** It is part of the contract, written during Clarify. Items run two ways: command items are deterministic — compiler, grep, tests, the five-dimension scan below — and exit codes do the talking; judge items genuinely need judgment (say, "does the empty-state copy explain what to do next"), and those are scored by the evaluator from **fresh evidence** — live Playwright screenshots, real API probe responses — never from "I read the code and it looks fine." Every check must produce evidence: which file, which line, which screenshot. No evidence, no pass.

**Layer two, the five-dimension scan — how healthy is this codebase?** It is a standalone instrument (`harness scan`, usable without the full workflow), across five dimensions:

- Structure: does the type check compile, is anything bypassing checks with suppression comments, do imports respect the architecture constraints, are files and functions within length caps;
- Data: are copy keys complete, is the state structure closed, are local-storage keys namespaced as required; if the project provides a data spec, a field-by-field diff against it;
- Logic: the feature checklist from Clarify, verified item by item against implementations and key branches in the code — which is exactly why the checklist must be written before the code; it is the exam paper, and writing the exam after the test is pointless;
- UI: do styles go through component scoping, are colors and spacing tokenized rather than hard-coded; if a design file is provided, a pixel-level fidelity comparison against screenshots;
- End-to-end: the tests actually run, pass/fail counts come back, and the main flows' coverage is visible.

One caveat has to be stated plainly, or the numbers lie: **the scan has two modes.** With full project configuration, the structure dimension really runs `tsc`, the end-to-end dimension really runs your test command, the data dimension diffs field by field against the spec — that is measurement. With zero configuration, those inputs are unavailable and the scan falls back to static checks; in that case the report must state openly which dimensions were "not measured," instead of dressing static numbers up as real runs. The confidence level of a score belongs in the report, not hidden under it.

And the report rule: once written, an evaluation report is never edited. Regenerate code, re-evaluate, write a new report; the old one stays. That is what lets a post-mortem answer a crucial question: did the previous report already warn about the thing that just broke? If it did, the problem is routing and repair; if it didn't, the problem is evaluation itself. Without the archive, that account can never be settled.

## 5. The Kernel: A Long Workflow Cannot Rely on the Model "Remembering"

What happens if all five phases run inside one main conversation?

Each phase loads its instructions into context. Somewhere in the second half, compaction inevitably fires — and the moment it does, the earlier phases' constraints and conclusions are ground down to a few lines in a summary. The more critical the detail, the cleaner it disappears.

I measured this with probes: a set of key rules planted at the start of the workflow, audited at the end of each phase for how much is still remembered. In main-conversation mode, by the fifth phase only about 40% of the information survived.

The fix is to move the workflow out of the conversation and into a deterministic kernel. It is a zero-dependency Node program, and its logic is plain:

Every feature has a state file (`.harness/tasks/<feature>/state.json`) that is the single source of truth for the whole pipeline: current phase, per-phase history, the task list, where the contract files live, the evaluation verdict. **Nobody — including the model itself — may edit this file by hand**; every state change goes through a kernel command. It looks like this (simplified):

```
{
  "feature": "todo-app",
  "phase": "evaluate",
  "history": [
    { "event": "clarify-done", "at": "…" },
    { "event": "task-done", "task": "add-todo", "commit": "a1b2c3d" }
  ],
  "prd": { "source": "imported", "numberingComplete": true },
  "verdict": { "passed": false, "openItems": ["REQ-3"] }
}
```

Roles talk to the kernel through **task packets**: for the current phase the kernel generates a scoped input packet — the evaluator at Evaluate gets the rubric and the code entry points, and the developer's packet contains no rubric at all. A role does its work, writes its outputs back to files, and exits; what happens next is decided by the kernel reading state, never by a model "recalling."

There are two ways to drive it. Interactively: you work inside Claude Code or Codex, and the first command for any feature is `harness next <feature>` — it tells you only what the current step is; finish it, ask again. A single-step protocol, and a human can take over at any point. Unattended: `harness run <feature>` drives the whole pipeline by the same protocol and only comes to you at the clarify confirmation and if the workflow pauses.

When evaluation fails, the kernel routes by the verdict: open items send the feature back to Implement to fix exactly those items; if the evaluator has suggestions for the rubric itself, the planner answers them first — that is evolution's second loop, and its direction is locked: **a rubric may only be tightened automatically; loosening one requires a human.** Every loop has a budget cap; exhaust it and the state machine enters Paused and waits for a person. Nothing loops forever.

Measured the same way, this mode keeps about 95% of the information alive at the fifth phase. The difference is not the model; it is where the information lives. In the conversation, it gets compacted along with everything else. In files and program variables, it doesn't.

## 6. Four Pits I Fell Into

**Pit one: evaluation started out as model judgment.**

The first evaluation had the model read the code and write conclusions. It awarded itself full marks — 100 out of 100 by its own account — while in reality only about thirty percent of the code actually worked, and the end-to-end tests were wiped out.

The root cause is the self-leniency of section 4. The fix was to convert everything convertible into commands and evidence: compiler exit codes, test pass counts, line-level evidence. One lesson worth keeping: a lint error is not just an error — it is also the model's repair instruction. The more specific the report, the more precisely it fixes.

**Pit two: writing the workflow as documents for the model to follow.**

The early version's eight stages were eight Skill documents, executed in order by the model's good behavior. The first end-to-end run executed only four of the eight: several stages were silently skipped, while the workflow reported everything as normal.

The root cause sat in the "what runs next" judgment. Judging from documents, and later judging with buggy code, produced the same class of error — no hard check at the seams. A phase that had never run, with an empty history, was misjudged as "already passed, move on." The fix came in two steps: first, split the judgment into three explicit checks (is there a failure with retries left; has it never run; only then, has it passed); then, one step further, move the entire workflow out of documents and into a code state machine. One lesson: unit tests cannot catch this class of bug. Every phase tests correctly on its own; the error lives between phases. It only becomes trustworthy after a real end-to-end run.

**Pit three: running the whole pipeline in the main conversation.**

The symptoms are the first half of section 5: by the later phases, the rules laid down earlier have been eaten by compaction, and the remaining phases are run by an amnesiac context on vibes.

The fix was splitting the phases across independent roles and moving state into files. One lesson: never pile workflow content into the main context. Any design that "runs a long workflow inside one long conversation" collapses somewhere in the middle; the only question is when.

**Pit four: static scores dressed up as measured scores.**

The scanner had an insidious early problem: a zero-configuration static-check score and a fully configured score — real compilation, real test runs — looked identical. Both are a number between 0 and 100. Reporting the former as "I measured it" was false: the most important dimensions had never been measured at all.

The fix was to label every dimension with its provenance — measured, or statically inferred; a dimension whose inputs are unavailable says "not verified" in the report, with the caveat next to the score. One lesson: **if you cannot measure it, write "cannot be assessed" — never a number that merely looks real.** For an evaluation system this is a matter of honesty, not precision.

## 7. Adoption: Three Steps Now

The system is open source, so "adoption" is no longer building it yourself. It is three steps:

1. **Install**: `git clone` the repository — or paste a single prompt into the Claude Code or Codex you already use and let the agent install the CLI and initialize your project itself. On the [health-check page](https://maoxunxing.com/ai/ai-code-health-check/) I keep a ready-made copy of that one-prompt setup.
2. **Run**: `harness init` installs the rules and the skill pack for your stack (Next.js / React / Vue / Node). Then `harness new <feature>` starts your first feature — add `--prd` if you have a finished PRD to import. Drive it interactively with `harness next`, or unattended with `harness run`.
3. **Scan before you commit to the whole workflow**: if you are not sure it is worth it, run `harness scan` on an existing repository first — or paste a public repository link into the health-check page above for an online report. Ten minutes gets you an evidence-backed report to decide with.

If what you want to copy is the design rather than the tool, my advice is unchanged: take the smallest piece first — **the language and engineering layers.** Strict mode plus two lints will, this afternoon, remove an entire class of mistakes your AI makes in your project. Constraints do not need the whole system to start working; that is true whether the path is four weeks or three steps.

As for build order, my own experience: pin the constraints first (a week), then write the skills for clarify and implement, then evaluation, and only then is a kernel worth building. Reversing the order — orchestration first, evaluation later — is the most common way this dies: the smoother the pipeline runs, the faster it produces garbage.

## 8. Limitations: I Know Exactly What It Cannot Measure

**First, the aesthetics layer is only half measurable.**

Automation can check: whether tokens are used, whether scoping is correct, how far a screenshot sits from the design in pixels. But "does this color pairing work," "does this spacing have rhythm," "is the type hierarchy clear" — automation covers roughly half of those judgments today. The other half still needs screenshots plus human review, or a separate reviewing agent whose score is deliberately calibrated toward suspicion, so it does not repeat the self-leniency mistake.

That is why I call aesthetics the frontend-specific layer and, at the same time, the weakest of the five. Admitting it is weak matters more than pretending it is solved.

**Second, "general-purpose" is not fully verified yet.**

The system is verified deepest on Next.js projects. The stack packs for Vue and other stacks are in place, but my own acceptance line is: one real feature driven end-to-end on two heterogeneous projects, Next.js and Vue — until then I will not claim "generality verified" in public. The tool is usable now; the conclusion may not run ahead of the evidence.

**Third, constraints have a shelf life.**

This system is not build-once-and-forget. Every model upgrade deserves an ablation pass: remove a constraint and watch whether results improve or degrade. Some constraints compensate for a model's current weaknesses; once the model fixes the weakness, the guardrail becomes an obstacle. There is a subtler effect, too: a model can overfit to the tools and harness it has long been used with, so swapping one component can make results worse — something you can only discover by measuring, never by reasoning about it.

The industry backdrop is not cheerful either: surveys report that among heavy users of AI coding tools, close to seventy percent say AI-generated code has at least a fifty-percent chance of causing deployment problems, and about half feel code quality is declining. Speed arrived first; the delivery system has not caught up. This harness solves the share of that problem inside my own projects. It is not a universal remedy.

## Closing Thoughts

Back to the line at the start: don't ask for a smarter horse; build a better track.

Models will change, quickly. But looking back, the real core of this system is not any particular number or tool. It is five compensating designs: define "done" before starting; separate detection from repair; feed context passively wherever possible; split long workflows across independent contexts; and let evaluation trust only deterministic evidence.

They compensate not for the model's intelligence, but for its structural weaknesses: it does not know what it doesn't know, it talks itself into believing its work is fine, it cannot remember a long workflow, and it drowns in its own context. Those weaknesses will not disappear because the model got one size bigger — which is why this design will not expire quickly either. What expires is individual constraints, and that is precisely what the ablation pass is for.

The system is fully open source: [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli) — kernel, three roles, 21 Skills, and the five-dimension scan are all in there (the scan began life as the earlier ai-code-gate tool, now folded in as the sensor layer). If you only want to see one report, paste a public repository link into the [health-check page](https://maoxunxing.com/ai/ai-code-health-check/); if you want your own agent to use it directly, the same page carries a copy-and-paste prompt for that.

The previous post was about why the scene is needed; this one is about how the scene is built. If there is a next post, I want it to be about the evolution loops: how a system turns every failure into one of its own rules — which parts are automated already, and which must stay with humans.

## References

- LangChain, "The Anatomy of an Agent Harness" — the six-layer anatomy of Agent = Model + Harness, and the Terminal Bench 2.0 data
- Vercel, "AGENTS.md outperforms skills in our agent evals" — the controlled comparison of passive injection vs. active retrieval
- OpenAI, "Harness engineering: engineering in the agent-first world," and the Codex team's zero-handwritten-code internal practice (compiled via Yage.ai research)
- Anthropic, "Harness design for long-running application development" — harness design for long-running applications, and the reviewer self-leniency problem
- The Omni-I2C benchmark (2026) — visual fidelity and parameter precision of mainstream models on image-to-code tasks
- Fred Brooks, "No Silver Bullet" (1986) — essential vs. accidental complexity
