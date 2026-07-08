---
title: 项目
layout: projects
kicker: 项目记录
intro: "这里放一些我做过、还在维护，或者觉得值得留下来的项目。有些能直接用，有些只是工具和实验。它们不一定都很大，但能看出我最近在折腾什么。"
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
    lead: "先放几个最近最常折腾的东西。它们不一定都成熟，但最能代表我现在的方向。"
    items:
      - name: Sayo
        link: https://gosayo.cc/
        desc: "一个围绕“核心动词 + 真实场景 + 迁移练习”做的英语口语项目。它不是翻译工具，更像一个练反应的地方：先自己说，卡住了再看提示，然后换个场景再试一次。"
        icon: fas fa-language
        status: Live
        visual: 核心动词 → 场景 → 练习
        tags: [英语学习, AI Tutor, 产品]
        featured: true
      - name: Xiaohongshu AI Operator
        link: https://github.com/XingMXTeam/xiaohongshushipfast
        desc: 面向创作者、个人品牌、本地商家和小团队的内容运营工具。重点不是生成一篇笔记，而是把选题、竞品、草稿、发布计划和复盘串起来。
        icon: fas fa-pen-nib
        status: Building
        visual: 选题 → 草稿 → 发布
        tags: [AI, 内容运营, 小红书]
        featured: true
      - name: maoxunxing.com
        link: https://github.com/XingMXTeam/maoxunxing.com
        desc: 我的个人网站，也是一个长期写作和整理想法的地方。这里会放 AI 编程、创作者工具、系统思考、投资和一些产品实验。
        icon: fab fa-github
        status: Active
        visual: 笔记 → 文章 → 系统
        tags: [个人站, 写作系统, SEO/GEO]
        featured: true
      - name: Agent Workstation
        link: https://maoxunxing.com/zh-cn/agent-workstation/
        desc: 一个关于 AI 工作站的实验。我想试试看，能不能把重复出现的 AI 工作流，整理成一套更稳定、可复用的工作台。
        icon: fas fa-robot
        status: In Progress
        visual: 用户 → agents → tools → output
        tags: [Agent 工作流, AI 工程, 系统]
        featured: true
  - title: AI / Agent 工程
    id: ai-agent-engineering
    lead: "这些是围绕 Agent、工具调用、浏览器自动化和 RAG 做的小实验。很多还不完整，但可以看出我在摸索什么。"
    items:
      - name: MCP Screenshot Inverter
        link: https://github.com/XingMXTeam/a-simple-mcp
        desc: 一个 MCP + Puppeteer 实验，用来测试浏览器截图、页面操作和 AI 工具调用能怎么配合。
        icon: fas fa-camera
        status: Experimental
        visual: MCP + browser tools
        tags: [MCP, Puppeteer, 浏览器]
      - name: Crawler AI Chrome
        link: https://github.com/XingMXTeam/crawler_ai_chrome
        desc: 一个 Chrome 插件实验，用来采集公开 Twitter / X 内容，方便后续做资料整理、选题分析和内容研究。
        icon: fab fa-chrome
        status: Experimental
        visual: 采集 → 结构化 → 分析
        tags: [Chrome 插件, 研究工作流, 创作者运营]
      - name: RAG Search API
        link: https://github.com/XingMXTeam/rag-search
        desc: 一个 RAG 后端学习实验，主要用于理解检索、索引和问答链路，不把它当成原创代表项目。
        icon: fas fa-search
        status: Reference
        visual: 文档 → 检索 → 回答
        tags: [RAG, 后端, Reference]
  - title: 前端工程基础设施
    id: frontend-infrastructure
    lead: "这里放前端工程底子。schema-render 不算 AI 项目，它更像低代码、动态表单和配置化页面的实验。"
    items:
      - name: schema-render
        link: https://github.com/XingMXTeam/schema-render
        desc: 一个基于 schema 的前端动态渲染实验。方向更接近低代码、动态表单、后台配置页和前端架构抽象，不是 AI 项目本身。
        icon: fas fa-layer-group
        status: Experimental
        visual: schema → components → UI
        tags: [Schema UI, 低代码, 前端架构]
      - name: Frontend Map
        link: https://github.com/XingMXTeam/frontend-map
        desc: 以前整理的前端知识档案，覆盖 JavaScript、TypeScript、Vue 和一些工程实践。它更像是我的前端经验存档。
        icon: fas fa-code
        status: Archive
        visual: JS + TS + Vue + engineering
        tags: [前端, JavaScript, TypeScript]
      - name: Frontend Engineering Archive
        link: https://github.com/XingMXTeam
        desc: 一些早期前端工程实验和笔记，包括 front-end-architecture、component-doc、shared-state-management、simple-hmr、webpack-build 等。
        icon: fas fa-box-archive
        status: Archive
        visual: 架构笔记 + 小仓库
        tags: [工程, 组件, 构建工具]
  - title: 创作者 & 媒体工具
    id: creator-media-tools
    lead: 一些给内容生产和视频剪辑用的小工具。
    items:
      - name: CapCut Audio Subtitle Align
        link: https://github.com/XingMXTeam/capcut_audio_subtitle_align
        desc: 一个音频和字幕对齐的小实验。主要是为了让短视频剪辑流程少一点重复劳动。
        icon: fas fa-closed-captioning
        status: Experimental
        visual: audio → subtitles → edit
        tags: [视频工作流, 创作者工具, 自动化]
  - title: 出版与知识系统
    id: publishing-knowledge-systems
    lead: 这里放写作、电子书、Prompt 和知识产品相关的东西。
    items:
      - name: Ebook Factory
        link: https://maoxunxing.com/zh-cn/ebook-factory/
        desc: 一个 Markdown 到电子书的生产流程，基于 Pandoc、Make、Docker 和 TypeScript。主要解决写完之后怎么稳定打包、发布的问题。
        icon: fas fa-book
        status: Building
        visual: markdown → epub → kindle
        tags: [出版系统, Markdown, Pandoc]
      - name: Prompt Library
        link: https://maoxunxing.com/prompts/
        desc: 我实际用过、觉得有复用价值的一些 Prompt。不是提示词大全，更像是我做编程、写作、研究时留下来的工作手册。
        icon: fas fa-lightbulb
        status: Active
        visual: prompts → workflows → output
        tags: [Prompt Engineering, AI 工作流, 知识库]
      - name: 期权大白话
        link: https://www.amazon.com/dp/B0F6NSTGPQ
        desc: 面向新手的期权入门电子书。尽量用普通人能听懂的比喻和真实交易场景，把期权讲清楚。
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
