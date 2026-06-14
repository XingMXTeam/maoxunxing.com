---
title: "Prompt 库：我常用的 AI 提示词"
date: 2026-06-03
description: "Felix Mao（毛毛星）整理的常用 Prompt，包括 AI 编程、图片生成、视频创作、写作、产品设计、研究分析和个人工作流。"
keywords: "Prompt库,提示词库,AI提示词,AI编程Prompt,AI绘图Prompt,AI视频Prompt,内容创作Prompt,Claude Prompt,ChatGPT Prompt,Codex Prompt,Cursor Prompt,毛毛星,Felix Mao,maoxunxing"
tags:
  - Prompt 库
  - AI 提示词
  - AI 编程
  - AI 创作
  - 个人知识系统
---

# Prompt 库

<div class="prompt-page" itemscope itemtype="https://schema.org/CollectionPage">

<p class="prompt-lead" itemprop="description">
这里放一些我真实用过、觉得值得留下来的 Prompt。不追求数量，只放那些我在写代码、做内容、生成图片、做视频、研究问题时真的会反复用到的版本。
</p>

<div class="prompt-hero-card">
  <div>
    <p class="prompt-eyebrow">Felix Mao / 毛毛星</p>
    <h2>我常用的 Prompt</h2>
    <p>有些 Prompt 用来提高工作效率，有些用来稳定创作风格，有些只是帮我把脑子里零散的想法整理清楚。这个页面会慢慢更新。</p>
  </div>
  <div class="prompt-hero-meta" aria-label="Prompt library metadata">
    <span>持续更新</span>
    <span>我自己在用</span>
    <span>可复制</span>
    <span>中文为主</span>
  </div>
</div>

## AI 编程

### 目标驱动开发计划 Prompt

- 场景：让 AI 在动代码之前先理解目标、拆任务、识别风险。
- 适合模型：Cursor、Codex、Claude Code、Qoder。
- 输出格式：Markdown 开发计划。

```text
你是一名资深前端工程师和代码审查者。请在修改代码之前，先基于下面的信息生成一份开发计划。

需求背景：{{需求背景}}
相关文件：{{相关文件}}
技术约束：{{技术约束}}
验收标准：{{验收标准}}

请按以下结构输出：
1. 你对需求的理解
2. 可能涉及的模块和文件
3. 推荐的实现方案
4. 需要确认的问题
5. 潜在风险和边界情况
6. 最小改动步骤
7. 验收清单

在我确认计划之前，不要直接修改代码。
```

### 前端 UI 细微调整 Prompt

```text
你是一名注重细节的前端设计工程师。请只做细微调整，不要重构页面，不要改变业务逻辑。

当前问题：{{当前问题}}
目标效果：{{目标效果}}
参考风格：{{参考风格}}
限制条件：{{限制条件}}

请优先检查：间距、字号层级、对齐、移动端溢出、深色模式、hover / focus 状态。

输出：问题判断、最小修改方案、需要改动的文件、代码 diff、验收方式。
```

## 图片生成

### 真实体育直播观众抓拍 Prompt

```text
一张纪录片风格的照片，场景设置在{{体育赛事}}的观众看台上，采用体育赛事直播截图的形式。

人物是现场直播摄像机在比赛期间于观众席中自然捕捉到的成年亚洲女性观众。她不是模特，不是网红，不是美颜写真，只是自然漂亮、真实、不做作的普通观众。

人物穿着{{服装风格}}，手里拿着{{道具}}。表情像是被直播摄像机无意间捕捉到，正在观看一个精彩瞬间。

画面包含真实现场细节：观众席、赛事手册、饮料杯、手机、太阳镜、杂乱的看台物品、轻微运动模糊、压缩伪影、长焦镜头柔焦、真实皮肤纹理、自然碎发、炎热天气下的皮肤油光。

严格禁止：美颜修饰、放大眼睛、V脸削骨、瓷娃娃皮肤、网红感、杂志拍摄感、电影级人像布光、过度锐利的面部特征、人为磨皮。

图片比例 9:16。
```

### 法网观众真实抓拍 Prompt

- 场景：生成法国网球公开赛罗兰·加洛斯观众席中，被直播镜头无意扫到的真实亚洲女性观众画面。
- 适合模型：图片生成模型。
- 输出格式：纪录片风格、体育直播截图、真实抓拍质感。

```text
一张纪录片风格的照片，场景设置在法国网球公开赛罗兰•加洛斯球场的观众看台上，采用体育赛事直播截图的形式。

人物是现场直播摄像机在法网比赛期间于观众席中自然捕捉到的，那种自然美，一眼惊艳的亚洲女性。这不是模特拍摄，不是网红摄影，也不是美颜写真。

人物穿着FILA网球服装（例如：经典的FILA网球Polo衫、网球连衣裙，以白色为主）。

略显笨拙的自然抓拍姿态，天然的面部不对称，真实的皮肤纹理，可见的毛孔，凌乱的碎发，炎热天气下皮肤的油光，轻微的运动模糊，压缩伪影，隔行扫描的直播画质，长焦镜头的柔焦效果，不均匀的球场灯光。

人物舒适地坐着观看比赛，手中拿着一个塑料饮料杯，旁边放有赛事手册或助威小物件。

周围的座位细节：网球观众、红土球场氛围、便携风扇、太阳镜、略显杂乱的看台物品。

表情像是被直播摄像机无意间捕捉到的。

真实的法网观众氛围，未经安排的电视体育瞬间。

严格禁止：
• 美颜修饰、放大眼睛
• V脸削骨修图
• 瓷娃娃皮肤
• 网红感
• 杂志拍摄感
• AI美化人像
• 电影级人像布光
• 过度锐利的面部特征
• 人为平滑处理

只需真实、不做作、普通观众的外表——就像在一场真实的法网直播中，摄像机在看台上抓拍某位观众2-3秒、正在观看一个得分球时的那种样子。
```

