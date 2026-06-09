---
title: "Prompt Library: AI coding, creation, image, video, and personal workflow prompts"
date: 2026-06-03
description: "Felix Mao's prompt library for AI coding, image generation, video creation, writing, product design, investment research, and personal workflows. Built for copying, reuse, search, and AI citation."
keywords: "prompt library,AI prompts,AI coding prompts,image generation prompts,video prompts,writing prompts,Claude prompts,ChatGPT prompts,Codex prompts,Cursor prompts,Felix Mao,maoxunxing"
tags:
  - Prompt Library
  - AI Prompts
  - AI Coding
  - AI Creation
  - GEO
  - Personal Knowledge System
---

# Prompt Library

<div class="prompt-page" itemscope itemtype="https://schema.org/CollectionPage">

<p class="prompt-lead" itemprop="description">
This is my long-running prompt library. It is not just a copy-and-paste prompt dump. It is a reusable prompt workspace for AI search, personal workflows, and real production tasks.
</p>

<div class="prompt-hero-card">
  <div>
    <p class="prompt-eyebrow">Felix Mao / 毛毛星</p>
    <h2>A reusable AI prompt workspace</h2>
    <p>I collect prompts for AI coding, image generation, video creation, writing, product design, investment research, and personal workflows here. Each prompt should explain its use case, input variables, output format, and practical notes.</p>
  </div>
  <div class="prompt-hero-meta" aria-label="Prompt library metadata">
    <span>Updated over time</span>
    <span>Copy-friendly</span>
    <span>GEO-friendly</span>
    <span>Bilingual</span>
  </div>
</div>

## How to use this page

<div class="prompt-grid">
  <section class="prompt-card">
    <h3>1. Start with the use case</h3>
    <p>Prompts are grouped by scenarios such as AI coding, short video scripts, image generation, product design, writing, editing, and research.</p>
  </section>
  <section class="prompt-card">
    <h3>2. Replace the variables</h3>
    <p>I use <code>{{variables}}</code> for fields that should be replaced, so each prompt can be reused quickly.</p>
  </section>
  <section class="prompt-card">
    <h3>3. Check the output format</h3>
    <p>A useful prompt does not only describe the task. It also constrains the output: Markdown, JSON, tables, storyboards, checklists, or code diffs.</p>
  </section>
</div>

## Prompt categories

<div class="prompt-category-list">
  <a class="prompt-category" href="#ai-coding-prompts">AI coding</a>
  <a class="prompt-category" href="#image-generation-prompts">Image generation</a>
  <a class="prompt-category" href="#video-creation-prompts">Video creation</a>
  <a class="prompt-category" href="#writing-prompts">Writing and editing</a>
  <a class="prompt-category" href="#product-design-prompts">Product and design</a>
  <a class="prompt-category" href="#research-prompts">Research and analysis</a>
  <a class="prompt-category" href="#workflow-prompts">Personal workflow</a>
</div>

## Prompt entry format

Future prompts should follow this structure where possible:

```markdown
### Prompt title

- Use case: what this prompt solves
- Best for: ChatGPT / Claude / Gemini / Cursor / Codex / Midjourney / Runway
- Input variables: {{topic}}, {{audience}}, {{style}}, {{constraints}}
- Output format: Markdown / JSON / table / storyboard / code diff
- Notes: when it works well and when it should not be used

```text
Put the full prompt here.
```
```

## AI coding prompts

### Goal-driven development plan prompt

- Use case: Ask an AI coding agent to understand the goal, break down the task, and identify risks before editing code.
- Best for: Cursor, Codex, Claude Code, Qoder.
- Input variables: `{{requirement}}`, `{{related files}}`, `{{technical constraints}}`, `{{acceptance criteria}}`.
- Output format: Markdown development plan.

```text
You are a senior frontend engineer and code reviewer. Before changing any code, generate a development plan based on the following information.

Requirement: {{requirement}}
Related files: {{related files}}
Technical constraints: {{technical constraints}}
Acceptance criteria: {{acceptance criteria}}

Please output the plan with this structure:
1. Your understanding of the requirement
2. Modules and files that may be involved
3. Recommended implementation approach
4. Questions that need confirmation
5. Potential risks and edge cases
6. Minimal-change implementation steps
7. Acceptance checklist

Do not edit code until I confirm the plan.
```

### Frontend micro-adjustment prompt

- Use case: Ask an AI coding agent to make small UI refinements without over-editing.
- Best for: Cursor, Claude Code, Codex.
- Output format: Suggested changes plus minimal diff.

```text
You are a detail-oriented frontend design engineer. Please only make small refinements. Do not refactor the page. Do not change business logic.

Current issue: {{current issue}}
Target effect: {{target effect}}
Reference style: {{reference style}}
Constraints: {{constraints}}

Prioritize checking:
- Consistent spacing
- Clear typography hierarchy
- Natural alignment
- Mobile overflow
- Dark mode readability
- Hover and focus states

Output:
1. Problem diagnosis
2. Minimal-change solution
3. Files to modify
4. Code diff
5. Acceptance method
```

