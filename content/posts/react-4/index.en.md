---
title: "React Diary #4: React Server Component"
description: "what is React Server Component ?"
date: 2024-08-18
tags:
  - React Diary
images:
  - react-1/a.png
---

{{< table_of_contents >}}

## Initial design intent

Enhancing the performance and developer experience of React applications:

- **Reducing client-side JavaScript load:** RSC allows developers to execute part of the logic on the server side, reducing the amount of JavaScript that needs to be sent to the client, thus improving application load performance.
- **More efficient data fetching:** RSC enables components to fetch data and render on the server side directly.
- **Optimizing SEO and initial load performance:** HTML pages can be returned to the client upon the first load.
- **Improving developer experience:** Developers can use both client components and server components within the same project.
- **Better utilization of server resources:** RSC allows better use of server computing resources, thereby reducing the load on client devices. This is particularly important for users on mobile devices or low-performance devices.

Features：

- Refresh senselessly and without refreshing the state of other blocks
- Hijack a tag click, simulate page refresh by pushState, and replace the refreshed content by means of RSC component. Can keep the state of other blocks and replace the refresh content senselessly.

## What

Convert jsx (here jsx is RSC component) to html by server and send to client for rendering is ssr, send request to get latest block html hydration to replace block by js.

Server components and server rendering (SSR) are separate technologies that can be used together to build cross-server and client applications. ssr produces HTML, server components produce instructions.

## How

Rendering content on the server side normally returns html as a string, but with the babel plugin: node-jsx-loader, you can write jsx on the server side. This plugin converts jsx into a js object (with type and props), which can be converted to html and sent to the client.

The core is these two methods:

1. renderJSXToClientJSX: server-side jsx component will be converted to jsx object. And then into json passed to the client can update the dom!  
2. renderToString: jsx into a string, sent to the browser converted to htm3. Then the client needs to be hydrated!

CSR in-depth: [Introduction to the CSR protocol](https://juejin.cn/post/7244452476190752829)
