# Deployment

## Platform

- **Hosting**: Firebase Hosting
- **CI/CD**: GitHub Actions
- **Domain**: maoxunxing.com

## Firebase Configuration

- Config in `firebase.json`
- Project settings in `.firebaserc`

## GitHub Actions

Workflows in `.github/workflows/`:

- `firebase-hosting-merge.yml` - Deploy on merge to main
- `firebase-hosting-pull-request.yml` - Preview on PR

## Build Process

1. Hugo builds static site to `public/`
2. Firebase deploys `public/` directory
3. Cache settings configured in `firebase.json`

## Local Development

```bash
# Start Hugo server with live reload
hugo server -D --baseURL http://localhost:1313/

# Build for production
hugo --minify

# Run dev script (includes checks)
npm run dev
```

## Environment Variables

- `ALGOLIA_ADMIN_KEY` - For search indexing (CI/local only, never in config)

## Pre-deployment Checks

1. Run Prettier: `npm run format`
2. Check format: `npm run check-format`
3. Build: `npm run build`
4. Verify build output in `public/`
