---
title: "实现自动曝光功能"
description: "MutationObserver 和 IntersectionObserver的使用"
date: 2024-09-10
tags:
  - Web
images:
  - web-1/a.jpeg
---

本文档详细介绍了如何使用 `MutationObserver` 和 `IntersectionObserver` 实现对目标元素的曝光检测，并提供了完整的代码示例。适合需要监控 DOM 变化和元素可视状态的开发者。

---

## 目录

1. [实现方法](#实现方法)
   - [MutationObserver](#mutationobserver)
   - [IntersectionObserver](#intersectionobserver)
2. [代码实现](#代码实现)
3. [总结与扩展](#总结与扩展)

---

## 实现方法

### MutationObserver

- **用途**：监视 DOM 树的变化。
- **功能**：
  - 检测元素的添加、删除、属性变化等。
- **在我们的代码中**：
  - 用于检测新的目标元素何时被添加到 DOM 中。
  - 当新元素被添加时，将其注册到 `IntersectionObserver` 中以监控其曝光状态。

> **补充说明**：`MutationObserver` 是一个强大的工具，可以高效地监听 DOM 的动态变化，而不会对性能造成显著影响。

---

### IntersectionObserver

- **用途**：监视元素与视口（或指定根元素）的交叉状态。
- **功能**：
  - 检测元素是否进入或离开视口。
- **在我们的代码中**：
  - 用于检测目标元素何时进入视口（即曝光）。
  - 当元素进入视口后，触发回调函数并停止对该元素的观察。

> **补充说明**：`IntersectionObserver` 是一种轻量级的方式，能够避免频繁的滚动事件监听，从而提高性能。

---

## 代码实现

以下是一个完整的实现代码，展示了如何结合 `MutationObserver` 和 `IntersectionObserver` 来检测目标元素的曝光状态。

```js
// Throttle 函数
function throttle(func, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = new Date().getTime();
    if (now - lastCall < delay) return;
    lastCall = now;
    return func(...args);
  };
}

/**
 * 监听目标元素的曝光状态
 * @param {string} targetElement - 目标元素的选择器
 * @param {Function} callback - 曝光时的回调函数
 */
function observeElementExposure(targetElement, callback) {
  // 创建一个带有 throttle 的回调函数
  const throttledCallback = throttle(callback, 500);

  // 创建一个 IntersectionObserver 实例
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { // 进入可视窗口
        throttledCallback(entry.target);
        observer.unobserve(entry.target); // 停止观察已曝光的元素
      }
    });
  });

  // 创建一个 MutationObserver 实例
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.matches(targetElement)) {
            observer.observe(node); // 开始观察新增的目标元素
          }
        });
      }
    });
  });

  // 开始观察 DOM 变化
  mutationObserver.observe(document.body, { childList: true, subtree: true });
}

// 使用示例
observeElementExposure('.target-div', (element) => {
  console.log('目标 div 已曝光:', element);
});
```

---

## 总结与扩展

### 总结
- **核心工具**：
  - `MutationObserver`：用于动态监听 DOM 变化。
  - `IntersectionObserver`：用于检测元素是否进入视口。
- **优势**：
  - 高效且轻量，避免了传统滚动事件监听的性能问题。
  - 支持动态加载的内容（如懒加载图片、异步渲染的组件）。

### 扩展建议
1. **性能优化**：
   - 在大规模 DOM 场景下，可以通过限制 `MutationObserver` 的观察范围（如指定子树）来进一步提升性能。
2. **多场景适配**：
   - 结合实际需求，支持更多复杂的曝光逻辑，例如多次曝光统计、特定区域曝光检测等。
3. **兼容性处理**：
   - 对于不支持 `IntersectionObserver` 的浏览器，可以使用 polyfill 或降级方案（如监听滚动事件）。