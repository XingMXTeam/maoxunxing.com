# maoxunxing.com

## Overview

This is the source for https://maoxunxing.com/. Inspired by **mtlynch.io**.

## Local development

**Prerequisites:** [Hugo](https://gohugo.io/installation/) (extended, 0.111+ recommended) and Node.js.

Always run commands from the **repository root** (where `config.toml` lives).

1. **Install:** `git submodule update --init` (pulls `themes/hugo-coder`), then `npm install`
2. **Build:** `npm run build` or `hugo --minify`
3. **Preview:** `npm run start` or `hugo server` — open http://localhost:1313/
4. **Optional helper:** `bash scripts/ensure-dev.sh` checks that `hugo` is on your `PATH` and the theme exists, then starts `hugo server`

**Note:** On some macOS setups the shell may print “Unable to locate a Java Runtime.” That message is unrelated to Hugo; if `hugo version` works, you can ignore it.

### Algolia indexing (deploy / CI only)

- The **Admin API key is not stored in the repo.** Set `ALGOLIA_ADMIN_KEY` in your environment when running `npm run index-and-send` (implemented by [scripts/index-and-send.sh](scripts/index-and-send.sh), which writes a temporary config file).
- **GitHub Actions:** add a repository secret named `ALGOLIA_ADMIN_KEY` with your Algolia Admin API key so merge/PR deploy workflows can push the search index.
- Public App ID and index name are documented under `[params.algolia]` in [config.toml](config.toml) for reference.

### Architecture (short)

| Area | Notes |
|------|--------|
| **Generator** | [Hugo](https://gohugo.io/) with theme [hugo-coder](https://github.com/luizdepra/hugo-coder) as a **git submodule** under `themes/hugo-coder`. |
| **Layouts** | This site **overrides** the theme heavily: see root [layouts/](layouts/) (e.g. [layouts/_default/baseof.html](layouts/_default/baseof.html), partials). Theme upgrades require **manual diff** against your copies. |
| **Styles** | Main theme pipeline: [assets/scss/coder.scss](assets/scss/coder.scss) (project copy / fork of theme SCSS). Additional overrides: [static/css/main.css](static/css/main.css) via `custom_css` in [config.toml](config.toml). Prefer changing variables in `assets/scss/_variables.scss` before piling rules into `main.css`. |
| **Content** | Markdown under [content/](content/) with per-locale files such as `index.en.md` / `index.zh-cn.md`. |
| **Config** | Primary [config.toml](config.toml). Algolia admin key is **not** in config files. |
| **Search (browser)** | [layouts/partials/search.html](layouts/partials/search.html) uses the public search-only key + App ID (safe for frontend). |

### Machine-readable / SEO extras

- [static/llms.txt](static/llms.txt) — brief site summary for tools that look for it.
- Article pages emit **JSON-LD** `BlogPosting` via [layouts/partials/schema-article.html](layouts/partials/schema-article.html).
- Posts, notes, and book reports show **Copy / View raw / Edit on GitHub** when `github_repo` / `github_branch` are set under `[params]` in [config.toml](config.toml).

## Code style guides

New code should adhere to the appropriate Google Style guide for the given language:

- [HTML/CSS](https://google.github.io/styleguide/htmlcssguide.html)
- [JavaScript](https://google.github.io/styleguide/jsguide.html)

## Pull requests

### Merge conflicts

If a PR has merge conflicts with the main repo's `master` branch, rebase the PR onto `master`. Do not include merge commits in a PR.

### Pull request style

PRs should have a descriptive one-line summary to explain the change. The PR description should add any additional required context or explanation for the change. For simple or obvious PRs, a PR description is not required.

If the PR fixes an issue, include the text "Fixes #XX" in the PR description, where `XX` is the [issue number in this repository](https://github.com/XingMXTeam/maoxunxing.com/issues). This allows GitHub to cross-reference between PRs and issues.

## Build Failures

### HTMLProofer

If HTMLProofer fails on a broken link, we have three options: suppress the error, fix the link, or remove the link.

You should suppress the error if the link works fine in a browser, but fails in CI occasionally. To do this, open [tests/lint-html](tests/lint-html), update the `--ignore-urls` / related flags for the `htmlproofer` command. Add a comment above the command to explain why we're adding this suppression.

If the link is just permanently broken and does not load, even in a browser, either replace the link with another that achieves the same effect or remove the link entirely.

## Compatibility targets

The site should render properly on all of the following operating systems (latest stable releases):

- Android
- iOS
- Windows
- OS X
- Linux (any flavor)

The site should render properly on all the following browsers:

- Chrome
- Firefox
- Safari

### Compatibility testing

Developers need not verify every change on every possible OS/browser combination. Developers should test CSS or layout changes on at least one desktop OS and one mobile OS (preferably not the same browser for both). For more complex changes to CSS or layout, developers should test more than two OS+browser combinations, but it's at the developer's discretion how exhaustively to test.

## Prose style guide

### Headings

- Content headings start at `##` (`<h2>` in HTML).
- Headings use sentence-style capitalization (only first word is capitalized).
- Headings do not have trailing punctuation.

### Point of view

- Author is first-person singular (I).
- Reader is second-person singular (you).

### Readers

- Readers of the blog are collectively referred to as "readers" or "visitors."
    - Readers are not referred to as "users" and should never be described as "traffic."

### Numbers

- For 1-9, spell out the number.
    - _Except_: When the number is a multiplier (2x, 9x).
- For all other numbers, use numerals.
- For numbers 1,000 or over, write commas to separate thousands.
- For number ranges, use a regular hyphen and no space (200-300).

### Time of day

- Use AM/PM, separated by a space (2 AM, 4:30 PM).

### Pronouns

- When referring to non-specific people (e.g. "the user", "the client"), use "they."

### Names

- reddit is written all lowercase.

### e.g. / i.e.

- Put e.g. or i.e. within parentheses (e.g., like this).

### Oxford comma

- Always use an Oxford comma.

### Spelling conventions

- ebook (not e-book)

## Encoding video for posts

Use ffmpeg with these settings:

```bash
ffmpeg \
  -i input.avi \
  -shortest \
  -vcodec libx264 \
  -movflags +faststart \
  -vf "format=yuv420p" \
  output.mp4
```

## 生成默认封面

`npm run cover vue` 封面默认大小`1200*300` 封面采用统一风格

