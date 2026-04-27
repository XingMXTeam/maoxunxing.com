---
title: "AI 一周速览：3B 对标 235B、缓存价格战与计费风波"
description: "本周 AI 圈焦点：AgenticQwen、GPT-5.5、DeepSeek 降价、Claude Code 计费 Bug，以及多模态、基础设施与产业趋势。"
date: 2026-04-27
tags:
  - AI
  - 周报
  - 大模型
  - Agent
  - 行业动态
custom_toc:
  - title: "核心大模型发布与技术迭代"
  - title: "AI 编程与开发者工具"
  - title: "多模态与应用层"
  - title: "学术与底层能力"
  - title: "机器人与物理世界"
  - title: "行业与趋势"
---

今天这一波有点意思：
阿里用 3B 活跃参数去硬刚 235B 大模型；DeepSeek 直接把缓存价格打到一折；另一边，Anthropic 因为一个文件名 Bug 引发“扣费风波”。

> 说明：本文基于公开社交媒体信息整理，具体数据与细节以各机构官方后续披露为准。

## 1. 核心大模型发布与技术迭代

### 阿里这次有点猛：3B 打 235B

阿里发布 AgenticQwen 系列，一个 30B 的 MoE 模型，但真正跑起来只用 3B 活跃参数。
关键是，在实际工具使用任务里，它居然能对标 Qwen3-235B，在 TAU-2 等测评里性能直接翻倍。

简单说一句：这不是堆参数了，是在拼“效率”。

来源：<https://x.com/omarsar0/status/2048504655932760565>

### GPT-5.5 正式落地

Sam Altman 亲自确认 GPT-5.5 已经上线 ChatGPT 和 Codex。
目前开发者反馈比较集中在一点：工具能力明显更强。
另外他也顺带强调了 OpenAI 的五大原则，比如“民主化”和“赋能”。

来源：<https://x.com/sama/status/2048554097985593849>

### DeepSeek 继续打价格战

DeepSeek 这次直接把缓存命中的价格打到原来的 **1/10**。
同时 DeepSeek-V4-Pro 还在打 7.5 折。

这个节奏已经不是优惠了，是在逼同行跟进。

来源：<https://x.com/deepseek_ai/status/2048440764368347611>

## 2. AI 编程与开发者工具

### Claude Code 出现“离谱 Bug”

有用户反馈，只是因为文件名里有个 `HERMES.md`，就触发了 Claude Code 的逻辑错误：
从订阅模式被切换到 API 计费，然后开始扣费。

Anthropic 已确认是 Bug，但拒绝退款，这点争议较大。

来源：<https://x.com/minchoi/status/2048509024782487911>

### GitHub 也开始“整活”了

GitHub 推了个有意思的小项目：
可以把你的个人主页变成一座像素城市，你的提交次数、Star 数直接决定“城市规模”。

挺适合开发者做一个“会动的数据名片”。

来源：<https://x.com/github/status/2048494014383505661>

## 3. 多模态与应用层

### GPT Image 2 更会“听话”了

OpenAI 内部人士透露，现在 GPT Image 2 在处理长提示词方面明显更强。
你给的信息越复杂，它反而越稳定，生成结果也更丰富。

来源：<https://x.com/gdb/status/2048449695622586576>

### AI 开始“理解人群类型”

有人用 AI 去生成各种“典型人设”，比如 GenZ、Gym bro 这种。
有意思的是，它对细节的捕捉已经到了很像现实的程度。

来源：<https://x.com/IterIntellectus/status/2048476474001244497>

## 4. 学术与底层能力

### Sakana AI 的新框架：TRINITY

Sakana AI 提出一个思路：
用“进化算法”来协调多个大模型之间的协作。

本质是在解决一个问题——多模型如何更高效地一起完成任务。

来源：<https://x.com/SakanaAILabs/status/2048444915429044444>

### 长周期智能体的问题，开始有人系统解决

新论文盯住两个痛点：

1. 任务太复杂，拆不动。
2. 技能库会过时。

给出的方案是“协同进化”，让智能体能长期稳定执行复杂任务。

来源：<https://x.com/omarsar0/status/2048440985726955998>

## 5. 机器人与物理世界

### TPU 8t 的细节出来了

Google 披露了 TPU 8t 的架构，采用 3D 环面网络。
一个集群可以堆到 9600 颗芯片，明显是为超大模型预训练准备的。

来源：<https://x.com/GoogleCloudTech/status/2048537610998440084>

### 一个有点“危险”的新闻

15 架工业级化学喷雾无人机被盗，已引发 FBI 关注。
这种设备本身载重和扩散能力都很强，安全层面确实是隐患。

来源：<https://x.com/AISafetyMemes/status/2048438610857259493>

## 6. 行业与趋势

### 英伟达供应链在悄悄变化

NVIDIA 的 Vera Rubin 服务器开始采用南亚科 LPDDR。
鸿海拿下 LPX 计算托盘独供，另外 TSMC 的 3nm 产能预计到 2026 年底会拉到每月 18 万片。

一句话：上游在加速。

来源：<https://x.com/dnystedt/status/2048547960812884160>

### 白领岗位在减少

数据显示，白领岗位减少 40 万，这是 2026 年首次年度下降。
很多人开始把这个趋势直接和 AI 联系起来——效率提升，岗位被压缩。

来源：<https://x.com/kimmonismus/status/2048489184323670480>

### WWDC 可能有大变化

Apple 2026 年 WWDC 的关注度很高。
外界普遍在看三件事：

- 新 CEO
- iOS 深度接入 Gemini
- macOS 的 AI 化

来源：<https://x.com/kimmonismus/status/2048471670529081666>
