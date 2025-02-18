---
title: "Class 类中 `this` 的使用问题"
date: 2022-01-24T13:15:59+08:00
---

# Class 类中 `this` 的使用问题

在 JavaScript 中，`class` 类的成员函数中的 `this` 指向可能会因为调用方式的不同而发生变化。本文将详细说明在类中通过成员函数内部定义函数时，`this` 的指向问题，并提供解决方案。

---

## 目录

1. [背景与问题](#背景与问题)
2. [问题分析](#问题分析)
3. [解决方案](#解决方案)
   - [箭头函数绑定 `this`](#箭头函数绑定-this)
   - [显式绑定 `this`](#显式绑定-this)
4. [代码示例](#代码示例)
5. [总结](#总结)

---

## 背景与问题

在 JavaScript 的 `class` 类中，`this` 的指向是一个常见的问题。尤其是在将类的成员函数作为回调函数传递时，`this` 可能会丢失其原本的上下文，导致运行时错误。

以下是一个典型的例子：

```js
function test(fn) {
  fn();
}

class A {
  a = 123;

  fnB() {
    console.log(this.a); // 这里的 this 是 undefined
  }

  fnA() {
    test(this.fnB); // 错误的用法
  }
}
```

在上述代码中，`fnB` 方法中的 `this` 在调用时变成了 `undefined`，这是因为 `this` 的上下文在传递过程中丢失了。

---

## 问题分析

- **原因**：
  - 在 JavaScript 中，函数的 `this` 是动态绑定的，取决于函数的调用方式。
  - 当 `this.fnB` 被作为参数传递给 `test` 函数时，`fnB` 的调用方式变为普通函数调用（而非方法调用），此时 `this` 不再指向类实例，而是变成 `undefined`（在严格模式下）。

- **影响**：
  - 如果类的成员函数依赖于 `this` 访问实例属性或方法，则会导致运行时错误。

---

## 解决方案

### 箭头函数绑定 `this`

箭头函数不会创建自己的 `this`，而是继承外层作用域的 `this`。因此，可以使用箭头函数来确保 `this` 始终指向类实例。

#### 示例
```js
class A {
  a = 123;

  fnB = () => {
    console.log(this.a); // 硭保 this 指向类实例
  };

  fnA() {
    test(this.fnB); // 正确的用法
  }
}
```

### 显式绑定 `this`

通过 `Function.prototype.bind` 方法显式绑定 `this`，可以确保函数调用时的上下文始终是类实例。

#### 示例
```js
class A {
  a = 123;

  fnB() {
    console.log(this.a); // 硭保 this 指向类实例
  }

  fnA() {
    test(this.fnB.bind(this)); // 使用 bind 绑定 this
  }
}
```

---

## 代码示例

以下是一个完整的示例，展示如何解决 `this` 丢失的问题：

```js
function test(fn) {
  fn();
}

class A {
  a = 123;

  // 使用箭头函数
  fnB = () => {
    console.log('箭头函数:', this.a);
  };

  // 使用显式绑定
  fnC() {
    console.log('显式绑定:', this.a);
  }

  fnA() {
    test(this.fnB); // 箭头函数方式
    test(this.fnC.bind(this)); // 显式绑定方式
  }
}

const instance = new A();
instance.fnA();
// 输出:
// 箭头函数: 123
// 显式绑定: 123
```

---

## 总结

- **问题原因**：在 JavaScript 中，`this` 的指向由函数的调用方式决定。当类的成员函数作为回调函数传递时，`this` 可能会丢失其上下文。
- **解决方案**：
  - 使用箭头函数定义成员函数，确保 `this` 始终指向类实例。
  - 使用 `bind` 方法显式绑定 `this`。
- **建议**：在类中定义需要访问实例属性或方法的函数时，优先使用箭头函数以避免 `this` 丢失的问题。