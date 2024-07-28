---
title: "React Diary #1: Suspense"
description: "how to write prompt"
date: 2024-07-07
tags:
  - React Diary
images:
  - react-1/a.png
---

## Why Design This ?

React.Suspense is specifically designed for handling asynchronous components, like code-splitting with React.lazy （React 16.6), data fetching with concurrent features (React 18), or integrating with libraries like Relay for asynchronous data loading.

It provides a declarative way to show a fallback UI (like a spinner) while waiting for the component to load. Note: **Only the data source of using `use()` will take effect**

It can play a huge role in **server-side rendering**, equivalent to exception catching for component rendering.

Example:  

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

`useState` and `setLoading` are more for solving the problem of state in case of asynchronous data.

- Suspense can solve a similar problem in a declarative way, **the code is simpler**, and **it doesn't trigger additional refreshes**.
- Suspense support nesting

## Version

`>= React 18`
