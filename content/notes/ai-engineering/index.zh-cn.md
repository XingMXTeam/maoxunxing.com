---
title: "AI 工程实践：从原则到工具链"
date: 2026-04-13
tags:
  - AI
  - LLM
  - Agent
  - 工具
  - 自动化
---

本文综合整理了 AI 工程领域的核心概念、设计原则、工具链和知识管理方法，为构建可靠的 AI 应用提供系统性参考。

---

## 一、AI 基础概念速查

### 神经网络

| 类型 | 特点 | 典型用途 |
|------|------|----------|
| 前馈神经网络（FFNN） | 信号单向传递，无记忆 | 分类、回归 |
| 循环神经网络（RNN） | 处理序列数据，能记住前面的信息 | 文本、时间序列 |
| 卷积神经网络（CNN） | 自动提取特征（边缘、形状） | 图像处理 |

### 训练与优化

- **预训练**：AI 先学习海量通用数据，掌握基础能力
- **微调（Fine-tuning）**：在预训练基础上，用特定任务数据训练
- **人类对齐（Alignment）**：让 AI 回答符合人类价值观
- **LoRA**：只修改模型一小部分参数，节省资源
- **量化（Quantization）**：压缩模型大小，加快推理速度
- **蒸馏（Distillation）**：用大模型指导小模型

### Transformer 架构

核心组件：Embedding（文字转向量）、自注意力机制（关注重要信息）、多头注意力（同时关注不同特征）、编码器/解码器。

- **Base 模型**：经过预训练但回答可能不稳定
- **Chat 模型**：经过对齐，能稳定回答问题

### 提示词工程

角色扮演、思维链（CoT）、结构化输入、限制长度、样本学习（Few-shot）、顺序思考（Sequential Thinking）。

### RAG（检索增强生成）

1. 索引：将知识库数据转为向量
2. 检索：根据问题找到相关片段
3. 生成：结合检索结果生成最终答案

演进：Naive RAG -> Advanced RAG -> Modular RAG

### Agent（智能体）

- 模式：ReAct（思考与行动）、Plan & Execute、Multi-Agent
- 记忆：长期记忆、短期记忆、工作记忆
- 工具调用：MCP 协议、Function Call

### 框架与工具

| 工具 | 用途 |
|------|------|
| LangChain | 模块化构建 AI 应用 |
| MCP 协议 | 统一 AI 与工具的接口 |
| RAGAS 框架 | 评估 RAG 系统性能 |

---

## 二、构建可靠 LLM 应用的 12 条原则

来源：[12 Factor Agents](https://github.com/humanlayer/12-factor-agents)，受 12 Factor Apps 启发。核心观点：**好的 AI Agent 本质上"大部分还是软件"**。

### 演进路径

传统代码 -> DAG 编排器 -> Agent 循环 -> 模块化、软件化的控制流

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

问题：粗粒度循环在达到 70-80% 质量后很难再提升，而面向客户的产品需要更高标准。

### 12 + 1 条原则

| # | 原则 | 要点 |
|---|------|------|
| 1 | Natural Language to Tool Calls | LLM 核心能力：自然语言 -> 结构化工具调用 |
| 2 | Own Your Prompts | 完全掌控提示词，不依赖框架默认值 |
| 3 | Own Your Context Window | 精心管理上下文内容，它决定 LLM 的决策 |
| 4 | Tools Are Just Structured Outputs | 工具只是获取结构化数据的机制 |
| 5 | Unify Execution & Business State | Agent 执行状态与业务状态统一管理 |
| 6 | Launch/Pause/Resume | 设计可干净启停和恢复的 Agent |
| 7 | Contact Humans with Tool Calls | 通过工具调用实现 Human-in-the-Loop |
| 8 | Own Your Control Flow | 编写显式控制流，不依赖框架"魔法" |
| 9 | Compact Errors into Context | 错误压缩后送回上下文，让 LLM 自行纠正 |
| 10 | Small, Focused Agents | 构建小而专注的 Agent，而非大而全 |
| 11 | Trigger from Anywhere | 支持多种触发方式（Slack、Webhook、API 等） |
| 12 | Agent as Stateless Reducer | Agent 逻辑应是输入状态的纯函数 |
| 13 | Pre-fetch All Context | 提前获取可能需要的所有上下文 |

**关键观点**：框架在 80% 之前有用，超过后往往成为障碍。最佳实践是将 Agent 模块化概念融入现有产品。

---

## 三、gstack：AI 软件工厂实践

来源：[gstack](https://github.com/garrytan/gstack)，Y Combinator 总裁 Garry Tan 开源的 AI 工程工作流工具集。核心理念：**一个人 + 正确的工具 > 传统团队**。

### 冲刺流程

Think -> Plan -> Build -> Review -> Test -> Ship -> Reflect

### 23 个专家角色（部分）

| 阶段 | 角色 | 职责 |
|------|------|------|
| 产品 | `/office-hours` | 产品构思与验证 |
| 策略 | `/plan-ceo-review` | 战略审查 |
| 架构 | `/plan-eng-review` | 技术架构审查 |
| 设计 | `/design-consultation` | 设计系统与品牌 |
| 调试 | `/investigate` | Bug 调试与排查 |
| QA | `/qa` | 测试与质量保证 |
| 发布 | `/ship` | 部署与发布 |
| 回顾 | `/retro` | 周回顾与复盘 |

### 浏览器自动化（$B 命令）

内置 Playwright 无头浏览器，支持导航、读取、交互、截图、网络检查等操作。

### 工程实践

- **slop-scan**：检测 AI 生成代码中的低质量模式
- **freeze/guard**：限制编辑范围，防止误操作
- **Conductor**：多 Agent 并行执行冲刺流程

---

## 四、LLM 驱动的个人知识库方法

来源：Andrej Karpathy 的知识库方法论。

### 工作流

1. **数据导入**：将文章、论文、代码等归档到 `raw/` 目录
2. **LLM 编译**：通过 LLM 逐步生成按目录组织的 `.md` 文件知识库
3. **IDE 查看**：用 Obsidian 作为前端查看原始数据和编译后的知识库
4. **问答交互**：知识库规模足够大时，向 LLM Agent 提出复杂问题
5. **结果输出**：生成 Markdown、幻灯片（Marp）、Matplotlib 图表
6. **内容校验**：LLM 健康检查，排查矛盾、补全缺失、挖掘关联

关键发现：小规模场景下不需要复杂的 RAG，LLM 能自动维护索引和摘要。

---

## 五、Chrome DevTools + MCP 自动化测试

### 环境要求

| 依赖 | 要求 |
|------|------|
| Chrome | 最新稳定版 |
| Node.js | > 22 |
| Chrome DevTools MCP | 最新版 |

### 两类场景

1. **Web 页面自动化**：登录、菜单导航、接口校验
2. **Chrome 扩展自动化**：popup/onboarding 页面、扩展业务流程

### 人类化行为模拟

- 输入每字间隔 50-150ms
- 操作间隔 300-800ms
- 滑块验证需曲线轨迹、800-1500ms 时长
- 页面加载后等待 1-2 秒

### 通用实践

1. 先连接再操作（通过 MCP 列出标签页确认状态）
2. 分阶段执行：初始化 -> 认证 -> 业务 -> 校验
3. 配置结构化：URL、账号、扩展 ID 放入配置
4. 异常表格化：为每类场景列异常处理表

---

## 来源

- [12 Factor Agents](https://github.com/humanlayer/12-factor-agents)
- [gstack](https://github.com/garrytan/gstack)
- Andrej Karpathy 个人知识库方法
- Chrome DevTools + MCP 自动化实践
