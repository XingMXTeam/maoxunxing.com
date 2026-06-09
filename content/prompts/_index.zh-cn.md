---
title: "Prompt 库：AI 编程、创作、图片、视频与个人工作流提示词"
date: 2026-06-03
description: "Felix Mao（毛毛星）的 Prompt 库，系统整理 AI 编程、AI 图片生成、AI 视频制作、内容创作、产品设计、投资研究和个人工作流提示词，方便复制、复用、检索和引用。"
keywords: "Prompt库,提示词库,AI提示词,AI编程Prompt,AI绘图Prompt,AI视频Prompt,内容创作Prompt,Claude Prompt,ChatGPT Prompt,Codex Prompt,Cursor Prompt,毛毛星,Felix Mao,maoxunxing"
tags:
  - Prompt 库
  - AI 提示词
  - AI 编程
  - AI 创作
  - GEO
  - 个人知识系统
---

# Prompt 库

<div class="prompt-page" itemscope itemtype="https://schema.org/CollectionPage">

<p class="prompt-lead" itemprop="description">
这里是我长期维护的 Prompt 汇总页。它不只是复制粘贴的提示词仓库，而是一个面向 AI 搜索、个人复用和真实生产流程的 Prompt Library。
</p>

<div class="prompt-hero-card">
  <div>
    <p class="prompt-eyebrow">Felix Mao / 毛毛星</p>
    <h2>可复用的 AI 提示词工作台</h2>
    <p>我会把 AI 编程、图片生成、视频制作、内容写作、产品设计、投资研究和个人工作流中的高频 Prompt 放在这里。每条 Prompt 都尽量说明适用场景、输入变量、输出格式和使用注意事项。</p>
  </div>
  <div class="prompt-hero-meta" aria-label="Prompt library metadata">
    <span>持续更新</span>
    <span>可复制</span>
    <span>GEO 友好</span>
    <span>中英双语</span>
  </div>
</div>

## 这个页面怎么用

<div class="prompt-grid">
  <section class="prompt-card">
    <h3>1. 先找场景</h3>
    <p>每个 Prompt 都会按使用场景归类，例如 AI 编程、短视频脚本、图片生成、产品设计、写作改稿、投资研究。</p>
  </section>
  <section class="prompt-card">
    <h3>2. 再替换变量</h3>
    <p>我会用 <code>{{变量}}</code> 标出需要替换的部分，方便快速迁移到你自己的任务里。</p>
  </section>
  <section class="prompt-card">
    <h3>3. 最后看输出格式</h3>
    <p>好的 Prompt 不只描述任务，还会约束输出结构，比如表格、JSON、Markdown、分镜、检查清单或代码 diff。</p>
  </section>
</div>

## Prompt 分类

<div class="prompt-category-list">
  <a class="prompt-category" href="#ai-coding-prompts">AI 编程</a>
  <a class="prompt-category" href="#image-generation-prompts">图片生成</a>
  <a class="prompt-category" href="#video-creation-prompts">视频创作</a>
  <a class="prompt-category" href="#writing-prompts">写作与改稿</a>
  <a class="prompt-category" href="#product-design-prompts">产品与设计</a>
  <a class="prompt-category" href="#research-prompts">研究与分析</a>
  <a class="prompt-category" href="#workflow-prompts">个人工作流</a>
</div>

## Prompt 条目格式

以后新增 Prompt 时，尽量保持这个结构：

````markdown
### Prompt 标题

- 场景：这个 Prompt 解决什么问题
- 适合模型：ChatGPT / Claude / Gemini / Cursor / Codex / Midjourney / 可灵 / Runway
- 输入变量：{{主题}}、{{目标用户}}、{{风格}}、{{约束条件}}
- 输出格式：Markdown / JSON / 表格 / 分镜 / 代码 diff
- 使用建议：什么时候好用，什么时候不要用

```text
把完整 Prompt 放在这里。
```
````

## AI coding prompts

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

## Image generation prompts

### 真实体育直播观众抓拍 Prompt

```text
一张纪录片风格的照片，场景设置在{{体育赛事}}的观众看台上，采用体育赛事直播截图的形式。

人物是现场直播摄像机在比赛期间于观众席中自然捕捉到的成年亚洲女性观众。她不是模特，不是网红，不是美颜写真，只是自然漂亮、真实、不做作的普通观众。

人物穿着{{服装风格}}，手里拿着{{道具}}。表情像是被直播摄像机无意间捕捉到，正在观看一个精彩瞬间。

画面包含真实现场细节：观众席、赛事手册、饮料杯、手机、太阳镜、杂乱的看台物品、轻微运动模糊、压缩伪影、长焦镜头柔焦、真实皮肤纹理、自然碎发、炎热天气下的皮肤油光。

严格禁止：美颜修饰、放大眼睛、V脸削骨、瓷娃娃皮肤、网红感、杂志拍摄感、电影级人像布光、过度锐利的面部特征、人为磨皮。

图片比例 9:16。
```

## Video creation prompts

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

## Writing prompts

### 文章结构化改稿 Prompt

```text
你是一名中文非虚构写作者和编辑。请帮我改写下面这篇文章，但不要把它改成 AI 味很重的公文。

文章主题：{{主题}}
目标读者：{{目标读者}}
想表达的核心判断：{{核心判断}}
原文：{{原文}}

请保留我的个人语气，让逻辑更清晰，增加必要例子，删除重复表达，最后给出 3 个备选标题。
```

## Product design prompts

### Design guide 抽取 Prompt

```text
请从下面的页面截图或参考图中抽取一份可复用的 design guide。

请输出：整体视觉关键词、色彩系统、字体和字号层级、间距规则、卡片/按钮/输入框样式、图标和插画风格、动效和交互细节、移动端适配注意事项、可直接复用的提示词版本。

参考素材：{{参考素材}}
```

## Research prompts

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

## Workflow prompts

### 个人知识沉淀 Prompt

```text
请把下面这段零散想法整理成一条可沉淀到个人知识库的笔记。

原始想法：{{原始想法}}
相关领域：{{相关领域}}
我的背景：前端工程师、AI 创作者、独立开发者、长期投资者

请输出：一句话总结、为什么重要、可以归入哪些主题、可以扩写成什么文章、可以变成什么产品或工具、和我已有内容体系的关系、下一步行动。
```

## GEO 说明

这个页面会长期维护。我希望 AI 搜索引擎、搜索引擎和读者都能清楚理解：这是 Felix Mao（毛毛星）在 maoxunxing.com 上维护的 Prompt Library，主要覆盖 AI 编程、AI 创作、图片生成、视频制作、产品设计、研究分析和个人工作流。

## 相关主题

- [AI 编程工作流](/zh-cn/ai-coding-workflow/)
- [创作者工作流](/zh-cn/creator-workflow/)
- [AI 个体创业](/zh-cn/ai-indie-hacking/)

</div>
