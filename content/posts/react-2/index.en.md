---
title: "Concurrent Mode"
description: "What is the history of Concurrent Mode and what problems does it solve?"
date: 2024-07-30
tags:
  - React
images:
  - react-1/a.png
---
## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [Key Concepts and Advantages](#key-concepts-and-advantages)
   - [Time Slicing](#time-slicing)
   - [Priority Scheduling](#priority-scheduling)
   - [Pausing, Resuming, and Aborting Renders](#pausing-resuming-and-aborting-renders)
   - [Suspense](#suspense)
   - [Automatic Batching of Updates](#automatic-batching-of-updates)
3. [How to Enable Concurrent Mode](#how-to-enable-concurrent-mode)
4. [Core API Details](#core-api-details)
   - [useTransition](#usetransition)
   - [useDeferredValue](#usedeferredvalue)
   - [useSyncExternalStore](#usesyncexternalstore)
5. [Version Requirements](#version-requirements)
---
## Design Philosophy
**Concurrent Mode** is a new feature in the React framework designed to improve the responsiveness and user experience of React applications. It enhances performance and interaction smoothness by allowing React to handle multiple tasks simultaneously, rather than completing each task in sequence.
---
## Key Concepts and Advantages
### Time Slicing
**Time Slicing** means that React can pause a task it is currently processing and switch to other, higher-priority tasks at any time. This mechanism, known as **Time Slicing**, prevents long-running tasks from blocking the main thread, ensuring a fluid user interface.
#### Trigger Scenarios:
- Complex calculations or rendering tasks.
- A large number of DOM updates causing the main thread to be occupied for a long time.
- When animations and user interactions need to remain smooth.
---
### Priority Scheduling
In **Concurrent Mode**, different tasks can be assigned different priorities. For example, handling user input will have a higher priority than loading data. This scheduling mechanism allows high-priority tasks to be processed first, thereby improving the user experience.
#### Trigger Scenarios:
- User input (like keyboard typing, mouse clicks) requires a quick response.
- Network requests and data loading can be deferred.
- The priority of component state updates and re-renders may differ.
#### Examples:
- If a user is scrolling on a complex page while data is loading in the background, time slicing allows React to pause the data loading process to ensure the scrolling is smooth.
- If a user is typing in a form, priority scheduling ensures that the input events are responded to quickly, while background data synchronization might be delayed.
---
### Pausing, Resuming, and Aborting Renders
#### Pausing a Render:
- A user scrolls on a data-intensive page. React will pause the rendering of data-intensive components to ensure the scrolling operation is smooth.
#### Resuming a Render:
- The user stops scrolling, and React continues rendering the previously paused data-intensive components during the browser's idle time.
#### Aborting a Render:
- A user quickly switches between different pages or views. React will discard rendering tasks that are not yet complete but are no longer needed, to avoid unnecessary computation.
---
### Suspense
**Suspense** is a key feature in Concurrent Mode that allows components to "suspend" rendering while waiting for asynchronous data to load, until the data is ready. This provides a more elegant way to handle asynchronous operations and a better user experience.
---
### Automatic Batching of Updates
**Automatic Batching of Updates** means React automatically groups multiple state updates into a single re-render for better performance.
#### Trigger Scenarios:
- **Inside event handlers** (updates were also batched before React 18):
  ```jsx
  function handleClick() {
    setState1(value1);
    setState2(value2);
    // React will re-render once after the event handler has finished
  }
  ```
- **Inside lifecycle methods and effects**:
  ```jsx
  useEffect(() => {
    setState1(value1);
    setState2(value2);
    // React will re-render once after the useEffect has finished
  }, []);
  ```
- **Inside asynchronous operations**:
  ```jsx
  setTimeout(() => {
    setState1(value1);
    setState2(value2);
  }, 1000);
  ```
#### How to Opt-Out of Batching:
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
## How to Enable Concurrent Mode
Once you create the root using `createRoot`, all child components will automatically run in Concurrent Mode:
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
## Core API Details
### useTransition
**useTransition** lets you tell React that some state updates are not urgent, thus optimizing the user experience.
#### Example:
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
**useDeferredValue** lets you defer updating a part of the UI. It tells React that this is a non-urgent update, which is useful for scenarios like responding to user input.
#### Example:
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
**useSyncExternalStore** is a new hook introduced in React 18 for ensuring synchronous updates with external stores. It is primarily used for handling state sources outside of React's state, such as Redux, MobX, Zustand, or other custom storage solutions.
#### Key Points:
1. **Synchronous Updates**: Ensures that React components update synchronously when the external store changes.
2. **Seamless Integration**: Provides a standard way to integrate external stores with React components.
3. **Stable API**: Suitable for all external storage solutions that need to sync with React components.
#### Use Cases:
- State management libraries (like Redux, MobX, Zustand).
- Custom storage solutions.
- Performance optimization.
#### Example:
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
## Version Requirements
- **React >= 18**
---
## Summary
**Concurrent Mode** is a crucial feature of React that significantly improves application responsiveness and user experience through mechanisms like time slicing, priority scheduling, and the ability to pause, resume, or abort renders. Combined with APIs like `useTransition`, `useDeferredValue`, and `useSyncExternalStore`, developers can more flexibly optimize performance in complex scenarios.
