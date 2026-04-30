> This article was originally published on [maoxunxing.com](https://maoxunxing.com).
>
# What CLI setup should we use in the AI era? (DEV.to Template)

> Platform: DEV Community  
> Positioning: opinionated engineering workflow post  
> Audience: developers using AI coding tools in daily work

## TL;DR
In the AI era, the terminal is no longer just where we type commands — it is the entry point to development. Instead of picking a single “best terminal,” design your setup in **four layers**: terminal emulator, shell, workflow tools, and AI layer.

---

## Hook
For years, many Mac developers used a classic setup: **iTerm2 + Oh My Zsh**.

It still works.

But now we also run AI-assisted workflows in terminal: logs, Git, build/test loops, and agents like Codex / Claude Code / Gemini CLI.

So the question changed from:

> “Which terminal is best?”

to:

> “What command-line workflow fits AI-native development?”

---

## The 4-layer model
1. **Terminal emulator**: iTerm2 / Ghostty / Warp  
2. **Shell**: Zsh / Fish / Bash  
3. **Workflow tools**: tmux / LazyGit / fzf / ripgrep  
4. **AI layer**: Warp AI / Codex / Claude Code / Gemini CLI

This layering makes your workflow modular and future-proof.

---

## Quick tool breakdown
### iTerm2
- Pros: stable, mature, feature-rich
- Cons: not AI-native
- Best for: conservative, reliability-first setups

### Oh My Zsh
- Pros: fast onboarding, huge ecosystem
- Cons: easy to over-configure and slow startup
- Tip: keep only high-value plugins

### Fish
- Pros: great defaults (autosuggest, highlighting, completion)
- Cons: not fully POSIX-compatible
- Tip: Fish for interaction, Bash/Zsh for scripts

### Ghostty
- Pros: lightweight, fast, native feel
- Cons: AI is not the built-in focus
- Best for: clean and controllable workflows

### Warp
- Pros: AI-native UX, command generation, error explanation
- Cons: heavier, more opinionated product workflow
- Best for: people who want terminal-as-AI-workbench

### tmux
- Pros: excellent for remote/dev-server sessions
- Cons: steeper learning curve
- Rule of thumb: optional locally, essential remotely

### LazyGit
- Pros: huge speed boost for frequent Git tasks
- Note: complements Git knowledge; does not replace it

---

## 3 recommended setups
### 1) Stable setup
**iTerm2 + Oh My Zsh + LazyGit**

### 2) Lightweight setup
**Ghostty + Fish + LazyGit**

### 3) AI-native setup
**Warp + AI Agent + LazyGit**

---

## My practical recommendation
- Keep iTerm2 if you value stability and don’t want churn.
- Try Ghostty if you want modern performance with minimal overhead.
- Try Warp if you want deep AI in terminal.
- Use Fish if you want better defaults; stay on Zsh if your setup is already solid.
- Install LazyGit either way.
- Adopt tmux when remote/long-running sessions become frequent.

---

## Discussion prompt (for DEV comments)
What’s your current terminal stack in 2026?

- iTerm2 / Ghostty / Warp?
- Zsh / Fish?
- Are you using AI *inside* terminal, or mainly in your editor?

---

## Suggested tags
`terminal` `productivity` `ai` `developer-tools` `workflow`
