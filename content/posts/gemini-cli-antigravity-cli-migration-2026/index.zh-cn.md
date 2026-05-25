---
title: "Gemini CLI 即将停服：如何迁移到 Antigravity CLI？2026 最新教程"
date: 2026-05-25
description: "Google 已宣布 Gemini CLI 将迁移到 Antigravity CLI，并在 2026 年 6 月 18 日起停止个人版和免费相关请求服务。本文整理受影响范围、迁移步骤、命令示例和常见问题。"
tags:
  - AI
  - Gemini CLI
  - Antigravity CLI
  - CLI
  - 教程
ai_generated: true
custom_toc:
  - title: "Gemini CLI 为什么要迁移"
  - title: "哪些用户会受影响"
  - title: "如何一步步迁移到 Antigravity CLI"
  - title: "Gemini CLI 和 Antigravity CLI 有什么区别"
  - title: "常见问题"
---

如果你最近还在用 Gemini CLI，现在最重要的不是折腾新 Prompt，而是先确认一件事：

**Google 已经宣布 Gemini CLI 将迁移到 Antigravity CLI，而且从 2026 年 6 月 18 日开始，个人版和免费 Gemini CLI / Gemini Code Assist 相关请求将停止服务。**

这不是“未来可能变化”，而是已经给出明确时间点的官方迁移通知。对于靠命令行做内容处理、代码生成、脚本协作和日常自动化的人来说，这篇文章最核心的目标只有一个：**帮你尽快完成迁移，避免工作流中断。**

如果你之前是照着我那篇 [`Gemini CLI 配置教程`](/ai-gemini-cli/) 配起来的，现在可以把它视为旧环境安装文；从今天开始，更应该关注的是 **Gemini CLI -> Antigravity CLI 的迁移路径**。

---

## Gemini CLI 为什么要迁移

根据 Google 在 **2026 年 5 月 19 日** 发布的官方说明，这次变更背后有两个核心原因：

### 1. Google 要把 CLI 能力并入更大的 Agent 平台

Gemini CLI 不再只是一个“调用模型的命令行壳子”。

Google 正在把它整合进 Antigravity 体系，包括：

- Antigravity 2.0
- Antigravity CLI
- Antigravity SDK
- Gemini API 的 Managed Agents

这意味着 Google 的方向已经不是单点 CLI 工具，而是一个更完整的 **Agent 运行时 + 工具调用 + 持续执行环境**。

### 2. Antigravity CLI 是继任者，不是平行替代品

Google 官方写得很直接：**Antigravity CLI 是 Gemini CLI 的继任产品。**

也就是说，这不是“你爱迁不迁”的工具多选题，而是官方产品路线已经切换。继续停留在 Gemini CLI，上限就是未来服务逐步退出。

---

## 哪些用户会受影响

这部分一定要看清楚，因为不是所有人都受影响程度一样。

### 明确会受影响的人

如果你属于下面这几类，建议尽快迁移：

- 使用个人版 Gemini CLI
- 使用免费版 Gemini Code Assist 相关能力
- 本地脚本、内容工作流、终端操作依赖 Gemini CLI
- 团队文档、教程、Shell alias、自动化脚本里还写着 `gemini`

根据 Google 官方说明，**从 2026 年 6 月 18 日开始，这些请求将停止服务。**

### 影响较小的人

Google 也说明了：

- 企业版 Gemini Code Assist 用户
- 标准版 Gemini Code Assist 用户

**不会受到这次停服影响。**

但即便如此，如果你的团队里同时存在个人工作流和企业工作流，还是建议尽早统一到 Antigravity CLI，避免文档和指令体系分裂。

---

## 如何一步步迁移到 Antigravity CLI

下面给你一个实用版迁移流程。重点不是“理论上可行”，而是尽量减少中断。

### 第一步：先盘点你现在有没有这些依赖

在动手之前，先检查这些地方：

- Shell alias
- `~/.config` 下的 Gemini 相关配置
- 个人脚本里是否硬编码 `gemini`
- README / 笔记 / 博文里的命令示例
- 自动化脚本或 CI 脚本里是否调用 Gemini CLI

你的目标不是马上删掉 Gemini CLI，而是先看清它嵌在哪些流程里。

### 第二步：安装 Antigravity CLI

Google 官方给出的安装命令是：

```bash
curl -fsSL https://antigravity.google/cli/install.sh | bash
```

安装后，先确认命令可用：

```bash
agy --version
```

如果你之前习惯了 `gemini` 命令，这一步最容易出错的地方不是安装失败，而是 **PATH 还没刷新**。遇到这种情况，重开一个终端窗口通常就能解决。

### 第三步：导入 Gemini CLI 插件

Google 官方提供了兼容迁移方式：

```bash
agy plugin import gemini
```

这一步的意义很大。它不是简单“装个插件”，而是帮助你把已有 Gemini CLI 工作流迁到 Antigravity CLI 的兼容层上，减少一下子全部重写命令的成本。

