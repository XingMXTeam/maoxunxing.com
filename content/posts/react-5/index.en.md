---
title: "Why React Hooks"
description: ""
date: 2019-12-05 11:53
tags:
  - React
images:
  - react-1/a.png
---

1. [Background of React Hooks](#background-of-react-hooks)

## Table of Contents
2. [Usage of React Hooks](#usage-of-react-hooks)
   - [useState](#usestate)
   - [useEffect](#useeffect)
- [Custom Hooks](#custom-hooks)
   - [useReducer](#usereducer)
   - [useRef](#useref)
   - [useContext](#usecontext)
3. [Performance Optimization](#performance-optimization)
   - [React.memo](#reactmemo)
   - [useCallback](#usecallback)
   - [useMemo](#usememo)
4. [Summary](#summary)

## Background of React Hooks

In the early versions of React, we used `createClass` to create components, and later introduced `React.Component` in React v0.13.0. However, this approach had some issues:
1. **Limitations in the constructor**: The `constructor` must call the `super` method and pass `props` to it.
2. **Manually bind `this`**: It is necessary to manually bind `this` in class methods.

Although these issues can be avoided using **Class Fields** and **arrow functions**, code repetition still remains a problem. For example:

{{< img src="image.png" alt="" maxWidth="540px" >}}


To address these issues, developers often use **Higher-Order Components (HOCs)** or the **Render Props** pattern to reuse logic. However, these approaches can lead to "Wrapper Hell" and reduce code readability.

Therefore, the React team introduced **React Hooks**, aimed at solving these problems and providing a more concise and flexible development approach.


## Usage of React Hooks

### useState

`useState` is the most basic Hook in React Hooks. Its function is to manage the state of a component.

- **Function**: Accepts an initial state (value or function), returns an array, the first element is the current state, and the second element is a function to update the state (e.g., `setRepos`).
- **Difference from `setState`**:
  - `setState` manages the entire component's state object, while `useState` only manages a single state.
  - The update function of `useState` will completely replace the state, while `setState` will merge the state object.

{{< img src="image-2.png" alt="" maxWidth="540px" >}}

Example code:
```jsx
const [repos, setRepos] = useState([]);
### useEffect

In traditional class components, lifecycle methods are used to handle side effects (such as data fetching, subscriptions, etc.). In React Hooks, `useEffect` takes on this responsibility.

- **Function**: `useEffect` runs after the component renders, similar to `componentDidMount` and `componentDidUpdate`.

- **Trigger Timing**:
- If the second parameter is not passed, it will be executed after each re-render.
- If an empty array `[]` is passed, it will only be executed during the initial render.
- If a dependencies array is passed, it will only be executed when the dependencies change.
{{< img src="image-3.png" alt="" maxWidth="540px" >}}

To avoid infinite loops, it is recommended to set the dependencies array reasonably. Additionally, `useEffect` provides a cleanup mechanism for handling resource release, such as event listeners or WebSockets.

Example code:

```jsx
useEffect(() => {
const handler = () => console.log('Window resized');
  window.addEventListener('resize', handler);
  return () => window.removeEventListener('resize', handler);
}, []);
```
{{< img src="image-5.png" alt="" maxWidth="540px" >}}

### Custom Hooks

React is not just a UI component library but also needs to handle a lot of non-visual logic. To reuse logic, React provides **Custom Hooks**.

- **Advantages**: Avoids the "wrapping hell" of HOCs and Render Props, making the code easier to understand.

- **Naming Convention**: Custom Hooks must start with `use`.
Example code:

```jsx
function useTooltip() {
const [visible, setVisible] = useState(false);
  return { visible, show: () => setVisible(true), hide: () => setVisible(false) };
// Using custom Hook
const tooltip = useTooltip();

{{< img src="image-8.png" alt="" maxWidth="540px" >}}
### useReducer
`useReducer` is a state management method based on the **Reducer pattern**, suitable for handling complex state logic.

- **Function**: Triggers state updates via `dispatch`, similar to how Redux works.

- **Applicable Scenarios**: When there are multiple interrelated states in a component, `useReducer` provides a more declarative way to manage state.

Example code:

```jsx
const initialState = { count: 0 };

function reducer(state, action) {
    case 'increment':
```

      return { count: state.count + 1 };
    case 'decrement':
return { count: state.count - 1 };
      throw new Error();
const [state, dispatch] = useReducer(reducer, initialState);
{{< img src="image-10.png" alt="" maxWidth="540px" >}}
### useRef
`useRef` is used to persist a value across multiple renders of a component, or to access a DOM node.
- **Functionality**:
  - Persist values: Access and modify values via `ref.current`.

- Accessing the DOM: Obtain DOM nodes via `ref`.
Example code:

```jsx

const inputRef = useRef(null);

useEffect(() => {

}
  inputRef.current.focus();
}, []);

return <input ref={inputRef} />;
```
{{< img src="image-17.png" alt="" maxWidth="540px" >}}

### useContext
`useContext` provides a way to share data across components, avoiding the cumbersome process of passing `props` layer by layer.
Example code:

```jsx
const ThemeContext = createContext();

function App() {

  return (
```

<ThemeContext.Provider value="dark">

      <Child />
    </ThemeContext.Provider>
  );

function Child() {
  const theme = useContext(ThemeContext);
  return <div>{theme}</div>;
  switch (action.type) {
{{< img src="image-18.png" alt="" maxWidth="540px" >}}
## Performance Optimization
### React.memo

`React.memo` is a higher-order component used to skip unnecessary re-renders.
default:
Example code:
  }
}

```jsx


const MemoizedComponent = React.memo(MyComponent);

```

### useCallback

`useCallback` is used to memoize callback functions, preventing the creation of new function instances on parent component re-renders.
Example code:
```jsx
const handleClick = useCallback(() => {

  console.log('Clicked');

```

}, []);

### useMemo
`useMemo` is used to cache the result of a calculation to avoid unnecessary recalculations.
Example code:
```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
{{< img src="image-19.png" alt="" maxWidth="540px" >}}

```

}

}
```
```
```

```