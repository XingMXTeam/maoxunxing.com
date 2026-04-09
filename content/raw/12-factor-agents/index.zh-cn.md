---
title: "12 Factor Agents - 构建可靠 LLM 应用的 12 条原则"
date: 2026-04-09
draft: true
tags: [AI, LLM, Agent, Architecture, Design Patterns]
source: "https://github.com/humanlayer/12-factor-agents"
---

## 简介

受 [12 Factor Apps](https://12factor.net/) 启发，由 HumanLayer 的 Dex 整理的一套构建可靠 LLM 应用的工程原则。核心观点：**好的 AI Agent 本质上"大部分还是软件"**，而非简单的"给个目标 + 工具，循环到完成"模式。

作者发现大多数对外号称"AI Agent"的产品其实并没那么 agentic——它们大部分是确定性代码，在关键节点穿插 LLM 调用来创造"魔法感"。

> **The fastest way I've seen for builders to get good AI software in the hands of customers is to take small, modular concepts from agent building, and incorporate them into their existing product.**

## 演进路径

传统代码 → DAG 编排器 (Airflow/Prefect/Dagster) → Agent 循环 → 模块化、软件化的控制流

Agent 循环的基本模式：

```python
context = [initial_event]
while True:
    next_step = await llm.determine_next_step(context)
    context.append(next_step)
    if next_step.intent == "done":
        return next_step.final_answer
    result = await execute_step(next_step)
    context.append(result)
```

问题在于：这种粗粒度循环在达到 70-80% 质量后很难再提升，而 80% 对面向客户的产品远远不够。

## 12 条原则

### Factor 1: Natural Language to Tool Calls

LLM 的核心能力是将自然语言转换为结构化的工具调用（structured JSON）。这是 Agent 的基础能力。

### Factor 2: Own Your Prompts

完全掌控你的提示词工程，而不是依赖框架默认值。框架封装的 prompt 在达到 80% 后会成为瓶颈。

### Factor 3: Own Your Context Window (Context Engineering)

精心管理送入上下文窗口的内容。Context 是你最重要的资源——决定了 LLM 能看到什么、会做什么决策。

### Factor 4: Tools Are Just Structured Outputs

工具不是什么神秘的东西——它只是从 LLM 获取结构化数据的一种机制。Function calling、structured output、JSON mode 本质上是同一件事的不同表现形式。

### Factor 5: Unify Execution State and Business State

将 Agent 的执行状态与业务领域状态统一管理。不要让 Agent 的运行状态散落在框架内部——它应该和你的业务数据放在一起，可查询、可审计。

### Factor 6: Launch/Pause/Resume with Simple APIs

设计可以干净地启停和恢复的 Agent。Agent 不应该是一个长时间运行的进程——它应该可以随时暂停、持久化状态、然后从断点恢复。

### Factor 7: Contact Humans with Tool Calls

通过工具调用实现 Human-in-the-Loop。当 Agent 需要人类介入时（审批、确认、提供信息），这应该和其他工具调用一样是一个结构化的操作。

### Factor 8: Own Your Control Flow

编写显式的控制流，而不是依赖框架的"魔法"。当你需要超越 80% 质量线时，你需要能精确控制 Agent 在每个步骤做什么。

### Factor 9: Compact Errors into Context Window

将错误信息压缩后送回上下文窗口。错误不应该终止 Agent——它们应该成为 context 的一部分，让 LLM 可以自行纠正和重试。

### Factor 10: Small, Focused Agents

构建小而专注的 Agent，而非大而全的单体。即使 LLM 持续变强，小型专注的 Agent 也更容易调试、测试和维护。

### Factor 11: Trigger from Anywhere, Meet Users Where They Are

支持多种触发方式——Slack、邮件、Webhook、Cron、API 调用等。Agent 应该能从任何地方被唤起。

### Factor 12: Make Your Agent a Stateless Reducer

Agent 逻辑应该是输入状态的纯函数。给定相同的上下文/状态，Agent 应该产生相同的行为。这使得 Agent 可测试、可重放、可调试。

## Honorable Mention

### Factor 13: Pre-fetch All the Context You Might Need

提前获取你可能需要的所有上下文。不要让 Agent 在运行中一次次去查，尽量在开始前就把相关信息准备好。

## 关键观点

- 框架在 80% 之前很有用，超过 80% 后往往成为障碍
- 最佳实践：将 Agent 的模块化概念融入现有产品，而非推倒重来
- 这些原则对有经验的软件工程师来说都是可操作的，即使没有 AI 背景
- 代码使用 Apache 2.0 许可，内容使用 CC BY-SA 4.0 许可

## 相关资源

- [AI Engineer World's Fair 演讲](https://www.youtube.com/watch?v=8kMaTybvDUw)
- [YouTube Deep Dive](https://www.youtube.com/watch?v=yxJDyQ8v6P0)
- [The Outer Loop (作者博客)](https://theouterloop.substack.com)
- [got-agents/agents (用此方法论构建的 OSS agents)](https://github.com/got-agents/agents)
- [Building Effective Agents (Anthropic)](https://www.anthropic.com/engineering/building-effective-agents)