### 第四步：确认认证方式

如果你之前依赖 Gemini 账号体系或旧认证流程，迁移后要重点确认：

- 登录方式有没有变化
- API key 是否还沿用原配置
- 本地脚本是用户态调用，还是 API 调用

不要默认“装完就能直接跑以前所有命令”。真正容易出问题的，往往不是二进制安装，而是认证和配置路径。

### 第五步：把高频命令先迁移

我建议先迁这几类高频动作：

- 文本处理 / 翻译
- 代码解释 / 代码生成
- 文件级批处理
- 你平时最常用的 Prompt 模板

原因很简单：这几类动作最能快速验证新工具到底稳不稳。

### 第六步：更新文档和旧教程

如果你自己维护博客、知识库、团队文档，别忘了把旧入口一起更新。

尤其是下面这些内容：

- 安装命令
- 首次登录步骤
- 常用 alias
- FAQ
- 自动化脚本说明

否则接下来你会反复踩“文章里写的和现在工具不一致”的坑。

---

## 一个更稳的迁移顺序

如果你不想一次性全切，可以按下面顺序来：

1. 先安装 Antigravity CLI，不卸载 Gemini CLI
2. 先迁移 1 到 2 个最高频工作流
3. 对比输出质量、速度和稳定性
4. 再迁移个人模板和脚本
5. 最后清理旧命令、旧文档和旧 alias

这样做的好处是：**你不会因为一次性全切，导致整条工作流一起挂。**

---

## Gemini CLI 和 Antigravity CLI 有什么区别

从官方路线看，差异已经不只是“换个名字”。

### Gemini CLI 更像什么？

- 单点 CLI 工具
- 重点在模型调用
- 适合个人直接使用

### Antigravity CLI 更像什么？

- 更接近 Agent 工作台
- 更强调工具调用与持续执行
- 与 Antigravity 平台和 Managed Agents 更一致

如果你只看短期，会觉得这是一轮命令迁移。

但如果你把它放到 Google I/O 2026 的产品路线里看，会发现它本质上是：**Google 把“模型命令行”升级成“Agent 命令行”。**

---

## 迁移时最容易忽略的三个问题

### 1. 旧 alias 没删，导致你以为自己在用新工具

很多人 Shell 里早就配过：

```bash
alias gemini="some-old-wrapper"
```

如果不清理，你可能以为自己完成了迁移，实际上还在调用旧封装。

### 2. 文档没改，团队里继续有人照旧教程操作

这类问题尤其常见。你自己迁完了，但同事、新读者、未来的自己还是会照旧教程继续装 Gemini CLI。

所以迁移不是只改本机，而是要改“知识入口”。

### 3. 把“停服”理解成“暂时不可用”

这次官方给的是明确服务停止日期，不是一次临时故障公告。

如果你依赖这条链路做生产性工作，最好在 **2026 年 6 月 18 日之前** 就完成迁移验证。

---

## 常见问题

### Q1：Gemini CLI 现在还能不能继续用？

在官方停止相关请求服务前，部分场景可能还能用。但从迁移成本和稳定性来看，已经不值得继续把新工作流建立在旧工具上。

### Q2：企业用户需要马上迁吗？

Google 官方说明企业版和标准版 Gemini Code Assist 不受这次变化影响。但如果你的团队同时维护个人环境、教程和自动化脚本，提早统一仍然更省事。

### Q3：我以前写的 Gemini CLI 教程是不是过时了？

如果教程的目标是“帮助用户今天开始搭环境”，那它已经部分过时；如果教程的目标是“解释旧方案曾经怎么配”，它仍然有存档价值。更好的做法是补一篇迁移指南，并在旧文里加新文入口。

### Q4：现在还有必要继续学这类 CLI 工具吗？

有必要，而且重要性更高了。

因为这波变化说明一件事：AI CLI 不再只是模型调用入口，而是正在演化成 **Agent 工作流入口**。命令会变，平台会变，但“用终端组织 AI 工作流”的能力只会越来越值钱。

---

## 最后

如果你只想记住一件事，那就是：

**Gemini CLI 的问题已经不是“还好不好用”，而是“官方路线已经切换到 Antigravity CLI，且 2026 年 6 月 18 日开始个人版和免费相关请求将停止服务”。**

所以最务实的动作不是继续观望，而是：

1. 先安装 Antigravity CLI
2. 导入 Gemini 插件兼容层
3. 把高频工作流迁过去
4. 更新自己的教程、脚本和文档

这样你后面无论是做内容创作、AI 编程，还是终端自动化，至少不会在最基础的命令入口上被突然卡住。

## References

- [An important update: transitioning Gemini CLI to Antigravity CLI — Google Developers Blog, May 19, 2026](https://developers.googleblog.com/en/an-important-update-transitioning-gemini-cli-to-antigravity-cli/)
- [Building the agentic future: Developer highlights from I/O 2026 — Google Blog, May 19, 2026](https://blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-developer-highlights/)
