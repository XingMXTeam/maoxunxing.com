---
title: "Gemini CLI Configuration Tutorial"
date: 2025-07-07
description: "how i use Gemini CLI to Translate large amouts of text"
tags:
  - AI
  - Gemini CLI
images:
  - ai-gemini-cli/cover.jpg
---
In daily content creation, technical documentation writing, or multilingual blog management, translating large amounts of text is often time-consuming and labor-intensive. Google's Gemini CLI offers a new solution for this scenario, allowing you to invoke Gemini's translation model via the command line to achieve bulk, efficient article translation.

{{< img src="draw.png" alt="gemini setup steps" maxWidth="960px" align="center" caption="gemini setup steps" >}}
## Set Gemini environment variables
`echo 'export GEMINI_API_KEY="AIzaSyDotsntj" >> ~/.config/fish/config.fish`
## Test translation usage
`echo “Please translate the following Chinese text to English: Test Title” | gemini`

<iframe width="960" height="659" src="https://www.youtube.com/embed/ZPalbIyMt54" title="Gemini CLI Setup Crash Course， 快速翻译50篇文章，AI效率新方式！" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>