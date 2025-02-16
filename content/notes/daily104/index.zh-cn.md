---
title: "react-lazyload代码阅读总结"
date: 2019-11-25
tags:
  - React
  - JavaScript
  - Performance
  - Code Analysis
---

## **1. 函数节流（Throttling）**

- **问题背景**  
  - 在事件如 `resize` 和 `mousemove` 中，正常操作会短时间内触发多次绑定事件。  
  - 如果事件中涉及 DOM 操作，会引发大量计算，导致页面响应慢、卡顿，甚至崩溃（例如 IE 浏览器）。  

- **解决方案**  
  - 使用函数节流（Throttling）限制事件触发频率，优化性能。  

- **参考链接**  
  - [AlloyTeam: JavaScript 节流](http://www.alloyteam.com/2012/11/javascript-throttle/)  
  - [CSS-Tricks: 节流与防抖的区别](https://css-tricks.com/the-difference-between-throttling-and-debouncing/)  
  - [bblog Issue #7](https://github.com/lishengzxc/bblog/issues/7)  

---

## **2. `offsetWidth` 和 `width` 的区别**

- **核心概念**  
  - `offsetWidth`：返回盒模型的宽度（包括内容、内边距和边框）。  
  - `width`：通常指 CSS 样式中的宽度，可能不包含内边距和边框。  

- **参考链接**  
  - [MDN: HTMLElement.offsetWidth](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/offsetWidth)  

---

## **3. `getClientRects` 的用法**

- **功能描述**  
  - 返回元素的矩形区域集合。  
  - 如果元素是 `inline-box` 模型且换行了，会返回多个矩形区域（例如两行返回两个偏移数组，三行返回三个）。  
  - 块状元素则只返回一个矩形区域。  

- **参考链接**  
  - [张鑫旭: CSSOM 视图模式相关整理](http://www.zhangxinxu.com/wordpress/2011/09/cssom%E8%A7%86%E5%9B%BE%E6%A8%A1%E5%BC%8Fcssom-view-module%E7%9B%B8%E5%85%B3%E6%95%B4%E7%90%86%E4%B8%8E%E4%BB%8B%E7%BB%8D/)  

---

## **4. 使用 `prop-types` 替代 `React.PropTypes`**

- **背景**  
  - React 15.5 版本后，`React.PropTypes` 已被废弃，推荐使用独立的 `prop-types` 包。  

- **实现方式**  
  ```javascript
  import PropTypes from 'prop-types';

  MyComponent.propTypes = {
    name: PropTypes.string.isRequired,
    age: PropTypes.number
  };


## **5. `getBoundingClientRect` 在 IE10 下可能报错**

- **问题描述**  
  - 在 IE10 中调用 `getBoundingClientRect` 可能会抛出错误。  

- **解决方案**  
  - 使用 `try...catch` 处理异常，确保代码健壮性。  

- **参考链接**  
  - [C3.js Issue #1056](https://github.com/c3js/c3/issues/1056)  

---

## **6. `document.documentElement`、`node.ownerDocument` 和 `document` 的区别**

- **核心概念**  
  - **`document.documentElement`**  
    - 只读属性，返回 HTML 文档的根元素（即 `<html>` 元素）。  
  - **`document`**  
    - 文档对象，属于 `window` 对象的一部分（如 `window.document`）。  
  - **`node.ownerDocument`**  
    - 返回当前节点所属的顶层文档对象。  
      - 通常为 `document`，但如果节点位于 iframe 中，则可能是 `iframe.contentWindow.document` 或其他文档（如 XML 文档）。  

- **参考链接**  
  - [MDN: Document.documentElement](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/documentElement)  
  - [Stack Overflow: node.ownerDocument 的使用场景](https://stackoverflow.com/questions/9845043/when-node-ownerdocument-is-not-window-document)  

---

## **总结**

- **关键点**  
  - 函数节流和防抖是优化高频事件的重要手段。  
  - 理解 DOM 属性（如 `offsetWidth` 和 `getClientRects`）有助于更高效地操作页面元素。  
  - 使用现代工具（如 `prop-types`）替代已废弃的功能，保持代码的兼容性和可维护性。  
  - 注意浏览器兼容性问题（如 `getBoundingClientRect` 在 IE10 下的异常），并采用适当的容错机制。  

> **建议**：深入学习上述知识点，并结合实际项目进行实践，提升前端开发能力。