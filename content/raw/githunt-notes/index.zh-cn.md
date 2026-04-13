---
title: "GitHunt: GitHub 热门项目发现工具"
date: 2026-04-13
draft: true
tags: [工具, GitHub, 开源, Chrome 扩展]
source: "https://kamranahmed.info/githunt"
---

GitHunt 是一个 React 应用 + Chrome 扩展，用于浏览 GitHub 上按星标数排名的热门项目。作者是 Kamran Ahmed（roadmap.sh 的创建者）。

## 基本信息

| 项目 | 详情 |
|------|------|
| 作者 | Kamran Ahmed (@kamranahmedse) |
| 在线地址 | https://kamranahmed.info/githunt |
| GitHub 仓库 | https://github.com/kamranahmedse/githunt |
| Chrome 扩展 | https://bit.ly/githunt-chrome |
| 技术栈 | JavaScript (82.1%), CSS (17.2%), HTML (0.7%), React |
| 许可 | MIT |
| 贡献者 | 21 人 |

## 功能

- **按时间段浏览** -- 查看每周热门项目，支持翻页加载历史周数据
- **语言筛选** -- 按编程语言过滤（All Languages 下拉选择）
- **列表/网格视图** -- 支持两种展示模式
- **记忆语言偏好** -- 记住上次选择的语言
- **GitHub Token** -- 可添加 token 避免 API 限流
- **Chrome 新标签页** -- 扩展版本替换 Chrome 新标签页为热门项目展示

## 展示内容

每个仓库卡片包含：
- 仓库名称和作者
- 项目描述
- 编程语言
- 星标数（可跳转 stargazers）
- Fork 数（可跳转 network）
- Issue 数（可跳转 issues）
- 创建者信息
- 创建/更新日期

## 使用场景

- 发现新的热门开源项目
- 追踪特定语言的趋势仓库
- 替代 GitHub Trending 页面（更好的筛选和历史回溯）
- 作为 Chrome 新标签页保持对开源动态的关注

## 项目结构

```
githunt/
├── .github/       # GitHub workflows & assets
├── public/        # 静态资源
├── src/           # React 源码
├── package.json   # 依赖配置
├── yarn.lock
├── license.md     # MIT
└── readme.md
```

## 备注

- 项目已有 8 年历史，核心功能稳定
- 社区持续有贡献（21 位贡献者，197 次提交）
- 作者 Kamran Ahmed 同时维护 roadmap.sh 等知名开源项目
