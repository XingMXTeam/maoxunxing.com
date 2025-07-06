---
title: "React State Management & Global Shared State Design"
date: 2021-12-02T15:00:46+08:00
tags:
  - React
  - State Management
  - Web Development
---
In modern front-end development, React's state management and component design are core to building efficient and maintainable applications. This article will discuss topics such as the **pros and cons of Class components**, **best practices for Hooks**, and the **selection of state management tools**, providing detailed analysis and code examples.
---
## Table of Contents
1. [Disadvantages of Class Components](#disadvantages-of-class-components)
2. [Advantages of Class Components](#advantages-of-class-components)
3. [Best Practice Recommendations](#best-practice-recommendations)
4. [How to Manage State?](#how-to-manage-state)
   - [Solution 1: umi/hox](#solution-1-umihox)
   - [Solution 2: Redux](#solution-2-redux)
   - [Solution 3: Dva](#solution-3-dva)
   - [Solution 4: MobX](#solution-4-mobx)
   - [Solution 5: Immer](#solution-5-immer)
   - [Solution 6: zustand and valtio](#solution-6-zustand-and-valtio)
5. [Conclusion](#conclusion)
6. [Global Shared State Design](#global-shared-state-design)
---
## Disadvantages of Class Components
Although Class components were once the core of React, with the introduction of Hooks, some of their disadvantages have become apparent:
### 1. Complex TypeScript Type Definitions
- When using TypeScript, Classes require defining a large number of types (such as interfaces, class properties, etc.), whereas Hooks functions can achieve the same functionality in a more concise way.
### 2. HOC Nesting Hell
- When using Class components, the problem of deeply nested HOCs (Higher-Order Components) is quite prominent. This nesting is often implemented through the iterator pattern, which can easily increase code complexity.
- Hooks, on the other hand, avoid this problem well through the composition pattern, making the logic clearer.
### 3. Props Consumption Black Box Problem
- The process of passing props down through HOCs creates a "consumption black box," making debugging difficult. Some props may be lost or not passed correctly, leading to rendering anomalies.
### 4. Dependencies Between Multiple HOCs
- There may be sequential dependencies between multiple HOCs, which increases the complexity of code maintenance and debugging.
---
## Advantages of Class Components
Although Hooks are more popular, Class components still have unique advantages in certain scenarios:
### 1. Clear Consumption of Data Entities
- Class components are based on object-oriented design principles, making the structure of data entities clearer, rather than being scattered across various fields.
### 2. Strong Extensibility
- Extending data processing is very convenient; you can complete data operations simply by adding new methods.
### 3. Clear Data Association Relationships
- The relationships between data can be clearly understood through type inference, which facilitates maintenance and extension.
### 4. More Intuitive Multi-Data Conditionals
- When UI rendering or interaction needs to be based on multiple data points, Class components perform more intuitively.
---
## Best Practice Recommendations
Combining the pros and cons of both, the following practices are recommended:
- **Data Model**: Implement using Classes, leveraging decorators, class metadata, and dependency injection to flexibly combine data, services, and consumption. This approach can avoid the limitations imposed by traditional directory conventions or special naming rules, improving development efficiency.
- **Component Rendering**: Implement using Hooks, taking advantage of their simplicity and composition capabilities to simplify component logic.
---
## How to Manage State?
> **Broken Window Effect**  
> State management with Hooks has issues with not being shared or persistent. Data often exists in multiple copies, which can lead to difficulties in state synchronization.
Here are several common state management solutions and their pros and cons:
---
### Solution 1: [umi/hox](https://github.com/umijs/hox)
#### Advantages
1. **Persistence and Global Sharing**  
   - Data can be shared globally and supports persistent storage.
2. **Flexible Subscription Mechanism**  
   - Supports both subscribed and non-subscribed updates, allowing developers to choose whether to listen for state changes based on their needs.
#### Disadvantages
1. **Blurred Line Between Persistent and Non-Persistent**  
   - How to distinguish between persistent and non-persistent state? For example, are there boundaries in the design of `createModel`?
2. **Lack of DevTools Support**  
   - It's impossible to view the state change process through tools, making debugging difficult.
3. **Insufficient Side Effect Handling**  
   - Can side effect logic be written directly in the Model? This is not yet clear.
---
### Solution 2: Redux
Redux is a classic state management tool suitable for large-scale projects.
- **Advantages**: Centralized state management, supports time-travel debugging (DevTools).  
- **Disadvantages**: Steep learning curve, more boilerplate code, which can easily lead to code bloat.
> The filename of a Redux reducer is the mount point for the state. For example, if the filename is `schedule`, then all states within the reducer are mounted under the `schedule` object.
---
### Solution 3: Dva
Dva is a wrapper based on Redux, providing a more concise API and built-in asynchronous handling capabilities.
- **Advantages**: Built-in Redux-Saga, simplifying the handling of asynchronous logic.  
- **Disadvantages**: Less flexible than native Redux, may not be suitable for complex business scenarios.
---
### Solution 4: MobX
MobX provides a reactive state management approach, suitable for small to medium-sized projects.
- **Advantages**: Simple to use, less code, state changes automatically trigger view updates.  
- **Disadvantages**: For large projects, state traceability and debugging capabilities may be insufficient.
> The `observer` object in mobx-react (usually a React component) listens for changes in the store's data (triggered when `@observable` data changes) and re-renders.
---
### Solution 5: Immer
Immer is an immutable data management library, often used to simplify state update logic. **It is not a state management solution.**
- **Advantages**: Achieves immutable data operations with a simple API, making code more readable.  
- **Disadvantages**: Only solves the state update problem and needs to be used in conjunction with other state management tools.
```js
import {produce} from "immer"
const nextState = produce(baseState, draft => {
    draft[1].done = true
    draft.push({title: "Tweet about it"})
})
```
vs
```js
const nextState = baseState.slice() // shallow clone the array
nextState[1] = {
    // replace element 1...
    ...nextState[1], // with a shallow clone of element 1
    done: true // ...combined with the desired update
}
// since nextState was freshly cloned, using push is safe here,
// but doing the same thing at any arbitrary time in the future would
// violate the immutability principles and introduce a bug!
nextState.push({title: "Tweet about it"})
```
---
### Solution 6: zustand and valtio
In early front-end development, we often used Redux, Dva, or React Context to manage state. However, these tools have limitations in certain scenarios, for example:
- **Redux** has too much boilerplate code and a steep learning curve.
- **React Context** can suffer from Context Loss in multi-renderer environments.
- **Hooks** can easily lead to problems like "stale props" or "zombie children" when handling asynchronous operations and complex state logic.
zustand and valtio are new-generation state management tools that solve the above problems and provide a more concise API and better performance. For novice developers, these two libraries are almost a no-brainer choice.
#### Core Advantages of zustand
##### Stale Props and Zombie Children Problem
###### What are Stale Props?
Stale Props refer to the use of outdated props due to a component re-rendering before an asynchronous operation is complete. This can lead to fetching incorrect data.
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
If the `id` changes again before the asynchronous data fetching is complete, the `Stale Props` problem will occur, using an outdated `id` to fetch incorrect data.
###### What are Zombie Children?
Zombie Children refer to child components that still exist in the DOM after the parent component has been unmounted or updated during an asynchronous operation.
Here is an example:
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
If `id` changes before the asynchronous request is complete, it can lead to the Stale Props problem; if the component is unmounted, it can also lead to the Zombie Children problem.
###### Solving the react concurrency problem. 
This problem refers to tearing that can occur in React's concurrent mode due to mutations during the rendering process. Updates can be interrupted or changed mid-way, causing the component UI to display inconsistently or throw an error. In concurrent mode, React may split rendering work into multiple time slices and execute a portion of the rendering work in each time slice.
```js
import React, { useState } from 'react';
const Counter = () => {
  const [count, setCount] = useState(0);
  const handleClick = () => {
    // Directly modifying state in the render function
    setCount(count + 1);
    console.log(count); // The count here may not be the latest value
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
    // Use functional update to ensure getting the latest count value
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
###### How does zustand solve this?
zustand uses the **Immer** library to ensure state immutability, making sure that every state update is based on the latest state copy. This helps to avoid problems caused by using outdated data.
Here is the example rewritten with zustand:
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
In this way, zustand ensures the state is always up-to-date, avoiding the Stale Props and Zombie Children problems.
#### Tutorial
1. Merging immutable state: 
 1.1. The `set` method merges automatically
 
```js
// Correct
set((state) => ({ count: state.count + 1 }))
// Disable state merging with the second argument
set((state) => ({ count: state.count + 1 }, true))
// Provide a reason for the state change with the third argument, used by devtools
set((state) => ({ count: state.count + 1 }, false, 'increment count'))
// ...state can be omitted
set((state) => ({ ...state, count: state.count + 1 })) 
```
 1.2. For nested objects, you need to merge manually. [More info](https://github.com/pmndrs/zustand/blob/main/docs/guides/updating-state.md#deeply-nested-object)
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
2. Usage of selectors:
A selector is similar to Redux's selector or MobX's computed property. For example, if we have a store:
```js
import create from 'zustand';
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));
export default useStore;
```
Here we access the store via `useStore` and pass in two selectors. They derive new values by accessing parts of the state, without needing to access the entire state tree.
This means if we want to reuse the logic `state.count * 2`, we can write two functions. Since the functions are pure, they can be tested independently.
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
#### Introduction to valtio
valtio is another state management library developed by Daishi Kato, based on Proxy objects. Its functionality is similar to zustand, but its API style is different. valtio is more lightweight and suitable for developers who prefer a simple API.
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
valtio can throw a Promise directly when accessing a value.
```js
const state = proxy({ post: fetch(url).then((res) => res.json()) })
function Post() {
  const snap = useSnapshot(state); 
  // This is equivalent to throwing a Promise when post.title doesn't exist.
  // No need to handle loading and error states separately (handled by the Suspense component).
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
zustand, however, cannot do this.
```js
// 1. Create store
import create from 'zustand';
const postStore = create((set) => ({
  post: null,
  getPost: async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    set({ post: data });
  },
}));
// 2. Use store
import { useStore } from './postStore';
function Post() {
  const post = useStore((state) => state.post);
  const getPost = useStore((state) => state.getPost);
  // Here you need to handle the Promise yourself
  if (!post) {
    getPost(url); // Call the method to fetch data directly
    throw getPost(url); // Throw the Promise directly
  }
  return <div>{post.title}</div>;
}
```
This can be improved with SWR: [Complex example](https://gist.github.com/samselikoff/ac8076c6c224786da23c9297567585cf), [SWR Improvement](https://codesandbox.io/s/react-suspense-swr-zustand-uyj1ub?file=/src/store.ts:0-582)
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
      // If data needs to be saved, you can set the data in onSuccess
      onSuccess: (data) => {
        set({ userInfo: data });
      }
    })
}));
```
---
## Conclusion
In actual projects, choosing the right state management tool and component design approach is crucial. Here are some summary recommendations:
- **Class Components**: Suitable for scenarios with complex data models and strong extensibility requirements.
- **Hooks**: Suitable for scenarios with simple component logic and a need for composition.
- **State Management Tools**: Choose the appropriate tool based on project scale and complexity, such as Redux, MobX, zustand, or valtio.
---
## Global Shared State Design
How to design a simple global shared state manager:
1. Create a model:
```js
const model = getModel("foo");  // Create or get an existing model
```
2. Create a container and a listener:
- Create a Container to store the state (subscribers share one instance).
- Create a hidden Executor component to listen for state changes (acts as a mediator; after data changes, it calls each subscribing component's `setState` to trigger a re-render).
3. Subscribe to state:
- Components subscribe to state changes via `useModel`.
- When the state changes, the component updates automatically.
[Git Repo](https://github.com/XingMXTeam/reactivity.git)
1. What are the implementation differences compared to zustand, Jotai, and mobx-react-lite?
2. What is the difference from React's native Context implementation? It requires nesting and wrapping components.
New Intuitions:
1. `useModel` within a component is essentially a subscription; updates are subscribed to via an intermediary component; notifications are sent via the container's observer pattern.
2. `const { data, setData } = useModel('bannerComponent')` will only subscribe to the data of the component you want, and `setData` will also only update the data for that specific component.
