---
title: "Ebook Factory"
date: 2026-06-25
description: "A case study for Ebook Factory, a repeatable Markdown-to-ebook publishing pipeline."
keywords: "Ebook Factory,Markdown ebook,Pandoc,personal publishing,EPUB,MOBI,PDF,Felix Mao"
tags:
  - Publishing
  - Project
  - Creator Tools
---

# Ebook Factory

Ebook Factory is a personal publishing pipeline for turning Markdown-based book projects into ebook artifacts.

The working repository is currently private because it may contain real book material. A clean public template should be extracted later.

## The problem

Writing an ebook is not only a writing problem. It quickly becomes a production problem:

- keeping book structure consistent
- exporting PDF / EPUB / MOBI
- managing metadata
- reusing templates across books
- keeping source files clean
- avoiding manual publishing steps

If every book is handled manually, the process becomes hard to repeat.

## The idea

Ebook Factory treats each book as a structured project and gives the publishing workflow a repeatable command-line pipeline.

```text
Markdown source
  -> book template
  -> build command
  -> Pandoc / Docker workflow
  -> PDF / EPUB / MOBI output
```

## Current direction

The system is built around:

- Markdown source files
- reusable book templates
- Pandoc-based export
- Make-based build workflow
- Dockerized environment
- TypeScript CLI for project operations

## Why this matters

I care about publishing systems because content is not just output. Content can become a product, a distribution asset, and a learning record.

A repeatable publishing pipeline makes it easier to turn long-form thinking into durable artifacts.

## Current status

Private repository. Public template planned.

Before publishing a clean template, I need to:

- separate real manuscript material from reusable tooling
- clean example book content
- document the build workflow
- add a minimal demo book
- add export examples

## Related

- GitHub profile: <https://github.com/XingMXTeam>
- Projects page: <https://maoxunxing.com/projects/>
