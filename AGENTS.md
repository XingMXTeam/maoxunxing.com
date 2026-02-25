## Cursor Cloud specific instructions

This is a Hugo static blog (maoxunxing.com) — bilingual (EN/ZH-CN), using the `hugo-coder` theme via git submodule.

### System dependency

Hugo **v0.111.3 extended** must be installed. It is not an npm dependency. The `.deb` is installed from the GitHub releases page during environment setup. Verify with `hugo version`.

### Key commands

| Task | Command |
|---|---|
| Dev server | `hugo server --bind 0.0.0.0 --port 1313 --baseURL http://localhost:1313 --disableFastRender` |
| Production build | `rm -rf public && hugo --minify` |
| Format check (lint) | `npm run check-format` (prettier) |
| Auto-format | `npm run format` |

### Caveats

- The git submodule at `themes/hugo-coder` must be initialized before Hugo can build. If the theme directory is empty, run `git submodule update --init --recursive`.
- `npm run check-format` exits with code 2 when formatting differences are found — this is pre-existing in the repo and not a setup failure.
- The `canvas` and `sharp` npm packages require native binaries; `npm install` handles this automatically on Linux x86_64.
- Algolia indexing (`npm run index-and-send`) requires API keys and is only needed for search — not required for local development.
- Firebase deployment is only relevant for production hosting, not local dev.
