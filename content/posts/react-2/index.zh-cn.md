---
title: "Concurrent Mode并发模式"
description: "并发模式的历史、解决的问题是什么？"
date: 2024-07-30
tags:
  - React
images:
  - react-1/a.png
---

## 目录

1. [设计初衷](#设计初衷)
2. [关键概念与优势](#关键概念与优势)
   - [时间切片（Time Slicing）](#时间切片)
   - [优先级调度（Priority Scheduling）](#优先级调度)
   - [暂停、恢复和丢弃渲染](#暂停恢复和丢弃渲染)
   - [Suspense](#suspense)
   - [自动批量更新（Automatic Batching of Updates）](#自动批量更新)
3. [如何开启 Concurrent Mode](#如何开启-concurrent-mode)
4. [核心 API 详解](#核心-api-详解)
   - [useTransition](#usetransition)
   - [useDeferredValue](#usedeferredvalue)
   - [useSyncExternalStore](#usesyncexternalstore)
5. [版本要求](#版本要求)

---

## 设计初衷

**Concurrent Mode** 是 React 框架的一种新特性，旨在提高 React 应用的响应速度和用户体验。它通过允许 React 同时处理多个任务，而不是按顺序完成每个任务，从而提升性能和交互流畅性。

---

## 关键概念与优势

### 时间切片（Time Slicing）

**时间切片** 是指 React 在处理某个任务时，可以随时暂停并切换到其他更高优先级的任务。这种机制被称为 **时间切片**，可以防止长时间任务阻塞主线程，确保用户界面的流畅性。

#### 触发场景：
- 复杂的计算或渲染任务。
- 大量 DOM 更新导致主线程被长时间占用。
- 动画和用户交互需要保持流畅时。

---

### 优先级调度（Priority Scheduling）

在 **Concurrent Mode** 中，不同的任务可以分配不同的优先级。例如，用户输入的处理优先级会高于数据加载的优先级。这种调度机制可以使高优先级任务优先得到处理，从而提高用户体验。

#### 触发场景：
- 用户输入（如键盘输入、鼠标点击）需要快速响应。
- 网络请求和数据加载可以延迟处理。
- 组件状态更新和重渲染的优先级可能不同。

#### 示例：
- 如果用户在一个复杂的页面上滚动，同时后台正在进行数据加载，时间切片可以让 React 暂停数据加载的处理，确保滚动操作流畅。
- 如果用户在表单中输入数据，优先级调度会确保输入事件得到快速响应，而后台的数据同步可能被延迟。

---

### 暂停、恢复和丢弃渲染

#### 暂停渲染：
- 用户在一个数据密集型的页面上滚动。React 会暂停数据密集型组件的渲染，以确保滚动操作流畅。

#### 恢复渲染：
- 用户停止滚动，React 在浏览器的空闲时间继续之前被暂停的数据密集型组件的渲染。

#### 丢弃渲染：
- 用户快速切换不同的页面或视图。React 会丢弃那些还未完成的、但已经不再需要的渲染任务，以避免不必要的计算。

---

### Suspense

**Suspense** 是 Concurrent Mode 中的重要特性，允许组件在等待异步数据加载时 "挂起" 渲染，直到数据准备好。这样可以更优雅地处理异步操作，提供更好的用户体验。

---

### 自动批量更新（Automatic Batching of Updates）

**自动批量更新** 是指 React 自动将多个状态更新批量处理，从而减少重新渲染的次数，提高性能。

#### 触发场景：
- **事件处理函数中**（React 18 版本之前也会批量处理更新）：
  ```jsx
  function handleClick() {
    setState1(value1);
    setState2(value2);
    // React 会在事件处理函数执行完毕后一次性进行重新渲染
  }
  ```

- **生命周期方法和副作用中**：
  ```jsx
  useEffect(() => {
    setState1(value1);
    setState2(value2);
    // React 会在 useEffect 完成后一次性进行重新渲染
  }, []);
  ```

- **异步操作中**：
  ```jsx
  setTimeout(() => {
    setState1(value1);
    setState2(value2);
  }, 1000);
  ```

#### 如何退出批量更新：
  ```jsx
  import { flushSync } from 'react-dom';
  setTimeout(() => {
    flushSync(() => {
      setState1(value1);
    });
    flushSync(() => { 
      setState2(value2);
    });
  }, 1000);
  ```

---

## 如何开启 Concurrent Mode

一旦你使用 `createRoot` 创建了根节点，所有子树组件将自动运行在并发模式下：

```jsx
// index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

---

## 核心 API 详解

### useTransition

**useTransition** 允许你告诉 React 某些更新是非紧急的，从而优化用户体验。

#### 示例：
```jsx
import React, { useState, useTransition } from 'react';

function App() {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(0);

  const handleClick = () => {
    startTransition(() => {
      setCount(c => c + 1);
    });
  };

  return (
    <div>
      <button onClick={handleClick}>Increment</button>
      {isPending ? <p>Loading...</p> : <p>Count: {count}</p>}
    </div>
  );
}

export default App;
```

---

### useDeferredValue

**useDeferredValue** 延迟更新 UI，适用于跟随输入的情况。它告诉 React 这是一次非紧急更新。

#### 示例：
```jsx
import React, { useState, useDeferredValue } from 'react';

function App() {
  const [text, setText] = useState('');
  const deferredText = useDeferredValue(text);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div>
      <input type="text" value={text} onChange={handleChange} />
      <p>Deferred Text: {deferredText}</p>
    </div>
  );
}

export default App;
```

---

### useSyncExternalStore

**useSyncExternalStore** 是 React 18 中引入的一个新钩子，用于确保外部存储的同步更新。它主要用于处理那些 React 状态之外的状态源，比如 Redux、MobX、Zustand 或其他自定义存储解决方案。

#### 关键点：
1. **同步更新**：确保 React 组件在外部存储更新时能同步更新。
2. **无缝集成**：提供一种标准的方式，将外部存储与 React 组件集成。
3. **稳定的 API**：适用于所有需要与 React 组件同步的外部存储解决方案。

#### 使用场景：
- 状态管理库（如 Redux、MobX、Zustand）。
- 自定义存储解决方案。
- 性能优化。

#### 示例：
```jsx
// store.js
let state = { count: 0 };
let listeners = new Set();

function getState() {
  return state;
}

function setState(newState) {
  state = newState;
  listeners.forEach(listener => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export { getState, setState, subscribe };
```

```jsx
// App.js
import React from 'react';
import { useSyncExternalStore } from 'react';
import { getState, setState, subscribe } from './store';

function useStore(selector) {
  return useSyncExternalStore(subscribe, () => selector(getState()));
}

function App() {
  const count = useStore(state => state.count);

  const increment = () => {
    setState({ count: count + 1 });
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

export default App;
```

---

## 版本要求

- **React >= 18**

---

## 总结

**Concurrent Mode** 是 React 的一项重要特性，通过时间切片、优先级调度、暂停/恢复/丢弃渲染等机制，显著提升了应用的响应速度和用户体验。结合 `useTransition`、`useDeferredValue` 和 `useSyncExternalStore` 等 API，开发者可以更灵活地优化复杂场景下的性能问题。