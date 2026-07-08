---
title: "Codex CLI：我现在更在意的不是会不会用，而是怎么让它安全地做事"
description: "从真实使用痛点出发，聊聊终端 Agent、AGENTS.md、权限边界、Skills 和 Subagents 到底解决了什么问题。"
date: 2026-05-27
tags:
  - AI 编程
  - Codex
  - OpenAI
  - CLI
  - Agent
custom_toc:
  - title: "真正的问题不是会不会用 AI 写代码"
  - title: "Codex CLI 到底改变了什么"
  - title: "AGENTS.md：给 AI 一张项目地图"
  - title: "权限边界：先建立信任，再追求速度"
  - title: "Skills 和 Subagents：不要把所有事都塞进一句 prompt"
  - title: "我建议的上手顺序"
  - title: "几个容易踩的坑"
  - title: "Codex CLI 适合什么人"
  - title: "References"
---

最近我试了一下几类终端型 AI 编程工具，最明显的感受是：AI 写代码这件事，已经不只是“模型能不能生成一段代码”了。

以前我们用 Copilot，更多是在编辑器里补几行代码。你写一个函数，它帮你续一点；你写一个注释，它猜一下实现。这个阶段的问题比较简单：补得准不准，风格像不像，能不能少打一点字。

但到了 Codex CLI、Claude Code、Gemini CLI 这类终端 Agent，问题变复杂了。它们不只是回答问题，而是可以读仓库、改文件、跑命令、看结果，甚至把一个任务拆成好几步去做。

听起来很厉害，但真正用起来，你很快会遇到一个更现实的问题：它写得很快，但你敢不敢直接合并？

Codex CLI 的重点不是“又多了一个能写代码的 AI 工具”，而是把 AI 带进了一个更接近真实工程现场的位置。

这里真正关键的不是模型多聪明，而是它有没有上下文、有没有边界、有没有反馈。

**没有反馈，AI 就是在黑屋子里写代码。**

## 真正的问题不是会不会用 AI 写代码

很多人第一次接触终端 Agent，会把注意力放在“怎么安装、怎么启动、怎么提问”上。这些当然要会，但它们不是最核心的问题。

因为 prompt 写得再好，也只能解决“你怎么问”。它解决不了模型能不能理解真实项目里的约束。

一个真实项目里，麻烦往往不在某一行代码，而在这些地方：

代码看起来能跑，但一进项目就和现有结构冲突；模型修好了当前页面，却顺手改坏了另一个页面；文档明明在仓库里，但它不一定知道什么时候该看；它能给你一个很漂亮的方案，但你不知道它有没有跑过测试。

所以我后来越来越觉得，AI 编程的下一阶段，不是问得更巧，而是系统搭得更好。

Prompt 当然重要，但它只是任务说明。真正让 AI 稳定工作的，是它能不能进入一个有上下文、有工具、有权限边界、有验证结果的环境。

简单说，问题从“怎么让 AI 回答我”，变成了“怎么给 AI 搭一个能工作的工程现场”。

## Codex CLI 到底改变了什么

Codex CLI 可以理解成一个在终端里工作的 coding agent。它不是单纯聊天，而是可以在当前项目目录里读取代码、理解规则、做修改，并把结果交回来。

这和传统聊天式 AI 的差别很明显。

聊天式 AI 更像一个很聪明的外部顾问。你把问题复制给它，它给你建议。但它并不知道你的项目实际长什么样，也看不到完整上下文，更不能在本地环境里验证。

Codex CLI 更像一个刚加入项目的新同事。你不能只给他说一句“帮我优化一下”，然后期待它自动理解所有背景。你要告诉它项目规则在哪里，哪些文件可以动，哪些命令需要先确认，改完以后怎么验证。

这个类比挺能说明问题：AI 不是缺少聪明，而是缺少项目现场。

如果没有项目地图，它只能猜。如果没有权限边界，它可能做过头。如果没有验证反馈，它不知道自己有没有真的做对。

所以我更愿意把 Codex CLI 看成三层东西：

```txt
Prompt 是任务说明
Context 是项目地图
Harness 是工程现场
```

