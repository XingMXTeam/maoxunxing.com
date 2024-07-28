---
title: "React日记#1期：Suspense"
description: "Why Suspense ?"
date: 2024-07-28
images:
  - react-1/a.png
---

## 设计初衷

React.Suspense 是专为处理异步组件而设计的，例如使用 React.lazy 进行code-splitting、使用 concurrent features 获取数据，或与 Relay 等库集成以实现异步数据加载。

它提供了一种声明式方法，可在等待组件加载时显示 fallback UI（如Spinner）。

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

`useState` and `setLoading` 更多的是为了解决异步数据时状态的问题。Suspense可以以声明式的方式解决类似问题，**代码更简单**， 而且 **不会触发额外的刷新**。

## 版本

>= React 18

