---
title: 项目
layout: projects
kicker: Build log
intro: 我做的不是一堆零散 repo，而是把混乱工作流变成可重复系统：AI 编程、内容运营、前端工程、个人出版，都是这条线上的不同形态。
project_links:
  - label: GitHub
    url: https://github.com/XingMXTeam
    icon: fab fa-github
  - label: 文章
    url: https://maoxunxing.com/zh-cn/
    icon: fas fa-pen
  - label: 联系
    url: https://twitter.com/maoxunxing/
    icon: fab fa-twitter
project_sections:
  - title: 当前重点
    id: current-focus
    featured: true
    lead: 这一组是现在最该被看见的项目：AI 产品、创作者工作流、个人出版系统，以及可复用的 AI 工作站。
    items:
      - name: Sayo
        link: https://gosayo.cc/
        desc: 一个围绕“核心动词 + 真实场景 + 迁移练习”设计的英语口语产品。它不是翻译工具，而是帮助用户停止逐字翻译，开始用可复用的英语结构表达。
        icon: fas fa-language
        status: Live
        visual: 核心动词 → 场景 → 练习
        tags: [英语学习, AI Tutor, 产品]
        featured: true
      - name: Xiaohongshu AI Operator
        link: https://github.com/XingMXTeam/xiaohongshushipfast
        desc: 面向创作者、个人品牌、本地商家和小团队的 AI 内容运营系统。它不是帮你写一篇笔记，而是把选题、竞品、草稿、发布计划和复盘串成可重复流程。
        icon: fas fa-pen-nib
        status: Building
        visual: 选题 → 草稿 → 发布
        tags: [AI, 内容运营, 小红书]
        featured: true
      - name: maoxunxing.com
        link: https://github.com/XingMXTeam/maoxunxing.com
        desc: 我的个人出版系统，用来沉淀 AI 编程、创作者工作流、系统思维、投资和长文写作。它不是普通博客，而是一个公开的想法操作系统。
        icon: fab fa-github
        status: Active
        visual: 笔记 → 文章 → 系统
        tags: [个人站, 写作系统, SEO/GEO]
        featured: true
      - name: Agent Workstation
        link: https://maoxunxing.com/zh-cn/agent-workstation/
        desc: 用于搭建任务型 AI 工作站的多 Agent 编排框架。这个实验关注的是：如何把重复的 AI 工作流程，沉淀成结构化工作站。
        icon: fas fa-robot
        status: In Progress
        visual: 用户 → agents → tools → output
        tags: [Agent 工作流, AI 工程, 系统]
        featured: true
  - title: AI / Agent 工程
    id: ai-agent-engineering
    lead: 这里保留工具调用、浏览器自动化、RAG 和 AI 辅助研究相关的小实验。
    items:
      - name: MCP Screenshot Inverter
        link: https://github.com/XingMXTeam/a-simple-mcp
        desc: 一个 MCP + Puppeteer 实验，用于浏览器截图和 AI 工具调用工作流。
        icon: fas fa-camera
        status: Experimental
        visual: MCP + browser tools
        tags: [MCP, Puppeteer, 浏览器]
      - name: Crawler AI Chrome
        link: https://github.com/XingMXTeam/crawler_ai_chrome
        desc: 用于采集公开 Twitter / X 内容，并服务 AI 辅助研究和创作者运营流程的 Chrome 插件实验。
        icon: fab fa-chrome
        status: Experimental
        visual: 采集 → 结构化 → 分析
        tags: [Chrome 插件, 研究工作流, 创作者运营]
      - name: RAG Search API
        link: https://github.com/XingMXTeam/rag-search
        desc: fork / 参考改造型 RAG 后端学习实验，适合学习和内部探索，不作为原创代表项目展示。
        icon: fas fa-search
        status: Reference
        visual: 文档 → 检索 → 回答
        tags: [RAG, 后端, Reference]
  - title: 前端工程基础设施
    id: frontend-infrastructure
    lead: 这一组证明工程底座：schema 驱动 UI、前端知识档案，以及早期工程实验。它们不是 AI 项目，但支撑我现在做 AI 产品和全栈实验。
    items:
      - name: schema-render
        link: https://github.com/XingMXTeam/schema-render
        desc: 一个基于 schema 的前端动态渲染实验。它属于低代码、动态表单、后台配置页和前端架构抽象，不是 AI 项目本身。
        icon: fas fa-layer-group
        status: Experimental
        visual: schema → components → UI
        tags: [Schema UI, 低代码, 前端架构]
      - name: Frontend Map
        link: https://github.com/XingMXTeam/frontend-map
        desc: 覆盖 JavaScript、TypeScript、Vue 和前端工程的历史知识档案。它记录的是我的工程底子，也支撑现在的 AI 产品和全栈转型。
        icon: fas fa-code
        status: Archive
        visual: JS + TS + Vue + engineering
        tags: [前端, JavaScript, TypeScript]
      - name: Frontend Engineering Archive
        link: https://github.com/XingMXTeam
        desc: 早期前端工程实验和笔记集合，包括 front-end-architecture、component-doc、shared-state-management、simple-hmr、webpack-build 等。
        icon: fas fa-box-archive
        status: Archive
        visual: 架构笔记 + 小仓库
        tags: [工程, 组件, 构建工具]
  - title: 创作者 & 媒体工具
    id: creator-media-tools
    lead: 服务创作者、视频编辑和内容生产流程的小工具。
    items:
      - name: CapCut Audio Subtitle Align
        link: https://github.com/XingMXTeam/capcut_audio_subtitle_align
        desc: 用于音频和字幕对齐的创作者编辑流程实验，适合把 AI 生成或编辑后的素材变成短视频内容。
        icon: fas fa-closed-captioning
        status: Experimental
        visual: audio → subtitles → edit
        tags: [视频工作流, 创作者工具, 自动化]
  - title: 出版与知识系统
    id: publishing-knowledge-systems
    lead: 把写作、Prompt 和领域知识变成可复用资产的项目。
    items:
      - name: Ebook Factory
        link: https://maoxunxing.com/zh-cn/ebook-factory/
        desc: 基于 Pandoc、Make、Docker 和 TypeScript 的 Markdown 到电子书生产流水线，目标是让写作、打包和发布更可重复。
        icon: fas fa-book
        status: Building
        visual: markdown → epub → kindle
        tags: [出版系统, Markdown, Pandoc]
      - name: Prompt Library
        link: https://maoxunxing.com/zh-cn/prompt-library-prompts-i-actually-use/
        desc: 我实际使用并持续沉淀的 AI 编程、创作、写作、研究和工作流 Prompt。它不是提示词堆积，而是真实任务里的工作模式。
        icon: fas fa-lightbulb
        status: Active
        visual: prompts → workflows → output
        tags: [Prompt Engineering, AI 工作流, 知识库]
      - name: 期权大白话
        link: https://www.amazon.com/dp/B0F6NSTGPQ
        desc: 面向新手的期权交易入门电子书，用大白话比喻和真实交易场景解释期权，不把期权讲成赌博故事。
        icon: fas fa-chart-line
        status: Published
        visual: 大白话投资教育
        tags: [电子书, 投资, 教育]
      - name: Modern Javascript for the Impatient
        link: https://item.jd.com/12911627.html
        desc: Modern JavaScript for the Impatient 中文翻译版。
        icon: fas fa-book-open
        status: Published
        visual: 翻译 + 前端教育
        tags: [书籍, 翻译, JavaScript]
---
