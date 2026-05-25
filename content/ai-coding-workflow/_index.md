---
title: "Goal-driven AI Coding Workflow: From Copilot and Cursor to Codex and Qoder"
date: 2026-05-24
description: "Felix Mao's practical notes on a goal-driven AI coding workflow: from Copilot-style assistance to Cursor Plan Mode, and then to a workflow built with Skills, Rules, Qoder, Codex, MCP, Browser Use, and frontend engineering practice."
tags:
  - AI Coding
  - Cursor
  - Codex
  - Qoder
  - Frontend Engineering
  - AI Workflow
  - Goal-driven
---

# Goal-driven AI Coding Workflow: From Copilot and Cursor to Codex and Qoder

I started using AI coding tools not because I wanted to chase a trend, but because I am a frontend engineer and there has always been a real need to improve engineering efficiency at work.

At the beginning, I used the Copilot-style tool provided by my company, similar to GitHub Copilot. Later, I gradually moved to Cursor. Today, I use multiple AI coding products, including Tongyi Lingma, Claude, Codex, and Qoder.

Looking back, this was not simply a process of switching tools. It was a change in how development work is organized:

```txt
Copilot assistant mode
→ Cursor Plan Mode
→ A workflow mode built with Skills / Rules / Qoder / Codex / MCP
```

I would not say that I already have a perfectly mature methodology. A more accurate description is that I am turning scattered AI coding practices into a goal-driven AI coding workflow.

The core of this workflow is not asking AI to write more lines of code. The core is letting AI participate in the full engineering loop: requirement clarification, context understanding, plan generation, code implementation, automated testing, code review, and browser-based validation.

## From code completion to requirement execution

Early Copilot felt more like an assistant. It mainly helped me with code completion, small refactoring tasks, and reducing repetitive typing.

At that stage, AI was still attached to the traditional development process. I understood the requirement, broke down the task, wrote the code, and AI only helped me fill in a few lines or rewrite a small section.

After moving to Cursor, the biggest change was that AI gradually moved from assistant mode to Plan Mode. It no longer only completes code. It can first clarify my requirement, generate a development plan, and then modify code according to the plan.

In other words, AI moved from small local productivity gains to becoming a collaborator that can take on a whole feature or requirement.

Previously, the workflow was:

```txt
I write code, AI completes code
```

Now it is closer to:

```txt
I describe the goal, AI generates a plan and executes the task
```

This is a significant change.

The value of Cursor is not just stronger code completion. Its real value is that AI enters the full chain of requirement understanding, solution planning, and code execution.

## Vibe Coding is becoming a general skill

I increasingly feel that AI coding is no longer just a productivity tool for programmers. It is turning Vibe Coding into a more general skill.

In the past, Vibe Coding still mostly happened inside the developer context. To complete a page or a feature, you needed to understand HTML, CSS, JavaScript, frameworks, engineering systems, component libraries, state management, and API integration.

Now, AI allows many people who are not professional frontend engineers to generate pages, adjust styles, and implement basic interactions by describing goals.

This does not mean frontend engineers are no longer important. It means the value of frontend engineers must move upward.

Frontend engineers used to be described as “page engineers” in many contexts. Their work was often associated with UI implementation, page building, and interaction handling. After AI lowered the barrier of page generation, the value of only “drawing pages” will be compressed.

The new value will shift toward:

```txt
goal definition
context engineering
component reuse judgment
engineering constraints
AI tool orchestration
quality validation
system delivery
```

Frontend engineers should not remain only code executors. They need to become organizers and quality owners of the AI coding process.

## From writing code to orchestrating tasks

I see my current working state as an orchestration mode.

The old development process looked like this:

```txt
understand the requirement
→ split the task
→ write code manually
→ debug manually
→ review manually
→ verify before release
```

The new process is gradually becoming:

```txt
describe the goal
→ provide context
→ AI clarifies the requirement
→ AI generates a Plan
→ human reviews the Plan
→ AI implements the code
→ AI performs Code Review
→ Browser / Mock validation
→ human fine-tuning
```

The amount of handwritten code is indeed much lower now.

For small changes, style adjustments, and local refactoring, AI-assisted Vibe Coding is often enough. For larger requirements, I use Cursor Plan Mode or Qoder Spec Mode, letting AI first generate a plan and then implement the code.

Debugging is also changing.

Previously, fixing bugs often meant adding logs manually, guessing the root cause, and narrowing the problem step by step. Now I can use Cursor Bug Mode or Qoder Expert Mode to let AI participate in problem diagnosis and fixes.

Code review is also becoming AI-assisted. Many basic review tasks can be delegated to AI, especially checking engineering rules, potential mistakes, edge cases, and duplicated logic.

But this does not mean humans disappear.

The human role is no longer to write every line of code or review every diff line by line. The role is to define goals, prepare context, review plans, and judge whether the final result satisfies the business expectation.

