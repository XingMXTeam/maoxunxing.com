---
title: "全栈：我的全栈技术栈"
date: 2026-07-09
description: "记录一套适合个人项目开发的全栈技术栈：TanStack、Drizzle、Better Auth 和 Cloudflare。"
tags:
  - AI 编程
  - 全栈开发
  - TanStack
  - Drizzle
  - Cloudflare
---

# 全栈：我的全栈技术栈

这套全栈技术栈最初看到的是来自 Twitter 上 **艾逗比（@idoubi）** 的分享，后面自己整理了一下，作为个人项目开发时的技术栈参考。

## 前端

### TanStack

包括：

- TanStack Query
- TanStack Router
- TanStack Table

用途：

- 数据请求与缓存管理
- 路由管理
- 表格数据展示

特点：

- 类型安全
- React 生态完善
- 适合构建现代 Web 应用

学习重点：

- 数据流设计
- SSR / CSR 混合模式

---

## 数据库

### Drizzle ORM

用途：

- 数据库访问层
- SQL 类型安全封装

支持：

- PostgreSQL
- MySQL
- SQLite

特点：

- 更接近原生 SQL
- 类型推导完善
- Schema 管理清晰

学习重点：

- 数据库设计
- Migration
- 类型安全

---

## 鉴权

### Better Auth

用途：

- 用户登录
- Session 管理
- OAuth 等认证功能

特点：

- 开源
- 灵活
- 可自定义

注意：

目前遇到的问题是加密性能可能偏慢，在 Cloudflare Worker 这种 CPU 时间有限的环境里可能需要优化。

可能方案：

- 调整加密实现
- 优化性能
- 或使用商业版本

---

## 部署

### Cloudflare

包括：

- Cloudflare Pages
- Cloudflare Workers
- Cloudflare D1
- Cloudflare R2
- Cloudflare KV

用途：

- 前端部署
- Serverless 后端
- 数据存储
- 边缘计算

特点：

- 全球 CDN
- 成本低
- 适合个人项目和小型 SaaS

注意：

Worker 有 CPU 时间限制，需要避免长时间计算任务。

---

## 整体组合

TanStack  
⬇️  
Drizzle  
⬇️  
Better Auth  
⬇️  
Cloudflare

这套技术栈比较适合：

- Indie Hacker 项目
- AI 工具
- SaaS MVP
- 个人开发产品

优点是轻量、成本低、开发效率高。

缺点是不适合大型企业级复杂系统。