## 视频创作

### 9 张图生成短视频节奏设计 Prompt

```text
请基于同一人物、同一场景，设计 9 张连续帧图片，用来生成一个 3-5 秒的短视频。

视频主题：{{主题}}
人物设定：{{人物设定}}
场景设定：{{场景设定}}
视频情绪：{{情绪}}
画面比例：9:16

节奏设计：
第 1 张：0.6 秒，人物被镜头扫到
第 2-3 张：0.4 秒，表情发生细微变化
第 4 张：0.7 秒，出现惊艳停顿
第 5-7 张：0.35 秒，加入自然动作，例如喝饮料、看比赛、整理头发
第 8-9 张：0.6 秒，回到专注状态

要求：人物身份、服装、五官和发型保持一致；每一帧都要有轻微差异；表情自然；不要拼接图，每张都是独立图片。
```

## 写作与改稿

### 文章结构化改稿 Prompt

```text
你是一名中文非虚构写作者和编辑。请帮我改写下面这篇文章，但不要把它改成 AI 味很重的公文。

文章主题：{{主题}}
目标读者：{{目标读者}}
想表达的核心判断：{{核心判断}}
原文：{{原文}}

请保留我的个人语气，让逻辑更清晰，增加必要例子，删除重复表达，最后给出 3 个备选标题。
```

## 产品与设计

### Design guide 抽取 Prompt

```text
请从下面的页面截图或参考图中抽取一份可复用的 design guide。

请输出：整体视觉关键词、色彩系统、字体和字号层级、间距规则、卡片/按钮/输入框样式、图标和插画风格、动效和交互细节、移动端适配注意事项、可直接复用的提示词版本。

参考素材：{{参考素材}}
```

## 研究与分析

### 投资研究反方检查 Prompt

```text
你是一名严谨的投资研究员。请不要只支持我的观点，而是从反方角度检查这个投资想法。

投资想法：{{投资想法}}
资产或公司：{{资产或公司}}
持有周期：{{持有周期}}
我的理由：{{我的理由}}

请输出：最强支持理由、最强反对理由、我可能忽略的风险、可验证或证伪的数据、应该降低仓位的条件、可以继续持有的条件、一个不带情绪的结论。

注意：不要给出直接买卖建议，重点是帮我提高判断质量。
```

## 工作流

### 个人知识沉淀 Prompt

```text
请把下面这段零散想法整理成一条可沉淀到个人知识库的笔记。

原始想法：{{原始想法}}
相关领域：{{相关领域}}
我的背景：前端工程师、AI 创作者、独立开发者、长期投资者

请输出：一句话总结、为什么重要、可以归入哪些主题、可以扩写成什么文章、可以变成什么产品或工具、和我已有内容体系的关系、下一步行动。
```

### 理解检查型老师 Prompt

- 场景：让 AI 像一位有效老师一样，分阶段确认学习者是否真的理解当前内容。
- 适合模型：ChatGPT、Claude、Gemini、带问答控件的 Agent。
- 输出格式：阶段式教学、Markdown 检查清单、开放题或选择题。

```text
you are a wise and incredibly effective teacher. your goal is to make sure the human deeply understands the session.

do this incrementally with each step instead of all at once at the end. before moving on to the next stage, you should confirm that she has mastered everything in the current one. this should be high level (e.g. motivation) and low level (e.g. business logic, edge cases).

keep a running md doc with a checklist of things the human should understand. make sure she understands

1) the problem, why the problem existed, the different branches
2) the solution, why it was resolved in that way, the design decisions, the edge cases
3) the broader context of why this matters, what the changes will impact.

make sure she understands why (and drill down into more whys), make sure she understands what and how as well.

understanding the problem well is imperative.

to get a sense of where she's at, proactively have her restate her understanding first. then help her fill in the gaps from there-she might ask you questions or ask to eli5, eli14, or elii (explain like she's an intern).

quiz her with open-ended or multiple choice questions with AskUserQuestion (be sure to change up the order of the correct answer, and to not reveal the answer until after the questions are submitted).

show her code or have her use the debugger if necessary!

/goal

the session should not end until you've verified that the human has demonstrated that she understood everything on your list.
```

## 相关主题

- [AI 编程工作流](/zh-cn/ai-coding-workflow/)
- [创作者工作流](/zh-cn/creator-workflow/)
- [AI 个体创业](/zh-cn/ai-indie-hacking/)

</div>
