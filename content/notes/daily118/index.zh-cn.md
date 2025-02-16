---
title: "React事件深入研究"
date: 2019-11-25
---

在 React 中，事件处理与原生 DOM 事件处理有一些不同之处。以下是关于 React 事件的基本用法和注意事项。

## 1. 事件名是驼峰命名

React 的事件名采用 **驼峰命名法**，例如 `onClick`、`onMouseOver` 等，而不是原生 HTML 的小写形式（如 `onclick`）。

---

## 2. 传递函数作为事件处理程序

在 JSX 文件中，事件处理函数需要传递一个函数引用，而不是字符串。以下是一个简单的示例：

```jsx
import React, { Component } from 'react';

class Hello extends Component {
  clickHandler(e) {
    e.preventDefault();
    console.log("The link was clicked.");
  }

  render() {
    return (
      <div>
        <button onClick={this.clickHandler}>点我</button>
      </div>
    );
  }
}

export default Hello;
```

---

## 3. 阻止默认行为

在 React 中，阻止默认行为需要调用 `e.preventDefault()`，不能通过 `return false` 来实现。

---

## 4. 合成事件对象

React 的事件对象 `e` 是一个 **合成事件对象**，它封装了原生事件对象，并提供了跨浏览器的一致性支持。

### 合成事件对象的属性

以下是合成事件对象的主要属性：

```javascript
boolean bubbles;                // 是否冒泡
boolean cancelable;             // 是否可以取消默认行为
DOMEventTarget currentTarget;   // 当前事件处理程序绑定的 DOM 元素
boolean defaultPrevented;       // 默认行为是否已被阻止
number eventPhase;              // 事件传播阶段
boolean isTrusted;              // 事件是否由用户触发
DOMEvent nativeEvent;           // 原生事件对象
void preventDefault();          // 阻止默认行为
boolean isDefaultPrevented();   // 判断默认行为是否被阻止
void stopPropagation();         // 阻止事件冒泡
boolean isPropagationStopped(); // 判断事件冒泡是否被阻止
DOMEventTarget target;          // 触发事件的原始 DOM 元素
number timeStamp;               // 事件发生的时间戳
string type;                    // 事件类型
```

---

## 5. 处理 `this` 指向问题

在类组件中，事件处理函数的 `this` 默认指向 `undefined`。如果需要让 `this` 指向当前组件实例，可以使用以下几种方法：

### 方法 1：使用 `bind` 绑定 `this`

```jsx
<button onClick={this.clickHandler.bind(this)}>点我</button>
```

### 方法 2：使用箭头函数定义事件处理函数

```jsx
clickHandler = (e) => {
  e.preventDefault();
  console.log("The link was clicked.");
}
```

### 方法 3：在 JSX 中使用箭头函数

```jsx
<button onClick={(e) => this.clickHandler(e)}>点我</button>
```

---

## 6. 传递参数给事件处理函数

如果需要向事件处理函数传递额外参数（如 ID），可以使用以下两种方式：

### 方式 1：使用箭头函数

```jsx
<button onClick={(e) => this.clickHandler(this.id, e)}>Delete Row</button>
```

### 方式 2：使用 `bind`

```jsx
<button onClick={this.clickHandler.bind(this, this.id)}>Delete Row</button>
```

---

## 7. 异步访问合成事件对象

由于 React 出于性能考虑，在事件处理函数结束后会将合成事件对象的所有属性置为 `null`，因此无法通过异步方式直接访问这些属性。

### 示例问题

```jsx
clickHandler(id, e) {
  e.preventDefault();
  console.log("The link was clicked.");
  console.log(id);
  setTimeout(function() {
    console.log(e.bubbles); // 输出 null
  }, 0);
}
```

### 解决方案：调用 `e.persist()`

通过调用 `e.persist()`，可以保留合成事件对象的属性值，使其在异步代码中可用。

```jsx
clickHandler(id, e) {
  e.preventDefault();
  console.log("The link was clicked.");
  console.log(id);
  e.persist(); // 保留事件对象
  setTimeout(function() {
    console.log(e.bubbles); // 输出 true
  }, 0);
}
```

---

## 8. 支持捕获阶段触发事件

如果需要在捕获阶段触发事件，可以在事件名称后加上 `Capture`，例如：

```jsx
<button onClickCapture={this.clickHandler}>点我</button>
```

这会在事件捕获阶段触发 `clickHandler`，而不是在冒泡阶段。
