---
title: "Why React Hooks"
description: ""
date: 2019-12-05 11:53
tags:
  - React
images:
  - react-1/a.png
---

## 目录

1. [React Hooks 的背景](#react-hooks-的背景)
2. [React Hooks 的使用](#react-hooks-的使用)
   - [useState](#usestate)
   - [useEffect](#useeffect)
   - [自定义 Hooks](#自定义-hooks)
   - [useReducer](#usereducer)
   - [useRef](#useref)
   - [useContext](#usecontext)
3. [性能优化](#性能优化)
   - [React.memo](#reactmemo)
   - [useCallback](#usecallback)
   - [useMemo](#usememo)
4. [总结](#总结)

---

## React Hooks 的背景

在 React 的早期版本中，我们使用 `createClass` 创建组件，随后在 React v0.13.0 中引入了 `React.Component`。然而，这种方式存在一些问题：
1. **构造函数中的限制**：在 `constructor` 中必须调用 `super` 方法，并将 `props` 传递给它。
2. **手动绑定 `this`**：需要手动绑定类方法中的 `this`。

虽然可以通过 **Class Fields** 和 **箭头函数** 来避免这些问题，但仍然会面临代码重复的问题。例如：

![alt text](image.png)

为了解决这些问题，开发者通常会使用 **高阶组件（HOC）** 或 **Render Props** 模式来复用逻辑。然而，这些方法容易导致“包装地狱”（Wrapper Hell），并且代码可读性较差。

因此，React 团队推出了 **React Hooks**，旨在解决这些问题并提供更简洁、更灵活的开发方式。

---

## React Hooks 的使用

### useState

`useState` 是 React Hooks 中最基础的一个 Hook。它的作用是管理组件的状态。

- **功能**：接受初始状态（值或函数），返回一个数组，第一个元素是当前状态，第二个元素是更新状态的函数（如 `setRepos`）。
- **与 `setState` 的区别**：
  - `setState` 管理的是整个组件的状态对象，而 `useState` 只管理单个状态。
  - `useState` 的更新函数会完全替换状态，而 `setState` 会合并状态对象。

![alt text](image-2.png)

示例代码：
```jsx
const [repos, setRepos] = useState([]);
```

---

### useEffect

在传统的类组件中，生命周期方法用于同步副作用（如数据获取、订阅等）。在 React Hooks 中，`useEffect` 承担了这一职责。

- **功能**：`useEffect` 在组件渲染后执行，类似于 `componentDidMount` 和 `componentDidUpdate`。
- **触发时机**：
  - 如果未传递第二个参数，则会在每次重新渲染后执行。
  - 如果传递空数组 `[]`，则只会在初始渲染时执行。
  - 如果传递依赖项数组，则仅在依赖项变化时执行。

![alt text](image-3.png)

为了避免无限循环，建议合理设置依赖项数组。此外，`useEffect` 提供了清理机制，用于处理如事件监听器或 WebSocket 等资源释放。

示例代码：
```jsx
useEffect(() => {
  const handler = () => console.log('Window resized');
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);
```

![alt text](image-5.png)

---

### 自定义 Hooks

React 不仅是一个 UI 组件库，还需要处理大量的非视觉逻辑。为了复用逻辑，React 提供了 **自定义 Hooks**。

- **优势**：避免 HOC 和 Render Props 的“包装地狱”，代码更易理解。
- **命名规则**：自定义 Hook 必须以 `use` 开头。

示例代码：
```jsx
function useTooltip() {
  const [visible, setVisible] = useState(false);
  return { visible, show: () => setVisible(true), hide: () => setVisible(false) };
}

// 使用自定义 Hook
const tooltip = useTooltip();
```

![alt text](image-8.png)

---

### useReducer

`useReducer` 是一种基于 **Reducer 模式** 的状态管理方式，适合处理复杂的状态逻辑。

- **功能**：通过 `dispatch` 触发状态更新，类似于 Redux 的工作方式。
- **适用场景**：当组件中有多个相互关联的状态时，`useReducer` 提供了一种更声明式的方式来管理状态。

示例代码：
```jsx
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

const [state, dispatch] = useReducer(reducer, initialState);
```

![alt text](image-10.png)

---

### useRef

`useRef` 用于在组件的多次渲染之间持久化某个值，或者访问 DOM 节点。

- **功能**：
  - 持久化值：通过 `ref.current` 访问和修改值。
  - 访问 DOM：通过 `ref` 获取 DOM 节点。

示例代码：
```jsx
const inputRef = useRef(null);

useEffect(() => {
  inputRef.current.focus();
}, []);

return <input ref={inputRef} />;
```

![alt text](image-17.png)

---

### useContext

`useContext` 提供了一种跨组件共享数据的方式，避免了逐层传递 `props` 的繁琐。

示例代码：
```jsx
const ThemeContext = createContext();

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Child />
    </ThemeContext.Provider>
  );
}

function Child() {
  const theme = useContext(ThemeContext);
  return <div>{theme}</div>;
}
```

![alt text](image-18.png)

---

## 性能优化

### React.memo

`React.memo` 是一个高阶组件，用于跳过不必要的重新渲染。

示例代码：
```jsx
const MemoizedComponent = React.memo(MyComponent);
```

---

### useCallback

`useCallback` 用于缓存回调函数，避免在父组件重新渲染时生成新的函数实例。

示例代码：
```jsx
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);
```

---

### useMemo

`useMemo` 用于缓存计算结果，避免不必要的重新计算。

示例代码：
```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

![alt text](image-19.png)

---

## 总结

React Hooks 的引入极大地简化了 React 开发流程，解决了传统类组件中的诸多痛点。通过 `useState`、`useEffect`、`useReducer` 等核心 Hooks，开发者可以更轻松地管理状态和副作用。同时，自定义 Hooks 提供了强大的逻辑复用能力，而性能优化工具如 `React.memo`、`useCallback` 和 `useMemo` 则进一步提升了应用的性能。

React Hooks 的出现标志着 React 开发进入了一个更加现代化、灵活化的时代。
