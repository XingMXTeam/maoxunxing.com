---
title: "如何写一个装饰器"
date: 2021-10-21T19:17:54+08:00
draft: true
tags:
- ES6
description: "装饰器看着高大上，其实是一个很简单的东西"
---

## 基本原理

> 本质上是一个高阶组件。结合babel插件进行编译。

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
