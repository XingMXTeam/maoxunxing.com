---
title: "React SSR (Streaming Server-Side Rendering)"
description: "What is React SSR?"
date: 2024-08-03
tags:
  - React
images:
  - react-1/a.png
---
## Table of Contents
- [Table of Contents](#table-of-contents)
- [History of React SSR](#history-of-react-ssr)
- [Original Design Intent](#original-design-intent)
  - [Example Code](#example-code)
    - [Server-Side Rendering](#server-side-rendering)
    - [Client-Side Hydration](#client-side-hydration)
- [Improvements in React v16 SSR](#improvements-in-react-v16-ssr)
- [Improvements in React v18 SSR](#improvements-in-react-v18-ssr)
- [Implementation of Streaming SSR](#implementation-of-streaming-ssr)
  - [Example Code](#example-code-1)
  - [Solving Traditional SSR Problems](#solving-traditional-ssr-problems)
    - [Solution](#solution)
    - [Lazy Loading Components](#lazy-loading-components)
- [What is Hydration?](#what-is-hydration)
- [Summary](#summary)
---
## History of React SSR
React's Server-Side Rendering (SSR) has evolved through several versions. Here are the key milestones in its development:
- **v0.4**: Introduced the `React.renderComponentToString` API, marking the beginning of SSR support.
- **v0.12**: Introduced `React.renderToString` to replace the original API.
- **2015 v0.14**: Split out the `react-dom` package and updated API calls to `ReactDOMServer.renderToString` and `renderToStaticMarkup`.
- **2016 v16**: Introduced `ReactDOMServer.renderToNodeStream` and `renderToStaticNodeStream`, adding support for streaming rendering.
- **2020**: Introduced RSC (React Server Components), further enhancing server-side rendering capabilities.
- **2022 v18**: Introduced `renderToReadableStream` and `renderToPipeableStream`, implementing a completely new server-side renderer.
---
## Original Design Intent
By generating and completing the rendering of content on the server, React's SSR provides a faster First Contentful Paint (FCP) compared to Client-Side Rendering (CSR). Here are the main advantages of SSR:
1. **Faster First Contentful Paint**
   - Because it's streaming, content can be seen more quickly.
2. **Lower Server Resource Consumption**
   - Streaming rendering allows for content to be generated and sent simultaneously, reducing server load and resource consumption, and better handling concurrent requests.
### Example Code
#### Server-Side Rendering
```jsx
import { renderToString } from 'react-dom/server';
app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```
#### Client-Side Hydration
```jsx
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';
hydrateRoot(document.getElementById('root'), <App />);
```
---
## Improvements in React v16 SSR
Compared to v15, React v16's SSR was optimized in the following areas:
1. **Smaller Generated HTML Size**
   - Removed the `data-reactId` attribute and comments, reducing the size of the HTML file.
2. **More Forgiving Hydration**
   - Looser attribute validation.
   - Only replaces mismatched HTML subtrees instead of re-rendering the entire component tree.
3. **Faster Speed**
   - Removed the dependency on `process.env.NODE_ENV`.
   - No Virtual DOM logic is involved in server-side rendering, improving rendering efficiency.
---
## Improvements in React v18 SSR
React v18 introduced several improvements that further optimized SSR performance and experience:
1. **Error Handling and Hydration Fallback**
   - When a server-side error or hydration mismatch occurs, it no longer automatically falls back to Client-Side Rendering (CSR). With `Suspense`, React can identify boundaries and perform partial fallbacks.
   ```jsx
   <Suspense fallback={<Loading />}>
     <Component />
   </Suspense>
   ```
2. **Selective Hydration**
   - Hydration is now handled selectively, allowing parts of the page that render first to become interactive sooner. This improves the initial user experience, especially in applications with slow API responses.
---
## Implementation of Streaming SSR
Streaming SSR is a form of server-side rendering characterized by the real-time generation of HTML chunks that are sent to the client.
### Example Code
```jsx
import { renderToPipeableStream } from 'react-dom/server';
const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['./main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html');
    pipe(response);
  },
});
```
### Solving Traditional SSR Problems
The steps for traditional SSR are as follows:
1. **Fetch Data**: All data must be ready before the component can be rendered to HTML.
2. **Load JS**: All component code on the client must be loaded before hydration can begin.
3. **Hydration**: You must wait for all components to be hydrated before you can interact with them.
#### Solution
By using a server renderer that streams HTML out of order, combined with the capabilities of `Suspense`, you can flush the HTML generated earlier.
- **Example Code**
```jsx
<Layout>
  <NavBar />
  <SideBar />
  <RightPane>
    <Post />
    <Suspense fallback={<Spinner />}>
      <Comments />
    </Suspense>
  </RightPane>
</Layout>
import { use } from 'react';
function Comments() {
  const comments = use(fetch('./api/comments'));
  return (
    <>
      {comments.map((comment, i) => {
        return <p key={i}>{comment}</p>;
      })}
    </>
  );
}
```
In React v18, hydration can begin before the script for the `Comments` component has loaded. If the data is ready but the JavaScript code has not yet loaded, React will perform an initial hydration; once the script is loaded, it will hydrate again.
#### Lazy Loading Components
```jsx
import { lazy } from 'react';
const Comments = lazy(() => import('./comments.js'));
<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```
---
## What is Hydration?
**Hydration** is the process where React takes over the HTML nodes generated by the server (usually for an isomorphic React component) and primarily attaches event listeners to make the component interactive.
- **Process**:
  1. React converts the static HTML generated by the server into dynamic, interactive components.
  2. It attaches event listeners and other interactive logic on the client side.
- **Importance**:
  - Hydration is a crucial step in SSR, ensuring that the content generated on the server can function correctly on the client.
---
## Summary
React's server-side rendering has evolved from simple string rendering to streaming rendering and selective hydration, significantly improving application performance and user experience. With the introduction of new features like `Suspense` and `React Server Components`, React v18 has further enhanced the flexibility and efficiency of SSR. In the future, as technology continues to advance, React's SSR capabilities will continue to provide developers with more powerful tools for building high-performance web applications.
