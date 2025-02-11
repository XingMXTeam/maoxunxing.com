---
title: "[WIP] 如何写一本电子书"
date: 2024-12-09
tags:
  - make digital book
description: ""
---

## 前言

我构建了一个[电子书体系](待补充)，可以通过markdown方式转换为pdf等各种格式的电子书。核心是通过docker技术，可以避免每次安装环境的不一致性，同时能减少自动化书籍封面，风格等繁琐的工作。

以下是一些配置的说明，方便下次查阅：

## settings.txt

基本信息：

```
title: 趣味期权：从零开始的投资指南
subtitle: 写给每个人的期权交易入门书
author: 毛毛星
subject: "markdown"
keywords: [期权, 投资入门, 金融科普, 股票交易, 风险管理, 投资策略, 理财知识]
language: zh-CN
cover-image: src/assets/fun_options_cover.png
```

geometry 设置文档的边距：

- left, right, top, bottom 分别设置左、右、上、下的边距。
- margin 设置整体的边距。

```
   geometry: 
     - "left=3cm"
     - "right=3cm"
     - "top=2.5cm"
     - "bottom=1in"
     - "margin=1in"
```

```
   linestretch: 1.5
   CJKmainfont: "Noto Sans CJK SC"
   CJKsansfont: "Noto Sans CJK SC"
   mainfont: "Noto Sans CJK SC"
   sansfont: "Noto Sans CJK SC"
   monofont: "Noto Sans Mono CJK SC"
   indent: false
   parskip: 0.5em
```

文本的行距、字体和段落间距：

```
   documentclass: ctexbook
   fontsize: 10.5pt
```

documentclass 指定文档类型，fontsize 设置字体大小。

定义了页脚的内容：

```
   footer-left: []
   footer-center: []
   footer-right: []
```
