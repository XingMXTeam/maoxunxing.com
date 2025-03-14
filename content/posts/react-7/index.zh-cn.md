---
title: "React 状态管理 & 全局共享状态设计"
date: 2021-12-02T15:00:46+08:00
tags:
  - React
  - 状态管理
  - Web开发
---

在现代前端开发中，React 的状态管理和组件设计是构建高效、可维护应用的核心。本文将从 **Class 组件的优缺点**、**Hooks 的最佳实践**、以及 **状态管理工具的选择** 等方面展开讨论，并提供详细的分析和代码示例。

---

## 目录

1. [Class 组件的弊端](#class-组件的弊端)
2. [Class 组件的优势](#class-组件的优势)
3. [最佳实践建议](#最佳实践建议)
4. [如何进行状态管理？](#如何进行状态管理)
   - [方案 1: umi/hox](#方案-1-umihox)
   - [方案 2: Redux](#方案-2-redux)
   - [方案 3: Dva](#方案-3-dva)
   - [方案 4: MobX](#方案-4-mobx)
   - [方案 5: Immer](#方案-5-immer)
   - [方案 6: zustand 和 valtio](#方案-6-zustand-和-valtio)
5. [总结](#总结)
6. [全局共享状态设计](#全局共享状态设计)

---

## Class 组件的弊端

尽管 Class 组件曾经是 React 的核心，但随着 Hooks 的引入，其一些弊端逐渐显现：

### 1. TypeScript 类型定义复杂
- 在使用 TypeScript 时，Class 需要定义大量的类型（如接口、类属性等），而 Hooks 函数可以通过更简洁的方式实现相同功能。

### 2. HOC 嵌套地狱
- 使用 Class 组件时，HOC（高阶组件）的层层嵌套问题较为突出。这种嵌套通常通过迭代器模式实现，容易导致代码复杂度增加。
- Hooks 则通过组合模式很好地规避了这个问题，使得逻辑更加清晰。

### 3. Props 消费黑盒问题
- HOC 的 Props 下传过程存在“消费黑盒”现象，排查难度较大。某些 Props 可能丢失或未正确传递，从而导致渲染异常。

### 4. 多个 HOC 的依赖关系
- 多个 HOC 之间可能存在前后依赖关系，增加了代码维护和调试的复杂性。

---

## Class 组件的优势

尽管 Hooks 更加流行，但 Class 组件在某些场景下仍然具有独特的优势：

### 1. 数据实体消费清晰
- Class 组件基于面向对象的设计思想，数据实体的结构更加清晰，而不是散落在各个字段中。

### 2. 扩展性强
- 对数据处理的扩展非常方便，只需新增方法即可完成对数据的操作。

### 3. 数据关联关系明确
- 数据之间的关联关系可以通过类型判断清晰理解，便于维护和扩展。

### 4. 多数据判断更直观
- 在需要根据多个数据进行 UI 渲染或交互时，Class 组件的表现更为直观。

---

## 最佳实践建议

结合两者的优缺点，推荐以下实践：

- **数据模型**：借助 Class 实现，利用装饰器、类元数据和依赖注入，将数据、服务和消费灵活组合。这种方式可以避免传统目录规定或特殊命名规则带来的限制，提升开发效率。
- **组件渲染**：借助 Hooks 实现，利用其简洁性和组合能力，简化组件逻辑。

---

## 如何进行状态管理？

> **破窗效应**  
> Hooks 的状态管理存在不共享、不持久的问题，数据往往是多份的，这可能导致状态同步困难。

以下是几种常见的状态管理方案及其优缺点：

---

### 方案 1: [umi/hox](https://github.com/umijs/hox)

#### 优点
1. **持久化与全局共享**  
   - 数据可以在全局范围内共享，并支持持久化存储。
2. **灵活订阅机制**  
   - 支持订阅更新和非订阅更新，开发者可以根据需求选择是否监听状态变化。

#### 缺点
1. **持久化与非持久化的界限模糊**  
   - 如何区分持久化和非持久化的状态？例如，`createModel` 的设计是否存在边界？
2. **缺少 DevTools 支持**  
   - 无法通过工具查看状态的变化过程，调试难度较大。
3. **副作用处理能力不足**  
   - 是否可以在 Model 中直接编写副作用逻辑？这一点尚不明确。

---

### 方案 2: Redux

Redux 是一种经典的状态管理工具，适用于大型项目。

- **优点**：状态集中管理，支持时间旅行调试（DevTools）。  
- **缺点**：学习曲线较陡，代码量较多，容易导致样板代码膨胀。

> Redux 的 reducer 文件名就是 state 的挂载对象。例如文件名是 `schedule`，那么 reducer 内部的所有状态都是挂载在 `schedule` 这个对象下。

---

### 方案 3: Dva

Dva 是基于 Redux 的封装，提供了更简洁的 API 和内置的异步处理能力。

- **优点**：内置了 Redux-Saga，简化了异步逻辑的处理。  
- **缺点**：灵活性不如原生 Redux，可能不适合复杂的业务场景。

---

### 方案 4: MobX

MobX 提供了一种响应式的状态管理方式，适合中小型项目。

- **优点**：使用简单，代码量少，状态变化自动触发视图更新。  
- **缺点**：对于大型项目，状态的可追踪性和调试能力可能不足。

> mobx-react 的 observer 对象（一般是 React 组件）会监听 store 的数据（`@observable` 的数据变化时会触发）变化，并且会重新渲染。

---

### 方案 5: Immer

Immer 是一个不可变数据管理库，常用于简化状态更新逻辑。

- **优点**：通过简单的 API 实现不可变数据操作，代码更易读。  
- **缺点**：仅解决状态更新问题，需与其他状态管理工具配合使用。

---

### 方案 6: zustand 和 valtio

在早期的前端开发中，我们常用 Redux、Dva 或 React Context 来管理状态。然而，这些工具在某些场景下存在局限性，例如：
- **Redux** 的样板代码过多，学习曲线陡峭。
- **React Context** 在多渲染器环境下可能出现上下文丢失（Context Loss）的问题。
- **Hooks** 在处理异步操作和复杂状态逻辑时容易出现“过时的 Props”或“僵尸子组件”等问题。

zustand 和 valtio 是新一代的状态管理工具，解决了上述问题，并提供了更简洁的 API 和更好的性能表现。对于新手开发者来说，这两个库几乎可以无脑选择。

#### zustand 的核心优势

##### Stale Props 和 Zombie Children 问题

###### 什么是 Stale Props？
Stale Props 指的是在异步操作完成之前，组件重新渲染导致使用了过时的 Props。这可能导致获取到错误的数据。
```js
const ExampleComponent = ({ id }) => {
  const [data, setData] = useState(null)
  useEffect(() => {
	  fetchData(id)
  }, [id])		
  const fetchData = id => {
	  const response = await fetch(`https://api.example.com/${id}`)
	  setData(response.json())
  }
  return <>{data ? <div>{data.description}</div> : <div>Loading</div></>
}
```
在异步拉取数据完成之前，如果id再次变化，就会出现`Stale Props` 的问题，使用了过期的id获取了不正确的数据。

###### 什么是 Zombie Children？
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
###### 解决react concurrency问题。 

这个问题是说React在并发模式下可能导致渲染过程中发生突变导致的撕裂，更新被中断或者中途改变，使组件UI显示不一致或者报错。并发模式下，React可能将渲染工作分成多个时间片，并在每个时间片中执行一部分渲染工作。


```js
import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // 在渲染函数中直接修改状态
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

```js
import React, { useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    // 使用函数式更新来确保获取最新的 count 值
    setCount(prevCount => prevCount + 1);
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

###### zustand 如何解决？
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

#### 教程
1、不可变状态的合并： 
 1.1、set方法会自动合并
 
```js
// 正确
set((state) => ({ count: state.count + 1 }))
// 通过第二个参数，禁止state合并
set((state) => ({ count: state.count + 1 }, true))
// 通过第三个参数，提供状态变更的原因，devtools使用到
set((state) => ({ count: state.count + 1 }, false, '增加count'))
// ...state可以省略，
set((state) => ({ ...state, count: state.count + 1 })) 
```
 1.2、如果是嵌套对象，需要手动合并。[更多](https://github.com/pmndrs/zustand/blob/main/docs/guides/updating-state.md#deeply-nested-object)
```js
import { create } from 'zustand'

const useCountStore = create((set) => ({
  nested: { count: 0 },
  inc: () =>
    set((state) => ({
      nested: { ...state.nested, count: state.nested.count + 1 },
    })),
}))
```
2、selector的用法：
selector类似Redux的selector或者MobX的computed属性，比如我们有一个store
```js
import create from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));

export default useStore;
```
这里我们通过useStore访问store，并且传递进去两个selector， 他们通过获取部分状态派生出新的值，而不用访问整个状态树。

也就是说如果我们要复用state.count * 2 的逻辑，可以写两个函数，函数因为是纯函数可以单独测试。
```js
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


#### zustand vs valtio

valtio获取值的时候可以直接抛Promise。

```js
const state = proxy({ post: fetch(url).then((res) => res.json()) })

function Post() {
  const snap = useSnapshot(state); 
  // 相当于当post.title不存在的时候，直接抛了一个Promise
  // 不需要额外处理加载状态和错误处理逻辑（Suspense组件处理了）
  return <div>{snap.post.title}</div> 
}

function App() {
  return (
    <Suspense fallback={<span>waiting...</span>}>
      <Post />
    </Suspense>
  )
}
```

zustand则不能
```js
// 1、创建store
import create from 'zustand';

const postStore = create((set) => ({
  post: null,
  getPost: async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    set({ post: data });
  },
}));

// 2、使用store
import { useStore } from './postStore';

function Post() {
  const post = useStore((state) => state.post);
  const getPost = useStore((state) => state.getPost);

  // 这里需要自己处理Promise 
  if (!post) {
    getPost(url); // 直接调用获取数据的方法
    throw getPost(url); // 直接抛出 Promise
  }

  return <div>{post.title}</div>;
}
```
可以借助swr改进：[复杂例子](https://gist.github.com/samselikoff/ac8076c6c224786da23c9297567585cf), [SWR改进](https://codesandbox.io/s/react-suspense-swr-zustand-uyj1ub?file=/src/store.ts:0-582)

```js
import useSWR from "swr";
import create from "zustand";

// fetch data from `jsonplaceholder` API
const fetcher = (
  type: "user" | "post" | "photo",
  id: string,
  delay: number
) => {
  const url = `https://jsonplaceholder.typicode.com/${type}s/${id}?_delay=${delay}`;

  return fetch(url).then((res) => res.json());
};

export const useStore = create((set) => ({
  userInfo: null,
  useFetch: (key) =>
    useSWR(key, fetcher, {
      suspense: true,
      // 如果需要数据保存，则可以在 onSucces 里把数据 set 下来
      onSuccess: (data) => {
        set({ userInfo: data });
      }
    })
}));
```


---

## 总结

在实际项目中，选择合适的状态管理工具和组件设计方式至关重要。以下是一些总结建议：

- **Class 组件**：适合数据模型复杂、扩展性强的场景。
- **Hooks**：适合组件逻辑简单、需要组合能力的场景。
- **状态管理工具**：根据项目规模和复杂度选择合适的工具，例如 Redux、MobX、zustand 或 valtio。

---

## 全局共享状态设计

如何设计一个简单的全局共享状态管理器

1、创建模型：
```js
const model = getModel("foo");  // 创建或获取已存在的模型
```

2、创建容器和监听器：
- 创建一个 Container 存储状态 （ 订阅者共享一个实例）
- 创建一个隐藏的 Executor 组件来监听状态变化（相当于中介者，数据变化后调用每个订阅组件的setState触发重新渲染）

3、订阅状态：
- 组件通过 useModel 订阅状态变化
- 当状态变化时，组件会自动更新


[Git Repo](https://github.com/XingMXTeam/reactivity.git)

1、和zustand、Jotai、 mobx-react-lite 实现的区别？
2、React原生实现Context的区别？需要嵌套包裹组件

新的直觉：
1、组件里面useModel实际就是订阅；通过中间组件订阅更新；通过container观察者模式通知
2、`const { data, setData } = useModel('bannerComponent')` 只会订阅你想要的这个组件的数据， `setData` 也只会更新指定组件的数据。