Prompt 解决“你想让它做什么”。Context 解决“它应该看什么、遵守什么”。Harness 解决“它在哪里工作、怎么验证、怎么暴露错误”。

这个框架比单纯研究 prompt 更有用。因为真实项目里，很多问题不是 prompt 不够漂亮，而是 AI 根本没有进入正确的工作环境。

## AGENTS.md：给 AI 一张项目地图

如果只记住 Codex CLI 里的一个东西，我会建议先记住 `AGENTS.md`。

它有点像给 AI 准备的一份项目说明书。你不用每次都重新告诉它“先读文件再改”“不要动部署配置”“中文文章要保持自然语气”“改完以后检查格式”。这些稳定规则，可以沉淀到仓库里。

这件事看起来很小，但实际用起来很关键。

因为 AI 最大的问题之一，是每次对话都像重新入职。你今天告诉它项目风格，明天换一个任务，它可能又忘了。`AGENTS.md` 的价值，就是把这些重复解释变成可持续的上下文。

我自己会把它分成几类规则：

```md
# Repository expectations

- Read the existing files before making assumptions.
- Prefer minimal diffs.
- Run formatting checks after editing content files.
- Do not touch deployment config unless explicitly asked.
- For Hugo posts, keep EN and ZH-CN versions aligned.
```

这类文件不需要一开始写得很复杂。越复杂，越容易变成没人维护的说明书。我的建议是先写最小可用版，只放真正会反复用到的规则。

等项目变复杂以后，再考虑给不同目录加更具体的说明。比如 `content/posts/` 下面可以放写作规则，`layouts/` 下面可以放 Hugo 模板规则，`scripts/` 下面可以放脚本规范。

这里的反常识点是：你不一定要先提升模型能力，很多时候先提升上下文质量，效果更明显。

模型像新同事，`AGENTS.md` 就是项目地图。没有地图，再聪明的人也会走弯路。

## 权限边界：先建立信任，再追求速度

终端 Agent 最容易让人紧张的地方，是它真的会动你的项目。

以前聊天式 AI 说错了，大不了你不复制。现在终端 Agent 如果权限开得太大，它可能真的改文件、跑命令、影响工作区。

所以我不建议一上来就追求“全自动”。这件事很反直觉，因为很多人用 AI 的第一反应就是想省事，最好一句话让它全干完。

但在真实项目里，越强的自动化，越需要清晰边界。

我会按这个顺序来：

先让它只读项目，观察它怎么理解仓库；确认它能说清楚项目结构之后，再允许它做小范围修改；等你对它的行为模式有信任以后，再让它处理更复杂的任务。

这里的重点不是保守，而是降低不确定性。

你可以把权限理解成 AI 的工作范围。刚开始不要让它进入所有房间，先让它在客厅看一圈。等它知道哪里是厨房、哪里是电闸、哪里不能动，再让它帮你做更复杂的事。

如果你把 Codex CLI 当成真正会执行动作的协作者，权限就不是附属功能，而是第一层能力。

## Skills 和 Subagents：不要把所有事都塞进一句 prompt

很多人使用 AI 的习惯，是把所有规则都写进一次 prompt 里。写文章要什么风格，改代码要什么原则，检查文件要注意什么，全塞进去。

这个方式短期能用，但长期会累。

因为每次都要重新解释，而且解释得稍微不完整，结果就会飘。Skills 解决的就是这个问题：把一类重复任务固化成可复用流程。

比如你经常做这些事：

- 检查 Hugo 文章的 frontmatter
- 统一中英文文章标题和描述
- 按固定风格改中文文章
- 做前端页面的细微 UI 调整
- 审查一个 PR 有没有越界修改

这些就不适合每次临时写 prompt，而适合沉淀成 Skill。

简单说，Skill 的价值是把“每次重新解释任务”，变成“直接调用一套可靠流程”。

Subagents 也类似，但它解决的是另一个问题：大任务里，有些工作可以并行探索。

比如一个问题排查任务，可以让一个 agent 看日志，一个 agent 看测试，一个 agent 看代码结构，最后主线程汇总判断。这样比一个 agent 从头看到尾更快，也更容易发现遗漏。

