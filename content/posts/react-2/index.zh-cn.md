---
title: "React日记 #2期：Concurrent Mode并发模式"
description: "并发模式的历史、解决的问题是什么？"
date: 2024-07-28
tags:
  - React日记
images:
  - react-1/a.png
---

## 设计初衷

Concurrent Mode 是 React 框架的一种新特性，用于提高 React 应用的响应速度和用户体验。它通过允许 React 同时处理多个任务，而不是按顺序完成每个任务，从而提升性能和交互流畅性。

Concurrent Mode 的一些关键概念和优势：

- 时间切片（Time Slicing）：Concurrent Mode 允许 React 在处理某个任务时，随时暂停并切换到其他更高优先级的任务。这种机制被称为时间切片，可以防止长时间任务阻塞主线程，确保用户界面的流畅性。

- 优先级调度（Priority Scheduling）：在 Concurrent Mode 中，不同的任务可以分配不同的优先级。例如，用户输入的处理优先级会高于数据加载的优先级。这种调度机制可以使高优先级任务优先得到处理，从而提高用户体验。

- 暂停、恢复和丢弃渲染（Pausing, Resuming, and Aborting Rendering）：React 可以暂停当前的渲染任务，并在稍后恢复，或者在不再需要时丢弃任务。这种能力使得 React 能够更灵活地管理复杂的应用场景。

- Suspense：这是 Concurrent Mode 中的重要特性，允许组件在等待异步数据加载时 "挂起" 渲染，直到数据准备好。这样可以更优雅地处理异步操作，提供更好的用户体验。

- 自动批量更新（Automatic Batching of Updates）：Concurrent Mode 自动将多个状态更新批量处理，从而减少重新渲染的次数，提高性能。

### 时间切片（Time Slicing）和 优先级调度（Priority Scheduling）

时间切片的触发主要是在处理较长任务时。React 会将这些长任务拆分成多个小任务，允许在每个小任务之间检查是否有更高优先级的任务需要处理。如果有，React 会暂停当前的任务，处理高优先级任务，然后再返回继续未完成的任务。

触发场景：

- 复杂的计算或渲染任务。
- 大量 DOM 更新导致主线程被长时间占用。
- 动画和用户交互需要保持流畅时。

优先级调度的触发主要是在有多个任务需要同时处理时。React 会根据任务的重要性和紧急程度分配不同的优先级。例如，用户输入通常被认为是高优先级任务，因为需要快速响应用户操作，而数据加载等任务可能被分配较低的优先级。

触发场景：

- 用户输入（如键盘输入、鼠标点击）需要快速响应。
- 网络请求和数据加载可以延迟处理。
- 组件状态更新和重渲染的优先级可能不同。

例子：

- 如果用户在一个复杂的页面上滚动，同时后台正在进行数据加载，时间切片可以让 React 暂停数据加载的处理，确保滚动操作流畅。
- 如果用户在表单中输入数据，优先级调度会确保输入事件得到快速响应，而后台的数据同步可能被延迟。

### 暂停、恢复、丢弃渲染

暂停渲染：

- 用户在一个数据密集型的页面上滚动。React 会暂停数据密集型组件的渲染，以确保滚动操作流畅。
  
恢复渲染：

- 用户停止滚动，React 在浏览器的空闲时间继续之前被暂停的数据密集型组件的渲染。

丢弃渲染：

- 用户快速切换不同的页面或视图。React 会丢弃那些还未完成的、但已经不再需要的渲染任务，以避免不必要的计算。

### 自动批量更新

触发场景：

- 事件处理函数中( React 18 版本之前也会批量处理更新)

```jsx
function handleClick() {
  setState1(value1);
  setState2(value2);
  // React 会在事件处理函数执行完毕后一次性进行重新渲染
}
```

- 生命周期方法和副作用中：

```jsx
useEffect(() => {
  setState1(value1);
  setState2(value2);
  // React 会在 useEffect 完成后一次性进行重新渲染
}, []);

```

- 异步操作中

```jsx
setTimeout(() => {
  setState1(value1);
  setState2(value2);
}, 1000);
```

如何退出批量更新:

```jsx
import { flushSync } from 'react-dom'

setTimeout(() => {
  flushSync(() => {
    setState1(value1);
  })
  flushSync(() => { 
    setState2(value2);
  })
}, 1000);

```

## 如何开启

一旦你使用 createRoot 创建了根节点，所有子树组件将自动运行在并发模式下

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

### useTransition

典型的案例是：用户切换Tab时，不用等待，而是可以立即响应切换动作。通过 `useTransition` 包装方法，
来告诉React这是一个**非紧急更新**。

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

### useDeferredValue 延迟更新UI，比如跟随输入的情况

同理也是告诉 React，这是一次非紧急更新，`useDeferredValue`的区别是它包装的时值。

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

### useSyncExternalStore

因为React的分片执行和优先级调度，可能导致高优先级的更新 改变了公共的数据 导致数据不同步。

`useSyncExternalStore` 是 React 18 中引入的一个新钩子，用于确保外部存储的同步更新。它主要用于处理那些 React 状态之外的状态源，比如 Redux、MobX、Zustand 或其他自定义存储解决方案。

以下是 `useSyncExternalStore` 的几个关键点，以及为什么你应该考虑在某些情况下使用它：

#### 关键点

1. **同步更新**：
   - `useSyncExternalStore` 确保 React 组件在外部存储更新时能同步更新。这意味着组件在状态变化时会立即得到更新，从而保持状态的一致性。

2. **无缝集成**：
   - 这个钩子提供了一种标准的方式，将外部存储与 React 组件集成，而无需依赖于具体的库。它提供了一种通用的接口，简化了与外部状态管理库的集成。

3. **稳定的 API**：
   - `useSyncExternalStore` 提供了一个稳定的 API，适用于所有需要与 React 组件同步的外部存储解决方案。这意味着你可以编写更稳定、更可靠的代码。

#### 使用场景

1. **状态管理库**：
   - 当使用 Redux、MobX 或 Zustand 等状态管理库时，你可以使用 `useSyncExternalStore` 来订阅外部存储的变化，确保你的组件在存储更新时同步更新。

2. **自定义存储**：
   - 如果你有自定义的存储解决方案（例如基于事件的存储或其他非 React 状态管理的存储），你可以使用 `useSyncExternalStore` 来订阅和处理这些存储的更新。

3. **性能优化**：
   - `useSyncExternalStore` 可以帮助优化组件更新，确保只在需要时重新渲染，从而提高应用的性能。

#### 使用示例

假设你有一个简单的全局状态存储，可以使用 `useSyncExternalStore` 将其与 React 组件同步：

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

在这个例子中，`useSyncExternalStore` 确保 `App` 组件在存储更新时能同步更新，从而保持组件状态与外部存储的一致性。

#### 总结

`useSyncExternalStore` 是一个强大的工具，适用于需要同步外部存储状态与 React 组件状态的场景。它提供了一种标准化的方式，使得与外部存储的集成更为简单和可靠，同时也有助于性能优化。

## 版本

`>= React 18`
