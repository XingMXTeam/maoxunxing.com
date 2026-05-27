---
title: "OpenAI Codex CLI 完整教程：安装、AGENTS.md、权限与自动化工作流"
description: "一篇面向前端工程师和 AI 编程实践者的 Codex CLI 教程，覆盖安装、AGENTS.md、权限配置、Skills、Subagents 与常见踩坑。"
date: 2026-05-27
tags:
  - AI 编程
  - Codex
  - OpenAI
  - CLI
  - Agent
  - 教程
custom_toc:
  - title: "为什么现在值得学 Codex CLI"
  - title: "Codex CLI 是什么"
  - title: "如何安装 Codex CLI"
  - title: "AGENTS.md 怎么用"
  - title: "权限、Skills、Subagents 怎么理解"
  - title: "我建议你的上手顺序"
  - title: "常见问题和踩坑"
  - title: "Codex CLI 适合什么人"
  - title: "References"
---

最近一波 AI 编程工具里，终端型 Agent 已经从“能写几行代码”进入了“能读仓库、改文件、跑命令、做验证”的阶段。

如果你最近在 X、GitHub，或者开发者社区里频繁看到 `Codex`、`Claude Code`、`Gemini CLI`，这不是错觉。截止 **2026 年 5 月 27 日**，GitHub 上的三个代表性仓库都已经进入非常高的关注区间：

- `anthropics/claude-code`：127k stars
- `google-gemini/gemini-cli`：105k stars
- `openai/codex`：85.9k stars

其中，`openai/codex` 对我来说有一个很值得写教程的点：它不是单纯“在终端里问答”，而是在 **AGENTS.md、权限边界、Skills、Subagents、MCP、Cloud task** 这些能力上，逐渐形成一套完整工作流。

如果你是前端工程师、独立开发者，或者已经在用 Cursor / Claude Code，这篇文章想解决的问题很直接：

1. `Codex CLI` 到底是什么？
2. 它和普通聊天式 AI、IDE Copilot 有什么不同？
3. `AGENTS.md`、权限、Skills、Subagents 应该怎么配？
4. 真正上手时，最容易踩哪些坑？

## 为什么现在值得学 Codex CLI

我选择这个题，不只是因为它“新”，而是因为它同时满足了两种信号。

