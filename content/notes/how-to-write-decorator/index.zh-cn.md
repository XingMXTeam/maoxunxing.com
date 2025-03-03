---
title: "ES6 知识"
date: 2021-10-21T19:17:54+08:00
tags:
  - ES6
---

## 如何写一个装饰器

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

## import 

`import * as path from 'path';` 和 `import path from 'path';` 
是两种不同方式导入模块的语法。前者是导出所有的内容。 后者是导出default，因为`path`没有default，所以会报错。
