# Tech Stack

## Core Framework

- **Hugo**: Static site generator (extended version)
- **Theme**: hugo-coder (with extensive customizations)

## Frontend

- **Fonts**: Inter (sans-serif), DM Mono (monospace)
- **CSS**: Custom CSS overrides in `static/css/main.css`
- **JavaScript**: Vanilla JS for interactions (lightbox, theme toggle)
- **Icons**: Font Awesome

## Build Tools

- **Node.js**: v14+ (for scripts)
- **npm**: Package management

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `hugo-algolia` | Algolia search indexing |
| `algoliasearch` | Search client |
| `sharp` | Image processing |
| `canvas` | OG image generation |
| `puppeteer` | Screenshot/testing |
| `prettier` | Code formatting |

## Search

- **Algolia**: Full-text search with autocomplete
- Index: `my-blog-index`
- App ID: `D7NQ3RODEC`

## Deployment

- **Firebase Hosting**: Primary deployment
- **GitHub Actions**: CI/CD pipeline
- Scripts in `.github/workflows/`

## Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Hugo server |
| `npm run format` | Format code with Prettier |
| `npm run og` | Generate OG images |
| `npm run cover` | Generate cover images |
