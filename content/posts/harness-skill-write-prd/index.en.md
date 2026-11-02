---
title: "write-prd: Requirements as a Contract That Can Be Checked Line by Line"
description: "A skill deep-dive (write-prd, second in the clarify authoring chain). Why a requirements document can read flawlessly and still jam every downstream step; why REQ numbering is a contract, not formatting; why an imported PRD gets its gaps filled but never a word rewritten — traced rule by rule to the SKILL.md source. Overview in “From ‘It Runs’ to Deliverable.”"
date: 2026-11-02
tags:
  - AI
  - Harness
  - Frontend Engineering
draft: false
custom_toc:
  - title: "A PRD nobody can fault — and nothing downstream can use"
  - title: "What this skill does: compile the confirmed summary into a contract"
  - title: "The gate comes before the writing"
  - title: "Nine sections: the fixed skeleton of prd.md"
  - title: "Numbering is not formatting; it is the audit key"
  - title: "Imported PRDs: fill the number gaps, touch nothing else"
  - title: "Why inventing a requirement is forbidden"
  - title: "What it cannot do"
---

This is one entry in the skill-by-skill series, covering `write-prd` — second in the clarify authoring chain, right after `clarify-requirements`. The overview post, [From "It Runs" to Deliverable: Design Notes on a Frontend AI Collaboration System](/en/frontend-ai-collaboration-design/), dissected this very skill in its third section as the specimen for the overall design; this series takes the 21 skills one at a time — why each exists, and concretely how it works. The system is the open-source [frontend-harness-cli](https://github.com/XingMXTeam/frontend-harness-cli); every rule below can be found verbatim in the repository at `templates/skills/write-prd/SKILL.md`.

## A PRD nobody can fault — and nothing downstream can use

Start with a concrete scene.

An AI hands you a requirements document: the background is clear, the goals are earnest, the feature descriptions flow paragraph after paragraph, and there are user stories. You read it end to end, find nothing to object to, nod, and work begins.

On day three, the developer asks: should export include the filtered results, or all the data? The document says "supports data export" — export *what*, it never says. Days later, evaluation arrives and tries to check the requirements off one by one — and discovers the document has no "ones." It has paragraphs. Each paragraph mixes three meanings; two and a half of them got built. Pass or fail? Nobody can rule. At final acceptance the user says "this is not what I asked for," and the developer produces the document in self-defense — and the document genuinely is on his side, because it never actually promised anything.

A document that promises nothing cannot be refuted by anyone, and protects no one.

The flaw is not in the writing. It is in the form: **prose cannot be audited.** The consumers of a requirements document are not readers; they are a rubric that needs it as a denominator, evaluation reports that cite it item by item, a coverage check that counts it. Something that cannot be counted or cited is, however smoothly it reads, just reading material. That is why `write-prd` exists: to turn requirements from reading material into a contract.

## What this skill does: compile the confirmed summary into a contract

The first skill in the chain, `clarify-requirements`, does the interviewing: it questions the user until open questions reach zero, and produces a user-confirmed clarification summary (`clarification/summary.md`). That summary is the conclusion of a conversation, written for a human.

`write-prd` takes the next step: it compiles the confirmed summary into `.harness/tasks/<feature>/prd.md` — in the skill's own words, "the product contract": the problem, who has it, what the feature must do, and what it will not do, "in words a tester can check."

Why does this step deserve its own skill instead of being folded into the interview? Because the two texts have different consumers. The summary's consumer is the user, and its standard is "does this look right to you?" The prd.md consumer is every later artifact and every later role: the quality vision (`vision.md`) references it, the tech design designs against it, and the rubric (`rubric.json`) copies its requirement ids outright as its checks. One text is for a person to confirm; the other is for machines to consume. The cost of an error differs completely, so the labor is divided: interviewing is interviewing, and contracting is contracting.

## The gate comes before the writing

The first part of this skill is not "how to write." It is a Gate — before writing a word, verify three facts:

- `clarification/summary.md` exists;
- it carries `confirmed-by-user: yes`;
- it carries `open-questions: 0`.

If any of the three is missing: stop, and return to `clarify-requirements`. No "draft it now, confirm it later." The reason is plain: if the user hasn't confirmed, or questions remain open, every sentence you write is a decision you made on the user's behalf — and the more complete those decisions look, the more expensive the rework.

Past the gate, the skill also reads the project overview (`.harness/overview/product.md` and `technical.md`) and checks the feature's scope against existing capabilities and boundaries. If the system already has an export facility and the new PRD plans a second one from scratch, this is the step where that gets caught.

This is the generic shape of these skills: **preconditions are file facts that can be checked one by one, not the model's sense that things are "pretty much ready."** The overview post dissected this skill's five-part anatomy (description as interface, Gate, artifact contract, Mode check, Rules and Done Criteria); I won't repeat that here — on to how it actually works.

## Nine sections: the fixed skeleton of prd.md

The structure of prd.md is fixed — nine sections, in this order:

1. **Problem** — whose problem, in their terms, and why now.
2. **Users and scenarios** — the roles, and the situations they are in.
3. **User stories** — "As a … I want … so that …".
4. **Requirements** — numbered `REQ-1`, `REQ-2`, …, one testable sentence each.
5. **Non-functional requirements** — measurable: response time, size, browser range, accessibility level.
6. **What good looks like** — for each key screen and each core interaction, 2–3 sentences describing the target the user agreed to.
7. **Non-goals** — what is explicitly out.
8. **Success measures** — how anyone will know it worked.
9. **Overview deltas** — new capability areas or boundary changes, one line each; they are listed here, *not* written into the project overview directly, for `sync-overview` to absorb later.

Three of the nine deserve a closer look.

**The requirements section is the hinge of the whole file.** Numbered, one sentence each, testable — the next section covers why. Here, note the sentence the skill states outright: "These ids become `rubric.json` requirements verbatim." The ids are not reading aids; the moment they are written, they are already the evaluation's exam questions.

**Non-functional requirements must be measurable.** "Performance should be good" in this section is equivalent to writing nothing: how fast is good, at what data volume, down to which browser? A cell that cannot be given a number is a dispute reserved for after launch.

**Section 6, "what good looks like," is the section most easily written into mush**, so the skill ships a contrast pair:

- Bad: "The list page should look clean and modern."
- Good: "The list shows one notice per row, newest first, unread rows with a bold title and a dot; 12–16 px between rows; an empty list shows one sentence and a 'Refresh' button."

The good example meets the skill's own standard: concrete enough "that a developer and an evaluator would picture the same screen." The problem with vibes words is not taste; it is that two people picture two different screens — the developer believes it is done, the evaluator believes it is not, and the acceptance meeting is really arguing about a section that was never pinned down. Note that this section is only the summary; the full anchors live in the `vision.md` produced by the next skill, `write-quality-vision`, and the two must stay consistent.

## Numbering is not formatting; it is the audit key

Why insist on numbers? Follow one requirement through its life.

`REQ-3` is born in prd.md. At the end of clarification it is copied into `rubric.json`, where it becomes an evaluation item with a checking method. At evaluation, a line of evidence hangs under its name — pass or fail, and on what evidence. When the coverage gate counts its denominator, `REQ-3` is one of the things being counted. The whole chain reconciles only because every link references the same requirement by the same key.

A prose paragraph has no key. "That sentence in the second paragraph of section three" is not a reference; it is a riddle — edit the document once, the paragraphs shift, and every reference silently dies. A number gives each requirement a **stable address**, turning "was this one verified?" from a question that requires re-reading the whole document into a table lookup.

And because it is an address, a published number must never move — which is exactly what makes the next topic, the import mode, so restrained.

## Imported PRDs: fill the number gaps, touch nothing else

Since v0.9 the system accepts a PRD the user wrote themselves (imported with `harness new <feature> --prd <file>`). In that case `state.json` marks `prd.source: "imported"`, and `write-prd` first runs its Mode check and switches to **normalize-only mode**: it does not author a new PRD — the user's document is the contract. It does only three things:

- **Verify the nine sections** are present, or consciously absent. A missing section is never filled in by invention — it becomes a gap question for the user, routed through `clarify-requirements`.
- **Fill numbering gaps in place**: where the import reported gaps, add the missing `REQ-n` numbers to the existing text, preserving the wording. Existing ids are never renumbered; a requirement's sentence is never reworded.
- **Check the "what good looks like" material**: a quality target stated concretely stays untouched; vibes-only text ("clean and modern") is recorded as a gap question — in the skill's words, "a gap question, not an editing invitation."

Done when the numbering runs `REQ-1..n` with no gaps and every section gap is either closed by the user or listed as an open question. Then the chain proceeds to `write-quality-vision` as usual.

Why this almost fastidious restraint? Two reasons. The first is the previous section's: ids are the audit address for the entire chain, and renumbering at the source silently breaks every downstream reference. The second runs deeper: this document is **a contract the user signed**. Polish one sentence, merge one requirement, and the drifted part is no longer the user's decision — it is yours, still traveling under the user's name. The most dangerous failure of machine authorship is not writing something wrong; it is writing your own meaning as someone else's decision. Normalize-only mode draws exactly that line: structure may be tidied, meaning may only come from the user, and anything uncertain goes back as a question.

## Why inventing a requirement is forbidden

The Rules section of this skill is mostly prohibitions, and they all aim at one behavior: the author smuggling in content of their own while drawing up the contract.

- **Every requirement must trace to the confirmed summary** (the Done Criteria say it verbatim: "Every requirement traces to the summary"). If it is not in the summary, it does not go in the PRD.
- **Use the user's terms from `answers.md`; do not rename concepts.** The user calls it a "ticket"; you decide "work order" sounds more professional and rename it — every downstream artifact follows the new name, and at acceptance nothing lines up with what the user asked for. A rename looks cosmetic; in substance it swaps one concept for another, unnoticed.
- **No TODO / TBD.** In the skill's words: "An open question means you are not in this skill yet." Vagueness is not "to be filled in later"; it is the Gate bypassed.
- **Every requirement must be checkable by someone who did not write it.** A sentence only its author understands becomes pure discretion at evaluation time.
- **One feature per PRD, and no implementation detail.** Frameworks and file names belong to the tech design (`write-tech-design`); putting them in the PRD smuggles technical decisions into the user's signature on the requirements.
- **Never write to `.harness/overview/` directly.** Changes are listed as deltas in section 9 and absorbed uniformly after delivery, instead of every feature casually editing the global overview.

Why is inventing one requirement so serious? Because numbering grants it equal rights. A fabricated requirement, once it holds a `REQ-n`, is indistinguishable from one the user asked for out loud: it gets planned, implemented, evaluated, and delivered — and the user ends up paying development time and acceptance effort for something never requested, with no clean way afterward to say where it crept in. A genuinely missed requirement, by contrast, at least exposes itself at the coverage gate. **Invention is worse than omission**, so this skill leaves gaps exactly one legal exit: become a question, go back to `clarify-requirements` — never become content.

## What it cannot do

Boundaries, stated plainly.

First, prd.md answers "what will be done and what will not," not "how good it should look" or "how it will be built." Section 6's quality picture is summary-level; the full quality anchors are the next skill's job: [`write-quality-vision`](/en/harness-skill-write-quality-vision/) writes the user-agreed target into `vision.md`, where implementation and evaluation can compare against it item by item; the implementation path belongs to `write-tech-design` after that.

Second, it cannot rescue a clarification that asked the wrong questions. If the user signed a summary whose direction was already off, `write-prd` will only lay that error out in tidy sections with continuous numbering — and the tidier the contract, the harder the error is to question. That is why this skill's Gate trusts exactly one fact, `confirmed-by-user: yes`, and never the model's confidence in the content; the real defense is whether the previous skill interviewed thoroughly. That is the previous article's story.
