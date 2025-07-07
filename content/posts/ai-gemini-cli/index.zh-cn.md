---
title: "Gemini CLI配置教程"
date: 2025-07-07
description: ""
tags:
  - AI
  - Gemini CLI
images:
  - ai-gemini-cli/cover.png
---

在日常内容创作、技术文档编写或多语言博客管理中，翻译大量文本往往耗时耗力。Google 推出的 Gemini CLI 为这一场景带来了全新的解决方案，通过命令行即可调用 Gemini 的翻译模型，实现批量、高效的文章翻译。

{{< img src="draw.png" alt="gemini setup steps" maxWidth="960px" align="center" caption="gemini setup steps" >}}

## Gemini 设置环境变量

`echo 'export GEMINI_API_KEY="AIzaSyDotsntj" >> ~/.config/fish/config.fish`

## 测试翻译常规用法

`echo "Please translate the following Chinese text to English: 测试标题" | gemini`

{{< video src="https://www.youtube.com/shorts/ZPalbIyMt54" caption="How I Use Gemini CLI">}}
