---
title: "The Engineering Layer: Changing One Page Should Not Wake Ten Others"
description: "Part four of the five-layer constraints series (the engineering layer). Why import direction is law rather than convention, why import cycles are banned outright, why the point of a 300-line file cap is not the number itself, and why the checks sit on the only road to delivery — the why and the how. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "How a file grows to 1,400 lines"
  - title: "Why an engineering layer: it governs the cost of change"
  - title: "Decision 1: import direction is law, not convention"
  - title: "Decision 2: import cycles are banned outright"
  - title: "Decision 3: size caps — the point is not 300, it's that a cap exists"
  - title: "Decision 4: the checks sit on the only road to delivery"
  - title: "How the machine verifies this layer"
  - title: "What this layer cannot do"
---

This is part four of the five-layer constraints series. The overview post, [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), covered all five layers at once; this series takes them one at a time: the [language layer](/en/harness-layer-language/) governs whether code is legally shaped, the [styling layer](/en/harness-layer-styling/) governs a palette of fixed visual options, the [state layer](/en/harness-layer-state/) governs where data comes from and that there is only one copy of it. This part covers the engineering layer: who decides the directories, the imports, and the sizes. The system I use is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below has a corresponding implementation in the repository.

## How a file grows to 1,400 lines

Start with a concrete scene.

A list-page file, when first generated, is 200 lines: fetch the data, render a table, one filter box — clean. Three months later you open it and it has 1,400 lines.

Nobody made it big on purpose. Every change, looked at alone, was reasonable: add an export button, append forty lines at the end of the file; add a batch operation, append sixty more; fix an edge case, wedge a branch into the middle. The AI writing the code changed a dozen times, a fresh context each time, and every one of them made the locally cheapest choice — **appending is always cheaper than splitting**: appending only requires understanding the end of the file, while splitting requires understanding all of it and accepting the risk of cutting in the wrong place.

Then one day you ask it to change the sort rule for one column of the table. It has to read all 1,400 lines first — that column's logic shares a pool of variables with the export, the batch operation, and two dialogs. The sort gets fixed; the export breaks. Not carelessness: the file has grown into a single tangled whole where touching anything drags everything else along.

## Why an engineering layer: it governs the cost of change

The first three layers govern whether this version of the code is right: legally shaped, visually within the rules, fed by accurate data. The engineering layer governs something else: **what the next change will cost.**

Code will be changed. The only question is whether a change stays inside one file or spreads along the import graph into ten. That does not depend on how careful the changer is — in this system, the readers and modifiers of the code are fresh-context AIs, and an AI cannot be careful about files it has not read. **Whether a change is local or contagious is decided at the moment an import is written**, before anyone's care enters the picture.

The overview post's analogy for this layer was traffic rules plus traffic lights: not advice against running a red light, but an intersection designed so you can't. Every rule in this layer — who may import whom, how large a file may grow, what qualifies code for delivery — has to land as a machine-executed check, not as a document hoping for compliance.

## Decision 1: import direction is law, not convention

The layout section of the standards pack (the standards file `harness init` installs into your project) states three rules:

- **A route never imports another route's files**: a component living under `/orders` is for orders alone;
- **Shared code never imports a route in return**: anything used by everyone sits lower in the hierarchy and may not depend back on a specific page;
- Paths go through the alias `@/` (pointing at `src/`), not a chain of `../../../` that writes the directory depth into the code — move a file and relative paths snap; the alias doesn't.

Why is the first rule so strict? Picture the reports page needing a table component, and the orders route containing one that looks identical. Import it, done in five minutes. Two weeks later the orders page gets a redesign, its table switches to a compact layout — and the reports page changes too, with nobody knowing why, because that dependency hides in one route importing another, on no list of "shared components" anywhere. When the reports page breaks, orders is the last place anyone looks.

The rule's answer is not "be careful when importing"; it is to force the sharing to happen up front: if two routes need it, extract it first — into a shared directory, into a hook, down into lib — so the dependency sits visibly in the directory structure. When the scan finds a cross-route import, its report suggests exactly this: extract the shared piece into shared dirs, hooks, or lib.

Direction also serves the reader. When dependencies point one way only (pages → shared → foundation libraries), reading any file means walking a tree that terminates. When anything may import anything, understanding one file can require understanding the whole repository. For an AI reader with a finite context, that decides whether it can see everything it needs within a single task.

## Decision 2: import cycles are banned outright

A cycle is the stealthiest import defect: module A imports B, and B imports A back.

