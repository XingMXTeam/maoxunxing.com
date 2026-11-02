---
title: "context-map: The First Job Inside a Repo Is Drawing Its Map"
description: "A skill deep-dive (context-map, general-purpose group). Why an agent dropped into an unfamiliar repo fails from lack of a map, not lack of skill; what the map actually records — directory purposes, verified commands, sources of truth, high-risk zones, hard rules; and why the map must be pointers, not copies — traced rule by rule to the SKILL.md source. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "In a 200,000-line repo, grep finds the wrong one"
  - title: "What this skill does: draw the terrain as one map"
  - title: "Survey: structure first, content second"
  - title: "Commands and sources of truth: only what was verified"
  - title: "High-risk zones and hard rules: the map's warning signs"
  - title: "Design 1: the map is a file, not a memory"
  - title: "Design 2: it records how things are done here, not a file list"
  - title: "What it cannot do"
---

This is one entry in the skill-by-skill series, covering `context-map` — one of the general-purpose skills, attached to none of the five phases; it governs the first thing you do inside a repo. The overview post is [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/); this series takes the skills one at a time — why each exists, and concretely how it works. The system is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below can be found verbatim in the repository at `templates/skills/context-map/SKILL.md`.

## In a 200,000-line repo, grep finds the wrong one

Start with a concrete scene.

A fresh-context agent is dropped into a 200,000-line repo and asked to add date formatting to an order list. Its opening move is grep: search for "formatDate" and three near-identical utilities come back — one in `utils/date.ts`, one in `lib/format.ts`, one in `shared/dates/index.ts`. It picks the one with the tidiest name and builds forty minutes of code on top of it.

That function lives in a module the team marked for deprecation six months ago. The current standard is the third one. Worse, along the way it casually changed the props of a shared component — a component three other features also use. None of its steps were stupid: search, compare, choose, implement — every action correct. It simply didn't know the terrain of this repo: what lives where, which one is canonical, which places you don't touch casually.

The SKILL.md opens by saying this plainly: **an agent dropped into an unfamiliar repo doesn't fail from lack of skill; it fails from lack of a map.** It greps blindly, reinvents a utility that already exists, and edits a file three other features depend on. The output of `context-map` is that map — built once, so every later session starts oriented.

## What this skill does: draw the terrain as one map

The skill lists four triggers: the first time working in a repository; an AGENTS.md / CLAUDE.md that is missing, stale, or "a 2,000-line dump nobody can use"; the agent keeps asking questions the repo could answer itself — how to run tests, where components live, what not to touch; and after a restructure that moved directories, commands, or conventions.