第一种是**趋势信号**。OpenAI 在 `2026-04-16` 发布了 [Codex for (almost) everything](https://openai.com/index/codex-for-almost-everything/)，明确把 Codex 从“写代码”往“理解系统、调试、评审、协调长任务”扩展。紧接着在 `2026-05-08` 发布了 [Running Codex safely at OpenAI](https://openai.com/index/running-codex-safely/)，重点谈沙箱、审批、网络策略和遥测。又在 `2026-05-14` 发布了 [Work with Codex from anywhere](https://openai.com/index/work-with-codex-from-anywhere/)，把跨设备和远程环境工作流也补上了。

第二种是**搜索意图信号**。用户搜索 `Codex CLI` 时，通常不是为了看概念新闻，而是想解决这些具体问题：

- `Codex CLI install`
- `Codex CLI AGENTS.md`
- `Codex CLI permissions`
- `Codex CLI vs Claude Code`
- `Codex CLI tutorial`

这类词比泛新闻更容易沉淀持续流量，也更符合我这个站点的定位：**AI 编程实践，而不是只做资讯搬运**。

## Codex CLI 是什么

官方定义很直接：`Codex CLI` 是 OpenAI 的 coding agent，可以在你当前目录里**读取、修改、运行代码**，并且它是 **open source**，底层用 Rust 构建。

这和传统代码补全工具差别很大。

以前的 Copilot 类产品，更像“你写，它补”。而 `Codex CLI` 更像一个在终端里工作的执行型 Agent：

```txt
你给目标
→ 它先理解仓库和指令
→ 再读文件、跑命令、做修改
→ 最后把 diff、结果、风险交回来
```

所以你可以把它理解成三个层次：

### 1. 它不是普通聊天机器人

普通聊天机器人知道“怎么回答”，但不知道你本地仓库长什么样，也不能直接动手。

`Codex CLI` 的关键能力在于：

- 能读取当前项目上下文
- 能在许可范围内执行命令
- 能根据项目规则做具体修改

### 2. 它也不只是终端版 Copilot

很多人第一次装终端 Agent，会把它当“命令行聊天窗口”。但真正的价值在于它的**执行链路**：

- 指令继承：`AGENTS.md`
- 权限控制：`read-only` / `workspace` / `danger-full-access`
- 能力扩展：`Skills`
- 并行委派：`Subagents`
- 外部工具：`MCP`

这些组合起来，才是它和“能答题的模型”之间的根本差异。

### 3. 它开始覆盖完整开发流

现在的 `Codex CLI` 不只是能写代码。官方文档已经把它扩展到：

- 本地交互式开发
- 本地 code review
- Web search
- Cloud tasks
- GitHub / Slack / Linear 等集成

所以如果你是工程师，真正要学的不是一个命令，而是一套工作方式。

## 如何安装 Codex CLI

官方给了三种主流安装路径，macOS / Linux 最直接的是：

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

如果你更习惯包管理器，也可以：

```bash
npm install -g @openai/codex
```

或者：

```bash
brew install --cask codex
```

装完后直接运行：

```bash
codex
```

第一次启动时，通常会要求你登录。官方文档支持两种思路：

- 用 ChatGPT 账号登录
- 用 API key 配置

如果你已经有 ChatGPT Plus / Pro / Business / Edu / Enterprise，官方文档写得很明确，这些套餐都包含 Codex 能力。对大多数个人开发者来说，**优先用 ChatGPT 账号登录最省事**。

## AGENTS.md 怎么用

如果你只记住 Codex 一个概念，我建议你记住 `AGENTS.md`。

这是 Codex 工作流里最重要的“可持续上下文”机制之一。

官方文档里说得非常清楚：**Codex 会在开始工作前先读取 `AGENTS.md` 文件**。而且它不是只读一个文件，而是按层级组合：

1. `~/.codex/AGENTS.md` 这类全局指令
2. 仓库根目录的 `AGENTS.md`
3. 当前工作目录路径上的更近层级指令

离你当前目录越近的指令，优先级越高。

这意味着什么？

意味着你终于不用在每次对话里重复这些话：

- 先读项目结构再改
- 不要乱改无关文件
- 修改后跑哪些检查
- 哪些目录不能动
- 这个项目偏向什么风格

你可以直接把这些内容沉淀进仓库。

### 一个实用的 AGENTS.md 写法

如果是个人项目，我建议先写最小可用版：

```md
# Repository expectations

- Read the existing files before making assumptions.
- Prefer minimal diffs.
- Run formatting checks after editing content files.
- Do not touch deployment config unless explicitly asked.
- For Hugo posts, keep EN and ZH-CN versions aligned.
```

这类指令的价值不在“写得多”，而在于**写得稳定、长期复用**。

### 什么时候要加子目录级 AGENTS.md

如果你的仓库开始变复杂，就不要把所有规则都塞在根目录。

例如：

- `content/posts/` 下有内容写作规则
- `layouts/` 下有 Hugo 模板规则
- `scripts/` 下有脚本规范

Codex 官方文档支持在嵌套目录里继续放 `AGENTS.md` 或 `AGENTS.override.md`。这样它在处理某个子目录任务时，能读到更贴近那部分工作的规则。

这和我理解的“目标驱动 AI 编程”非常一致：**不要只优化 prompt，而是优化上下文系统。**

## 权限、Skills、Subagents 怎么理解

很多人第一次用终端 Agent，最大的不适感来自两个问题：

1. 它会不会改太多？
2. 它会不会跑不该跑的命令？

Codex 对这个问题的答案，不是“相信模型”，而是**先做边界设计**。

### 权限不是附属功能，而是第一层能力

官方的 `Permissions` 文档把权限分成了几种内建模式：

- `:read-only`
- `:workspace`
- `:danger-full-access`

我的建议非常简单：

- 第一次接触项目，用 `read-only`
- 确认项目结构和工作方式后，再切到 `workspace`
- `danger-full-access` 只在你非常明确风险时再开

如果你把终端 Agent 当成真正会执行动作的协作者，这个顺序是必要的。因为你最开始需要建立的不是速度，而是**信任边界**。

### Skills 适合把重复工作固化下来

官方把 `Skills` 定义成一类可复用工作流：一个 skill 可以打包指令、资源和可选脚本，让 Codex 在某类任务上走得更稳定。

这特别适合三类事：

- 固定格式的内容生成
- 固定步骤的代码审查
- 固定套路的脚手架或排错

如果你已经在 Cursor 或 Qoder 里习惯了 rules / templates / workflow，那你会很快理解 Skills 的价值。

它本质上是在做一件事：

```txt
把“每次重新解释任务”变成“直接调用一套可靠流程”
```

### Subagents 适合大任务，但不要滥用

`Subagents` 是 Codex 另一个很重要的能力。官方文档写得很明确，它可以让 Codex **并行启动多个专门 agent**，把探索、测试、日志分析这类读多写少的工作并发做掉。

我自己的理解是：

- 小任务，不要上 subagents
- 多维度分析任务，可以上 subagents
- 多 agent 同时写代码，要谨慎

因为并行带来的不是只有速度，还有协调成本。官方文档也特别提醒，**read-heavy** 任务更适合并行，**write-heavy** 任务更容易冲突。

所以更合理的用法是：

- 一个 agent 看测试失败
- 一个 agent 看日志
- 一个 agent 看代码结构
- 主线程最后汇总

这比“让所有 agent 一起改文件”稳定得多。

## 我建议你的上手顺序

如果你现在刚开始接触 `Codex CLI`，我不建议一上来就追求“全自动开发”。

更稳的顺序是：

### 第一步：先把它当高质量仓库阅读器

让它做这些事：

- 总结目录结构
- 解释某个模块
- 找出某段逻辑的入口
- 梳理一个需求可能会改到哪些文件

这个阶段最重要的不是产出代码，而是观察它怎么理解你的项目。

### 第二步：加 AGENTS.md，让它开始遵守规则

等你确认它的基本理解没问题，再把项目规范写进 `AGENTS.md`。

这样下一次任务，Codex 就不是“重新认识你一遍”，而是带着规则进入上下文。

### 第三步：只开放 workspace 级写权限

让它先做低风险改动：

- 文案修改
- 小范围重构
- 样式修正
- 补充测试
- 写文档

不要上来就交给它做跨目录大改。

### 第四步：把常用套路做成 Skills

例如：

- 生成博客双语草稿
- 做文章 SEO 检查
- 对 Hugo 文章跑格式 / 元数据检查
- 针对前端项目做 review

一旦 skill 成熟，你的效率会比“每次临时写 prompt”高很多。

### 第五步：最后再上 Subagents 和 Cloud tasks

这些能力不是没用，而是**越强的能力越依赖稳定边界**。

如果你还没把项目规范、权限模型、验证流程建好，就先不要追求最大自动化。

## 常见问题和踩坑

### 1. 装上了 Codex，但感觉只是聊天

这通常不是模型不行，而是你没有给它可执行上下文。

你要补的不是更多形容词，而是：

- 当前目录是否正确
- `AGENTS.md` 是否清晰
- 权限是否允许它动手
- 是否给了具体目标和验收方式

### 2. 它改得太多

这通常是两个原因：

- 任务描述太宽
- 没有明确“最小改动原则”

解决方式也很直接：把“只做最小必要修改”“先读文件再改”“不要顺手重构无关代码”写进 `AGENTS.md`。

### 3. 一开始就开太大权限

很多人容易犯这个错。觉得越大权限越高效，但实际上你在项目还没建立信任时，越大权限越容易把自己搞得紧张。

先 `read-only`，后 `workspace`，最后再考虑更高权限，这才是长期可持续的做法。

### 4. 想让它一次完成太多事

终端 Agent 不是你一句话丢过去，所有复杂任务都会自动拆得很完美。

更好的方式是：

```txt
先澄清范围
→ 再拆成几个可验证步骤
→ 每一步都给明确输出
```

这也是我现在越来越倾向的 AI 编程方法：**先定义目标和边界，再让 Agent 执行。**

## Codex CLI 适合什么人

如果你属于下面几类人，我认为 `Codex CLI` 值得尽快上手：

- 已经在用 Cursor / Claude Code，想理解 OpenAI 的 Agent 工作流
- 经常需要在本地仓库里做阅读、重构、排错、review
- 想把项目规范沉淀成可重复执行的上下文系统
- 想把 AI 从“问答工具”升级成“可以执行任务的协作者”

如果你只是偶尔写点脚本，或者还没准备接受“AI 会动你的文件和命令”，那你可以先不急着切终端 Agent。

但如果你已经进入**AI 编程工作流阶段**，而不只是“让 AI 帮你补几行代码”，那 `Codex CLI` 基本是绕不过去的一类工具。

## 结论

我会把 `Codex CLI` 看成一个很典型的信号：AI 编程的竞争，正在从“谁生成代码更快”，转向“谁能在约束下稳定完成工作流”。

在这个框架里，真正重要的不是一句 prompt，而是五件事：

- 指令怎么继承
- 权限怎么隔离
- 工作流怎么复用
- 并行任务怎么协作
- 验证和审计怎么补齐

而 `AGENTS.md`、`Permissions`、`Skills`、`Subagents`，正好就是这套方法论的骨架。

如果你最近刚好在研究 `Codex CLI`，我建议你不要只停留在安装层面。装好以后，先做一件小事：**给你的项目写一个像样的 `AGENTS.md`**。

这是我目前看下来，投入产出比最高的一步。

## References

- [Codex CLI - OpenAI Developers](https://developers.openai.com/codex/cli)
- [GitHub - openai/codex](https://github.com/openai/codex)
- [Custom instructions with AGENTS.md - OpenAI Developers](https://developers.openai.com/codex/guides/agents-md)
- [Permissions - OpenAI Developers](https://developers.openai.com/codex/permissions)
- [Agent Skills - OpenAI Developers](https://developers.openai.com/codex/skills)
- [Subagents - OpenAI Developers](https://developers.openai.com/codex/concepts/subagents)
- [Codex for (almost) everything - OpenAI](https://openai.com/index/codex-for-almost-everything/)
- [Running Codex safely at OpenAI - OpenAI](https://openai.com/index/running-codex-safely/)
- [Work with Codex from anywhere - OpenAI](https://openai.com/index/work-with-codex-from-anywhere/)
- [GitHub - anthropics/claude-code](https://github.com/anthropics/claude-code)
- [GitHub - google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli)
