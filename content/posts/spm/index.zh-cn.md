---
title: "前端埋点指南"
date: 2024-12-09
description: ""
tags:
  - Web开发
  - 埋点
custom_toc:
  - title: "SPM 埋点"
  - title: "自动曝光"
---


## SPM 埋点

SPM（Super Position Model）是一种用于追踪用户行为和来源的埋点模型，广泛应用于数据分析、流量来源追踪以及用户行为分析。通过 SPM 参数，可以精准识别用户的来源场域、曝光位置信息以及会话或操作的唯一标识。

---

## SPM 参数说明

### spm-url
- **作用**  
  `spm-url` 用于识别用户的来源场域，即用户是从哪个页面或渠道进入当前页面的。
- **应用场景**  
  例如，用户从搜索引擎、广告链接或内部推荐位跳转到目标页面时，`spm-url` 可以记录具体的来源信息。

### spm-cnt
- **作用**  
  `spm-cnt` 用于识别曝光位置信息，通常表示某个内容或模块在页面中的具体位置。
- **特点**  
  如果发生页面跳转，`spm-cnt` 会自动携带到目标页面的 URL 中，从而实现跨页面的曝光追踪。
- **示例**  
  在商品详情页中，`spm-cnt` 可以标记某个推荐商品的具体位置（如第 3 行第 2 列）。

### pageid
- **作用**  
  `pageid` 是每次会话或操作的唯一标识符，用于区分不同的用户行为或会话。
- **生成规则**  
  每次会话甚至每次操作都建议生成一个新的 `pageid`，以确保数据的精确性和可追溯性。
- **应用场景**  
  例如，在用户点击某个按钮或完成某个操作时，生成一个新的 `pageid`，便于后续分析。

---

## 埋点案例

以下是一个典型的 SPM 埋点案例：

### 场景描述
假设用户从首页的推荐位点击进入商品详情页，并在详情页中完成了购买操作。

### 埋点实现
1. **首页推荐位点击**
   - 用户点击首页的某个推荐商品。
   - 埋点参数：
     ```javascript
     spm-url: "home.recommend" // 来源场域：首页推荐位
     spm-cnt: "item_001"       // 曝光位置：推荐位第 1 个商品
     pageid: "1234567890abcdef" // 当前操作的唯一标识
     ```

2. **跳转到商品详情页**
   - 用户跳转到商品详情页后，`spm-cnt` 自动携带到 URL 中。
   - 商品详情页 URL 示例：
     ```
     https://example.com/product?id=123&spm-url=home.recommend&spm-cnt=item_001&pageid=1234567890abcdef
     ```

3. **完成购买操作**
   - 用户在商品详情页完成购买操作。
   - 埋点参数：
     ```javascript
     spm-url: "home.recommend" // 来源场域：首页推荐位
     spm-cnt: "item_001"       // 曝光位置：推荐位第 1 个商品
     pageid: "abcdef1234567890" // 新的操作唯一标识
     action: "purchase"        // 用户行为：购买
     ```

### 数据分析
通过上述埋点，可以分析以下信息：
- 用户从哪个页面或推荐位进入商品详情页。
- 具体是哪个推荐位的商品被点击。
- 用户是否完成了购买操作。


---

## 自动曝光

### MutationObserver

- **用途**：监视 DOM 树的变化。
- **功能**：
  - 检测元素的添加、删除、属性变化等。
- **在我们的代码中**：
  - 用于检测新的目标元素何时被添加到 DOM 中。
  - 当新元素被添加时，将其注册到 `IntersectionObserver` 中以监控其曝光状态。

> **补充说明**：`MutationObserver` 是一个强大的工具，可以高效地监听 DOM 的动态变化，而不会对性能造成显著影响。

### IntersectionObserver

- **用途**：监视元素与视口（或指定根元素）的交叉状态。
- **功能**：
  - 检测元素是否进入或离开视口。
- **在我们的代码中**：
  - 用于检测目标元素何时进入视口（即曝光）。
  - 当元素进入视口后，触发回调函数并停止对该元素的观察。

> **补充说明**：`IntersectionObserver` 是一种轻量级的方式，能够避免频繁的滚动事件监听，从而提高性能。


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