但我不建议一开始就滥用 Subagents。尤其是多个 agent 同时写代码，很容易出现冲突。它更适合读多写少的任务，比如分析、搜索、定位、对比，而不是让一堆 agent 同时改同一片代码。

这也是我现在比较在意的一点：AI 工作流不是能力越多越好，而是每种能力要放在合适的位置上。

## 我建议的上手顺序

如果你刚开始接触 Codex CLI，我不建议一上来就追求“让它完整开发一个功能”。

更稳的方式，是先把它当成一个高质量仓库阅读器。让它总结目录结构，解释某个模块，找出某段逻辑入口，或者判断一个需求可能会改到哪些文件。

这个阶段最重要的不是产出代码，而是观察它怎么理解你的项目。它能不能找到关键文件，能不能说清楚依赖关系，能不能承认不确定性，这些比它立刻写出代码更重要。

等你确认它理解项目的方式还可以，再加 `AGENTS.md`。把项目规则、写作规则、改动边界、验证方式写进去，让它下一次不是重新认识你一遍，而是带着规则进入上下文。

然后再开放小范围写权限，让它做文案修改、小范围重构、样式修正、补充测试、写文档这类风险比较低的任务。

等这些都稳定以后，再把常用套路做成 Skills。比如文章检查、SEO 检查、Hugo 内容格式检查、前端 review。Skill 成熟以后，效率会比每次临时写 prompt 高很多。

最后再考虑 Subagents 和 Cloud tasks。不是它们没用，而是越强的能力越依赖稳定边界。边界没搭好，自动化越强，你越不敢放心用。

## 几个容易踩的坑

第一个坑，是装上以后觉得它只是聊天。

这通常不是模型不行，而是你没有给它可执行上下文。当前目录不对，项目规则没写，权限不清楚，目标没有验收方式，它当然只能像聊天机器人一样回答你。

第二个坑，是让它改得太多。

这个问题很常见。你只说“优化一下这个页面”，它可能顺手重构了一堆东西。解决方式不是生气，而是把“最小改动原则”写清楚：只改必要文件，不顺手重构，不改无关逻辑，修改前先说明计划。

第三个坑，是一开始就开太大权限。

很多人觉得权限越大越高效，但真实项目里，权限越大，不确定性也越大。刚开始你需要的是建立信任，而不是制造紧张感。

第四个坑，是想让它一次完成太多事。

终端 Agent 不是一句话丢过去，复杂任务就会自动拆得很完美。更好的方式是先澄清范围，再拆成几个可验证步骤，每一步都要求它交付明确结果。

这也是我现在越来越倾向的 AI 编程方法：先定义目标和边界，再让 Agent 执行。

## Codex CLI 适合什么人

如果你已经在用 Cursor、Claude Code，或者经常需要在本地仓库里做阅读、重构、排错、review，我觉得 Codex CLI 值得认真试一下。

它适合的不是“偶尔问 AI 一个代码问题”的场景，而是你已经开始把 AI 当成工作流的一部分，希望它能在项目里稳定做事。

如果你只是偶尔写点脚本，或者还没准备接受“AI 会动你的文件和命令”，那可以不用急。聊天式 AI 和 IDE 补全已经够用了。

但如果你已经明显感觉到：现在的问题不是 AI 会不会写，而是它能不能在真实项目里安全、稳定、可验证地完成任务，那 Codex CLI 这类终端 Agent 基本绕不过去。

我会把它看成一个信号：AI 编程的竞争，正在从“谁生成代码更快”，转向“谁能在约束下稳定完成工作流”。

最后真正要带走的，不是某个安装命令，而是这个框架：

```txt
Prompt 是任务说明
Context 是项目地图
Harness 是工程现场
```

你可以先不追求全自动，也不用一上来就研究所有高级功能。先做一件小事：给你的项目写一份像样的 `AGENTS.md`，再让 AI 从只读开始理解你的项目。

AI 编程的下一阶段，不是问得更巧，而是系统搭得更好。

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
