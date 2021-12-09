---
title: "如何写一个装饰器"
date: 2021-10-21T19:17:54+08:00
draft: true
tags:
- ES6
description: "装饰器看着高大上，其实是一个很简单的东西"
---

## 基本原理

> 本质上是一个高阶组件（参数是函数，返回一个新函数）。结合babel插件进行编译。

``` js

class Provider extends React.Component {
  render() {
    return this.props.children
  }
}

export const DecoratorDemo = props => WrappedComponent => {
  const Wrapped = React.forwardRef(function(innerProps, ref)) {
    return (
      <Provider {...props} innerProps={...innerProps}>
        <WrappedComponent {...innerProps} ref={ref} />
      </Provider>
    )
  }
  // copy static method
  return Object.assign(Wrapped, WrappedComponent)
}

```


## 装饰器的弊端

1 在运行时注入隐藏的代码，给那些期望源代码遵循传统语义的开发者造成混乱。
2 可能难以调试，因为装饰器需要编译
3 可能影响api约定 因为是运行时生成的