Its output is an AGENTS.md (or the repo's equivalent) at the repo root, with five fixed sections:

- **Structure**: the top-level directories, each with one line stating what it owns.
- **Commands**: install, run, build, lint, typecheck, test — a table copied from real config and verified entry by entry.
- **Sources of truth**: for each kind of fact (API contract, design tokens, routing rules, state conventions, error codes), the file or doc that is authoritative.
- **High-risk zones**: files and directories where a careless edit has outsized blast radius, each with a reason.
- **Hard rules**: the repo's few non-negotiable conventions, written as imperatives.

Note that none of the five sections explains any code. The map never describes how a function works; it answers only: where things live, how commands run, whose word is authoritative, where the danger is, and what the rules are.

## Survey: structure first, content second

Step one is **survey the terrain**: list the top-level directories and state what each owns in one line. The required output is "a structure section where every entry has a purpose, not just a name."

The order matters: structure before content. Nobody can read 200,000 lines, and nobody needs to — knowing that `src/features/` owns business features and `src/shared/` owns what is shared across them already tells you which layer to look in for a date formatter. This step is what prevents the opening scene: which of the three same-named utilities is canonical gets decided by its directory's stated purpose and the sources of truth below, not by which name looks tidiest.

The survey may not run on impressions, either. Each directory's one line has to match what is actually in it. A wrong line on a map costs more than no map at all, because the reader trusts it and stops checking.

## Commands and sources of truth: only what was verified

Step two is **capture the commands**: find install, run, build, lint, typecheck, and test in package scripts, Makefiles, or CI config, and verify each command exists. The output requirement is strict: a command table "copied from real config, never from memory."

The anti-patterns call out the failure mode by name: copying command lists from the README without checking them against the actual scripts — **stale commands are worse than none, because the agent will trust them.** With no table, the agent goes and finds the commands itself. With a wrong one, it runs the wrong thing, watches it fail, and suspects the code first. It is the same logic as the language layer's lying signature being worse than no signature: wrong navigation gets you lost faster than no navigation.

Step three is **point to sources of truth**: for each kind of fact, name the authoritative file or doc. The output is "pointers, one line each — the map links to truth, it does not copy it."

That sentence is the skeleton of the whole skill. The truth about the API contract lives in the contract file; the truth about state conventions lives in the state spec. The map only says where each kind of question gets answered. Copy the truth into the map and the same fact now lives in two places, one of which will quietly go stale — exactly the state layer's rule that a fact may have only one source of truth, applied to documentation.

## High-risk zones and hard rules: the map's warning signs

Step four is **mark the high-risk zones**: shared components, global styles, config, generated code, migration scripts — and what "care" means in each place. The output is "a short list with a reason per entry."

The reason is not optional decoration. Write only "don't touch `src/shared/`" and the agent, faced with a change that genuinely has to go there, either barges in anyway or detours into building a duplicate. Write "every feature shares these components; changing props changes all callers at once" and it knows the careful move is adding a prop rather than modifying an existing one. The shared component in the opening scene died precisely because nobody wrote that line anywhere it would be read in time.

Step five is **record the hard rules**: the repo's few non-negotiable conventions as imperatives — the skill's own example is "use the shared Button, don't create a new one." The output: "at most a handful of rules, each verifiable."

The anti-patterns draw the line on phrasing: conventions written as aspirations ("we prefer clean code") are not rules; checkable statements are ("files stay under ~300 lines; split before adding"). An aspiration can't be verified, so readers nod and move on; a checkable rule can enter task gates and rubric items. Paired with that is the quantity discipline — a handful at most. Multiply the rules and each one depreciates, until the map converges with the 2,000-line dump it was meant to replace.

## Design 1: the map is a file, not a memory

Why insist on a file at all? In the skill's words, it "builds the map once so every later session starts oriented."

"Every later session" is the load-bearing phrase. In this system, contexts are disposable: clarify, implement, and evaluate each run in a fresh context, and nothing one session saw carries over by itself. Terrain an agent spends twenty minutes learning evaporates when its session ends if it lives only in that context; the next agent re-surveys from zero, with no guarantee of reaching the same conclusions.

A file doesn't evaporate. The map sits at the repo root, every newcomer reads it first, and the twenty minutes of surveying get paid exactly once. This is also how it divides labor with the skills around it: the project knowledge `clarify-requirements` interviews for, and the existing patterns `write-tech-design` must respect, both presuppose a trustworthy map underneath. The map is the one terrain fact every later session shares.

## Design 2: it records how things are done here, not a file list

Step six fixes the map's form: **keep it an index.** If a section needs more than a few lines, link to the doc instead of pasting it; the output standard is that "the whole map stays scannable in under two minutes." The done criteria repeat it: the map is an index, it points to facts instead of restating them, and stays readable in minutes.

This settles a choice that is easy to get backwards: does the map record *what exists* in the repo, or *how things are done here*?

A file inventory records the former, and it is the least useful version: a 200,000-line repo has thousands of files, so the inventory alone would run to thousands of lines, and the map instantly becomes the thing nobody reads. The first anti-pattern is exactly this — dumping the entire wiki into AGENTS.md: "a map that contains everything is read by no one and decays fastest exactly where it matters."

What is worth recording is the latter. Structure with one purpose line per directory describes how modules divide the work; sources of truth say where each kind of question gets asked; hard rules state the local law. Together they are "how things are done here." Files are added and deleted daily; the way of working is far more stable — the map records the stable layer, which is what makes it a durable asset.

Step seven closes the loop: **verify by walking it.** Pick three pointers at random and open them; fix any that are wrong or dead. The done criteria require every path and command in the map to have been verified against the current repo. Note what gets spot-checked: pointers, not content. The map's promise is only "the place I point to is the right place" — the content itself takes its authority from the file being pointed at.

## What it cannot do

Boundaries, stated plainly.

First, the map guarantees its pointers, not the things pointed at. It can declare that state conventions live in a certain file; if that file is itself wrong or outdated, the map will not notice. The map registers where truth lives; it does not audit truth.

Second, the map goes stale, and it goes stale quietly. The last anti-pattern warns about exactly this: restructuring the repo and leaving the old paths in place, "so the next session navigates by a map of a city that no longer exists." The skill can only list "rebuild after a restructure" among its triggers and spot-checking among its steps; nothing in it can detect that the city changed. Detection falls to whoever hits the wall while using the map, or to whoever did the restructuring and updates the map on the way out.

Third, it records how things are done here without judging whether that way is any good. If the repo's existing patterns are poor, the map registers them faithfully, and agents navigating by it will reproduce the poor patterns neatly. Whether a pattern should change is a planning judgment made with the map in hand — not the map's job.

So this skill's place in the system is one piece of the foundation: it guarantees that no fresh context starts blind. The next entry covers `state-schema-first`: where the map's "state conventions" pointer leads — how a piece of data's shape, ownership, and source of truth get defined dead before any code is written.