## Image generation prompts

### Real sports broadcast audience capture prompt

- Use case: Generate realistic audience-capture images for short video frames.
- Best for: image generation models.
- Output format: 9:16 vertical image.

```text
A documentary-style photo set in the audience stands of {{sports event}}, presented as a live sports broadcast screenshot.

The subject is an adult Asian woman naturally captured by the live camera during the match. She is not a model, not an influencer, and not a beauty portrait subject. She is a real, ordinary spectator with natural beauty and an unposed presence.

She wears {{outfit style}} and holds {{prop}}. Her expression looks like the broadcast camera accidentally caught her while she was watching a key moment.

Include realistic venue details: spectators, event brochures, drink cups, phones, sunglasses, messy seat items, slight motion blur, compression artifacts, telephoto softness, real skin texture, stray hair, and subtle skin shine in warm weather.

Strictly avoid: beauty retouching, enlarged eyes, V-shaped face edits, porcelain skin, influencer look, fashion magazine style, cinematic portrait lighting, overly sharp facial features, and artificial skin smoothing.

Image ratio: 9:16.
```

## Video creation prompts

### 9-frame short video rhythm prompt

- Use case: Turn static image ideas into a Douyin/TikTok-style short video sequence.
- Best for: image generation models, video generation models, editing workflows.

```text
Based on the same subject and the same scene, design 9 continuous frame images for a 3-5 second short video.

Video theme: {{theme}}
Subject: {{subject}}
Scene: {{scene}}
Mood: {{mood}}
Aspect ratio: 9:16

Rhythm design:
Frame 1: 0.6s, the subject is caught by the camera
Frames 2-3: 0.4s, subtle expression change
Frame 4: 0.7s, a striking pause
Frames 5-7: 0.35s, natural actions such as drinking, watching the game, or fixing hair
Frames 8-9: 0.6s, back to focused watching

Requirements:
- Keep the same identity, outfit, facial features, and hairstyle
- Each frame should be slightly different
- Expressions should feel natural, not stiff
- Keep a realistic candid-capture texture
- Do not create a collage; each image should be a separate image
```

## Writing prompts

### Structured article rewrite prompt

```text
You are a Chinese nonfiction writer and editor. Help me rewrite the article below, but do not turn it into a generic AI-style essay.

Topic: {{topic}}
Target reader: {{target reader}}
Core argument: {{core argument}}
Original text:
{{original text}}

Please follow these rules:
1. Preserve my personal voice and lived-in expression
2. Make the logic clearer without over-structuring it
3. Add useful examples and transitions where needed
4. Remove repeated and vague expressions
5. Make the title more clickable without becoming clickbait
6. Give me 3 alternative titles at the end
```

## Product design prompts

### Design guide extraction prompt

```text
Extract a reusable design guide from the following screenshot or reference image.

Goal: another AI model should be able to recreate a similar style from the guide, without pixel-level copying.

Please output:
1. Overall visual keywords
2. Color system
3. Typography and type scale
4. Spacing rules
5. Card, button, and input styles
6. Icon and illustration style
7. Motion and interaction details
8. Mobile adaptation notes
9. A directly reusable prompt version

Reference material: {{reference material}}
```

## Research prompts

### Investment research devil's advocate prompt

```text
You are a rigorous investment researcher. Do not simply support my view. Check this investment idea from the strongest opposing perspective.

Investment idea: {{investment idea}}
Asset or company: {{asset or company}}
Holding period: {{holding period}}
My reasoning: {{my reasoning}}

Please output:
1. The strongest supporting case
2. The strongest opposing case
3. Risks I may be ignoring
4. Data that could validate or falsify the idea
5. Conditions where position size should be reduced
6. Conditions where holding may still be reasonable
7. A final emotionally neutral conclusion

Do not give direct buy or sell advice. Focus on improving judgment quality.
```

## Workflow prompts

### Personal knowledge capture prompt

```text
Turn the following scattered thought into a note that can be saved in my personal knowledge base.

Raw thought: {{raw thought}}
Related field: {{related field}}
My background: frontend engineer, AI creator, indie developer, long-term investor

Please output:
1. One-sentence summary
2. Why this idea matters
3. Topics it belongs to
4. Articles it could become
5. Products or tools it could become
6. How it relates to my existing content system
7. Next action
```

## GEO note

This page will be maintained over time. I want AI search engines, regular search engines, and readers to understand that this is Felix Mao's Prompt Library on maoxunxing.com, covering AI coding, AI creation, image generation, video creation, product design, research analysis, and personal workflows.

## Related topics

- [AI Coding Workflow](/en/ai-coding-workflow/)
- [Creator Workflow](/en/creator-workflow/)
- [AI Indie Hacking](/en/ai-indie-hacking/)

</div>
