---
title: "AI 时代，我们到底应该用什么命令行工具？"
date: 2026-04-30
tags:
  - 命令行
  - AI
  - 工具
---

今天想聊一个程序员每天都会碰到，但很多人又不太重视的东西：命令行工具。

以前我们在 Mac 上写代码，最常见搭配是 **iTerm2 + Oh My Zsh**。这套组合过去很好用，但在 AI 时代，命令行已经从“输入命令的地方”变成了“开发入口”。

你在里面跑项目、看日志、调 Git、启动 AI Agent、调用 Codex / Claude Code / Gemini CLI，甚至直接让 AI 帮你改代码。

所以问题变成：**AI 时代，我们到底应该用什么命令行工具？**

我的答案是：不要只选“一个终端”，而要按层设计工作流。

- 第 1 层：终端模拟器（iTerm2、Ghostty、Warp）
- 第 2 层：Shell（Zsh、Fish、Bash）
- 第 3 层：工作流工具（tmux、LazyGit、fzf、ripgrep）
- 第 4 层：AI 能力（Warp AI、Claude Code、Codex、Gemini CLI）

---

## 1. iTerm2：经典稳定，但 AI 感不强

iTerm2 依然是 macOS 上非常稳的选择：成熟、稳定、功能全，分屏、标签、快捷键、Profile 都很完善。官方文档也提到，iTerm2 支持把一个标签分成多个 Pane，每个 Pane 都是独立 Session。([iTerm2][2])

短板同样明显：它是传统终端思路，适合“人操作命令行”，不是为“AI 协助开发”原生设计。

结论：**保守型用户继续用 iTerm2 完全没问题。**

---

## 2. Oh My Zsh：好用，但别过度配置

Oh My Zsh 是开源、社区驱动的 Zsh 配置框架，插件和主题非常多。([Oh My Zsh!][3])

优点是上手快；缺点是容易“越配越重”，最后启动变慢、问题难排查。

结论：**可以用，但只留高价值插件。**

---

## 3. Fish：默认体验友好

Fish 的优势是开箱即用：语法高亮、自动建议、补全都默认提供。([Fish Shell][4])

而且它会在输入时给出实时反馈，比如命令不存在、重定向错误等。([Fish Shell][5])

缺点是并非完全 POSIX 兼容，部分 Bash/Zsh 脚本不能直接运行。

结论：**日常交互用 Fish 很舒服；脚本仍建议 Bash/Zsh。**

---

## 4. Ghostty：轻量高性能终端

Ghostty 官方定位是快速、功能丰富、跨平台终端，强调原生 UI 与 GPU 渲染。([Ghostty][6])

它的气质是：快、轻、干净、不绑工作流。你可以自由搭配 Fish/Zsh/tmux/Neovim/各类 AI CLI。

短板是 AI 不是内置重点。

结论：**适合把终端当“高性能容器”的用户。**

---

## 5. Warp：AI 原生终端代表

Warp 目前强调 agentic development，既可用内置 Agent，也能接入 Claude Code、Codex、Gemini CLI。([Warp][7])

另外 Warp 客户端已经开源。([Warp][8])

优势：AI 友好、现代交互、对新手门槛低。

代价：更重、更产品化、工作流“有观点”。而且 AI 生成命令必须审慎执行。

结论：**想把终端变成 AI 工作台，Warp 值得试。**

---

## 6. tmux：老派但仍然强

tmux 的核心是终端复用：多窗口、多面板、detach/reattach，特别适合远程服务器和长任务。([GitHub][9])

本地 GUI 终端分屏已经很够用时，不一定必须上 tmux；但远程开发场景它依然非常硬核。

---

## 7. LazyGit：Git 效率神器

LazyGit 是 Git 的终端 UI。([GitHub][10])

它特别适合高频 diff/stage/commit、分支管理、stash/rebase/cherry-pick。不是替你理解 Git，而是让懂 Git 的人更快。

---

## 8. 三套推荐组合

### 稳定保守型
**iTerm2 + Oh My Zsh + LazyGit**

### 轻量高效型
**Ghostty + Fish + LazyGit**

### AI 原生型
**Warp + AI Agent + LazyGit**

---

## 9. 我的最终建议

- 普通开发者继续用 iTerm2 没问题。
- 想要更现代、更轻量，试 Ghostty。
- 想要 AI 深度集成，试 Warp。
- Shell：不想折腾用 Fish，已习惯 Zsh 就继续用。
- Git：LazyGit 非常值得装。
- tmux：有远程开发/长期 Session 需求再上。

我自己的倾向是：

> Ghostty 做主力终端，Fish 做日常 Shell，LazyGit 处理 Git，AI 编程交给 Codex / Claude Code / Gemini CLI。需要 AI 终端体验时，再打开 Warp。

---

## 结尾

AI 时代，命令行不会消失，反而会更重要。

过去命令行是“程序员和机器”的接口；未来它更像“程序员、AI Agent、机器”的共同工作台。

所以我们选择命令行工具，不是在选一个黑窗口，而是在选自己的开发方式。

[1]: https://iterm2.com/features.html?utm_source=chatgpt.com "Features - iTerm2 - macOS Terminal Replacement"
[2]: https://iterm2.com/documentation/2.1/documentation-one-page.html?utm_source=chatgpt.com "Documentation - iTerm2 - Mac OS Terminal Replacement"
[3]: https://ohmyz.sh/?utm_source=chatgpt.com "Oh My Zsh - a delightful & open source framework for Zsh"
[4]: https://fishshell.com/docs/current/tutorial.html?utm_source=chatgpt.com "Tutorial — fish-shell documentation"
[5]: https://fishshell.com/docs/current/interactive.html?utm_source=chatgpt.com "Interactive use — fish-shell documentation"
[6]: https://ghostty.org/?utm_source=chatgpt.com "Ghostty"
[7]: https://www.warp.dev/?utm_source=chatgpt.com "Warp Terminal"
[8]: https://www.warp.dev/blog/warp-is-now-open-source?utm_source=chatgpt.com "Warp is now open-source"
[9]: https://github.com/tmux/tmux/wiki?utm_source=chatgpt.com "Home · tmux/tmux Wiki"
[10]: https://github.com/jesseduffield/lazygit?utm_source=chatgpt.com "jesseduffield/lazygit: simple terminal UI for git commands"
