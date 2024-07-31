---
title: "React Diary #2: Concurrent Mode"
description: "what is concurrent mode ?"
date: 2024-07-28
tags:
  - React Diary
images:
  - react-1/a.png
---

## Initial design intent

Concurrent Mode is a new feature of the React framework that improves the responsiveness and user experience of React applications. It improves performance and interaction fluency by allowing React to handle multiple tasks simultaneously, rather than completing each task sequentially.

Some of the key concepts and benefits of Concurrent Mode:

- Time Slicing: Concurrent Mode allows React to pause and switch to other higher-priority tasks at any time while working on one task. This mechanism, called time slicing, prevents long tasks from blocking the main thread and ensures a smooth user interface.

- Priority Scheduling: In Concurrent Mode, different tasks can be assigned different priorities. For example, the processing priority of user input is higher than the priority of data loading. This scheduling mechanism allows high-priority tasks to be processed first, thus improving the user experience.

- Pausing, Resuming, and Aborting Rendering: React can pause the current rendering task and resume it later, or abandon it when it is no longer needed. This ability allows React to manage complex application scenarios more flexibly.

- Suspense: This is an important feature in the Concurrent Mode that allows components to ‘hang’ rendering while waiting for asynchronous data to load until the data is ready. This allows asynchronous operations to be handled more gracefully, providing a better user experience.

- Automatic Batching of Updates: Concurrent Mode automatically batches multiple state updates to reduce re-rendering and improve performance.

### Time Slicing and Priority Scheduling

Time slicing is triggered primarily when working on longer tasks, which React splits into smaller tasks, allowing it to check between each of them to see if there are higher priority tasks that need to be processed. If there is, React pauses the current task, processes the higher priority task, and then returns to continue the unfinished task.

Trigger scenes:

- Complex computation or rendering tasks.
- A large number of DOM updates cause the main thread to be tied up for a long time.
- Animations and user interactions that need to remain smooth.

Priority scheduling is triggered when there are multiple tasks that need to be processed at the same time, and React assigns different priorities to tasks based on their importance and urgency. For example, user input is usually considered a high priority task because of the need to respond quickly to user actions, while tasks such as data loading may be assigned a lower priority.

Trigger scenarios:

- User input (e.g., keyboard input, mouse clicks) requires a fast response.
- Network requests and data loading can be delayed.
- Component state updates and re-rendering may have different priorities.

Example:

- If a user is scrolling on a complex page while data loading is going on in the background, time slicing allows React to pause the processing of data loading to ensure smooth scrolling operations.
- If a user enters data into a form, priority scheduling ensures that input events are responded to quickly, while data synchronisation in the background may be delayed.

### Pause, resume, discard rendering

Pause rendering:

- If a user scrolls through a data-intensive page, React pauses the rendering of data-intensive components to ensure smooth scrolling.
  
Resume rendering:

- The user stops scrolling and React resumes rendering of the previously paused data-intensive component during the browser's idle time.

Discard rendering:

- When a user quickly switches between pages or views, React discards rendering tasks that have not yet been completed but are no longer needed, avoiding unnecessary computation.

### Automatic batch updates

Trigger scene:

- In the event handler function ( Before React 18, it will batch updates, too)

```jsx
function handleClick() {
  setState1(value1);
  setState2(value2);
  // React will re-render the event handler once it's finished executing it
}
```

- Of the lifecycle methods and side effects:

``` jsx
useEffect(() => {
  setState1(value1);
  setState2(value2);
  // React will do a one-time re-render after the useEffect is done.
}, []);

```

- In asynchronous operation

``` jsx
setTimeout(() => {
  setState1(value1);
  setState2(value2);
}, 1000);
```

how to exit batch updates:

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


## How to turn it on

Once you have created the root node using createRoot, all subtree components will automatically run in concurrent mode

```jsx
// index.js
import React from ‘react’.
import ReactDOM from ‘react-dom/client’;
import App from ‘. /App'; const rootElement = document.getElement

const rootElement = document.getElementById(‘root’);
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

```

### useTransition

> avoid stopping ui reader process

```jsx
import React, { useState, useTransition } from ‘react’;

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
      {isPending ? <p>Loading... </p> : <p>Count: {count}</p>}
    </div>
  );
}

export default App;

```

### useDeferredValue 

> defer render

```jsx
import React, { useState, useDeferredValue } from ‘react’;

function App() {
  const [text, setText] = useState(‘’);
  const deferredText = useDeferredValue(text);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div>
      <input type=‘text’ value={text} onChange={handleChange} />
      <p>Deferred Text: {deferredText}</p>
    </div>
  );
}

export default App;

```

## Version

`>= React 18`
