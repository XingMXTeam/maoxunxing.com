---
title: "Web #1期：实现自动曝光功能"
description: "MutationObserver 和 IntersectionObserver的使用"
date: 2024-09-10
tags:
  - Web
images:
  - web-1/a.jpeg
---

{{< table_of_contents >}}

## 实现方法

MutationObserver: 
 
用途：监视 DOM 树的变化。  
功能：检测元素的添加、删除、属性变化等。  
在我们的代码中：用于检测新的目标元素何时被添加到 DOM 中。  

IntersectionObserver:

用途：监视元素与视口（或指定根元素）的交叉状态。  
功能：检测元素是否进入或离开视口。  
在我们的代码中：用于检测目标元素何时进入视口（即曝光）。  

## 代码

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

function observeElementExposure(targetElement, callback) {
  // 创建一个带有 throttle 的回调函数
  const throttledCallback = throttle(callback, 500);

  // 创建一个 IntersectionObserver 实例
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { // 进入可视窗口
        throttledCallback(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });

  // 创建一个 MutationObserver 实例
  const mutationObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && node.matches(targetElement)) {
            observer.observe(node);
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