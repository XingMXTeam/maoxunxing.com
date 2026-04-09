---
title: "AI Agent 入门指南：从概念到协议"
description: "理解 AI Agent 核心概念：Agent 与 Copilot 的区别、架构模式、MCP 与 SGP 协议及落地思路。"
date: 2026-04-08
tags:
  - AI
  - Agent
  - MCP
  - 架构
custom_toc:
  - title: "Agent vs Copilot"
  - title: "为什么需要 Agent"
  - title: "Agent 架构模式"
  - title: "协议层：MCP 与 SGP"
  - title: "落地思路与商业机会"
  - title: "实践参考"
---

## Agent vs Copilot

这是理解当前 AI 工具形态的关键区分：

| | Agent（主驾） | Copilot（副驾） |
|---|---|---|
| **角色** | 自主决策、执行 | 辅助、听指令 |
| **行为** | 环境感知 → 制定计划 → 执行任务 → 完成目标 | 你给指令 → 帮你完成任务 |
| **对使用者要求** | 定义好目标和边界即可 | 需要 Prompt 能力、业务场景能力、持续探索 |
| **流程** | 不确定的，动态决策 | 相对固定，人驱动 |

---

## 为什么需要 Agent

模型不是能回答所有问题的。比如训练时的知识截止时间之后的事件，模型肯定回答不上来。

因此演进路径是：

```
单纯的 LLM
  ↓
结合 API 回答（Compound AI System / Agentic System）→ 固定的 Pipeline
  ↓
Agents → LLM 基于任务目标、环境信息动态做决策，流程是不确定的
```

关键区别：Pipeline 是固定流程，Agent 是动态流程。Agent 根据当前环境和任务目标，实时决定下一步做什么。

---

## Agent 架构模式

### 单 Agent

一个 LLM 实例，自主感知环境、规划、执行、反馈，完成端到端任务。

### 多 Agent

- **主从模式**：一个主 Agent 负责规划和分派任务，多个从 Agent 执行具体子任务
- **平等协作模式**：所有 Agent 都可以决策，根据能力和上下文决定谁来做

### Computer Use / Web Agent

与传统自动化测试的区别：传统测试的指令是人写的，而 Web Agent 的指令是 Agent **动态生成**的。Agent 可以像人一样操作浏览器、桌面应用，根据目标自主决定操作路径。

---

## 协议层：MCP 与 SGP

AI Agent 要真正落地，需要与外部资源和服务对接。目前有两个关键协议方向：

### MCP（Model Context Protocol）

解决的问题：**本地电脑资源怎么集成？**

- RPA（流程自动化）
- 本地文档（Local Doc）
- 本地软件（Local Software）

MCP 让 Agent 能够调用本地能力，不需要所有事情都走云端。

### SGP（Standard Gateway Protocol）

解决的问题：**远程服务怎么接入？**

- API 服务
- 远程模型

SGP 统一了 Agent 与远程服务的交互协议。

---

## 落地思路与商业机会

### 架构层的机会属于小企业

> 数据处理架构 + 系统工程 + 应用的范式是**不确定的**，是小企业家的机会，补齐模型做不了的事情。底部是非常多的模型。但是模型和算法的范式是**确定的**，是大企业做的事。

一个值得注意的发现：大模型通过蒸馏变成小模型，效果比不过从零开始训练的小模型。

### 个性化推荐的新范式

通过 Agent 实现个人化推荐，而不是传统的搜推算法：

- 模型关注知识和通识
- 端上解决隐私不走云端（1B 参数，300-500M 内存）
- 25ms 搜索 RT，模型适合 IM 异步场景
- 超级个性化：每个人进去看到的东西都是不一样的 UI

### 选垂直场景，不做单点

不要铺货式地什么都做，而是选出垂直场景深入。

### Pipeline 思维

不要被范式限制，而是考虑它能做什么，去体验它：

> 比如通过模型识别意图 → 通过抠图工具实现抠图 → 再通过其他工具实现后续处理。这是一个 Pipeline，数据 + 工程 + 算法全栈都可以做。能力不一定 100%，有 50% 就 OK。

### 文本即服务

FaaS 是一个服务，Serverless 是服务，那么**文本也可以成为服务**：

> 每天给我推送 5 条 AI 消息，只能是英文并且满足某些条件，最后执行任务发布到公众号——这可以成为一个服务。自己实现代码，成为一个服务。代码是生产力。

### 业务场景示例

- **舆情和评论**：提取淹没在海量信息中的关键信号
- **基建工具**：都可以用，关键是方案是什么，面向未来

---

## 实践参考

### fastrtc

实时通信框架，适合构建语音/视频 Agent：[fastrtc.org/cookbook](https://fastrtc.org/cookbook/)


## References

- [Building Effective Agents — Anthropic](https://www.anthropic.com/engineering/building-effective-agents) — Anthropic's guide to building effective AI agents with practical patterns
- [Model Context Protocol (MCP) Specification](https://modelcontextprotocol.io/) — Official specification for MCP, the open protocol for AI-tool integration
- [LangChain Agent Documentation](https://python.langchain.com/docs/concepts/agents/) — Comprehensive documentation on building AI agents with LangChain framework
