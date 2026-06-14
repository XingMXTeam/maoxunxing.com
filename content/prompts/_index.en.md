---
title: "Prompt Library: Prompts I Actually Use"
date: 2026-06-03
description: "A small collection of prompts I actually use for coding, image generation, video creation, writing, product design, research, and personal workflows."
keywords: "prompt library,AI prompts,AI coding prompts,image generation prompts,video prompts,writing prompts,Claude prompts,ChatGPT prompts,Codex prompts,Cursor prompts,Felix Mao,maoxunxing"
tags:
  - Prompt Library
  - AI Prompts
  - AI Coding
  - AI Creation
  - Personal Knowledge System
---

# Prompt Library

<div class="prompt-page">

<p class="prompt-lead">
This page is where I keep prompts that I have actually used and want to keep around. I am not trying to collect as many prompts as possible. I only keep the ones I may return to when coding, writing, making images, making videos, or thinking through a problem.
</p>

<div class="prompt-hero-card">
  <div>
    <p class="prompt-eyebrow">Felix Mao / 毛毛星</p>
    <h2>Prompts I keep coming back to</h2>
    <p>Some of these prompts help me work faster. Some help me keep a creative style stable. Some simply help me organize messy thoughts. I will update this page slowly.</p>
  </div>
</div>

<div class="prompt-category-list">
  <a class="prompt-category" href="#ai-coding-prompts">AI coding</a>
  <a class="prompt-category" href="#image-generation-prompts">Image generation</a>
  <a class="prompt-category" href="#video-creation-prompts">Video creation</a>
  <a class="prompt-category" href="#writing-prompts">Writing and editing</a>
  <a class="prompt-category" href="#product-design-prompts">Product and design</a>
  <a class="prompt-category" href="#research-prompts">Research and analysis</a>
  <a class="prompt-category" href="#workflow-prompts">Workflow</a>
</div>

## AI coding prompts

### Goal-driven development plan prompt

I use this before asking Cursor, Codex, or Claude Code to change code. It forces the model to understand the goal, risks, edge cases, and minimal-change path before touching files.

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

This one is for polishing UI details without letting the model rewrite the whole page or change business logic.

```text
You are a detail-oriented frontend design engineer. Please only make small refinements. Do not refactor the page. Do not change business logic.

Current issue: {{current issue}}
Target effect: {{target effect}}
Reference style: {{reference style}}
Constraints: {{constraints}}

Prioritize checking: spacing, typography hierarchy, alignment, mobile overflow, dark mode readability, and hover/focus states.

Output: problem diagnosis, minimal-change solution, files to modify, code diff, and acceptance method.
```

## Image generation prompts

### Real sports broadcast audience capture prompt

This is my general prompt for creating a realistic sports broadcast spectator shot. The key is to avoid fashion-photo, influencer, and over-retouched portrait aesthetics.

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

This is useful when turning static images into a short video. It focuses on rhythm and subtle differences between frames instead of random movement.

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

Requirements: keep the same identity, outfit, facial features, and hairstyle; make every frame slightly different; keep expressions natural; do not create a collage.
```

## Writing prompts

### Structured article rewrite prompt

I use this when I want an article to become clearer without losing my own voice.

```text
You are a Chinese nonfiction writer and editor. Help me rewrite the article below, but do not turn it into a generic AI-style essay.

Topic: {{topic}}
Target reader: {{target reader}}
Core argument: {{core argument}}
Original text: {{original text}}

Preserve my personal voice, make the logic clearer, add useful examples, remove vague repetition, and give me 3 alternative titles at the end.
```

## Product design prompts

### Design guide extraction prompt

This is for turning a page screenshot or reference image into a reusable design guide.

```text
Extract a reusable design guide from the following screenshot or reference image.

Please output: overall visual keywords, color system, typography and type scale, spacing rules, card/button/input styles, icon and illustration style, motion and interaction details, mobile adaptation notes, and a directly reusable prompt version.

Reference material: {{reference material}}
```

## Research prompts

### Investment research devil's advocate prompt

I use this when I already have an investment thesis and want to force myself to look at the strongest opposing arguments.

```text
You are a rigorous investment researcher. Do not simply support my view. Check this investment idea from the strongest opposing perspective.

Investment idea: {{investment idea}}
Asset or company: {{asset or company}}
Holding period: {{holding period}}
My reasoning: {{my reasoning}}

Please output: the strongest supporting case, the strongest opposing case, risks I may be ignoring, data that could validate or falsify the idea, conditions where position size should be reduced, conditions where holding may still be reasonable, and a final emotionally neutral conclusion.

Do not give direct buy or sell advice. Focus on improving judgment quality.
```

## Workflow prompts

### Personal knowledge capture prompt

This turns a scattered thought into a note that can be saved, expanded, or turned into future writing.

```text
Turn the following scattered thought into a note that can be saved in my personal knowledge base.

Raw thought: {{raw thought}}
Related field: {{related field}}
My background: frontend engineer, AI creator, indie developer, long-term investor

Please output: one-sentence summary, why this idea matters, topics it belongs to, articles it could become, products or tools it could become, how it relates to my existing content system, and next action.
```

## Related topics

- [AI Coding Workflow](/en/ai-coding-workflow/)
- [Creator Workflow](/en/creator-workflow/)
- [AI Indie Hacking](/en/ai-indie-hacking/)

</div>
