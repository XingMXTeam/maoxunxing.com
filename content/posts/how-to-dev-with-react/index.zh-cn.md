---
title: "[WIP] 现代化React开发最佳实践"
date: 2021-12-02T15:00:46+08:00
---

## **Class 的弊端**

1. **TypeScript 类型定义复杂**  
   - 在使用 TypeScript 时，Class 需要定义大量的类型（如接口、类属性等），而 Hooks 函数可以通过更简洁的方式实现相同功能。

2. **HOC 嵌套地狱**  
   - 使用 Class 组件时，HOC（高阶组件）的层层嵌套问题较为突出。这种嵌套通常通过迭代器模式实现，容易导致代码复杂度增加。  
   - Hooks 则通过组合模式很好地规避了这个问题，使得逻辑更加清晰。

3. **Props 消费黑盒问题**  
   - HOC 的 Props 下传过程存在“消费黑盒”现象，排查难度较大。某些 Props 可能丢失或未正确传递，从而导致渲染异常。

4. **多个 HOC 的依赖关系**  
   - 多个 HOC 之间可能存在前后依赖关系，增加了代码维护和调试的复杂性。

---

## **Class 的优势**

尽管 Hooks 更加流行，但 Class 组件在某些场景下仍然具有独特的优势：

1. **数据实体消费清晰**  
   - Class 组件基于面向对象的设计思想，数据实体的结构更加清晰，而不是散落在各个字段中。

2. **扩展性强**  
   - 对数据处理的扩展非常方便，只需新增方法即可完成对数据的操作。

3. **数据关联关系明确**  
   - 数据之间的关联关系可以通过类型判断清晰理解，便于维护和扩展。

4. **多数据判断更直观**  
   - 在需要根据多个数据进行 UI 渲染或交互时，Class 组件的表现更为直观。

---

## **最佳实践建议**

结合两者的优缺点，推荐以下实践：
- **数据模型**：借助 Class 实现，利用装饰器、类元数据和依赖注入，将数据、服务和消费灵活组合。这种方式可以避免传统目录规定或特殊命名规则带来的限制，提升开发效率。
- **组件渲染**：借助 Hooks 实现，利用其简洁性和组合能力，简化组件逻辑。

---

## **如何进行状态管理？**

> **破窗效应**  
> Hooks 的状态管理存在不共享、不持久的问题，数据往往是多份的，这可能导致状态同步困难。

以下是几种常见的状态管理方案及其优缺点：

### **方案 1: [umi/hox](https://github.com/umijs/hox)**

#### **优点**
1. **持久化与全局共享**  
   - 数据可以在全局范围内共享，并支持持久化存储。
2. **灵活订阅机制**  
   - 支持订阅更新和非订阅更新，开发者可以根据需求选择是否监听状态变化。

#### **缺点**
1. **持久化与非持久化的界限模糊**  
   - 如何区分持久化和非持久化的状态？例如，`createModel` 的设计是否存在边界？
2. **缺少 DevTools 支持**  
   - 无法通过工具查看状态的变化过程，调试难度较大。
3. **副作用处理能力不足**  
   - 是否可以在 Model 中直接编写副作用逻辑？这一点尚不明确。

---

### **方案 2: Redux**

Redux 是一种经典的状态管理工具，适用于大型项目。  
- **优点**：状态集中管理，支持时间旅行调试（DevTools）。  
- **缺点**：学习曲线较陡，代码量较多，容易导致样板代码膨胀。

---

### **方案 3: Dva**

Dva 是基于 Redux 的封装，提供了更简洁的 API 和内置的异步处理能力。  
- **优点**：内置了 Redux-Saga，简化了异步逻辑的处理。  
- **缺点**：灵活性不如原生 Redux，可能不适合复杂的业务场景。

---

### **方案 4: MobX**

MobX 提供了一种响应式的状态管理方式，适合中小型项目。  
- **优点**：使用简单，代码量少，状态变化自动触发视图更新。  
- **缺点**：对于大型项目，状态的可追踪性和调试能力可能不足。

---

### **方案 5: Immer**

Immer 是一个不可变数据管理库，常用于简化状态更新逻辑。  
- **优点**：通过简单的 API 实现不可变数据操作，代码更易读。  
- **缺点**：仅解决状态更新问题，需与其他状态管理工具配合使用。

---


### **方案 6: zustand 和 valtio**

在早期的前端开发中，我们常用 Redux、Dva 或 React Context 来管理状态。然而，这些工具在某些场景下存在局限性，例如：

- **Redux** 的样板代码过多，学习曲线陡峭。
- **React Context** 在多渲染器环境下可能出现上下文丢失（Context Loss）的问题。
- **Hooks** 在处理异步操作和复杂状态逻辑时容易出现“过时的 Props”或“僵尸子组件”等问题。

zustand 和 valtio 是新一代的状态管理工具，解决了上述问题，并提供了更简洁的 API 和更好的性能表现。对于新手开发者来说，这两个库几乎可以无脑选择。

---

#### zustand 的核心优势

##### Stale Props 和 Zombie Children 问题

##### 什么是 Stale Props？
Stale Props 指的是在异步操作完成之前，组件重新渲染导致使用了过时的 Props。这可能导致获取到错误的数据。

##### 什么是 Zombie Children？
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

##### zustand 如何解决？
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

##### 多渲染器的 Context Loss 问题

###### 什么是 Context Loss？
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

#### React Concurrency 问题

##### 什么是 React Concurrency？
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

#####zustand 如何解决？
zustand 的状态更新是同步的，且基于 Immer 的不可变性设计，能够有效避免并发模式下的状态撕裂问题。

---

#### zustand 的使用方法

##### 状态更新与合并

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

#### Selector 的概念与使用

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

#### valtio 简介

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

zustand 和 valtio 是现代前端开发中非常优秀的状态管理工具，解决了传统方案中的许多痛点，包括 Stale Props、Zombie Children、Context Loss 和 React Concurrency 等问题。它们的特点如下：

- **zustand**：API 简洁，支持 Selector 和状态合并，适合复杂的状态管理场景。
- **valtio**：基于 Proxy 实现，更加轻量级，适合喜欢简单 API 的开发者。

在实际项目中，建议根据团队的技术栈和个人偏好选择合适的工具。对于复杂的交互联动和异步请求场景，推荐优先考虑 zustand。