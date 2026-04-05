# Layout Partials

## Key Partials

| Partial | Purpose |
|---------|---------|
| `header.html` | Navigation, logo, social links, theme toggle, search |
| `footer.html` | Copyright, CC license |
| `home.html` | Homepage prose layout |
| `toc.html` | Table of contents |
| `search.html` | Algolia search integration |
| `content-source-actions.html` | View source, edit, raw buttons |
| `opengraph.html` | Open Graph meta tags |
| `twitter-card.html` | Twitter card meta tags |
| `schema-article.html` | Schema.org structured data |
| `social-share.html` | Share buttons |
| `social-discuss.html` | Discussion links |
| `comment.html` | Comment system placeholder |
| `serviceworker.html` | Service worker registration |

## Header Structure

The header (`header.html`) contains:

1. **Logo/Avatar**: Links to homepage
2. **Navigation Links**: Menu items from config
3. **Social Icons**: GitHub, Twitter, YouTube, Substack, RSS
4. **Search Icon**: Algolia autocomplete
5. **Theme Toggle**: Light/dark mode switch

## Footer Structure

The footer (`footer.html`) is minimal:

- Copyright line
- Creative Commons license badge
- No social icons (removed for cleaner look)

## Home Layout

The homepage (`home.html`) renders:

1. Avatar
2. Name (`.home-name`)
3. Bio (`.home-bio`)
4. Introduction paragraphs (`.home-para`)
5. Social links (`.home-find-me`)
6. Recent posts sections

## Content Source Actions

Buttons for viewing/editing source:

- **View Source**: Link to GitHub blob
- **Edit**: Link to GitHub edit
- **Raw**: Link to raw markdown

## Shortcodes

Custom shortcodes in `layouts/shortcodes/`:

- `float.html` - Float images
- Various content embeds
