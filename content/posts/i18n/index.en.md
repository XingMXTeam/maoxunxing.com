---
title: "Internationalization and Localization"
date: 2025-02-06
tags:
  - i18n
images:
  - i18n/cover.png
---
Internationalization (i18n) and localization (l10n) are indispensable parts of modern front-end development, especially in the context of globalization. This article will discuss **core issues of internationalization**, **the use of CLDR**, **handling RTL layouts**, and **the value of the front end**, providing detailed explanations and code examples.
---
## Table of Contents
1. [Foreword](#foreword)
2. [Core Issues of Internationalization](#core-issues-of-internationalization)
   - [Multi-language Support](#multi-language-support)
   - [CLDR Data](#cldr-data)
3. [Handling RTL Layouts](#handling-rtl-layouts)
4. [The Value of the Front End](#the-value-of-the-front-end)
5. [Appendix](#appendix)
---
## Foreword
Internationalization (i18n) refers to enabling an application's global capabilities at a technical level, while localization (l10n) is about providing customized services for specific regions or language environments. Internationalization involves several core issues, including multi-language support, the use of CLDR data, handling RTL layouts for the Middle East, and global monitoring and optimization.
---
## Core Issues of Internationalization
### Multi-language Support
Multi-language support is the foundation of internationalization and mainly includes the following:
- **Text Translation**: Managing text for different languages through resource files (like JSON or PO files).
- **Dynamic Loading**: Dynamically loading corresponding resource files based on the user's language environment.
- **Placeholder Handling**: Supporting text formatting with dynamically inserted variables, for example, `Hello, {name}`.
### CLDR Data
CLDR (Common Locale Data Repository) is a standardized set of locale data provided by Unicode, used to support the localized display of dates, times, numbers, currencies, etc.
#### Common Uses
- **Date and Time Formatting**: Displaying date and time formats that conform to local customs based on different regions.
- **Number and Currency Formatting**: Supporting localization for thousand separators, decimal point symbols, currency symbols, etc.
- **Collation Rules**: Providing correct string sorting methods according to the language environment.
#### Example Resources
- [ICU User Guide](https://unicode-org.github.io/icu/userguide/datetime/)
- [node-cldr](https://www.npmjs.com/package/cldr)
---
## Handling RTL Layouts
RTL (Right-to-Left) layout is a text direction commonly used in Middle Eastern regions (such as for Arabic, Hebrew). When handling RTL layouts, the following points need attention:
### Detecting RTL
You can determine if the current document is RTL in the following way:
```javascript
const isRTL = document.dir === 'rtl';
```
### Setting RTL Layout
You need to manually set the `direction` property of elements to `rtl` to adjust the text direction:
```css
body {
  direction: rtl;
}
```
### Style Adjustments
- **Spacing Handling**: Change left spacing (like `padding-left` and `margin-left`) to right spacing (like `padding-right` and `margin-right`).
- **Absolute Positioning**: Absolutely positioned elements will not automatically adjust their position; you need to manually change `left` to `right`.
- **Image Direction**: Images do not flip automatically and need to be adjusted manually as required.
#### Notes
- Arabic text will automatically align to the right, but the position of absolutely positioned elements will not change.
- The direction of images and other non-text content will not adjust automatically and requires extra handling.
---
## The Value of the Front End
The value of front-end development in internationalization and localization is mainly reflected in the following two aspects:
### 1. UI Component Libraries
Complex back-office UI component libraries are highly valuable, especially those designed for internationalization. These components can be produced and reused independently, improving development efficiency.
#### Characteristics of Internationalized Components
- Support for multi-language switching.
- Compatibility with RTL layouts.
- Provide localized formatting for dates, times, numbers, etc.
### 2. Engineering Atomic Capabilities
Engineering atomic capabilities are an important foundation for front-end development, for example:
- **npm2umd**: Converting NPM packages to UMD format for direct use in a browser environment.
- **Build Tools**: Supporting the packaging and dynamic loading of multi-language resources.
- **Performance Optimization**: Improving the performance of internationalized applications through code splitting and lazy loading.
---
## Appendix
### CLDR Resources
- [ICU User Guide](https://unicode-org.github.io/icu/userguide/datetime/)
- [node-cldr](https://www.npmjs.com/package/cldr)
### RTL Example Code
Here is a simple RTL layout example:
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <style>
    body {
      direction: rtl;
      text-align: right;
    }
    .box {
      padding-right: 20px;
      margin-right: 10px;
    }
  </style>
</head>
<body>
  <div class="box">مرحبًا بالعالم</div>
</body>
</html>
```
### Performance Analysis of Internationalization
For international sites, the local TTFB during performance testing is inaccurate because the local environment is in China and cannot simulate foreign environments like the United States. It is necessary to look at reports.
### Regional Routing
The regional routing of an account has a higher priority than that of an IP proxy.
After logging in, regional routing will be based on the account (usually the country in the cookie). Using only an IP proxy may not reach the pre-production environment. It is recommended to log out.
