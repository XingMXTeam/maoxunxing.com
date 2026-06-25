---
title: "Agent Workstation"
date: 2026-06-25
description: "Agent Workstation 项目说明：一个用于任务型 AI 工作流的多 Agent 编排框架。"
keywords: "Agent Workstation,AI Agent工作流,多Agent编排,AI编程,Codex工作流,毛毛星"
tags:
  - AI 编程
  - Agent 工作流
  - 项目
---

# Agent Workstation

Agent Workstation 是一个用于搭建任务型 AI 工作站的多 Agent 编排框架。

仓库目前仍然是私有状态，我还在清理示例、去掉项目特定痕迹，并准备抽成一个更干净的公开模板。这个页面先解释它的思路和设计方向。

## 问题是什么

大多数 AI 工作流一开始都是一个很长的 prompt。

这对一次性实验没问题，但很难复用、调试、评估和改进。一旦任务变复杂，prompt 里就会混进太多职责：

- 规划
- 研究
- 起草
- 审稿
- 格式化
- 产物生成
- 质量检查

最后结果就会很脆。它可能这一次能跑通，但很难变成一套每周都能复用的系统。

## 核心想法

Agent Workstation 把复杂任务变成显式工作流：

```text
User Task
  -> Pipeline
  -> Agent Step(s)
  -> Schema Validation
  -> Retry / Branch / Parallel Execution
  -> Artifacts and Trace Logs
```

不是让一个 prompt 做所有事，而是让每个 Agent 负责一个清晰角色，再用 Pipeline 定义这些 Agent 如何协作。

## 核心概念

### Agent

Agent 是一个角色明确的指令文件，可以定义：

- 名称
- 描述
- 模型
- 最大轮次
- 输出 schema
- 系统提示词

### Pipeline

Pipeline 定义任务如何在系统中流动：

- 顺序步骤
- 条件执行
- foreach / 并行执行
- 重试
- 子 pipeline
- 变量传递

### Artifact

每次运行都会生成一组产物：

- 状态文件
- trace 日志
- 生成文件
- 每一步的输出

这样工作流才容易调试和改进。

## 可以做成哪些工作站

例如：

- 写作工作站：研究 -> 大纲 -> 初稿 -> 编辑
- PPT 工作站：brief -> 大纲 -> 页面规划 -> 内容填充 -> 审查
- 创作者工作流：账号画像 -> 竞品研究 -> 选题计划 -> 笔记初稿 -> 审核
- 报告工作流：收集数据 -> 分析 -> 写作 -> 格式化 -> QA

## 为什么重要

我现在越来越觉得，Prompt Engineering 后面真正重要的是 Workflow Engineering。

一个好的 AI 工作流，不只是问一个更好的问题，而是设计一个让模型可以稳定工作的环境：结构、反馈、工具、记忆、校验和产物管理。

Agent Workstation 就是我对这种结构化 AI 工作流的尝试。

## 当前状态

私有模板清理中。

公开前需要补齐：

- 更干净的示例
- 更安全的默认配置
- 更完整的文档
- 截图或 trace 示例
- 至少一个完整的创作者工作流 demo

## 相关链接

- GitHub profile：<https://github.com/XingMXTeam>
- 项目页：<https://maoxunxing.com/zh-cn/projects/>
