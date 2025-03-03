---
title: "前端性能优化指南"
date: 2025-02-06
tags:
  - performance
---

## 目录
1. [关键概念](#关键概念)
   - [90 分位数](#90-分位数)
   - [TTFB 和 FCP](#ttfb-和-fcp)
   - [CLS、LCP 与性能指标](#cls-lcp-与性能指标)
2. [最佳实践](#最佳实践)
   - [首屏样式优化](#首屏样式优化)
   - [HTML 压缩与 14KB 法则](#html-压缩与-14kb-法则)
3. [LCP 优化方案](#lcp-优化方案)
4. [案例分析](#案例分析)
   - [图片加载抖动问题](#图片加载抖动问题)
5. [CSS 和 JS 的阻塞性](#css-和-js-的阻塞性)
6. [CSS 异步化与抽取](#css-异步化与抽取)

---

## 关键概念

### 90 分位数

**90 分位数** 是指一组数据中，有 90% 的数据小于或等于该值。在性能优化领域，90 分位数常用于衡量用户体验的核心指标，例如页面加载时间、交互响应时间等。它能够更全面地反映大部分用户的实际体验，而非仅关注平均值。

---

### TTFB 和 FCP

- **TTFB（Time to First Byte）**：从用户发起请求到接收到第一个字节的时间。
- **FCP（First Contentful Paint）**：浏览器首次渲染任何内容（文本、图像等）的时间。

#### 优化目标
- **TTFB 和 FCP 时间差控制在 2000ms 内**。
- 首屏样式应内联，其他非核心 CSS/JS 放到 `<body>` 底部（JS 在 CSS 前），或者使用 `rel="preload"` 加载非阻塞资源：
  ```html
  <link rel="preload" as="style" href="styles.css" onload="this.rel='stylesheet'">
  ```

#### 注意事项
- 将 5KB 的核心 CSS 样式放到 `<head>` 中，但需注意避免因过大导致 FCP 变慢（如增加 800ms）。

---

### CLS、LCP 与性能指标

- **CLS（Cumulative Layout Shift）**：累计布局偏移，衡量页面布局的稳定性。
- **LCP（Largest Contentful Paint）**：最大内容绘制，衡量页面主要内容的加载速度。

#### 关系
- **CLS 对 Good URL 的作用大于 LCP**，因为稳定的布局直接影响用户体验。

---

## 最佳实践

### 首屏样式优化

- **核心样式内联**：将首屏所需的关键 CSS 内联到 HTML 中，确保快速渲染。
- **非核心样式异步加载**：将其他样式放到 `<body>` 底部，或者通过 `preload` 实现非阻塞加载：
  ```html
  <link rel="preload" as="style" href="non-critical.css" onload="this.rel='stylesheet'">
  ```

---

### HTML 压缩与 14KB 法则

- **14KB 法则**：首屏内容应保持在 14KB 以内（压缩后），以确保第一次往返传输的最大数据量不超过限制。
- **原因**：TCP 协议的初始拥塞窗口通常为 10 个 TCP 数据包，每个数据包约 1.4KB，合计约 14KB。

---

## LCP 优化方案

1. **Base64 图片**：将最大的几张图片转为 Base64 编码，避免额外的下载请求。
2. **Preload 图片**：对关键图片使用 `preload` 提前加载：
   ```html
   <link rel="preload" as="image" href="large-image.jpg">
   ```
3. **减少 HTML 体积**：通过压缩 HTML 和减少内联样式来降低页面大小。
4. **React 水合优化**：
   - 确保水合前后元素一致，避免 LCP 元素变化。
   - 避免弹窗（Pop）或其他动态组件导致 LCP 元素被删除。
5. **轮播组件优化**：避免轮播组件频繁删除 DOM 元素，影响 LCP 计算。

---

## 案例分析

### 图片加载抖动问题

#### 问题描述
图片加载完成后出现抖动，原因是字体文件加载导致文字高度变化，进而影响图片布局。

#### 解决方法
- 使用 **Slow 3G** 模拟网络环境，观察字体加载对文字高度的影响。
- 优化字体加载策略，避免字体切换导致的高度变化。

---

## CSS 和 JS 的阻塞性

- **CSS 渲染阻塞**：CSS 文件会阻塞页面的渲染，直到所有样式加载完成。
- **JS 解析阻塞**：非异步 JS 文件会阻塞 HTML 解析，直到脚本执行完毕。

#### 优化建议
- 将非核心 JS 文件标记为 `async` 或 `defer`，避免阻塞 HTML 解析。
- 使用 `preload` 提前加载关键资源。

---

## CSS 异步化与抽取

### CSS 异步化
通过以下方式实现 CSS 的异步加载：
```html
<link rel="preload" as="style" href="styles.css" onload="this.rel='stylesheet'">
```

### CSS 抽取工具
- 使用工具提取关键 CSS：
  - [Critical CSS with Next.js](https://focusreactive.com/critical-css-with-nextjs/)
  - [Web.dev 文章：Extract Critical CSS](https://web.dev/articles/extract-critical-css?hl=zh-cn)

### 参考资料

- [W3C 性能计时入门](https://w3c.github.io/perf-timing-primer/?spm=ata.21736010.0.0.735649fepnL0uD)
- [Web.dev 提取关键 CSS](https://web.dev/articles/extract-critical-css?hl=zh-cn)

##  CSR 和 SSR 架构

csr架构： 采用动静分离，静态部分缓存，动态部分通过csr请求。

csr请求有两种形式一个是二段请求，先请求页面结构框架（也就是html），然后组件里面请求具体的数据。 
这个典型应用是商家工作台。 采用的是这种架构。

详情页面根据商品id走内存缓存，所以接口非常快。但是首页无法做到，因为首页的结构是跟着运营平台变化的。

ssr架构： html走serviceworker缓存，但是页面结构和商品和运营数据会刷新。
