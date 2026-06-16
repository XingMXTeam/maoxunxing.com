---
title: "AI 写代码，真正难的不是 Prompt，而是 Harness"
description: "从 Prompt Engineering、Context Engineering 到 Harness Engineering：为什么 AI 前端开发真正缺的不是更聪明的模型，而是一套能提供上下文、约束、工具和反馈的运行环境。"
date: 2026-06-16
tags:
  - AI 编程
  - Harness Engineering
  - Context Engineering
  - Prompt Engineering
  - 前端工程
  - Coding Agent
draft: false
custom_toc:
  - title: "Prompt、Context 和 Harness 的区别"
  - title: "为什么被动上下文这么有效"
  - title: "前端为什么是一个极端案例"
  - title: "AI 前端开发不能只靠聊天框"
  - title: "真正有用的 Harness 应该包含什么"
  - title: "前端工程师的新机会"
  - title: "参考资料"
---

最近我在看 Codex、Claude Code、Vercel、LangChain 和 Anthropic 关于 agent 的一些实践文章时，越来越有一个感觉：AI 写代码这件事，真正难的可能已经不只是 Prompt 了。

最早大家聊 AI 编程，关注的是 **Prompt Engineering**，也就是“怎么问一个好问题”。后来慢慢发现，只会写 prompt 还不够，于是开始强调 **Context Engineering**：怎么把项目背景、代码结构、业务规则、接口文档、设计规范这些上下文提供给模型，让它不要凭空猜。

但现在我觉得，真正会拉开差距的，可能是第三件事：**Harness Engineering**。

## Prompt、Context 和 Harness 的区别

简单说，Prompt Engineering 关注的是：**怎么问**。

Context Engineering 关注的是：**给模型看什么**。

Harness Engineering 关注的是：**把模型放进一个什么样的运行环境里**。

这个区别很重要。

模型本身再聪明，如果它不知道项目结构，不知道真实业务约束，不能运行测试，不能看到浏览器里的效果，不能读取控制台报错，不能判断自己改完有没有破坏别的页面，那它就只能靠猜。

猜对了，看起来很神。猜错了，就会很离谱。

所以 AI 编程的核心问题，正在从“怎么写一个更好的 prompt”，变成“怎么搭一个更好的工程系统”。

LangChain 有一个很直白的说法：Agent = Model + Harness。模型提供智能，harness 让这种智能变得可用。这里的 harness 不只是系统提示词，而是包括工具、文件系统、沙箱、浏览器、状态、编排逻辑、反馈循环、权限约束和验证机制在内的一整套运行环境。

这句话我觉得很关键：**一个裸模型不是 agent。让模型能稳定工作的那套系统，才是 agent 能力真正落地的地方。**

## 为什么被动上下文这么有效

Vercel 之前做过一个很有意思的实验。

他们在 Next.js 16 API 相关的 eval 任务里，对比了几种给 coding agent 提供框架知识的方式。结果发现，一个压缩到大约 8KB 的 docs index，直接放进 `AGENTS.md` 并被动注入上下文之后，通过率达到了 100%。而使用 skill 的方案，即使显式提示 agent 去调用，最高也只到 79%。

这个结果很值得琢磨。

它不是说 `AGENTS.md` 有什么魔法，也不是说主动检索以后就没用了。真正关键的是：**被动上下文消灭了一个决策点**。

模型不需要先意识到“我可能不知道这个 API”，再决定“我要不要去查一下文档”。因为很多时候，模型最危险的地方恰恰在于，它不知道自己不知道。它会很自信地根据旧训练数据写出一个看起来合理、其实已经过时的方案。

而如果项目一开始就给它一张地图，告诉它：这个项目用的是哪个版本，文档在哪里，组件规范在哪里，路由规则在哪里，哪些地方不要乱改，那模型的工作方式会稳定很多。

OpenAI 在自己的 Harness Engineering 实践里也提到过类似经验：不要把 `AGENTS.md` 写成一本巨大的百科全书。上下文窗口是稀缺资源，什么都塞进去，最后等于什么都不重要。更好的方式是让 `AGENTS.md` 做目录和地图，把真正的知识放到结构化的 `docs/` 目录里，让模型知道遇到不同问题时应该去哪看。

这和我们平时带新人很像。

你不会第一天就塞给新人一份几百页的“宇宙级项目手册”，然后指望他全部记住。更好的方式是告诉他：项目怎么分层，核心模块在哪里，业务规则看哪份文档，历史决策看哪里，出问题怎么验证，哪些目录不要乱碰。

对 AI agent 来说也是一样。它不是缺少智力，而是缺少一个可导航、可验证、可反馈的工作环境。

## 前端为什么是一个极端案例

前端开发在这件事上尤其典型。

我不是说前端一定比后端更难。后端当然也有自己的复杂度，比如分布式系统的一致性问题、数据库迁移风险、Kubernetes 配置、缓存、消息队列、灰度发布，这些都不简单。

但前端有一个特别麻烦的地方：它的偶然复杂度和本质复杂度的比例很高，而且错误反馈经常非常滞后。

后端代码很多时候写错了，类型检查、编译、单元测试、集成测试、日志会比较早地告诉你。前端不一样。一个页面在 Chrome 里正常，在 Safari 里可能崩。你改了一个 CSS 选择器，看起来只影响当前组件，但可能因为优先级、继承、全局样式、响应式断点，悄悄影响到几十个页面外某个你从没打开过的组件。

