---
title: "ES6 知识"
date: 2021-10-21T19:17:54+08:00
tags:
  - ES6
---

## 如何写一个装饰器

装饰器本质上是一个高阶组件（Higher-Order Component, HOC），其参数是一个函数，并返回一个新的函数。结合 Babel 插件进行编译。

### **2. 示例代码**

以下是一个装饰器的实现示例：

```js
class Provider extends React.Component {
  render() {
    return this.props.children;
  }
}

export const DecoratorDemo = (props) => (WrappedComponent) => {
  const Wrapped = React.forwardRef(function (innerProps, ref) {
    return (
      <Provider {...props} innerProps={{ ...innerProps }}>
        <WrappedComponent {...innerProps} ref={ref} />
      </Provider>
    );
  });

  // 复制静态方法
  return Object.assign(Wrapped, WrappedComponent);
};
```

### **3. 装饰器的弊端**

#### **3.1 运行时注入隐藏代码**

- 装饰器在运行时注入隐藏的代码，可能会让那些期望源代码遵循传统语义的开发者感到困惑。

#### **3.2 调试困难**

- 装饰器需要编译后才能运行，因此调试时可能会遇到困难，难以追踪问题的根源。

#### **3.3 影响 API 约定**

- 装饰器是运行时生成的，可能会对 API 的约定产生影响，导致预期之外的行为。

---

## import 

`import * as path from 'path';` 和 `import path from 'path';` 
是两种不同方式导入模块的语法。前者是导出所有的内容。 后者是导出default，因为`path`没有default，所以会报错。

---

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

- 在 JavaScript 中，函数的 `this` 是动态绑定的，取决于函数的调用方式。
  - 当 `this.fnB` 被作为参数传递给 `test` 函数时，`fnB` 的调用方式变为普通函数调用（而非方法调用），此时 `this` 不再指向类实例，而是变成 `undefined`（在严格模式下）。

- 如果类的成员函数依赖于 `this` 访问实例属性或方法，则会导致运行时错误。

### 解决方案

#### 箭头函数绑定 `this`

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

#### 代码示例

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
