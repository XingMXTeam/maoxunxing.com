---
title: 项目
layout: projects
kicker: 项目记录
intro: "这里放一些我做过、还在维护，或者觉得值得留下来的项目。上面是现在就能打开的东西；下面有项目说明、实验仓库和已经发布的书。"
project_links:
  - label: GitHub
    url: https://github.com/XingMXTeam
    icon: fab fa-github
  - label: 文章
    url: /zh-cn/
    icon: fas fa-pen
  - label: 联系
    url: https://twitter.com/maoxunxing/
    icon: fab fa-twitter
project_sections:
  - title: 当前重点
    id: current-focus
    featured: true
    lead: "现在就能打开的东西：浏览器小工具、Sayo、CrossAgent Lab，以及这个站本身。"
    items:
      - name: Sayo
        link: https://gosayo.cc/
        desc: "英语口语练习。先自己说，卡住了再看提示，然后换个场景再试一次。"
        icon: fas fa-language
        status: Live
        visual: 核心动词 → 场景 → 练习
        tags: [英语学习, AI Tutor, 产品]
        featured: true
      - name: 口哨转写
        link: /ai/whistle-transcription/
        desc: "浏览器里的口哨转写。打开就能用，不用进仓库。"
        icon: fas fa-music
        status: Live
        visual: 口哨 → 转写
        tags: [浏览器工具, 转写]
        featured: true
      - name: 小红书封面
        link: /ai/xiaohongshu-cover-maker/
        desc: "浏览器里做小红书封面。这是能打开的工具；下面的运营仓库还在做，不是这个。"
        icon: fas fa-image
        status: Live
        visual: 打开 → 做封面
        tags: [浏览器工具, 小红书, 封面]
        featured: true
      - name: 说话人分离
        link: /ai/speaker-diarization/
        desc: "在浏览器里标出录音里谁在说话、什么时候说。"
        icon: fas fa-users
        status: Live
        visual: 录音 → 说话人
        tags: [浏览器工具, 音频]
        featured: true
      - name: CrossAgent Lab
        link: https://crossagent.maoxunxing.com
        desc: "垂直产品站。从这里离开本站，直接打开 CrossAgent Lab。"
        icon: fas fa-project-diagram
        status: Live
        visual: 垂直产品
        tags: [CrossAgent, 产品]
        featured: true
      - name: maoxunxing.com
        link: /zh-cn/
        desc: "这个站本身，长期放写作、AI 编程和产品实验。站点在线上，源码仓库也是公开的。"
        icon: fas fa-globe
        status: Active
        visual: 笔记 → 文章 → 系统
        tags: [个人站, 写作系统, SEO/GEO]
        featured: true
  - title: 文档 / 进行中
    id: docs-in-progress
    lead: "这两页是项目说明。仓库仍然是私有的，打开后看到的是思路，不是能运行的演示。"
    items:
      - name: Agent Workstation
        link: /zh-cn/agent-workstation/
        desc: "多 Agent 工作流的说明页。仓库还是私有的，页面只讲设计，没有公开演示。"
        icon: fas fa-robot
        status: 私有文档
        visual: 说明页，仓库私有
        tags: [Agent 工作流, 文档, 私有仓库]
      - name: Ebook Factory
        link: /zh-cn/ebook-factory/
        desc: "Markdown 到电子书的出版流水线说明。仓库仍是私有的，因为里面可能有真实书稿。"
        icon: fas fa-book
        status: 私有文档
        visual: 说明页，仓库私有
        tags: [出版系统, 文档, 私有仓库]
  - title: AI / Agent 工程
    id: ai-agent-engineering
    lead: "这些是围绕 Agent、工具调用、浏览器自动化和 RAG 做的小实验。仓库可以打开，但它们不是能直接使用的产品。"
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
    lead: "内容生产和视频剪辑相关的实验。能打开的封面工具在上面；这里是仓库，不是现成产品。"
    items:
      - name: Xiaohongshu AI Operator
        link: https://github.com/XingMXTeam/xiaohongshushipfast
        desc: 面向创作者和小团队的内容运营实验，仓库还在做。现在能用的是上面的小红书封面工具，不是这个仓库。
        icon: fas fa-pen-nib
        status: Building
        visual: 选题 → 草稿 → 发布
        tags: [AI, 内容运营, 小红书]
      - name: CapCut Audio Subtitle Align
        link: https://github.com/XingMXTeam/capcut_audio_subtitle_align
        desc: 一个音频和字幕对齐的小实验。主要是为了让短视频剪辑流程少一点重复劳动。
        icon: fas fa-closed-captioning
        status: Experimental
        visual: audio → subtitles → edit
        tags: [视频工作流, 创作者工具, 自动化]
  - title: 出版与知识系统
    id: publishing-knowledge-systems
    lead: 这里放已经能打开的 Prompt 库、已经出版的书，以及相关的知识产品。
    items:
      - name: Prompt Library
        link: /zh-cn/prompts/
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
