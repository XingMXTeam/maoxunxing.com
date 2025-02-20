# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2024-02-20

### Fixed
- Fixed Twitter card image not displaying correctly by:
  - Added proper URL construction for multi-language support using `$.Site.BaseURL` and `$.Site.LanguagePrefix`
  - Fixed image path handling for `images` and `hero_image` parameters in `layouts/partials/twitter-card.html`

## [1.0.0] - Initial Release 