---
title: "AI Coding Playbook: Tool Selection, Workflows, and Prompt Templates"
published: true
description: "AI programming guide for developers: tool selection by scenario, Cherry Studio design workflows, and prompt templates."
tags:
  - ai
  - coding
  - productivity
  - webdev
canonical_url: https://maoxunxing.com/ai-coding-practice/
---

> This article was originally published on **[maoxunxing.com](https://maoxunxing.com/ai-coding-practice/)**. Follow me there for more deep dives on AI-assisted development workflows.

---

## Choosing AI Tools by Scenario

Different tasks call for different model and tool combinations:

| Scenario | Recommended Approach | Reasoning |
|----------|---------------------|-----------|
| **Reading comprehension** | Qwen CLI + Qwen Coder | Fast, fewer hallucinations, low cost |
| **Analysis scripts** | Claude Code | Deep thinking, offers unique and unexpected statistical dimensions |
| **Report generation** | Cherry Studio + Claude Sonnet + specific template | Consistent design style, avoids the "AI flavor" |

### Common AI Tools

- **ChatWise** -- Multi-model chat client
- **DeepSeek R1** -- Reasoning model
- **Gemini 2 Flash Thinking** -- Fast reasoning model
- **Repomix** -- Packages codebases for feeding to AI as a whole
- **Spark Desktop** -- Desktop AI assistant

---

## Cherry Studio Design Workflow

Cherry Studio + HTML enables rapid page design "card drawing." The core approach:

- Like image generation, try to **generate multiple outputs at once**, then pick the best
- Use **HTML or SVG** for rendering
- To reduce response size, require AI to use **TailwindCSS**
- Reference established design systems like Ant Design or Shadcn UI as background knowledge

### UI/UX Designer System Prompt Template

Here is a field-tested UI/UX Design System Prompt suitable for Cherry Studio or similar tools:

```text
# Role
UI/UX Designer Expert

## Notes
1. Encourage deep thinking about role configuration details to ensure task completion.
2. Expert design should consider the user's needs and concerns.
3. Use emotional prompting to emphasize the role's significance and emotional dimensions.

## Personality Type
INTJ (Introverted, Intuitive, Thinking, Judging)

## Background
The UI/UX Designer Expert role is designed to help users make informed decisions
in the visual design and user experience domain. This role provides professional
guidance and advice to help create beautiful yet functional interface designs.

## Constraints
- Must follow user-centered design principles
- Must consider cross-platform and multi-device compatibility

## Goals
- Provide innovative and practical UI/UX design solutions
- Enhance user satisfaction and product usability
- Optimize user-product interaction experience

## Skills
1. Visual design capability
2. User research and analysis
3. Interaction design
4. Technical implementation

## Tone
- Professional and insightful
- Encouraging innovation and experimentation
- Approachable and easy to understand

## Values
- User-first: all design centered on user needs
- Pursuing simplicity without sacrificing functionality
- Continuous learning and adapting to new technologies and trends

## Workflow
1. Understand user requirements and goals
2. Conduct market research and competitive analysis
3. Determine design direction and style
4. Create prototypes and interaction flows
5. Conduct user testing and collect feedback
6. Iterate based on feedback
7. Deliver high-quality design output

# Initialization
Hello, let us think step by step, working diligently and carefully.
Please follow the Workflow step-by-step according to the chosen role to achieve the Goals.
This is very important to me -- please help. Thank you! Let's begin.

# Output Format
Return the final design result in HTML, using TailwindCSS for styling.
```

---

## Core Questions for AI-Assisted Development

When promoting AI programming within a team, consider these questions:

1. **Tool comparison**: What are the respective use cases for Cursor's built-in browser Agent vs. chrome-devtools-mcp?
2. **Product form**: What distinguishes Claude Code and Codex from an IDE?
3. **Team generalization**: Can current AI programming practices scale to other team members?
4. **Engineering standards**: What are the engineering standards? How are they established? Are they high-cohesion, low-coupling?
5. **AI as challenger**: Let AI raise questions for me, filling in missing perspectives -- AI as Code Reviewer and proposal challenger
6. **Tech Lead perspective**: What questions does a Tech Lead care about? How do I answer them?
7. **Memory management**: How to effectively maintain context with Cursor Memory Bank?

---

## Prompt Template Library

### Code Reading

```text
What does this code implement? Please provide a detailed introduction, create a
colored table diagram or generate a visualization to aid understanding. Also output
a minimal runnable version of the code -- no error handling, no edge cases, no logging.
```

### Article / Note Organization

```text
Help me organize this into better Markdown format (add a table of contents if there
is a lot of content). Please ensure no content is lost; minor additions are fine.
Organize everything in Markdown so I can copy and use it directly.
```

### Book Report

```text
Help me organize this into better Markdown format. Please ensure no content is lost;
minor additions are fine. Organize everything in Markdown so I can copy and use it
directly. Required format:

A 50-word summary

---

## What I Liked

## What I Disliked

## Key Takeaways
```

### Paper Reading

```text
List the distinctive methods used in this paper. Compare them with previous techniques.
Give me a list that is extremely specific about what they did differently compared to
prior work.
```

### Codebase Improvement

```text
Hello AI, here is my entire codebase. Tell me 10 ideas for how I can improve it.
```

### High-Quality Answer Pre-check

```text
Don't rush to answer my question yet. In order to produce a higher-quality answer,
what additional information do I need to provide?
```

### Writing Style Switches

- "Please rewrite this article in a **Hemingway** style." -- Short sentences, direct, powerful
- "Rewrite it in the style of **Stephen King**'s *On Writing*." -- Narrative drive, rhythm, vivid imagery


## References

- [Cursor Documentation](https://docs.cursor.com/) — Official documentation for Cursor AI-powered code editor
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot) — Official GitHub Copilot documentation covering setup and best practices
- [Prompt Engineering for Developers — DeepLearning.AI](https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/) — Free course on prompt engineering techniques for software development

---

## Related Reading

If you're wondering how AI agents differ from the coding assistants you use daily, my [AI Agent Beginner's Guide](https://maoxunxing.com/ai-agent-guide/) breaks down Agent vs Copilot architectures, MCP protocols, and when to use each pattern.

When AI boosts individual productivity 10x, the real question becomes how your career adapts. [AI Is Rewriting the Playbook](https://maoxunxing.com/ai-rewriting-workflow/) covers the structural shift from executor to leverage designer with a 30-day action checklist.

If you want to systematize your learning the way Karpathy does, my [Git-based Knowledge Base pipeline](https://maoxunxing.com/karpathy-knowledge-base-practice/) shows how to build a three-layer raw→notes→posts workflow with LLM compilation.

---

*Felix Mao | [maoxunxing.com](https://maoxunxing.com) | [@maoxunxing](https://twitter.com/maoxunxing) | [GitHub](https://github.com/XingMXTeam/)*
