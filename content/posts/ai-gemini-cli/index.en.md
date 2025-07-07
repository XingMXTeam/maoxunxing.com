---
title: "Gemini CLI Configuration Tutorial"
date: 2025-07-07
description: “”
tags:
  - AI
  - Gemini CLI
images:
  - ai-gemini-cli/cover.png
---
In daily content creation, technical documentation writing, or multilingual blog management, translating large amounts of text is often time-consuming and labor-intensive. Google's Gemini CLI offers a new solution for this scenario, allowing you to invoke Gemini's translation model via the command line to achieve bulk, efficient article translation.

{{< img src="draw.png" alt="gemini setup steps" maxWidth="960px" align="center" caption="gemini setup steps" >}}
## Set Gemini environment variables
`echo 'export GEMINI_API_KEY="AIzaSyDotsntj" >> ~/.config/fish/config.fish`
## Test translation usage
`echo “Please translate the following Chinese text to English: Test Title” | gemini`

{{< video src="https://www.youtube.com/shorts/ZPalbIyMt54" caption="How I Use Gemini CLI">}}