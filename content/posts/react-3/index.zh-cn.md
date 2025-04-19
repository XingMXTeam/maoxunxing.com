---
title: "React SSR (Streaming Server-Side Reandering)"
description: "React SSR是什么？"
date: 2024-08-03
tags:
  - React
images:
  - react-1/a.png
---

## 目录

- [目录](#目录)
- [React SSR 的历史](#react-ssr-的历史)
- [设计初衷](#设计初衷)
  - [示例代码](#示例代码)
    - [服务端渲染](#服务端渲染)
    - [客户端水合](#客户端水合)
- [React v16 SSR 的改进](#react-v16-ssr-的改进)
- [React v18 SSR 的改进](#react-v18-ssr-的改进)
- [流式 SSR 的实现](#流式-ssr-的实现)
  - [示例代码](#示例代码-1)
  - [解决传统 SSR 的问题](#解决传统-ssr-的问题)
    - [解决方案](#解决方案)
    - [懒加载组件](#懒加载组件)
- [什么是水合？](#什么是水合)
- [总结](#总结)

---

## React SSR 的历史

React 的服务端渲染（SSR）经历了多个版本的演进，以下是其发展的重要里程碑：

- **v0.4**：推出 `React.renderComponentToString` API，开始支持服务端渲染（SSR）。
- **v0.12**：推出 `React.renderToString` 替代原有的 API。
- **2015年 v0.14**：拆分出 `react-dom` 包，更新 API 调用方式为 `ReactDOMServer.renderToString` 和 `renderToStaticMarkup`。
- **2016年 v16**：推出 `ReactDOMServer.renderToNodeStream` 和 `renderToStaticNodeStream`，支持流式渲染。
- **2020年**：推出 RSC（React Server Component），进一步优化服务端渲染能力。
- **2022年 v18**：推出 `renderToReadableStream` 和 `renderToPipeableStream`，实现全新的服务端渲染器。

---

## 设计初衷

通过服务端生成并完成渲染内容，React 的 SSR 提供了比客户端渲染（CSR）更快的首次内容绘制时间。以下是 SSR 的主要优势：

1. **更快的首次内容绘制时间**  
   - 因为是流式的，可以更快地看到内容。
   
2. **更低的服务器资源消耗**  
   - 流式渲染允许边生成边传输，降低服务负载和资源消耗，更好地处理并发请求。

### 示例代码

#### 服务端渲染
```jsx
import { renderToString } from 'react-dom/server';

app.use('/', (request, response) => {
  const html = renderToString(<App />);
  response.send(html);
});
```

#### 客户端水合
```jsx
import { hydrateRoot } from 'react-dom/client';
import App from './App.js';

hydrateRoot(document.getElementById('root'), <App />);
```

---

## React v16 SSR 的改进

相比 v15，React v16 的 SSR 在以下几个方面进行了优化：

1. **生成的 HTML 体积更小**  
   - 去掉了 `data-reactId` 属性和注释，减少了 HTML 文件的大小。

2. **水合更宽松**  
   - 更宽松的属性检测。
   - 只替换不匹配的 HTML 子树，而不是重新渲染整个组件树。

3. **速度更快**  
   - 移除了 `process.env.NODE_ENV` 的依赖。
   - 在服务端渲染中不涉及任何虚拟 DOM 的逻辑，提升了渲染效率。

---

## React v18 SSR 的改进

React v18 引入了多项改进，进一步优化了 SSR 的性能和体验：

1. **错误处理与水合回退**  
   - 在服务端发生错误或水合不匹配时，不再自动回退到客户端渲染（CSR）。通过 `Suspense`，React 能够识别边界并进行局部回退。
   ```jsx
   <Suspense fallback={<Loading />}>
     <Component />
   </Suspense>
   ```

2. **异步水合**  
   - 对 `Hydrate` 进行了异步处理，让先渲染的部分达到可交互状态，从而提升首屏体验，特别是在接口较慢的应用中。

---

## 流式 SSR 的实现

流式 SSR 是服务端渲染的一种形式，它的特点是实时生成 HTML 片段并发送给客户端。

### 示例代码
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

### 解决传统 SSR 的问题

传统的 SSR 执行步骤如下：
1. **Fetch Data**：必须先准备好所有数据才能将组件渲染为 HTML。
2. **Load JS**：必须加载客户端的所有组件代码，然后才能开始对其中的组件进行水合。
3. **Hydration**：必须等所有的组件都水合完成后，才能对组件进行交互。

#### 解决方案
通过服务端渲染器以乱序流式 HTML，结合 `Suspense` 的能力，可以刷新之前生成的 HTML。

- **示例代码**
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

在 React v18 中，`Comments` 组件的脚本加载之前即可开始水合。如果数据已经就位但 JavaScript 代码尚未加载完成，React 会先进行一次水合；当脚本加载完成后，会再次进行水合。

#### 懒加载组件
```jsx
import { lazy } from 'react';

const Comments = lazy(() => import('./comments.js'));

<Suspense fallback={<Spinner />}>
  <Comments />
</Suspense>
```

---

## 什么是水合？

**水合（Hydration）** 是指 React 接管由服务端生成的 HTML 节点（通常是同构的 React 组件），主要是将事件绑定上去，使组件变得可交互。

- **过程**：
  1. React 将服务端生成的静态 HTML 转换为动态的、可交互的组件。
  2. 在客户端上附加事件监听器和其他交互逻辑。

- **重要性**：
  - 水合是 SSR 的关键步骤，确保服务端生成的内容能够在客户端上正常工作。

---

## 总结

React 的服务端渲染从早期的简单字符串渲染，逐步演进到流式渲染和异步水合，极大地提升了应用的性能和用户体验。通过引入 `Suspense` 和 `React Server Components` 等新特性，React v18 进一步优化了 SSR 的灵活性和效率。未来，随着技术的不断发展，React 的 SSR 能力将继续为开发者提供更强大的工具来构建高性能的 Web 应用。