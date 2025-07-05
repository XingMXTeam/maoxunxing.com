---
title: "react-lazyload Code Reading Summary"
date: 2019-11-25
tags:
  - React
---

## **1. Function Throttling**

- **Problem Background**
- In events such as `resize` and `mousemove`, normal operations can trigger bound events multiple times in a short period.
- If the event involves DOM operations, it can trigger a large number of computations, leading to slow page response, lag, or even crashes (e.g., in IE browsers).  

- **Solution**  
  - Use function throttling to limit the event trigger frequency and optimize performance.

- **Reference Links**  
  - [AlloyTeam: JavaScript Throttling](http://www.alloyteam.com/2012/11/javascript-throttle/)  
  - [CSS-Tricks: Throttling vs. Debouncing](https://css-tricks.com/the-difference-between-throttling-and-debouncing/)  
  - [bblog Issue #7](https://github.com/lishengzxc/bblog/issues/7) 

---

## **2. The Difference Between `offsetWidth` and `width`**

- **Core Concepts**  
  - `offsetWidth`: Returns the width of the box model (including content, padding, and borders).  
  - `width`: Typically refers to the width in CSS styles, which may not include padding and borders.  

- **Reference Links**  
  - [MDN: HTMLElement.offsetWidth](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/offsetWidth)  

---

## **3. Usage of `getClientRects`**

- **Function Description**
- Returns a collection of rectangular regions for the element.
- If the element is an `inline-box` model and wraps to multiple lines, it returns multiple rectangular regions (e.g., two lines return two offset arrays, three lines return three).
- Block-level elements return only one rectangular region.

- **Reference Links**  
  - [Zhang Xinxu: CSSOM View Mode Related Summary](http://www.zhangxinxu.com/wordpress/2011/09/cssom%E8%A7%86%E5%9B%BE%E6%A8%A1%E5%BC%8Fcssom-view-module%E7%9B%B8% E5%85%B3%E6%95%B4%E7%90%86%E4%B8%8E%E4%BB%8B%E7%BB%8D/)  

---

## **4. Use `prop-types` instead of `React.PropTypes`**

- **Background**  
  - Starting with React 15.5, `React.PropTypes` has been deprecated, and it is recommended to use the standalone `prop-types` package.  

- **Implementation**  
  ```javascript
  import PropTypes from ‘prop-types’;

  MyComponent.propTypes = {
    name: PropTypes.string.isRequired,
    age: PropTypes.number
  };


## **5. `getBoundingClientRect` may throw an error in IE10**

- **Problem Description**  
  - Calling `getBoundingClientRect` in IE10 may throw an error.  

- **Solution**  
  - Use `try...catch` to handle exceptions and ensure code robustness.  

- **Reference Links**  
  - [C3.js Issue #1056](https://github.com/c3js/c3/issues/1056)  

---

## **6. Differences between `document.documentElement`, `node.ownerDocument`, and `document`**

- **Core Concepts**  
  - **`document.documentElement`**
- Read-only property that returns the root element of the HTML document (i.e., the `<html>` element).  
  - **`document`**  
    - The document object, which is part of the `window` object (e.g., `window.document`).  
  - **`node.ownerDocument`**
- Returns the top-level document object to which the current node belongs.  
      - Typically `document`, but if the node is located within an iframe, it may be `iframe.contentWindow.document` or another document (such as an XML document).

- **Reference Links**  
  - [MDN: Document.documentElement](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/documentElement)  
  - [Stack Overflow: Use cases for node.ownerDocument](https://stackoverflow.com/questions/9845043/when-node-ownerdocument-is-not-window-document)  

---

## **Summary**

- **Key Points**  
  - Function throttling and debouncing are important techniques for optimizing high-frequency events.  
  - Understanding DOM properties (such as `offsetWidth` and `getClientRect`) can help you manipulate page elements more efficiently.  
  - Use modern tools (such as `prop-types`) to replace deprecated features, ensuring code compatibility and maintainability.  
  - Be mindful of browser compatibility issues (e.g., `getBoundingClientRect` behaves abnormally in IE10) and implement appropriate error-handling mechanisms.

> **Recommendation**: Deepen your understanding of the above concepts and apply them in real-world projects to enhance your front-end development skills.