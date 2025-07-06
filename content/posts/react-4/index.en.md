---
title: "React Server Component"
description: "What are React Server Components?"
date: 2024-08-18
tags:
  - React
images:
  - react-1/a.png
---
## Table of Contents
1. [Design Philosophy](#design-philosophy)
2. [What is RSC?](#what-is-rsc)
3. [How to Implement RSC?](#how-to-implement-rsc)
4. [Core Method Analysis](#core-method-analysis)
5. [Relationship Between RSC and SSR](#relationship-between-rsc-and-ssr)
6. [Summary](#summary)
7. [React.use API](#reactuse-api)
8. [Difference Between RSC and RCC](#difference-between-rsc-and-rcc)
9. [Comparison of SSG, RSC, and SSR](#comparison-of-ssg-rsc-and-ssr)
10. [Interaction Rules for RSC and RCC](#interaction-rules-for-rsc-and-rcc)
11. [Custom Header `content-type: text/x-component`](#custom-header-content-type-text-x-component)
12. [Functions Cannot Be Serialized](#functions-cannot-be-serialized)
---
## Design Philosophy
The introduction of React Server Components (RSC) aims to improve the performance and development experience of React applications, mainly in the following aspects:
### 1. Reduce Client-side JavaScript Load
- **Feature**: RSC allows developers to keep some logic on the server side, reducing the amount of JavaScript code sent to the client.
- **Advantage**: Significantly improves the application's loading performance, especially for large applications or complex pages.
### 2. More Efficient Data Fetching
- **Feature**: RSC can fetch data and render components directly on the server side.
- **Advantage**: Avoids additional network requests from the client, reducing latency.
### 3. Optimize SEO and Initial Load Performance
- **Feature**: Can return a complete HTML page to the client on the initial load.
- **Advantage**: Makes it easier for search engines to crawl content and improves the user's first-visit experience.
### 4. Improve Development Experience
- **Feature**: Allows mixing client components and server components in the same project.
- **Advantage**: Developers can flexibly choose component types based on their needs, simplifying the development process.
### 5. Better Utilization of Server Resources
- **Feature**: Fully utilizes the server's computing resources, reducing the burden on client devices.
- **Advantage**: Especially suitable for users on mobile or low-performance devices, providing a smoother experience.
---
## What is RSC?
The server converts JSX (in this case, the RSC component) into HTML and then sends it to the client for rendering. This is Server-Side Rendering (SSR).  
The core idea of RSC is to send a request via JS to get the latest block of HTML and replace the block's content through hydration.
### Features
1. **Seamless Refresh**: Only updates the content of specific blocks, while the state of other blocks remains unchanged.
2. **Hijacking `<a>` tag clicks**: Simulates a page refresh using `pushState`, combined with RSC components to replace the refreshed content, achieving a seamless replacement.
---
## How to Implement RSC?
### Server-Side Rendering Flow
1. **Return HTML as a String**  
   Normally, the server can directly return an HTML string to the client.
   
2. **Use a Babel Plugin to Process JSX**  
   - Using the `node-jsx-loader` plugin, you can write JSX on the server side.
   - This plugin converts JSX into a JS object (containing `type` and `props`), which can then be further converted to HTML and sent to the client.
---
## Core Method Analysis
### 1. `renderJSXToClientJSX`
- **Function**: The server converts a JSX component into a JSX object and then serializes it into JSON to be passed to the client.
- **Advantage**: After the client receives the JSON, it can directly update the DOM without reloading the entire page.
### 2. `renderToString`
- **Function**: Converts JSX into an HTML string, which is then sent to the browser for hydration by the client.
- **Use Case**: Suitable for traditional SSR scenarios.
---
## Relationship Between RSC and SSR
- **Independent but Combinable**  
  Server Components (RSC) and Server-Side Rendering (SSR) are two independent technologies, but they can be used together to build applications that span the server and client.
  
- **Differences**  
  - **SSR**: The output is HTML.
  - **RSC**: The output is a set of instructions that guide the client on how to update the content of specific blocks.
---
## Summary
The introduction of React Server Components brings many advantages to modern web applications:
- Reduces the client-side JavaScript load, improving loading performance.
- Completes data fetching and rendering on the server side, optimizing the user experience.
- Supports seamless refresh and state preservation, enhancing the interactive experience.
- A flexible development model allows developers to freely choose component types based on their needs.
Through core methods like `renderJSXToClientJSX` and `renderToString`, RSC achieves efficient cross-environment collaboration. In the future, as technology continues to evolve, RSC will continue to provide developers with more powerful tools to build high-performance, high-experience web applications.
---
## React.use API
**Overview:**  
The React.use API allows components to achieve isomorphic rendering between the server and client, with automatic fallback to CSR (Client-Side Rendering).
**Use Case:**  
Applicable to RSC (React Server Components) scenarios.
---
## Difference Between RSC and RCC (React Client Component)
| **Concept**       | **Description**                                                                 |
| -------------- | ------------------------------------------------------------------------ |
| RSC            | A component that fetches data from the backend, typically used for server-side rendering.                 |
| RCC            | An interactive component containing data, typically running on the client and supporting user interaction.        |
**Use Case:**  
RSC and RCC are core concepts in React Server Components, responsible for the division of duties between the server and the client.
---
## Comparison of SSG, RSC, and SSR
| **Strategy**       | **Description**                                                                 |
| -------------- | ------------------------------------------------------------------------ |
| SSG            | A compile-time strategy that generates static HTML files during the build phase.                                               |
| RSC            | A runtime strategy that outputs a JSON-like data structure and supports streaming.                                           |
| SSR            | A runtime strategy that outputs a complete HTML file.                                                   |
**Characteristics:**  
- RSC and SSR can coexist.
- SSG is more suitable for static content, while RSC and SSR are better for dynamic content.
**Use Case:**  
RSC's streaming output can significantly improve first-paint performance while supporting dynamic data updates.
---
## Interaction Rules for RSC and RCC
| **Rule**       | **Description**                                                                 |
| -------------- | ------------------------------------------------------------------------ |
| RSC and RCC     | Can be interleaved, but an RCC cannot directly import an RSC.                                             |
| RSC using RCC   | An RSC can use an RCC via `children` because the RCC can access data at runtime.                           |
**Additional Notes:**  
This design ensures a separation of concerns between the server and client while allowing for flexible component composition.
---
## Custom Header `content-type: text/x-component`
**Overview:**  
`content-type: text/x-component` is a custom header used to identify the response data format for RSC.
**Purpose:**  
- Differentiates from normal HTML or JSON responses.
- Ensures the client can correctly parse the streamed RSC data.
**Use Case:**  
In RSC scenarios, the data returned by the server will have this header so the client can identify and process it.
---
## Functions Cannot Be Serialized
**Problem Description:**  
In JavaScript, functions cannot be serialized using `JSON.stringify`.
**Example Code:**
```javascript
const obj = {
  name: 'John',
  age: 30,
  sayHello: function() {
    console.log('Hello!');
  }
};
const json = JSON.stringify(obj);
console.log(json); // Output: {"name":"John","age":30}
```
**Reasoning:**  
`JSON.stringify` can only serialize basic data types within an object (like strings, numbers, booleans, etc.) and cannot handle functions or methods.
**Application Scenario:**  
In the RSC serialization protocol, special care must be taken to avoid passing objects that contain functions, as this can lead to data loss or errors.
