---
title: "What Problems Does React Solve?"
description: "Why React?"
date: 2024-07-15
tags:
  - React
images:
  - react-1/a.png
---
## Design Philosophy
React's goal is to create a fast and responsive web architecture. To achieve this, React needs to solve two core problems:
### 1. Reducing IO Latency
- **Problem**: IO latency cannot be completely avoided, but the user experience can be improved by optimizing UI interactions.
- **Solution**:
  - In some cases, delaying the display of a loading state (like a spinner) can improve the user's perceived experience.
  - React 18 implements smarter loading and deferring strategies through **Suspense** and **useDeferredValue**.
### 2. Solving the CPU Bottleneck
- **Problem**: The browser's refresh rate is 60Hz (refreshing every 16.6ms). Within this timeframe, the following tasks must be completed:
  - Execute JavaScript scripts (JS thread)
  - Style layout and painting (GUI rendering thread)
- If a JavaScript script takes too long to execute, the rendering task cannot be completed on time, leading to **frame drops**, which manifest as page stuttering.
- **Definition of Frame Drop**:  
  > A frame drop occurs when the frame rate falls below 60fps due to insufficient hardware performance or long-running tasks, causing the screen to stutter or freeze.
- **React 18's Solution**:
  - Introduces **Time Slicing**, which splits synchronous update tasks into interruptible asynchronous ones.
  - Uses the **Fiber Architecture** to break down tasks into smaller units, prioritizing high-priority tasks (like user clicks, animations, etc.) to ensure a stable rendering frame rate.
---
## Architecture Design
React's architecture consists of three main parts:
1. **Scheduler**  
   - Manages task priorities to ensure high-priority tasks are executed first.
2. **Reconciler**  
   - Responsible for finding what has changed and performing a comparison (Diffing).
3. **Renderer**  
   - Responsible for converting the virtual DOM into actual DOM nodes and rendering them on the page.
![React Architecture Diagram](arch.png)
---
## Principle Analysis
### How the Renderer Works
- **Render Function**: Converts JSX into DOM nodes and renders them using native DOM APIs.
- **What is JSX?**
  - JSX is a data structure that describes the content of a component.
  - In React, Babel compiles JSX into a DSL object. Under the hood, it calls the `React.createElement` method, which generates an object with a type property of `Element`.
  - A React component is a special object. You can check if it's a class component using `ClassComponent.prototype.isReactComponent`.
### Fiber Architecture
- **Fiber Node**:  
  - A Fiber node is a virtual DOM node and also an object, defined in `packages/react-reconciler/src/ReactInternalTypes.js`.
  - The Fiber architecture is essentially a tree, with each node serving as an individual unit of work.
- **Why is Fiber needed?**
  - When there are a large number of JSX nodes, direct rendering can cause long-running tasks that block the main thread (stuttering).
  - The Fiber architecture splits the rendering task into multiple smaller tasks and uses time slicing to complete them incrementally, ensuring the main thread is not blocked for long periods.
---
## Framework Design and Feature Set
Modern front-end frameworks typically include the following features in their design:
### Feature Set
1. **Convention-based Routing**  
   - Automatically generates route configurations based on the file directory, reducing the complexity of manual configuration.
2. **API Routes**  
   - Provides back-end API support, facilitating integrated front-end and back-end development.
3. **SSR + SSG**  
   - Supports Server-Side Rendering (SSR) and Static Site Generation (SSG) to improve initial load speed and SEO performance.
4. **Compile-time Extensions**  
   - Extends framework capabilities through temporary files at compile time, offering greater flexibility.
5. **Plugins and Extension Mechanisms**  
   - Supports plugin-based development, allowing developers to include functional modules as needed.
---
### Data Loading Mechanism Comparison
Different frameworks have their own implementations for data loading mechanisms. Here is a comparison of several mainstream frameworks:
| Framework       | Data Loading Method                     | Features                                                         |
|------------|----------------------------------|--------------------------------------------------------------|
| **Remix**  | `export loader`                 | Loads data via a `loader` function, supporting route-level declarative data fetching.    |
| **Umi**    | `export clientLoader`           | Provides a client-side data loading method, combining routing and compile-time optimizations to speed up requests.         |
| **Qwik**   | `export onGet`                  | Uses an `onGet` method to load data, emphasizing its resumable lazy-loading capabilities.            |
| **Fresh**  | `export handler`                | Exports a handler object containing a `Get` method, based on Deno and a true bundless architecture. |
| **Solid Start** | `export routeData`          | Provides a `routeData` function, supporting declarative data fetching and cache optimization.          |
---
### Core Idea of Data Loading
- **Runtime Libraries vs. Framework Integration**  
  - Community solutions (like `useEffect`, `SWR`, `React Query`) can solve some problems, but if you are pursuing the ultimate request speed, relying solely on runtime libraries is not enough.
  - Data loading needs to be deeply integrated with the framework (combining routing and compile-time aspects) to achieve faster request initiation, parallel execution, and cache optimization.
---
## Summary
React's design philosophy revolves around improving the responsiveness of web applications. By introducing the **Fiber Architecture** and **Time Slicing**, it solves the performance bottlenecks found in traditional rendering. Meanwhile, modern front-end frameworks are continuously evolving in their functional design, offering a rich set of tools and mechanisms (such as convention-based routing, SSR/SSG, plugin extensions, etc.) to help developers build high-performance applications.
By deeply understanding React's architecture and principles, as well as the data loading mechanisms of different frameworks, we can better choose and design technical solutions that fit our project's needs.
