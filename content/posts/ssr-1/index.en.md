---
title: "A Practical Guide to SSR"
date: 2021-08-24
tags:
  - Web Development
  - SSR
description: ""
---
## Table of Contents
- [Table of Contents](#table-of-contents)
- [SSR Concepts and Classifications](#ssr-concepts-and-classifications)
  - [SSR (Server-Side Rendering)](#ssr-server-side-rendering)
  - [SSG (Static Site Generation)](#ssg-static-site-generation)
  - [Personalized SSR](#personalized-ssr)
- [Hydrate](#hydrate)
- [Serverless](#serverless)
  - [1. Definition of FaaS](#1-definition-of-faas)
  - [2. Definition of Serverless](#2-definition-of-serverless)
  - [3. Relationship between FaaS and Serverless](#3-relationship-between-faas-and-serverless)
  - [4. Characteristics of FaaS](#4-characteristics-of-faas)
  - [5. Characteristics of Serverless](#5-characteristics-of-serverless)
  - [6. Deploying Serverless Services via FaaS](#6-deploying-serverless-services-via-faas)
  - [7. Advantages of FaaS](#7-advantages-of-faas)
- [Isomorphism](#isomorphism)
- [Expertise and Case Studies](#expertise-and-case-studies)
- [Debugging Methods](#debugging-methods)
- [Streaming Rendering](#streaming-rendering)
- [Origin Server Architecture](#origin-server-architecture)
- [VM Template Compilation](#vm-template-compilation)
- [Page Routing](#page-routing)
- [Underlying SSR Rendering](#underlying-ssr-rendering)
---
## SSR Concepts and Classifications
### SSR (Server-Side Rendering)
Definition: The server generates HTML, and then the browser binds the state and events, making it a fully interactive page.
Scenarios: Suitable for SEO optimization and improving first-screen load speed.
### SSG (Static Site Generation)
Combines CDN caching of HTML by pre-generating static pages and caching them on the CDN to further improve performance.
### Personalized SSR
Dynamically adjust rendering strategy based on device performance:
- High-end devices: CSR (Client-Side Rendering)
- Low-end devices: SSG (Static Site Generation)
---
## Hydrate
**Definition:** Executing the business bundle to bind events and state.
**Characteristics:**
- If the hydration result matches the SSR render result, no repaint occurs. Otherwise, it might cause LCP to be recalculated, leading to a larger LCP.
- If the two do not match, it will re-render, which can cause page layout issues or flickering. (The JS and hydrated HTML structure must be identical; **for example, rendering different JSX based on an isSSR check in the code can cause style corruption**).
---
## Serverless
Deploy Serverless services via FaaS (Function as a Service) to provide page rendering capabilities.
### 1. Definition of FaaS
- **FaaS (Function as a Service)** is a stateless, event-driven computing service.
- Functions are deployed independently, scale automatically, and run on demand.
- FaaS generally only has internal RPC interfaces (e.g., HSF) and cannot expose HTTP endpoints directly, so a gateway is usually needed for forwarding.
### 2. Definition of Serverless
- **Serverless** is an architectural pattern that eliminates the need to manage servers.
- It includes infrastructure for computing (like FaaS), storage, databases, etc.
### 3. Relationship between FaaS and Serverless
- **FaaS is a part of Serverless**:
  - FaaS provides the computing capability.
  - Serverless is a broader concept, covering the serverless nature of the entire application.
### 4. Characteristics of FaaS
- **Stateless**: Functions do not retain state; external storage is required for state management.
- **Auto-scaling**: Dynamically adjusts resources based on traffic.
- **Event-driven**: Triggered by HTTP requests, scheduled tasks, etc.
- **Independent Deployment**: Supports fine-grained decomposition and microservices architecture.
### 5. Characteristics of Serverless
- **Full-stack Support**: Includes computing, storage, networking, etc.
- **Pay-per-use**: Pay only for what you actually use.
- **High Availability**: Cloud providers ensure the stability of the underlying infrastructure.
- **Simplified Operations**: No need to manage servers or runtime environments.
### 6. Deploying Serverless Services via FaaS
- Use FaaS to provide page rendering capabilities.
- Encapsulate rendering logic into functions, triggered by HTTP requests.
- **Advantages**:
  - Process requests in parallel, improving performance.
  - Differentiated request handling to implement fallback strategies.
### 7. Advantages of FaaS
- **High Performance**: Parallel processing, dynamic scaling.
- **Flexibility**: Adjust logic based on request content.
- **Low Cost**: No need to manage servers.
- **Rapid Iteration**: Independent deployment supports fast releases.
---
## Isomorphism
Code that supports both CSR and SSR, achieving front-end and back-end unification.
---
## Expertise and Case Studies
| **Knowledge Point** | **Case** |
| --- | --- |
| During SSR, if the front-end has no data, a fallback secondary request is initiated | SSR |
| When the same HSF is called multiple times in a single request with identical parameters, the result can be reused | SSR |
| Logs are typically under `home/admin/logs`:<br>- `cai` contains Nginx logs<br>- `[appname]` contains application logs<br>- `bin` contains some useful scripts | SSR |
| Memory leaks discovered through stress testing and log analysis | SSR |
| Unified SDK encapsulation (e.g., Midway-FaaS components for log handling) for FaaS functions to use | SSR |
| **Tool** | **Purpose** |
| --- | --- |
| npm package: `escapeHtml` | Used in SSR to escape HTML strings |
---
## Debugging Methods
How to switch to SSR:
1. In the browser's developer tools, block JS requests via the Network panel.
2. View the SSR rendering result (i.e., the result before hydration).
---
## Streaming Rendering
**Definition:** Streaming rendering is an optimization technique primarily used to address the issue of sending data to the client preferentially when one of several requests returns first.
**Characteristics:**
- Has some impact on QPS (Queries Per Second).
- Improves user experience by reducing wait times.
## Origin Server Architecture
1. General Gateway: Handles proxy forwarding, site-specific proxy forwarding.
2. The rendering gateway has non-business disaster recovery, such as fallbacks for failed page requests / 404s.
3. Data Gateway
4. The FaaS layer usually has business rate-limiting and disaster recovery for interfaces (single-machine rate limiting), including application-level disaster recovery like a multilingual fallbackCache.
## VM Template Compilation
The VM template is implemented using React syntax. It is compiled by a separate VM execution to detect problems in the early development stage and prevent code passthrough.
```js
ReactServer.renderToStaticMarkup(
  <DocumentContext.Provider value={context}>
    <DocumentElement />
  </DocumentContext.Provider>
);
```
## Page Routing
For example, aa.com/a/p/1.html -> aa.pc.a-p is used as a unique key for configuration. The `path-to-regexp` package is used to match pathnames and URLs.
---
## Underlying SSR Rendering
document.tsx is essentially a React component, and the SSR components within it are distributed in other JS files. The build output is still React code (compiled from JSX), which is rendered into an HTML string at runtime by React's functions.
