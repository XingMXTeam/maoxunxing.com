---
title: "GitHunt: GitHub Trending Project Discovery Tool"
date: 2026-04-13
draft: true
tags: [Tools, GitHub, Open Source, Chrome Extension]
source: "https://kamranahmed.info/githunt"
---

GitHunt is a React app + Chrome extension for browsing the most starred projects on GitHub. Created by Kamran Ahmed (the creator of roadmap.sh).

## Key Facts

| Item | Details |
|------|---------|
| Author | Kamran Ahmed (@kamranahmedse) |
| Live URL | https://kamranahmed.info/githunt |
| GitHub Repo | https://github.com/kamranahmedse/githunt |
| Chrome Extension | https://bit.ly/githunt-chrome |
| Tech Stack | JavaScript (82.1%), CSS (17.2%), HTML (0.7%), React |
| License | MIT |
| Contributors | 21 |

## Features

- **Browse by time period** -- View weekly top projects, paginate through historical weeks
- **Language filter** -- Filter by programming language via dropdown
- **List / Grid view** -- Two display modes
- **Remember language preference** -- Persists last selected language
- **GitHub Token** -- Add token to avoid API rate limiting
- **Chrome new tab** -- Extension replaces Chrome new tab with trending projects

## Repository Card Content

Each card displays:
- Repository name and author
- Project description
- Programming language
- Star count (links to stargazers)
- Fork count (links to network)
- Issue count (links to issues)
- Creator info
- Creation/push date

## Use Cases

- Discover new trending open-source projects
- Track trending repos in a specific language
- Better alternative to GitHub Trending page (with filtering and historical browsing)
- Chrome new tab page to stay on top of open-source activity

## Project Structure

```
githunt/
├── .github/       # GitHub workflows & assets
├── public/        # Static assets
├── src/           # React source code
├── package.json   # Dependencies
├── yarn.lock
├── license.md     # MIT
└── readme.md
```

## Notes

- 8+ year old project with stable core functionality
- Active community contributions (21 contributors, 197 commits)
- Author Kamran Ahmed also maintains roadmap.sh and other notable open-source projects
