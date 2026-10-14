---
title: Projects
layout: projects
kicker: Build log
intro: "What you can open sits at the top. Below that are private-repo write-ups, GitHub experiments, and books that are already published."
project_links:
  - label: GitHub
    url: https://github.com/XingMXTeam
    icon: fab fa-github
  - label: Writing
    url: /en/
    icon: fas fa-pen
  - label: Contact
    url: https://twitter.com/maoxunxing/
    icon: fab fa-twitter
project_sections:
  - title: Current Focus
    id: current-focus
    featured: true
    lead: "What you can open now: the browser tools, Sayo, CrossAgent Lab, and this site."
    items:
      - name: Sayo
        link: https://gosayo.cc/
        desc: Spoken English practice built around core verbs, real-life scenes, and another try in a new scene. Say it yourself first, then look at the hint if you get stuck.
        icon: fas fa-language
        status: Live
        visual: core verbs → scenes → practice
        tags: [English Learning, AI Tutor, Product]
        featured: true
      - name: Whistle transcription
        link: /ai/whistle-transcription/
        desc: A browser tool that transcribes a whistle. Open it and use it; there is no repo to clone.
        icon: fas fa-music
        status: Live
        visual: whistle → transcription
        tags: [Browser tool, Transcription]
        featured: true
      - name: Xiaohongshu cover maker
        link: /ai/xiaohongshu-cover-maker/
        desc: Make a Xiaohongshu cover in the browser. This is the tool you can open. The operator repo further down is still being built.
        icon: fas fa-image
        status: Live
        visual: open → cover
        tags: [Browser tool, Xiaohongshu, Cover]
        featured: true
      - name: Speaker diarization
        link: /ai/speaker-diarization/
        desc: Mark who is speaking, and when, in a recording. Open it in the browser.
        icon: fas fa-users
        status: Live
        visual: recording → speakers
        tags: [Browser tool, Audio]
        featured: true
      - name: CrossAgent Lab
        link: https://crossagent.maoxunxing.com
        desc: The vertical product. Leave this site and open CrossAgent Lab.
        icon: fas fa-project-diagram
        status: Live
        visual: vertical product
        tags: [CrossAgent, Product]
        featured: true
      - name: maoxunxing.com
        link: /en/
        desc: This site. It is the public archive for writing, AI coding, and product experiments. The site is live, and the source repo is public.
        icon: fas fa-globe
        status: Active
        visual: notes → essays → systems
        tags: [Personal Site, Writing, SEO/GEO]
        featured: true
  - title: Docs & in progress
    id: docs-in-progress
    lead: "These pages explain the idea. The repos are still private, so you get a write-up, not a demo you can run."
    items:
      - name: Agent Workstation
        link: /en/agent-workstation/
        desc: A write-up of a multi-agent workflow. The repo is still private. This page explains the design; it is not a public demo.
        icon: fas fa-robot
        status: Private docs
        visual: write-up, private repo
        tags: [Agent Workflow, Docs, Private repo]
      - name: Ebook Factory
        link: /en/ebook-factory/
        desc: A write-up of a Markdown-to-ebook pipeline. The repo is still private because it may contain real book material.
        icon: fas fa-book
        status: Private docs
        visual: write-up, private repo
        tags: [Publishing, Docs, Private repo]
  - title: AI / Agent Engineering
    id: ai-agent-engineering
    lead: GitHub experiments around tool calling, browser automation, RAG, and research workflows. You can open the repos. They are not products you can use.
    items:
      - name: MCP Screenshot Inverter
        link: https://github.com/XingMXTeam/a-simple-mcp
        desc: An MCP + Puppeteer experiment for browser screenshots and tool-calling workflows.
        icon: fas fa-camera
        status: Experimental
        visual: MCP + browser tools
        tags: [MCP, Puppeteer, Browser]
      - name: Crawler AI Chrome
        link: https://github.com/XingMXTeam/crawler_ai_chrome
        desc: A Chrome extension experiment for collecting public Twitter / X content for AI-assisted research and creator-operation workflows.
        icon: fab fa-chrome
        status: Experimental
        visual: collect → structure → analyze
        tags: [Chrome Extension, Research, Creator Ops]
      - name: RAG Search API
        link: https://github.com/XingMXTeam/rag-search
        desc: A forked / reference-based RAG backend learning experiment, useful for learning and internal exploration but not positioned as an original flagship project.
        icon: fas fa-search
        status: Reference
        visual: documents → retrieval → answer
        tags: [RAG, Backend, Reference]
  - title: Frontend Infrastructure
    id: frontend-infrastructure
    lead: "This is the engineering base: schema-driven UI, frontend knowledge archives, and older experiments that still explain how I think about systems."
    items:
      - name: schema-render
        link: https://github.com/XingMXTeam/schema-render
        desc: A schema-driven UI rendering experiment for dynamic frontend interfaces. It belongs to low-code, dynamic forms, admin systems, and frontend architecture abstraction — not AI by itself.
        icon: fas fa-layer-group
        status: Experimental
        visual: schema → components → UI
        tags: [Schema UI, Low-code, Frontend]
      - name: Frontend Map
        link: https://github.com/XingMXTeam/frontend-map
        desc: A historical frontend knowledge archive covering JavaScript, TypeScript, Vue, and frontend engineering. It records the engineering base behind my current AI and full-stack experiments.
        icon: fas fa-code
        status: Archive
        visual: JS + TS + Vue + engineering
        tags: [Frontend, JavaScript, TypeScript]
      - name: Frontend Engineering Archive
        link: https://github.com/XingMXTeam
        desc: Earlier frontend engineering experiments and notes, including front-end-architecture, component-doc, shared-state-management, simple-hmr, and webpack-build.
        icon: fas fa-box-archive
        status: Archive
        visual: architecture notes + small repos
        tags: [Engineering, Components, Build Tools]
  - title: Creator & Media Tools
    id: creator-media-tools
    lead: Experiments for content production and video editing. The cover tool you can open is above. These are repos, not finished products.
    items:
      - name: Xiaohongshu AI Operator
        link: https://github.com/XingMXTeam/xiaohongshushipfast
        desc: A GitHub experiment for creator content operations. It is still being built. The thing you can open today is the Xiaohongshu cover maker above, not this repo.
        icon: fas fa-pen-nib
        status: Building
        visual: topics → drafts → publishing
        tags: [AI, Content Ops, Xiaohongshu]
      - name: CapCut Audio Subtitle Align
        link: https://github.com/XingMXTeam/capcut_audio_subtitle_align
        desc: A creator-workflow experiment for aligning audio and subtitles in editing pipelines, especially useful when turning AI-generated or edited media into short-form content.
        icon: fas fa-closed-captioning
        status: Experimental
        visual: audio → subtitles → edit
        tags: [Video Workflow, Creator Tool, Automation]
  - title: Publishing & Knowledge Systems
    id: publishing-knowledge-systems
    lead: The prompt library you can open, plus books that are already published.
    items:
      - name: Prompt Library
        link: /en/prompts/
        desc: A curated collection of prompts used for coding, creation, writing, research, and workflows — not prompt snippets, but working patterns from real tasks.
        icon: fas fa-lightbulb
        status: Active
        visual: prompts → workflows → output
        tags: [Prompt Engineering, AI Workflow, Knowledge Base]
      - name: Options Made Simple
        link: https://www.amazon.com/dp/B0F6NSTGPQ
        desc: A beginner-friendly options trading ebook that explains options through plain-language metaphors and practical trading scenarios.
        icon: fas fa-chart-line
        status: Published
        visual: plain language investing
        tags: [Ebook, Investing, Education]
      - name: Modern Javascript for the Impatient
        link: https://item.jd.com/12911627.html
        desc: Chinese translation of Modern JavaScript for the Impatient.
        icon: fas fa-book-open
        status: Published
        visual: translation + frontend education
        tags: [Book, Translation, JavaScript]
---