## Why Prompt is not enough: Skills and Rules matter

Later, I began to build a Skills-based workflow in Cursor. The point is not writing longer prompts. The point is using Skills, Rules, Browser capabilities, and Code Review mechanisms to make AI behavior more structured.

I gradually realized that the bottleneck of AI coding is not only model capability. It is also the efficiency and accuracy of the prompt and context.

If every task depends on a temporary prompt, AI can easily miss project rules, business context, component conventions, and team constraints. A more effective approach is to turn this context into a system.

So I use several layers of configuration.

### 1. Rules and knowledge base

The project has rules similar to Cursor Rules, and it is connected to a Wiki knowledge base so that agent tools can understand business background, project conventions, and team context.

This context includes:

```txt
code style
component usage rules
business constraints
API conventions
directory structure
high cohesion, low coupling
minimal-change principle
```

When this context is prepared well enough, AI performs reasonably well on business logic, state management, API fields, and code style.

### 2. Skills and plugins

I gradually install and integrate Skills such as superpowers and Gstack to improve the workflow.

The value of Skills is turning a class of tasks into reusable capabilities, instead of rewriting prompts every time.

For example:

```txt
generate development plans
analyze UI implementation
perform Code Review
generate test cases
check PRD completeness
support browser testing
```

### 3. Browser and automated testing

I also use Cursor's native Browser capability. Codex handles some automation tasks as well, such as browser-side testing, batch checks, and build verification.

If the API is ready, AI can directly open the page and test it.

If the API is not ready, I use Chrome extensions or MCP tools to generate mock data, then use Browser Use-style MCP tools to open the browser and test different scenarios.

## How a real AI coding task starts

In real work, a typical AI coding task does not start from a single prompt. It starts from context preparation.

My project is usually already engineered with basic rules and conventions. It has Cursor Rules-like project rules and a connected Wiki knowledge base, so that Cursor, Qoder, and other agent tools can understand business background, code conventions, and project context.

When a larger requirement comes in, I provide the AI with the PRD in Markdown and screenshots from the Figma design.

The key is not to let AI write code immediately. The key is to let it first understand the goal, page structure, interaction logic, and business constraints.

Then AI calls the relevant Skill and generates two important intermediate artifacts:

```txt
UI implementation description
Development Plan
```

The Plan explains which modules need to be changed, which components should be reused, what states and APIs are involved, and which edge cases need attention.

Before AI starts coding, I review the Plan.

This step is important. If the Plan is wrong, the code can be fast and still wrong. So I use conversation to improve the Plan until it is closer to the actual business requirement.

After the Plan is confirmed, AI uses the existing repository, business background, and project rules to implement the code.

After implementation, I enter the validation and debugging phase:

```txt
ask AI to perform Code Review
fix basic engineering issues
compare the result against the PRD
generate test documentation and test cases
use Mock / Browser Use to test scenarios
use human Vibe Coding for final fine-tuning
```

If the API is not ready, I use Chrome extensions or MCP tools to generate mock data, then use Browser Use-like MCP tools to open the page and simulate different scenarios.

If the API is ready, AI can open the real page and validate it directly.

## The biggest pain point: validation is not fully automated yet

At this stage, code generation is the easiest part to automate. Production-level validation is the hardest part.

I see two main pain points.

### 1. Test environments are complex

Real business systems are not always easy to test by simply opening a page.

Some requirements involve gray release logic. To reproduce a scenario, the gray-release field, account, environment, and mock data all need to be aligned.

Sometimes the test environment also depends on a global system proxy and account login state, which makes automated debugging more complex.

So incomplete test coverage is often not because AI cannot test. It is because the environment itself is hard to simulate reliably.

### 2. Browser recognition is still limited

Browser testing currently depends on accessibility trees, screenshot recognition, or DOM element recognition.

This capability is already useful, but it is not stable enough. Some elements are not recognized precisely, and some visual details are hard to judge.

This means AI can complete most implementation work and initial validation, but final Vibe Coding fine-tuning still requires human participation.

My current judgment is:

> The bottleneck of AI coding is moving from code generation to context preparation and production-level validation.

Whoever can build better context and validation loops will be able to use AI coding more effectively in production environments.

## Where AI still makes mistakes

In my actual usage, the biggest problem with AI is not that it completely fails to understand business logic or writes random code.

If the context is prepared well enough — Cursor Rules, Wiki, business component conventions, clear PRD, and explicit code constraints — AI performs fairly well on business logic, state management, API fields, code style, and team conventions.

The issues I notice most are two things.

The first is UI fidelity.

AI can generate a page very quickly, but production-level design implementation is still unstable. Figma screenshots, assets, design rules, spacing, component states, responsive details, and visual hierarchy can all affect the final result.

The second is validation environment complexity.

In many cases, the code itself is not the main problem. The hard part is reproducing enough real scenarios. For example, some requirements involve gray release fields, account states, environments, and mock data. These conditions all need to match before a scenario can be tested correctly.

