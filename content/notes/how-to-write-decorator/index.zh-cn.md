---
title: "ES6 #1: 如何写一个装饰器"
date: 2021-10-21T19:17:54+08:00
tags:
  - ES6
description: "装饰器看着高大上，其实是一个很简单的东西"
---

# 装饰器与高阶组件

---

## **1. 本质**

装饰器本质上是一个高阶组件（Higher-Order Component, HOC），其参数是一个函数，并返回一个新的函数。结合 Babel 插件进行编译。

---

## **2. 示例代码**

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

---

## **3. 装饰器的弊端**

### **3.1 运行时注入隐藏代码**
- 装饰器在运行时注入隐藏的代码，可能会让那些期望源代码遵循传统语义的开发者感到困惑。

### **3.2 调试困难**
- 装饰器需要编译后才能运行，因此调试时可能会遇到困难，难以追踪问题的根源。

### **3.3 影响 API 约定**
- 装饰器是运行时生成的，可能会对 API 的约定产生影响，导致预期之外的行为。

---

## **4. 注意事项**

- 在使用装饰器时，建议充分理解其工作原理，避免因运行时行为与预期不符而导致问题。
- 如果项目中需要频繁使用装饰器，可以考虑通过 Babel 插件（如 `@babel/plugin-proposal-decorators`）来支持装饰器语法。
- 确保团队成员对装饰器的使用有一致的理解，以减少潜在的开发和维护成本。

---