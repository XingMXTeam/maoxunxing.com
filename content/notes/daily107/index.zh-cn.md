---
title: "图标"
date: 2019-11-25
tags:
  - Web Development
  - Icons
  - HTML
  - Mobile Web
---
## 提供出色的图标

当用户访问您的网页时，浏览器会尝试从 HTML 提取图标。图标可能出现在许多地方，包括浏览器标签、最近的应用切换、新的（或最近访问的）标签页面等

比如添加到主屏幕 （its Home screen icon (or the Web Clip icon), and its startup image）

```
<!-- icon in the highest resolution we need it for -->
<link rel="icon" sizes="192x192" href="icon.png">

<!-- reuse same icon for Safari -->
<link rel="apple-touch-icon" href="ios-icon.png">

<!-- multiple icons for IE -->
<meta name="msapplication-square310x310logo" content="icon_largetile.png">

```

twitter:

<link rel="icon" sizes="192x192" href="https://abs.twimg.com/responsive-web/web/ltr/icon-default.882fa4ccf6539401.png">

alipress:
<link rel="shortcut icon" href="/img/logo/favicon.ico">

taobao:
<link href="//gw.alicdn.com/tps/i2/TB1nmqyFFXXXXcQbFXXE5jB3XXX-114-114.png" rel="apple-touch-icon-precomposed"> 这个是ios7的情况下会加一个gloss effect 不过现在已经不加了
<link href="//gw.alicdn.com/tps/i2/TB1nmqyFFXXXXcQbFXXE5jB3XXX-114-114.png" rel="Shortcut Icon" type="image/x-icon">

Favicons.ico不推荐

192
114

## 定义浏览器元素的颜色

### Chrome 和 Opera 的元主题背景色

```
<!-- Chrome, Firefox OS and Opera -->
<meta name="theme-color" content="#4285f4">
```

地址栏颜色：
![](index_files/7f233d96-08f1-4665-a852-2594d2d0a2e7.jpg)

## 设置启动图片

### Safari

```
<link rel="apple-touch-startup-image" href="icon.png">
```
