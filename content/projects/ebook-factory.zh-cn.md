---
title: "Ebook Factory"
date: 2026-06-25
description: "Ebook Factory 项目说明：一个可重复使用的 Markdown 到电子书出版流水线。"
keywords: "Ebook Factory,Markdown电子书,Pandoc,个人出版,EPUB,MOBI,PDF,毛毛星"
tags:
  - 出版
  - 项目
  - 创作者工具
---

# Ebook Factory

Ebook Factory 是一个个人出版流水线，用来把基于 Markdown 的书稿项目转换成电子书产物。

当前工作仓库仍然是私有状态，因为里面可能包含真实书稿。后续应该抽出一个干净的公开模板。

## 问题是什么

写一本电子书不只是写作问题，很快就会变成生产问题：

- 如何保持书稿结构一致
- 如何导出 PDF / EPUB / MOBI
- 如何管理 metadata
- 如何在多本书之间复用模板
- 如何保持源文件干净
- 如何避免每次都手工发布

如果每本书都靠手动处理，这个流程就很难复用。

## 核心想法

Ebook Factory 把每本书当成一个结构化项目，再用命令行流水线管理出版过程。

```text
Markdown source
  -> book template
  -> build command
  -> Pandoc / Docker workflow
  -> PDF / EPUB / MOBI output
```

## 当前方向

系统围绕这些部分组织：

- Markdown 源文件
- 可复用书籍模板
- Pandoc 导出
- Make 构建流程
- Docker 化环境
- TypeScript CLI 项目操作

## 为什么重要

我重视出版系统，是因为内容不只是输出。内容可以变成产品、分发资产和学习记录。

一套可重复的出版流水线，会让长期思考更容易沉淀成稳定产物。

## 当前状态

私有仓库。计划抽出公开模板。

公开前需要做：

- 把真实书稿和通用工具分离
- 清理示例书内容
- 补构建流程文档
- 加一个最小 demo book
- 加导出产物示例

## 相关链接

- GitHub profile：<https://github.com/XingMXTeam>
- 项目页：<https://maoxunxing.com/zh-cn/projects/>