It is stealthy because it usually doesn't fire. Development runs fine — until some build order, bundling choice, or initialization timing changes, one side loads first and receives the other side's half-initialized shell, and the runtime throws an `undefined` error two modules away from the actual cause.

For an AI reader there is a more direct injury: **no file in a cycle can be understood on its own.** Reading A requires B; reading B leads back to A; there is no entry point. Ask a fresh-context AI to change anything inside the loop and it has to load the whole loop and guess the initialization order — and a wrong guess is exactly the runtime error above.

So this one has no negotiation: when the scan finds a cycle in the import graph, it is scored in the heaviest tier. Its verdict: "Cycles make module initialization order-dependent and defeat tree-shaking."

## Decision 3: size caps — the point is not 300, it's that a cap exists

The standards pack carries two more numbers: **a file stays under 300 lines, a function under 50–100 lines**; past that, split — into components, into hooks.

The most common misunderstanding first: the number 300 itself does not matter. Both caps are configurable per project (`rules.maxFileLines` and its siblings); if 400 is right for your project, set 400 and the system runs the same. What matters is that **a cap exists**.

Without one, file growth is one-directional — the opening scene. Every AI in the chain faces the same choice: append a few dozen lines and finish the task now, or stop and restructure, reading the whole file and risking a bad cut. On that task's ledger, appending always wins. The benefit of splitting accrues to future readers; the cost lands on the current author; and author and reader are never the same context. No amount of "be disciplined" fixes a ledger that misaligned — only an external hard line does: grow to this line and you must stop and split. Splitting stops being an optional optimization and becomes a precondition for writing more code.

The cap also decides *when* the split happens. Splitting a 300-line file means cutting a whole you can still hold in one reading into three pieces. Splitting a 1,400-line file is surgery inside a tangle. The cap forces the question while it is still cheap.

Functions are the same story. No reader can hold a 300-line function's opening invariants and its closing branches in view at the same time — the bugs live in the interaction between the two halves. The scan's verdict on an over-long function: "Long generated functions are where bugs hide."

## Decision 4: the checks sit on the only road to delivery

Rules, however right, get bypassed if they exist only as advice in a document. This layer's checks are chained into three positions:

- **Pre-commit hooks**: before code leaves the machine, it passes once;
- **CI**: typecheck, lint, build, and tests chained into one pipeline — red means no merge;
- **The delivery gate**: in this system, the project's own gate commands double as the Done phase's delivery gate — while the chain is red, a feature may not be marked delivered.

The third position is the key one. Hooks and CI govern whether code may enter the repository; the delivery gate governs whether the work may count as done. A check that is not on a mandatory road is a suggestion; chained onto the mandatory road, it is the intersection itself — a red light here is not a fine notice, it is a barrier that has not opened.

## How the machine verifies this layer

This layer is verified mainly by the structure dimension of `harness scan`. It builds the import graph from source and measures file and function lengths item by item. The deduction schedule is public, and its ordering is worth noticing:

- **Import-layer violations** (`import-layer`): 10 points off;
- **Cross-route imports** (`cross-route-import`): 10 points off, and the report attaches the extraction suggestion — move the shared piece to shared dirs, hooks, or lib;
- **Import cycles** (`import-cycle`): 10 points off;
- **Over-long files** (`file-too-long`): 8 points off, with a split suggestion attached;
- **Over-long functions** (`function-too-long`): 6 points off.

Every import problem sits in the heaviest tier; the size problems come after. The ordering is deliberate: **an over-long file hurts whoever edits that file; a wrong import hurts everyone it touches.** Local pain is priced lower than contagious pain. On top of that sit the gate commands from decision four — the project's configured gate commands really run at delivery time, and their exit codes decide.

## What this layer cannot do

The engineering layer guarantees that a change *can* be contained in one place. It does not guarantee the change is *right*.

A repository can have perfect import direction, no cycles, every file under 300 lines — and still implement the wrong feature on the wrong data; those belong to the state layer and to evaluation. Nor can this layer guarantee the *quality* of a split: cut a 900-line file at arbitrary points into three 300-line files, severing every logical unit in the middle, and every metric passes while the code gets harder to read than before. Where to cut, and what belongs together, remains a design judgment; the cap only forces the question to be asked while the file is still small. It does not answer it.

The relay so far: code legally shaped (language layer), visuals chosen only from the palette (styling layer), data single-sourced and accounted for (state layer), changes that do not infect each other (engineering layer). But all of that happens inside the code, and the user never sees code — the user sees a page. The final layer, the aesthetics layer, governs the one thing the previous four cannot see: how a feature can be entirely correct and the page can still be wrong.
