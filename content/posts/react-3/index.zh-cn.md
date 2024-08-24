---
title: "React日记 #3期：SSR (Streaming Server-Side Reandering)"
description: "React SSR是什么？"
date: 2024-08-03
tags:
  - React日记
images:
  - react-1/a.png
---

{{< table_of_contents >}}

## Server-Side rendering历史

v0.4: 推出React.renderComponentToString API开始支持SSR  
v0.12: 推出React.renderToString代替原有API  
2015年 v0.14: 拆分出 react-dom 包，更新API调用方式为 ReactDOMServer.renderToString  /renderToStaticMarkup  
2016年 v16: 推出ReactDomServer.renderToNodeStream API支持流式渲染  / 推出renderToStaticNodeStream  
2020年 推出RSC ( React Server Component )  
2022年 v18: 推出renderToReadableStream, renderToPipeableStream; 实现全新的服务端渲染器  

## 设计初衷

通过服务端上生成并完成渲染内容。 和CSR(Client Server Rendering)的区别是，CSR主要是在浏览器中通过JavaScript动态生成内容。这样带来的好处是

1. **更快的首次内容绘制时间**: 因为是流式的，可以更快看到内容
2. **更低的服务器资源消耗**: 同理因为是流式的，可以边生成边传输，降低服务负载和资源消耗，更好地处理并发请求

```jsx
import {renderToString} from 'react-dom/server'
app.user('/', (request, response) => {
  const html = renderToString(<App />)
  response.send(html)
})
```

```jsx
import { hydrateRoot } from 'react-dom/client'
import App from './App.js'

hydrateRoot(document.getElementById('root'), <App />)
```

流式SSR是Server-side rendering的一种，它的特点是可以实时地生成html片段发送给客户端。

```jsx
import { renderToPipeableStream } from 'react-dom/server'

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['./main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html')
    pipe(response)
  }
})
```

## v16 ssr的区别（ 相对v15 )

1. 生成的html体积更小：去掉了data-reactId属性和注释
2. 水合更不严格：
   1. 更宽松属性检测：
   2. 只替换不匹配的html子树
3. 速度更快：
   1. 移除process.env.NODE_ENV
   2. 在服务端渲染不涉及任何虚拟DOM的逻辑

## v18 ssr的区别

- 服务端错误或者水合不匹配：会自动回退到客户端渲染；现在通过Suspense，会识别边界，而不会自动回退到CSR

```jsx
<Suspense fallback={<Loading />}>
  <Component />
</Suspense>
```

- 对 Hydrate 进行了异步处理，可以让先渲染的也达到可交互状态效果，对于首屏接口较慢的应用，进一步提升体验

问题：

SSR执行步骤： Fetch Data -> Render as HTML -> Load JS -> Hydration

1. Fetch Data: 必须先准备好所有数据才能把组件渲染为html
2. Load JS: 必须先加载客户端所有组件的代码，然后才能开始对其中的组件进行水合
3. Hydration: 必须等所有的组件都水合完成，才能对组件进行交互

解决方案：

服务端渲染器以乱序流式HTML，可以刷新之前生成的HTML。同时结合Suspense能力。

<Suspense>告诉React不用等Comments渲染完成就可以传输其他的组件， 解决**Fetch Data** 问题。当comments数据就绪时会刷新html。

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


import { use } from 'react'
function Comments() {
  const comments = use(fetch('./api/commets'))
  return (<>
    {
      comments.map((comment,i) => {
        return <p>{comment}</p>
      })
    }
  </>)
}
```

这段代码在v18之前无法使用，现在Comments脚本加载之前对应用开始水合。
Comments组件如果js代码还没加载完成，但是数据已经就位，会先水合。 等js代码加载完成会再次水合。

```jsx
import {lazy} from 'react'

const Comments = lazy(
  () => import('./comments.js')
)

<Suspense fallback={<Spinner />}>
  <Comments>
</Suspense>
```

## 什么是水合

react接管由服务端生成的html节点（一般是同构的react组件），主要是将事件绑定上去，让可以组件可交互