---
title: "AI Agent 入门：我怎么理解 Agent、Copilot、MCP 和落地机会"
description: "这篇是我对 AI Agent 的一版理解笔记，主要讲 Agent 和 Copilot 的区别、常见架构、MCP / SGP 这类协议，以及一些可能落地的方向。"
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

我一开始理解 Agent 的时候，最容易混淆的就是它和 Copilot 的区别。简单说，Copilot 更像副驾，Agent 更像主驾。

| | Agent（主驾） | Copilot（副驾） |
|---|---|---|
| **角色** | 自主决策、执行 | 辅助、听指令 |
| **行为** | 感知环境 → 制定计划 → 执行任务 → 完成目标 | 你给指令 → 它帮你完成局部任务 |
| **对使用者要求** | 更需要定义目标和边界 | 更依赖 Prompt、业务场景和持续追问 |
| **流程** | 不确定，会动态调整 | 相对固定，人驱动 |

以前我们用 AI 工具，更多是在告诉它“帮我写一段代码”“帮我解释一下这个问题”。到了 Agent 这里，重点变成了“我给你一个目标，你自己判断下一步怎么做”。这个变化看起来只是名字不同，但实际对产品形态和工程架构影响很大。

---

## 为什么需要 Agent

模型本身并不是万能的。它有知识截止时间，也不能天然访问本地文件、浏览器、数据库、API 和真实业务系统。

所以 AI 工具大概会经历这样一个演进路径：

```text
单纯的 LLM
  ↓
结合 API 回答（Compound AI System / Agentic System）→ 固定 Pipeline
  ↓
Agent → LLM 基于任务目标和环境信息动态做决策，流程不再完全固定
```

这里的关键区别是：Pipeline 是固定流程，Agent 是动态流程。

Pipeline 更像你提前写好一串步骤：先做 A，再做 B，最后做 C。Agent 则是根据当前任务和环境状态，决定下一步到底该做什么。比如一个 Web Agent 打开网页后，发现按钮不存在，它可能会先找搜索框；如果登录态失效，它可能会先去登录。这种路径不是提前写死的。

---

## Agent 架构模式

### 单 Agent

单 Agent 比较好理解：一个 LLM 实例负责感知环境、规划任务、执行动作、读取反馈，然后继续下一步。很多简单任务，用单 Agent 就够了。

### 多 Agent

多 Agent 就会复杂一些。常见有两种方式：

- **主从模式**：一个主 Agent 负责规划和拆任务，多个子 Agent 执行具体任务。
- **平等协作模式**：多个 Agent 都有一定决策能力，根据能力和上下文决定谁来处理。

我个人感觉，多 Agent 听起来很酷，但真实落地时不一定一上来就需要。很多问题先用单 Agent + 工具调用就能跑起来。只有任务确实复杂到需要分工协作时，再考虑多 Agent 会更稳一点。

### Computer Use / Web Agent

Computer Use 或 Web Agent 的想象空间比较大。它和传统自动化测试最大的区别在于：传统自动化测试的步骤是人写死的，而 Web Agent 的操作路径是动态生成的。

比如传统测试脚本会写：点击第几个按钮、输入什么文本、等待哪个元素出现。Agent 则更像人在操作浏览器：它会看页面、理解目标、判断下一步该点哪里。这个能力还不完美，但方向很重要。

---

## 协议层：MCP 与 SGP

AI Agent 如果想真正落地，不能只停留在聊天窗口里。它需要接入本地资源、远程 API、业务系统、文件系统、浏览器和各种工具。这个时候协议层就变得很重要。

### MCP（Model Context Protocol）

MCP 主要解决的问题是：**本地电脑资源怎么接入 Agent？**

比如：

- RPA 流程自动化
- 本地文档
- 本地软件
- 文件系统
- 浏览器或开发工具

MCP 的价值在于，让 Agent 可以调用本地能力，而不是所有事情都必须走云端。对开发者来说，这也意味着很多原来分散的工具能力，可以通过统一协议接进 AI 工作流。

### SGP（Standard Gateway Protocol）

SGP 更像是远程服务接入方向，主要解决：**远程 API、远程模型和外部服务怎么统一接入 Agent？**

这个方向现在还没有像 MCP 那样形成很强的共识，但思路是类似的：Agent 不能只靠模型自己想，它必须能稳定调用外部能力。

---

## 落地思路与商业机会

### 架构层的机会可能更适合小团队

我现在对 Agent 的一个判断是：底层大模型和算法范式，可能更适合大公司做。但围绕具体场景的数据处理、系统工程、业务流程和应用形态，反而会留给很多小团队机会。

原因也简单：模型只是底座，真正把它接到业务里，还需要大量工程细节。比如权限、数据、流程、体验、成本、失败兜底，这些都不是模型一行回答能解决的。

### 个性化推荐可能会变化

传统推荐更多依赖统一的搜推算法。Agent 出现之后，个人化推荐可能会变得更细。

比如模型负责理解知识和通识，端上小模型负责隐私和本地个性化，每个人看到的 UI、内容和路径都不一样。这个方向很有想象力，但落地会很难，需要考虑性能、隐私、成本和体验。

### 选垂直场景，不做单点功能

我个人会更建议先选垂直场景，而不是铺货式地什么都做。

单点功能很容易被大模型或平台顺手吃掉。更稳的方式是深入一个具体流程，比如客服、舆情、研发、内容分发、投研、知识库管理，把 Agent 放进完整工作流里，而不是只做一个孤立按钮。

### Pipeline 思维仍然有价值

虽然 Agent 强调动态决策，但 Pipeline 思维并没有消失。很多真实产品，其实还是“模型识别意图 + 工具处理 + 人工兜底 + 结果交付”的组合。

比如：模型识别用户意图，调用抠图工具，再调用图片编辑工具，最后生成适合发布的素材。这里每个环节不一定都做到 100 分，只要整体能解决问题，就可能有价值。

### 文本也可以成为服务

这个想法我觉得很有意思：过去 FaaS 是服务，Serverless 是服务，现在文本也可以成为服务。

比如每天自动筛选 5 条英文 AI 新闻，满足某些条件后生成中文摘要，再排版发布到公众号。这不是单纯写一段文本，而是把“信息筛选、理解、改写、发布”做成一个服务。

### 业务场景示例

- **舆情和评论**：从大量信息里提取关键变化，而不是让人一条条看。
- **基建工具**：不是简单套壳，而是围绕一个未来工作流设计方案。
- **内容分发**：从长文拆短文、生成封面、适配平台格式、发布前检查。
- **研发流程**：需求理解、计划生成、代码修改、测试和验收串起来。

---

## 实践参考

### fastrtc

实时通信框架，适合构建语音 / 视频 Agent：[fastrtc.org/cookbook](https://fastrtc.org/cookbook/)

## References

- [Building Effective Agents — Anthropic](https://www.anthropic.com/engineering/building-effective-agents) — Anthropic's guide to building effective AI agents with practical patterns
- [Model Context Protocol (MCP) Specification](https://modelcontextprotocol.io/) — Official specification for MCP, the open protocol for AI-tool integration
- [LangChain Agent Documentation](https://python.langchain.com/docs/concepts/agents/) — Comprehensive documentation on building AI agents with LangChain framework
