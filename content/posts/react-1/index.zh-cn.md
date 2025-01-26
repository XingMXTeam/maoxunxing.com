---
title: "React #1期：Suspense"
description: "Why Suspense ?"
date: 2024-07-28
tags:
  - React
images:
  - react-1/a.png
---

## 设计初衷

React.Suspense 是专为处理异步组件而设计的，例如使用 React.lazy 进行code-splitting ( React 16.6 中）、使用 concurrent features 获取数据（ React 18 中) ，或与 Relay 等库集成以实现异步数据加载。

- 它提供了一种声明式方法，可在等待组件加载时显示 fallback UI（如Spinner）。需要注意： **只有使用 `use()` 的数据源才会生效**
- 可以在 **服务端渲染** 中发挥巨大作用，相当于 组件渲染的 异常捕获。

例子:  

```jsx
import React, { Suspense, lazy } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

const SuspenseWithLazyLoading = () => (
    <Suspense fallback={<div className="spinner">Loading component...</div>}>
        <LazyComponent />
    </Suspense>
);

export default SuspenseWithLazyLoading;

```

`useState` and `setLoading` 更多的是为了解决异步数据时状态的问题。

- Suspense可以以声明式的方式解决类似问题，**代码更简单**， 而且 **不会触发额外的刷新**。
- Suspense当请求足够快的时候， 可以略过 `loading` 状态的展示
- Suspense支持嵌套使用
- Suspense相当于是React组件的try...catch...

## 版本

`>= React 18`
