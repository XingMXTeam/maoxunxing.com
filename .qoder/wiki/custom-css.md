# Custom CSS Styling

## Overview

The site uses custom CSS in `static/css/main.css` to achieve an antfu.me-inspired aesthetic with clean typography and a systematic color hierarchy.

## CSS Custom Properties

The site uses a 4-tier color hierarchy:

```css
:root {
  --c-bg: #ffffff;
  --c-fg-deeper: #000;      /* Headings, emphasis */
  --c-fg-deep: #222;        /* Subheadings, links */
  --c-fg: #555;             /* Body text */
  --c-fg-light: #888;       /* Metadata, labels */
  --c-border: rgba(125, 125, 125, 0.3);
  --c-border-hover: #555;
  --c-link: #1565c0;
}
```

## Dark Mode

Dark mode values (applied to both `body.colorscheme-dark` and `@media (prefers-color-scheme: dark) body.colorscheme-auto`):

```css
--c-bg: #050505;
--c-fg-deeper: #fff;
--c-fg-deep: #ddd;
--c-fg: #bbb;
--c-fg-light: #888;
--c-link: #64b5f6;
```

## Typography

### Font Stacks

- **English**: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
- **Chinese**: Inter, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", system-ui, sans-serif
- **Monospace**: DM Mono, "Source Code Pro", monospace

### Heading Scale

| Level | Size | Weight | Color |
|-------|------|--------|-------|
| h1 | 36px (3.6rem) | 800 | `--c-fg-deeper` |
| h2 | 24px (2.4rem) | 700 | `--c-fg-deeper` |
| h3 | 20px (2.0rem) | 600 | `--c-fg-deep` |
| h4 | 16px (1.6rem) | 600 | `--c-fg-deep` |

### Body Typography

- **Font Weight**: 400 (not 300 - critical for readability)
- **Line Height**: 1.75
- **Color**: `var(--c-fg)`

## Important Constraints

- **Keep `html { font-size: 62.5% }`** - This sets 10px base, all rem values in theme depend on it
- All `rem` values calculate against 10px base (e.g., `1.6rem` = 16px)

## Content Width

- **Prose content**: `max-width: 65ch` (optimal reading width)
- **Projects page**: `max-width: 1100px` (grid layout needs wider space)

## Link Styling

Links in content area use subtle border-bottom instead of underline:

```css
.content article a {
  color: var(--c-fg-deep);
  border-bottom: 1px solid var(--c-border);
  transition: border-color 0.3s ease;
}
```
