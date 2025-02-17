---
title: "前端状态管理：zustand 与 valtio 的应用"
date: 2023-08-11
---

在实际工作中，React Hooks 虽然功能强大，但在处理复杂的中后台页面交互时，可能会显得力不从心。今天我们将介绍两个由 dai shi 大神开发的状态管理库——**zustand** 和 **valtio**，并探讨它们如何解决传统状态管理方案中的问题。

---

## 目录

1. [为什么选择 zustand 和 valtio？](#为什么选择-zustand-和-valtio)
2. [zustand 的核心优势](#zustand-的核心优势)
   - Stale Props 和 Zombie Children 问题
   - 多渲染器的 Context Loss 问题
   - React Concurrency 问题
3. [zustand 的使用方法](#zustand-的使用方法)
   - 状态更新与合并
   - Selector 的概念与使用
4. [valtio 简介](#valtio-简介)
5. [总结](#总结)

---

## 为什么选择 zustand 和 valtio？

在早期的前端开发中，我们常用 Redux、Dva 或 React Context 来管理状态。然而，这些工具在某些场景下存在局限性，例如：

- **Redux** 的样板代码过多，学习曲线陡峭。
- **React Context** 在多渲染器环境下可能出现上下文丢失（Context Loss）的问题。
- **Hooks** 在处理异步操作和复杂状态逻辑时容易出现“过时的 Props”或“僵尸子组件”等问题。

zustand 和 valtio 是新一代的状态管理工具，解决了上述问题，并提供了更简洁的 API 和更好的性能表现。对于新手开发者来说，这两个库几乎可以无脑选择。

---

## zustand 的核心优势

### Stale Props 和 Zombie Children 问题

#### 什么是 Stale Props？
Stale Props 指的是在异步操作完成之前，组件重新渲染导致使用了过时的 Props。这可能导致获取到错误的数据。

#### 什么是 Zombie Children？
Zombie Children 指的是在异步操作期间，父组件已经卸载或更新，但之前的子组件仍然存在于 DOM 中。

以下是一个示例：

```js
const ExampleComponent = ({ id }) => {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetchData(id);
  }, [id]);

  const fetchData = async (id) => {
    const response = await fetch(`https://api.example.com/${id}`);
    setData(response.json());
  };

  return data ? <div>{data.description}</div> : <div>Loading</div>;
};
```

如果 `id` 在异步请求完成前发生变化，就可能出现 Stale Props 问题；如果组件被卸载，可能还会导致 Zombie Children 问题。

#### zustand 如何解决？
zustand 使用了 **Immer** 库来保证状态的不可变性，确保每次状态更新都基于最新的状态副本。这样可以避免因使用过时数据而导致的问题。

以下是用 zustand 改写的示例：

```js
const useExampleStore = create((set) => ({
  data: null,
  loading: false,
  error: null,
  fetchData: async (id) => {
    set({ loading: true });
    try {
      const response = await fetch(`https://api.example.com/${id}`);
      set({ data: response.json(), loading: false });
    } catch (error) {
      set({ error, loading: false });
    }
  },
}));

const ExampleComponent = ({ id }) => {
  const { data, loading, error, fetchData } = useExampleStore();
  useEffect(() => {
    fetchData(id);
  }, [id]);

  return data ? <div>{data.description}</div> : <div>Loading</div>;
};
```

通过这种方式，zustand 确保了状态的最新性，避免了 Stale Props 和 Zombie Children 问题。

---

### 多渲染器的 Context Loss 问题

#### 什么是 Context Loss？
当组件被第三方渲染器渲染时，由于第三方渲染器无法访问 React 的上下文对象，就会导致上下文丢失。

以下是一个示例：

```js
// App.js (React renderer)
import React from 'react';
import ThirdPartyComponent from './ThirdPartyComponent';

export const MyContext = React.createContext();

const App = () => {
  const value = 'Hello from React';

  return (
    <MyContext.Provider value={value}>
      <ThirdPartyComponent />
    </MyContext.Provider>
  );
};

// ThirdPartyComponent.js (Third-party renderer)
import React from 'react';
import { MyContext } from './App';

const ThirdPartyComponent = () => {
  const value = React.useContext(MyContext); // Trying to access React context in a third-party component

  return <div>{value}</div>;
};

export default ThirdPartyComponent;
```

在这种情况下，`ThirdPartyComponent` 无法访问 `MyContext`，因为它是被第三方渲染器渲染的。

#### zustand 如何解决？
zustand 的状态存储是独立于 React 上下文的，因此即使在多渲染器环境中也能正常工作。

---

### React Concurrency 问题

#### 什么是 React Concurrency？
React 的并发模式允许将渲染任务分成多个时间片执行。这种机制可能导致渲染过程中发生突变，从而引发 UI 不一致或报错。

以下是一个示例：

```js
import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    console.log(count); // 这里的 count 可能不是最新的值
  };

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={handleClick}>Increment</button>
    </div>
  );
};

export default Counter;
```

在并发模式下，`count` 的值可能不是最新的，从而导致逻辑错误。

#### zustand 如何解决？
zustand 的状态更新是同步的，且基于 Immer 的不可变性设计，能够有效避免并发模式下的状态撕裂问题。

---

## zustand 的使用方法

### 状态更新与合并

zustand 的 `set` 方法会自动合并状态。如果是嵌套对象，则需要手动合并。

```js
// 正确
set((state) => ({ count: state.count + 1 }));

// 禁止状态合并
set((state) => ({ count: state.count + 1 }), true);

// 提供状态变更的原因（用于 devtools）
set((state) => ({ count: state.count + 1 }), false, '增加 count');

// 手动合并状态
set((state) => ({ ...state, count: state.count + 1 }));
```

---

### Selector 的概念与使用

Selector 类似于 Redux 的 selector 或 MobX 的 computed 属性，用于从状态树中派生出新的值。

以下是一个示例：

```js
import create from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

export default useStore;

import useStore from './useStore';

const Counter = () => {
  const count = useStore((state) => state.count);
  const doubleCount = useStore((state) => state.count * 2);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Double Count: {doubleCount}</p>
    </div>
  );
};

export default Counter;
```

在这个例子中，`useStore` 的回调函数就是 selector，它从状态树中提取部分状态并派生出新的值。

---

## valtio 简介

valtio 是另一个由 dai shi 开发的状态管理库，基于 Proxy 对象实现。它的功能与 zustand 类似，但 API 风格有所不同。valtio 更加轻量级，适合喜欢简单 API 的开发者。

```js
import { proxy, useSnapshot } from 'valtio';

const state = proxy({
  count: 0,
});

const Counter = () => {
  const snap = useSnapshot(state);
  return (
    <div>
      <p>Count: {snap.count}</p>
      <button onClick={() => (state.count += 1)}>Increment</button>
    </div>
  );
};

export default Counter;
```

---

## 总结

zustand 和 valtio 是现代前端开发中非常优秀的状态管理工具，解决了传统方案中的许多痛点，包括 Stale Props、Zombie Children、Context Loss 和 React Concurrency 等问题。它们的特点如下：

- **zustand**：API 简洁，支持 Selector 和状态合并，适合复杂的状态管理场景。
- **valtio**：基于 Proxy 实现，更加轻量级，适合喜欢简单 API 的开发者。

在实际项目中，建议根据团队的技术栈和个人偏好选择合适的工具。对于复杂的交互联动和异步请求场景，推荐优先考虑 zustand。