By contrast, when the context is complete, AI does reasonably well on PRD comparison, business logic understanding, component reuse, state management, API fields, and code conventions.

I also constrain it with high cohesion, low coupling, and minimal-change principles to reduce the risk of “changing A and breaking B.”

This confirms one thing: AI coding quality depends heavily on context quality.

## Why production-level UI implementation is still hard

AI can now generate pages quickly, but production-level UI implementation is still difficult.

The reason is not simply that the model is not strong enough. It is because frontend engineering contains complex context.

For example:

```txt
whether assets are complete
whether design rules are explicit
whether business components should be reused
how to use the existing component library
what the existing code style is
what the state management and API constraints are
whether gray-release fields and account environments match
```

A page may look like a visual implementation task, but behind it are design systems, business components, API states, permission logic, and engineering constraints.

AI can lower the barrier of page generation, but it cannot automatically understand a company's design system, business components, and engineering constraints.

So the value of frontend engineers does not disappear. It shifts from writing pages to providing context, constraining AI, and judging results.

## My goal-driven AI coding workflow v0.1

If I draw the current workflow as a sequence, it looks like this:

```txt
Project context preparation
→ PRD / Figma / business input
→ AI generates UI description and Plan
→ Human reviews the Plan
→ AI implements code
→ AI Code Review
→ PRD comparison
→ Test case generation
→ Mock / Browser Use validation
→ Human Vibe Coding fine-tuning
→ Review and accumulation
```

This workflow is not prompt-driven. It is:

```txt
Context + Plan + Review + Browser Validation driven
```

In other words, I am not directly asking AI to write code. I am putting AI inside a constrained, planned, and verifiable engineering process.

## What humans are still responsible for

Even though AI can write code, fix bugs, perform Code Review, and generate test cases, humans do not disappear.

The human role changes.

Previously, the main human action was writing code. Now the main human actions are:

```txt
define goals
prepare context
judge whether the Plan is reasonable
constrain the scope of code changes
decide component reuse
set validation standards
judge whether the result can be shipped
feed experience back into Rules / Wiki / Skills
```

This is what I mean by goal-driven.

It is not letting AI improvise randomly. It is defining the goal first, organizing context, letting AI execute, and then judging the result with validation standards.

AI can take on more and more execution work, but direction, boundaries, quality, and business judgment still require humans.

## Conclusion: AI coding is not prompt magic, but an engineering system

My current view is:

> AI coding is not prompt magic. It is an engineering system made of context engineering, plan generation, automated implementation, and validation loops.

In the Copilot stage, AI helped me complete code.

In the Cursor stage, AI helped me execute requirements.

In the Skills / Rules / Qoder / Codex / MCP stage, I started to engineer the AI coding process itself.

This workflow is not fully mature yet, especially in production-level validation. But it has already changed how I develop: I no longer see myself only as someone who writes code. I am gradually becoming a goal definer, context organizer, tool orchestrator, and quality judge.

For frontend engineers, AI is not only a productivity tool. It is forcing us to rethink our own value.

The important future skill is not whether we can manually write a page. It is whether we can turn complex requirements into clear goals, turn business context into executable AI input, and turn code generation into a verifiable, shippable, and continuously improving engineering workflow.

## Recommended reading

<!-- USER TODO: Add 5-10 real, published related articles. Avoid unverified handwritten URLs; prefer Hugo relref. -->

## FAQ

### Will AI coding replace frontend engineers?

AI will replace part of repetitive coding work and lower the barrier for page generation. But it will not directly replace frontend engineers who understand products, systems, business context, and user experience. The value of frontend engineers will move from writing pages to defining goals, organizing context, reviewing results, and driving delivery.

### How should Cursor, Codex, and Qoder be divided by role?

Cursor is better for daily development, local changes, Plan Mode, and in-context collaboration. Codex is better for automation tasks, batch changes, tests, and repository-level execution. Qoder Expert / Spec Mode is useful for bug fixing, code review, and more structured handling of larger requirements. The choice depends on task complexity and context requirements.

### What matters more than the model in AI coding?

Context matters most. This includes Rules, Wiki, Repo, PRD, Figma, component conventions, API contracts, code style, and validation standards. The more complete the context is, the more stable AI output becomes.

### Why can AI write code quickly but still struggle to ship production work?

Because real business systems are not only code problems. They involve test environments, account permissions, gray-release fields, API states, mock data, proxy settings, login state, and UI fidelity. Code generation is only the first step. Production-level validation determines whether the work can actually ship.

### What is the biggest weakness of this workflow today?

The biggest weakness is that the validation loop is not fully automated. Mock data, gray-release environments, account login, browser element recognition, and UI fidelity still require human judgment and Vibe Coding fine-tuning.

## Related topics

- [AI Indie Hacking](/en/ai-indie-hacking/)
- [Creator Workflow](/en/creator-workflow/)
