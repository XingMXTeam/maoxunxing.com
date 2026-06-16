---
title: "Prompt 库：我常用的 AI 提示词"
date: 2026-06-03
description: "我整理的一些真实用过、值得长期留下来的 Prompt，覆盖 AI 编程、图片生成、视频创作、写作、产品设计、研究分析和个人工作流。"
keywords: "Prompt库,提示词库,AI提示词,AI编程Prompt,AI绘图Prompt,AI视频Prompt,内容创作Prompt,Claude Prompt,ChatGPT Prompt,Codex Prompt,Cursor Prompt,毛毛星,Felix Mao,maoxunxing"
tags:
  - Prompt 库
  - AI 提示词
  - AI 编程
  - AI 创作
  - 个人知识系统
---

# Prompt 库

<div class="prompt-page">

<p class="prompt-lead">
这里放一些我真实用过、觉得值得留下来的 Prompt。不追求数量，只放那些我在写代码、做内容、生成图片、做视频、研究问题时真的会反复用到的版本。
</p>

<div class="prompt-hero-card">
  <div>
    <p class="prompt-eyebrow">Felix Mao / 毛毛星</p>
    <h2>我常用的 Prompt</h2>
    <p>这些 Prompt 有些是为了提高工作效率，有些是为了稳定创作风格，有些只是帮我把脑子里零散的想法整理清楚。这个页面会慢慢更新。</p>
  </div>
</div>

<div class="prompt-category-list">
  <a class="prompt-category" href="#ai-编程">AI 编程</a>
  <a class="prompt-category" href="#图片生成">图片生成</a>
  <a class="prompt-category" href="#视频创作">视频创作</a>
  <a class="prompt-category" href="#写作与改稿">写作与改稿</a>
  <a class="prompt-category" href="#产品与设计">产品与设计</a>
  <a class="prompt-category" href="#研究与分析">研究与分析</a>
  <a class="prompt-category" href="#工作流">工作流</a>
</div>

## AI 编程

### 目标驱动开发计划 Prompt

这条适合在 Cursor、Codex、Claude Code 这类工具里动手改代码前使用。我的习惯是先让 AI 把需求、风险、边界和最小改动路径说清楚，再开始写代码。

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

这条适合用来做页面细节打磨。它的重点不是大改，而是约束 AI 只处理间距、字号、对齐、移动端溢出、深色模式这类细节问题。

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

这条是我用来做“体育直播观众席真实抓拍感”的通用版本，重点是去掉写真感、网红感和过度修图感。

```text
一张纪录片风格的照片，场景设置在{{体育赛事}}的观众看台上，采用体育赛事直播截图的形式。

人物是现场直播摄像机在比赛期间于观众席中自然捕捉到的成年亚洲女性观众。她不是模特，不是网红，不是美颜写真，只是自然漂亮、真实、不做作的普通观众。

人物穿着{{服装风格}}，手里拿着{{道具}}。表情像是被直播摄像机无意间捕捉到，正在观看一个精彩瞬间。

画面包含真实现场细节：观众席、赛事手册、饮料杯、手机、太阳镜、杂乱的看台物品、轻微运动模糊、压缩伪影、长焦镜头柔焦、真实皮肤纹理、自然碎发、炎热天气下的皮肤油光。

严格禁止：美颜修饰、放大眼睛、V脸削骨、瓷娃娃皮肤、网红感、杂志拍摄感、电影级人像布光、过度锐利的面部特征、人为磨皮。

图片比例 9:16。
```

### 法网观众真实抓拍 Prompt

这是上面体育观众抓拍 Prompt 的法网版本，更强调罗兰·加洛斯、红土球场、FILA 网球服和直播截图质感。

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

这条适合把静态图做成短视频前使用。它解决的是“连续帧应该怎么设计才像一个自然瞬间”，而不是简单让图片乱动。

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

这条是给中文文章改稿用的。核心是保留个人语气，不要把文章改成那种一眼看出来的 AI 公文。

```text
你是一名中文非虚构写作者和编辑。请帮我改写下面这篇文章，但不要把它改成 AI 味很重的公文。

文章主题：{{主题}}
目标读者：{{目标读者}}
想表达的核心判断：{{核心判断}}
原文：{{原文}}

请保留我的个人语气，让逻辑更清晰，增加必要例子，删除重复表达，最后给出 3 个备选标题。
```

### 平和自然的经验分享式文章写作 Prompt

这条适合把文章写成平和、自然、像朋友分享经验一样的风格，避免官方教程、营销文案或 AI 总结感。适合 ChatGPT、Claude、Gemini 等写作模型，输出一篇结构清晰、语气克制、信息密度高、有个人经验感的中文文章。

```text
请用一种平和、自然、像跟朋友聊天一样的语气来写这篇文章。

不要写得像官方教程、营销文案、AI 总结稿，也不要太“博主腔”。整体表达要直接、清楚、有一点个人经验感，但不要夸张。

文章结构可以清晰，但段落不要切得太碎，少用过度频繁的换行。每一段尽量承载完整信息，让页面看起来更凝练。

语气上可以使用类似这样的表达：

“我最近试了一下……”
“这个地方其实不复杂，但有几个点容易踩坑。”
“我个人会更建议……”
“这个问题排查起来会比较烦。”
“简单说就是……”

写法上要像一个有经验的人在跟朋友分享自己的实践过程：不是居高临下教学，也不是官方文档复述，而是把自己理解后的东西讲清楚。

技术内容要准确，但不要堆太多术语。遇到配置、参数、步骤时，可以解释它为什么重要，以及哪里容易出错。

整体目标是：读起来像真人写的，有经验、有判断，但语气克制、平实、信息密度高。
```

## 产品与设计

### Design guide 抽取 Prompt

这条适合看到一个喜欢的页面或截图后，把它拆成可复用的设计风格说明，再交给别的模型或前端工具继续使用。

```text
请从下面的页面截图或参考图中抽取一份可复用的 design guide。

请输出：整体视觉关键词、色彩系统、字体和字号层级、间距规则、卡片/按钮/输入框样式、图标和插画风格、动效和交互细节、移动端适配注意事项、可直接复用的提示词版本。

参考素材：{{参考素材}}
```

## 研究与分析

### 投资研究反方检查 Prompt

这条适合在自己已经有一个投资判断时使用。它不是让 AI 告诉我买还是卖，而是逼自己看见反方证据和可能忽略的风险。

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

这条适合把一段零散想法变成可以放进知识库的笔记，尤其适合用来沉淀文章选题、产品想法和长期主题。

```text
请把下面这段零散想法整理成一条可沉淀到个人知识库的笔记。

原始想法：{{原始想法}}
相关领域：{{相关领域}}
我的背景：前端工程师、AI 创作者、独立开发者、长期投资者

请输出：一句话总结、为什么重要、可以归入哪些主题、可以扩写成什么文章、可以变成什么产品或工具、和我已有内容体系的关系、下一步行动。
```

### 理解检查型老师 Prompt

这条适合学习复杂内容时使用。它会要求模型像老师一样分阶段确认你是否真的理解，而不是一次性把答案全讲完。

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