---
title: "React Diary #2: SSR (Streaming Server-Side Reandering)"
description: "what is Streaming Server-Side Reandering ?"
date: 2024-08-03
tags:
  - React Diary
images:
  - react-1/a.png
---

## Server-Side rendering history

v0.4: Introduced React.renderComponentToString API to start SSR support  
v0.12: Introduced React.renderToString to replace the old API.  
v0.14: Split the react-dom package and updated the API call to ReactDOMServer.renderToString.  
v16: Introduced ReactDomServer.renderToNodeStream API to support stream rendering.  
v18: Implemented a new server-side renderer.  

## Initial design intent

Generate and complete rendered content on the server side. The difference with CSR (Client Server Rendering) is that CSR mainly generates content dynamically in the browser via JavaScript. This brings the following benefits

1. **Faster time to first content drawing**: because it is streaming, you can see the content faster
2. **Lower Server Resource Consumption**: Similarly, because it's streaming, it can be transmitted while it's being generated, which reduces service load and resource consumption, and better handles concurrent requests.

```js
import {renderToString} from 'react-dom/server'
app.user('/', (request, response) => {
  const html = renderToString(<App />)
  response.send(html)
})
```

```js
import { hydrateRoot } from 'react-dom/client'
import App from '. /App.js'

hydrateRoot(document.getElementById('root'), <App />)
```

Streaming SSR is a type of Server-side rendering that features real-time generation of html snippets to send to the client.

```js
import { renderToPipeableStream } from 'react-dom/server'

const { pipe } = renderToPipeableStream(<App />, {
  bootstrapScripts: ['. /main.js'],
  onShellReady() {
    response.setHeader('content-type', 'text/html')
    pipe(response)
  }
})
```

## v16 ssr differences (relative to v15 )

1. generated html is smaller: removed data-reactId attribute and comments
2. less strict hydration:
   1. more relaxed attribute detection:
   2. replace only mismatched html subtree
3. faster:
   1. remove process.env.NODE_ENV
   2. server-side rendering does not involve any virtual DOM logic

## v18 ssr differences

- Server-side error or hydration mismatch: automatically fallback to client-side rendering; now with Suspense, boundaries are recognised without automatically falling back to the CSR

```js
<Suspense fallback={<Loading />}>
  <Component />
</Suspense>
```

- Asynchronous processing of Hydrate allows for interactive state effects to be rendered first, further improving the experience for applications with slow first screen interfaces.

Problems:

SSR execution steps: Fetch Data -> Render as HTML -> Load JS -> Hydration

1. Fetch Data: All data must be ready before rendering the component as html.
2. Load JS: You must load the code of all the components on the client side before you can start hydrating them.
3. Hydration: You must wait until all components are hydrated before you can interact with them.

Solution:

The server-side renderer streams HTML in a chaotic fashion that refreshes previously generated HTML. combined with the Suspense capability.

<Suspense> tells React to transfer other components without waiting for Comments to finish rendering, solving the **Fetch Data** problem. The html is refreshed when the comments data is ready.

```js
<Layout>
  <NavBar />
  <SideBar />
  <RightPane
    <Post />
    <Suspense fallback={<Spinner />}>
      <Comments />
    </Suspense>
  </RightPane>
</Layout>


import { use } from 'react'
function Comments() {
  const comments = use(fetch('. /api/commets'))
  return (<>
    {
      comments.map((comments,i) => {
        return <p>{comment}</p>
      })
    }
  </>)
}
```

This code didn't work before v18, now the Comments script starts hydration on the app before it loads.
The Comments component will hydrate first if the js code hasn't finished loading but the data is in place. It will hydrate again when the js code finishes loading.

```Js
import {lazy} from 'react'

const Comments = lazy(
  () => import('. /comments.js')
)

<Suspense fallback={<Spinner />}}
  <Comments />
</Suspense


```

Translated with DeepL.com (free version)