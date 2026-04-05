# Architecture

## Directory Structure

```
maoxunxing.com/
├── archetypes/          # Content templates
├── assets/              # SCSS and JS assets
│   ├── js/             # Custom JavaScript
│   └── scss/           # Custom SCSS styles
├── content/             # All markdown content
│   ├── posts/          # Blog posts (EN/CN)
│   ├── notes/          # Short notes
│   ├── projects/       # Project pages
│   ├── gallery/        # Photo gallery
│   ├── book-reports/   # Book reviews
│   └── about/          # About page
├── layouts/             # Hugo templates (overrides theme)
│   ├── _default/       # Default layouts
│   ├── partials/       # Partial templates
│   ├── shortcodes/     # Custom shortcodes
│   └── [section]/      # Section-specific layouts
├── static/              # Static files
│   ├── css/            # Custom CSS (main.css)
│   ├── js/             # Static JavaScript
│   ├── images/         # Static images
│   └── third-party/    # Third-party assets
├── themes/hugo-coder/   # Base theme (git submodule)
├── config.toml          # Hugo configuration
└── package.json         # Node.js dependencies
```

## Hugo Configuration

- **Base URL**: `https://maoxunxing.com/`
- **Theme**: `hugo-coder`
- **Default Language**: English
- **Languages**: English (EN), Chinese (zh-CN)
- **Pagination**: 10 posts per page
- **Robots TXT**: Enabled
- **Future Posts**: Enabled

## Theme Customization

The site uses hugo-coder as a base theme with extensive overrides:

1. **Layouts**: Custom templates in `layouts/` override theme defaults
2. **CSS**: `static/css/main.css` loaded after theme styles
3. **Partials**: Custom partials for header, footer, home, etc.

## Color Scheme System

- Mode: `auto` (follows system preference)
- Light/Dark toggle available
- CSS custom properties for theming

## Permalinks

All sections use slug-based URLs:
```toml
posts = "/:slugorcontentbasename/"
notes = "/:slugorcontentbasename/"
# ... same for all sections
```
