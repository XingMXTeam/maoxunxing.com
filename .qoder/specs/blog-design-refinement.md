# Blog Design Refinement: antfu.me Aesthetic

## Context

The user's Hugo blog (maoxunxing.com) uses the hugo-coder theme with custom overrides. Previous session implemented structural features (Projects, Gallery, etc.) and a prose-style homepage. The user reports:
- Fonts still feel small / hard to read
- Content width is not optimal
- Overall aesthetic doesn't match antfu.me's clean, modern feel

Root cause analysis reveals the **real issue is not font size** (homepage name=36px, bio=16px are reasonable) but rather:
1. `font-weight: 300` (extremely light) making text appear thin and washed-out
2. Serif font (Merriweather) vs antfu's clean sans-serif (Inter)
3. No systematic color hierarchy (antfu uses 4-tier: #000/#222/#555/#888)
4. Content width too wide (90rem container)
5. Blue underline links instead of subtle border-bottom

## Files to Modify

| File | Change |
|---|---|
| `static/css/main.css` | All CSS overrides (main work) |
| `layouts/partials/footer.html` | Remove social icons block |
| `layouts/_default/baseof.html` | Add Inter + DM Mono font import |

Reference-only (do NOT modify):
- `themes/hugo-coder/assets/scss/_base.scss` - base values
- `themes/hugo-coder/assets/scss/_variables.scss` - color vars

## Important Constraints

- **Keep `html { font-size: 62.5% }`** (10px base) - changing it would break ALL theme rem values
- All `rem` values in this theme calculate against 10px base (e.g., `1.6rem` = 16px)
- Dark mode uses `colorscheme-auto` class + `@media (prefers-color-scheme: dark)`, NOT `.colorscheme-dark` alone
- Config has `colorscheme = "auto"`, so dark rules must cover both selectors

## Implementation Steps

### Step 1: Add Inter Font Import (`baseof.html`)

Add before line 39 (before existing `/third-party/google-fonts/css/style.css`):

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap" />
```

### Step 2: Remove Footer Social Icons (`footer.html`)

Remove lines 15-44 (the `{{ with .Site.Params.social }}...{{ end }}` block that renders `<ul class="social-links">`). Keep the copyright/CC license section (lines 3-14).

### Step 3: CSS Custom Properties (`main.css` - top of file)

Add color hierarchy system using CSS custom properties:

```css
:root {
  --c-bg: #ffffff;
  --c-fg-deeper: #000;
  --c-fg-deep: #222;
  --c-fg: #555;
  --c-fg-light: #888;
  --c-border: rgba(125, 125, 125, 0.3);
  --c-border-hover: #555;
}
```

Dark mode variants on TWO selectors:
```css
body.colorscheme-dark { /* explicit dark */ }
@media (prefers-color-scheme: dark) {
  body.colorscheme-auto { /* auto dark */ }
}
```

Dark values: `--c-bg: #050505`, `--c-fg-deeper: #fff`, `--c-fg-deep: #ddd`, `--c-fg: #bbb`, `--c-fg-light: #888`, `--c-border-hover: #bbb`

### Step 4: Body Typography Overrides (`main.css`)

| Property | Current (theme) | New Override |
|---|---|---|
| `font-weight` | `300` | `400` **(#1 readability fix)** |
| `line-height` | `1.8em` | `1.75` (unitless) |
| `color` | `#212121` / `#515151` | `var(--c-fg)` |
| `background-color` | `#ffffff` / `#FAFAFA` | `var(--c-bg)` |

Font family overrides (already exist in main.css, update stacks):
- `body.en`: `"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- `body.cn`: `"Inter", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif`

Also override: `a { font-weight: inherit; color: inherit; }`

### Step 5: Heading Scale (`main.css`)

All values in rem against 10px base:

| Level | Size | Weight | Line-height | Color | Margins |
|---|---|---|---|---|---|
| h1 | 3.6rem (36px) | 800 | 1.15 | `var(--c-fg-deeper)` | `0.5rem 0 2rem` |
| h2 | 2.4rem (24px) | 700 | 1.33 | `var(--c-fg-deeper)` | `3em 0 1em` |
| h3 | 2.0rem (20px) | 600 | 1.6 | `var(--c-fg-deep)` | `1.6em 0 0.6em` |
| h4 | 1.6rem (16px) | 600 | 1.5 | `var(--c-fg-deep)` | `1.2em 0 0.4em` |

### Step 6: Link Styling (`main.css`)

Scope to content area only to avoid breaking nav/component links:

```css
.content article a {
  color: var(--c-fg-deep);
  text-decoration: none;
  border-bottom: 1px solid var(--c-border);
  transition: border-color 0.3s ease;
}
.content article a:hover {
  text-decoration: none;
  border-bottom-color: var(--c-border-hover);
}
```

Keep `.home-para a` existing style (already has border-bottom pattern).

### Step 7: Content Width (`main.css`)

```css
.content {
  max-width: 65ch;
  margin-left: auto;
  margin-right: auto;
}
.home-prose {
  max-width: 65ch; /* was 52rem */
}
```

Remove the `@media (min-width: 1280px) .content { max-width: 72rem }` rule.

Keep `.projects-page { max-width: 1100px }` as-is (grid layout needs wider space).

### Step 8: Homepage Refinements (`main.css`)

Migrate all hardcoded colors to CSS variables:

| Selector | Key Changes |
|---|---|
| `.home-name` | weight 800, color `var(--c-fg-deeper)` |
| `.home-bio` | color `var(--c-fg)`, line-height 1.75 |
| `.home-para` | font-size `1.5rem` (15px, slight bump), color `var(--c-fg)` |
| `.home-para a` | color `var(--c-fg-deep)`, border-color `var(--c-border)` |
| `.home-find-me-label` | color `var(--c-fg-light)` |
| `.find-me-link` | color `var(--c-fg)` |
| `.home-divider` | border-color `var(--c-border)` |
| `.home-section-title` | font-size `2.0rem` (20px), weight 700, color `var(--c-fg-deeper)` |
| `.article-date` | color `var(--c-fg-light)` |
| `.article-title` | font-size `1.4rem` (14px), color `var(--c-fg-deep)` |

### Step 9: Misc Component Updates (`main.css`)

- `blockquote`: `border-left-color: var(--c-border)`, `line-height: 1.75`
- `hr`: `border: none; border-top: 1px solid var(--c-border); margin: 3em 0`
- `code`: font-family `"DM Mono", "Source Code Pro", monospace`, font-size `0.9em`
- `table td, table th`: `border-color: var(--c-border)`
- `.footer`: font-size `1.4rem`, `opacity: 0.6`, color `var(--c-fg-light)`
- `.navigation`: background `var(--c-bg)`

### Step 10: Dark Mode Migration (`main.css`)

Replace all existing `.colorscheme-dark` hardcoded color overrides with `var()` references. Since the custom properties are redefined for dark mode, most dark-specific rules become unnecessary. Update remaining ones:

- `.colorscheme-dark .navigation { background: var(--c-bg) }`
- `.colorscheme-dark .home-bio/para { color: var(--c-fg) }`
- `.colorscheme-dark .home-name { color: var(--c-fg-deeper) }`
- Remove redundant dark rules that are now handled by variables

Add corresponding `@media (prefers-color-scheme: dark) { body.colorscheme-auto ... }` rules for all dark overrides.

### Step 11: Cleanup Dead CSS (`main.css`)

Remove:
- `.footer ul`, `.footer ul li`, `.footer ul li a` rules (social links list removed)
- `.douban`, `.zhihu`, `.rss` position hacks (footer social icons gone)
- `.home-quick-nav` rules (section already removed from HTML)

## Verification

1. Run `hugo server -D --baseURL http://localhost:1313/` (must use baseURL flag due to `<base>` tag)
2. Check homepage: name should be bold (800 weight), body text clearly readable (400 weight), prose width ~65ch
3. Check dark mode toggle: colors should transition cleanly using CSS variables
4. Check article pages: links have subtle border-bottom (not blue underline), content width ~65ch
5. Check footer: no social icons, just copyright line
6. Check navigation: unchanged (icon links + text links + theme toggle)
7. Check projects/gallery pages: layouts not broken by width changes
8. Check mobile (resize to 375px): text readable, no horizontal overflow
