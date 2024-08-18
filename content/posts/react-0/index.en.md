---
title: "React Diary #0: Why React"
description: "why react"
date: 2024-07-15
tags:
  - React Diary
images:
  - react-1/a.png
---

{{< table_of_contents >}}

## Design Philosophy

The goal of React is to create a web architecture that is fast and responsive. The need to be responsive faces two problems.

1 Reducing IO latency: IO latency can't be avoided, it can only be provided through UI interactions that provide a better sense of context.

For example, time out of range and then display Loading 18 version is achieved by using Suspense useDeferedValue.

2 CPU bottleneck: During interaction, users sometimes complain about lag? Because the browser refresh frequency is 60Hz, that is, every 16.6ms browser refresh, during this period need to perform the task: js script + (js thread) style layout + style drawing (GUI rendering thread) in order to render out the user's needs, when the js script execution time is too long, resulting in the rendering of the no time (_frame dropping_), the page is lagging. Another kind of lag is when the user is in the middle of an action, and the re-rendering takes so long that it occupies the main process and can't respond to the user's actions, which is essentially the same thing as the rendering task not being completed.

> Dropped frames generally refers to the phenomenon of stuttering (either for a short or long period of time) caused by a low frame rate due to the hardware not being able to cope with the refresh rate (below 60fps) at which the game is able to run smoothly. Framerate drop in the game is the process of playing the game, there is a card this situation, the image is not timely refreshed caused by the screen stagnation.

In version 18, the js execution is divided into different tasks, also known as *time slicing*, which turns synchronous updates into interruptible asynchronous updates, i.e., the rendering task can be completed in 16.6 ms. In React, this is known as the Fiber architecture, which ensures the rendering frame rate by executing high-priority tasks (e.g., rendering user clicks, animations, etc.) as soon as the small tasks are completed.

## Architecture

{{< img src=‘arch.png’ alt=‘arch’ maxWidth=‘220px’ >}}

The React architecture is comprised of three parts:
1 Scheduler: manages task priorities
2 The coordinator: finds out what's changing
3 Renderer: responsible for rendering

## Principles

Let's start with the renderer, the other parts are mostly helper, the renderer function is a jsx to dom node that is rendered by the native dom api. What is JSX? jsx is a data structure that describes the content of the current component. In react, after babel compiles the jsx into a dsl object, the underlying React.createElement method is called to create an object whose property type $$type is Element. The react component is a different object, determined by ClassComponent.prototype.isReactComponent, and the Fiber node is a virtual DOM node, also an object.

Fiber nodes are virtual DOM nodes that are also objects. > Fiber nodes: packages/react-reconciler/src/ReactInternalTypes.js

We've talked about React's introduction of the Fiber architecture in the design rationale above. When we render a jsx into a dom node, if there are a lot of jsx nodes, the process can be very long (leading to lag), so we need to take advantage of the fibre architecture to split the rendering task. The fiber architecture is actually a tree, with each node acting as a separate unit of work.

## Framework Design

Function Set.  

- Constant Routing
- API routing
- SSR+SSG
- Extending framework capabilities with compile-time temporary files
- Plugins and Extension Mechanisms

Remix: loader + action data loading mechanism ; Fresh: OJS + deno + true bundless

- Route-based declarative data fetching: Besides community solutions like useEffect, swr, react-query, etc., if you want to pursue extreme request speed, only runtime libraries are not enough, and you need to combine them with frameworks (routing and compilation state combination) in order to launch as soon as possible, and execute them in parallel (as well as caching).

Remix: export loader method  
Umi: export clientLoader  
Qwik: export onGet method  
Fresh: export handler object containing Get method  
Solid Start: export routeData  