---
title: "\"Selector can't has classes from different scopes\" — how to fix this csso error"
date: 2026-09-30
description: "What the csso 'Selector can't has classes from different scopes' error means, why it happens in webpack builds that pass usage scopes to csso, and the three ways to fix it."
tags:
  - CSS
  - csso
  - webpack
  - 前端工程
  - Debug
custom_toc:
  - title: "The error"
  - title: "What it actually means"
  - title: "How to fix it"
  - title: "My take"
---

Your webpack build fails during CSS minification with:

```bash
Selector can't has classes from different scopes
```

## What it actually means

This error comes from [csso](https://github.com/css/csso), the CSS minifier. It only happens when your build passes **usage data with `scopes`** to csso — typically through `css-minimizer-webpack-plugin` (with the csso minifier) or `csso-webpack-plugin`.

Scopes are csso's way of understanding CSS Modules-style isolation: you tell csso which class names belong to the same "scope" (i.e. they never appear on the same markup), and csso can then merge rulesets more aggressively. Per the [csso docs](https://github.com/css/csso#scopes), the exception throws in exactly two cases:

1. **The same class name is listed in more than one scope.**
2. **One selector contains classes from different scopes.**

A class name that isn't listed in any scope simply belongs to the default scope — that's fine.

## How to fix it

Find where `usage` / `scopes` is passed to csso in your build config, e.g.:

```js
// webpack.config.js
new CssMinimizerPlugin({
  minify: CssMinimizerPlugin.cssoMinify,
  minimizerOptions: {
    usage: {
      scopes: [
        ["header-title", "header-nav"],
        ["card-title", "card-body"],
      ],
    },
  },
})
```

Then check the two cases:

**Case 1 — a class in two scopes.** Search your scopes arrays for duplicates and remove the class from one of them:

```js
scopes: [
  ["header-title", "shared-btn"],  // ❌ "shared-btn" is also below
  ["shared-btn", "card-body"],
]
```

**Case 2 — one selector mixing scopes.** Look for selectors that combine classes from different scopes:

```css
/* ❌ .header-title is in scope 1, .card-body is in scope 2 */
.header-title.card-body { margin: 0; }
```

Fix it by keeping the selector's classes within a single scope, or by moving the shared class into the same scope as the other.

**Case 3 — you never asked for scopes.** If you didn't intentionally set up scope-based optimization, the simplest fix is to drop `scopes` (or the whole `usage` option). Without usage data, csso falls back to safe transformations only — slightly larger output, zero errors.

## My take

Nine times out of ten this is stale or auto-generated `usage` config that nobody on the team remembers adding. Scopes are a power-user optimization; unless you're deliberately squeezing bytes out of a huge CSS bundle with CSS Modules, you don't need them. Delete the option, rebuild, and move on.
