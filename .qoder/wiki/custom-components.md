# Custom Components

## Homepage Prose Style

The homepage uses a prose-style layout defined in `layouts/partials/home.html`:

- **Container**: `.home-prose` with `max-width: 65ch`
- **Name**: `.home-name` - 36px, weight 800
- **Bio**: `.home-bio` - 16px
- **Paragraphs**: `.home-para` - 15px
- **Social Links**: `.find-me-link` with icons
- **Recent Posts**: Article list with dates

## Projects Page

Located at `content/projects/` with layout in `layouts/projects/`:

- **Container**: `.projects-page` with `max-width: 1100px`
- **Grid**: `.project-grid` with `auto-fill, minmax(280px, 1fr)`
- **Cards**: `.project-card` with hover effect
- **Categories**: Organized by category with background text

## Gallery

Photo gallery with lightbox functionality:

- **Grid**: `.gallery-grid` with `auto-fill, minmax(250px, 1fr)`
- **Items**: `.gallery-item` with hover zoom effect
- **Lightbox**: Full-screen overlay with navigation

## Table of Contents

Fixed TOC on the right side for long articles:

- **Position**: Fixed, right side, top 150px
- **Width**: 200px
- **Visibility**: Hidden on screens < 1280px
- **Active State**: Highlighted with left border

## Content Filter Tabs

Used on homepage for filtering posts:

- **Container**: `.content-filter` with flex layout
- **Buttons**: `.filter-btn` with pill style
- **Active State**: `.active` class changes background

## Notice Boxes

Styled callout boxes:

- `.notice-info` - Blue tint
- `.notice-warning` - Orange tint
- `.notice-danger` - Red tint

## Social Share Buttons

Share buttons for articles:

- Twitter, Facebook, LinkedIn, Hacker News, Reddit, Indie Hackers
- Icons only on mobile, text + icon on desktop

## Subscribe Container

Newsletter signup form:

- Located in `layouts/partials/mailing-list-*.html`
- Styled with subtle border and background