JavaScript 又很宽松。`document.getElementById` 返回 `null`，代码不会在你写的时候立刻阻止你。等用户点了某个按钮，控制台才冒出一句：`Cannot read properties of null`。

还有 React 里的旧闭包、异步状态竞态、重复请求、组件卸载后的状态更新、CSS 层级冲突、移动端视口差异、弹窗 z-index 问题。这些错误很多不是因为模型“不聪明”，而是因为环境没有给它足够清晰、及时、可执行的反馈。

这也是为什么我越来越觉得，AI 前端开发不能只靠聊天框。

## AI 前端开发不能只靠聊天框

你告诉模型“帮我把这个页面优化一下”，它可能能做出一个看起来不错的版本。

但如果没有设计规范，没有组件边界，没有浏览器反馈，没有截图对比，没有 lint，没有类型检查，没有 e2e，没有视觉回归，它其实不知道自己有没有真的做好。

它只是完成了一次生成，不是完成了一次工程交付。

Anthropic 在 long-running application development 的 harness 设计里，有一个点我很认同：他们不是只让模型生成代码，而是让 evaluator 通过 Playwright 去真实访问页面、点击功能、截图观察，再根据产品深度、功能性、视觉设计、代码质量等标准给出反馈。

这背后的思路很适合前端：前端质量很多时候不是“代码能不能编译”就能判断的。它必须进入真实页面，必须被点击，必须被观察，必须有反馈循环。

对于人类前端工程师来说，这些事情其实我们一直在做。只是过去很多反馈都在人的脑子里：我打开页面看一眼，我知道哪里别扭；我点一下交互，我知道哪里不对；我看一眼设计稿，我知道间距不统一。

但模型没有这种默认环境。你不把浏览器、截图、控制台、网络请求、DOM、CSS 计算结果、设计规范交给它，它就只能用文字想象前端。

这当然不稳定。

## 真正有用的 Harness 应该包含什么

如果从前端 AI 编程的角度看，一个真正有用的 harness，至少应该包含几类东西。

第一类是**项目地图**。

比如 `AGENTS.md`、`CLAUDE.md`、`README`、`docs/index.md`。它们不需要写成百科全书，而是要告诉模型：这个项目怎么组织，核心模块在哪里，哪些文档是事实源，哪些目录不要乱改。

第二类是**事实源**。

比如接口文档、组件规范、设计系统、业务规则、状态管理约定、路由约定、错误码说明。这些东西最好放在仓库里，版本化，而不是散落在飞书、聊天记录、个人脑子里。

第三类是**执行环境**。

模型要能安装依赖、跑测试、启动服务、打开浏览器、访问页面、读取日志。否则它只能写代码，不能验证代码。

第四类是**反馈机制**。

类型检查、lint、单测、e2e、Playwright、截图、控制台报错、网络请求、DOM 结构、样式计算结果，都应该能回到模型手里。前端尤其需要这一层，因为很多问题不是静态看代码能看出来的。

第五类是**完成标准**。

什么叫“做好了”？是页面不报错？是样式和设计稿一致？是移动端正常？是无障碍可用？是性能不能退化？是核心链路必须跑通？

这些标准不写清楚，模型就会用自己的审美和经验来猜。

这就是 Harness Engineering 的价值。

它不是让模型一次回答得更漂亮，而是让模型在一个更可靠的系统里持续工作。模型负责推理、生成、修复和迭代；harness 负责给它上下文、工具、约束、反馈和边界。

如果说 Prompt Engineering 是“会问问题”，Context Engineering 是“会给材料”，那 Harness Engineering 就是“会搭工作台”。

好的工作台会让人少犯错，也会让模型少犯错。

## 前端工程师的新机会

未来 AI 编程的差距，可能不只体现在谁用了更强的模型，而是体现在谁把自己的项目整理得更适合模型理解，谁的反馈链路更短，谁的验证机制更完整，谁的工程环境更像一个可以让 agent 长期工作的系统。

对前端工程师来说，这反而是一个机会。

因为前端长期以来最痛的那些问题：样式不可控、状态难追踪、跨端差异、反馈滞后、视觉质量主观、组件影响面不清晰，正好都是 Harness Engineering 能发挥价值的地方。

也就是说，AI 不会简单地替代前端工程师。它更可能先替代那些只会“写页面”的工作方式。

真正有价值的前端工程师，会越来越像系统设计者：不仅会写代码，还会设计上下文、设计约束、设计反馈、设计验证流程，让 AI 在这个环境里稳定地产出高质量结果。

这可能才是 AI 编程进入下一阶段的关键：不是问得更巧，而是系统搭得更好。

## 参考资料

- Vercel: [AGENTS.md outperforms skills in our agent evals](https://vercel.com/blog/agents-md-outperforms-skills-in-our-agent-evals)
- OpenAI: [Harness engineering: engineering in the agent-first world](https://openai.com/zh-Hans-CN/index/harness-engineering/)
- OpenAI: [Unlocking the Codex harness: how we built App Server](https://openai.com/zh-Hans-CN/index/unlocking-the-codex-harness/)
- LangChain: [The Anatomy of an Agent Harness](https://www.langchain.com/blog/the-anatomy-of-an-agent-harness)
- LangChain: [Improving Deep Agents with harness engineering](https://www.langchain.com/blog/improving-deep-agents-with-harness-engineering)
- Anthropic: [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps)
