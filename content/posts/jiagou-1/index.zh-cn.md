---
title: "JS架构日记 #1期：如何设计导航"
description: ""
date: 2024-09-18
tags:
  - JS架构日记
images:
  - jiagou-1/a.webp
---

{{< table_of_contents >}}

## 要求

- 业务无感知更新
- 无业务侵入：不能影响已有业务样式
- 对技术栈无要求

## 方案1选择

中间维护一个：无版本的CDN路径。真实的脚本是有版本的，通过更新这个中间CDN来实现一方发布，多方更新

影响：

- 无灰度能力
- 影响LCP



