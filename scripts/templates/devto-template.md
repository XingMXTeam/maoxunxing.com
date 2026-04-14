---
title: "Node.js CPU Spike Analysis: When Requests Hang and Event Loop Starves"
published: true
description: "Why CPU spikes to 100% when requests hang - two real production cases on timeouts and rate limiting"
tags: nodejs, javascript, performance, webdev
canonical_url: https://maoxunxing.com/node-event-loop-cpu-spike/
cover_image: https://maoxunxing.com/posts/node-event-loop-cpu-spike/cover.jpg
---

> This article was originally published on [maoxunxing.com](https://maoxunxing.com/node-event-loop-cpu-spike/). Follow me there for more deep dives on Node.js, AI, and frontend engineering.

---

[正文从这里开始,直接粘贴你的 markdown 内容]

[注意事项:]
[1. Hugo shortcode 需要替换: {{< img >}} 改为标准 markdown ![alt](url)]
[2. {{< youtube ID >}} 改为 {% youtube ID %}]
[3. 图片路径改为绝对路径: https://maoxunxing.com/posts/xxx/image.png]
[4. 去掉 custom_toc 等 Hugo 特有的 frontmatter 字段]

---

## 内链示例 (在正文中自然引用你的其他文章)

If you're interested in AI-assisted development workflows, check out my
[AI Coding Playbook](https://maoxunxing.com/ai-coding-practice/) where I
cover tool selection and prompt templates.

I also wrote about [building a personal knowledge base using Karpathy's
method](https://maoxunxing.com/karpathy-knowledge-base-practice/) which
covers how to organize technical learning into a publishing pipeline.

---

*Felix Mao (毛毛星) | [maoxunxing.com](https://maoxunxing.com) | [@maoxunxing](https://twitter.com/maoxunxing)*
