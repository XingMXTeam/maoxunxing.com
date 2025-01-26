---
title: "HTTP协议 #1期：html标签属性实现页面性能优化"
description: "dns-prefetch vs preload vs preconnect vs prefetch vs Early Hints 103"
date: 2024-09-10
tags:
  - HTTP协议
images:
  - http-1/a.jpg
---

{{< table_of_contents >}}

## prefetch

空闲时间加载。对当前页面性能影响较小，适用于提前获取下一页面的资源，进入浏览器缓存。

注意点：
默认不带cookie, credentials属性会让请求带上cookie

```html
<link rel='prefetch' href='...' as='script' credentials='include'>
```

甚至可以动态设置缓存时间。

```js
app.get('next-page', (req, res) => {
  const header = req.headers['purpose'] || req.headers['sec-purpose']
  if(header === 'prefetch') {
    res.set('Cache-Control', 'max-age=10')
  }
  res.send('next page content')
})
```

也可以用Service Worker控制。

## preload 

立即加载关键资源，无需等待DOM树解析。当某个资源（如字体、CSS、JS、图像等）是页面加载的关键部分，但无法通过正常的加载顺序立即获得时，使用 preload 让浏览器优先加载这些资源。

注意点：资源加载是同步的

```html
<link rel="preload" href="styles.css" as="style">
```


## preconnect

提前建立到外部资源服务器的网络连接，包括 DNS 解析、TCP 握手和 TLS 协商。如果仅仅想要提前解析，可以
用`dns-preconnect`

适合用于需要访问第三方资源的场景，比如字体库、CDN 资源等。
只预先建立网络连接，并不实际下载资源。减少了请求外部资源时的延迟。

设置可以在服务端动态设置

```js
app.get('/', (req, res) => {

  res.set('Link', [
    '<https://example.com>; rel=preconnect',
    '<https://fonts.googleapis.com>; rel=preconnect'
  ])

  res.flushHeaders(); // 立即发送

  const rs = fs.createReadStream('content')
  rs.pipe(res)
})
```

## 启发

ssr时可先返回静态部分，包含以上的一些资源。然后再处理耗时的核心html生成。
如果服务器响应较慢，浏览器仍然需要等到响应完成才会执行加载。这个时候可以用Early Hints 103。

```js

http.createServer((req,res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Transfer-Encoding': 'chunked'
  })


  // 先返回静态部分
  setTimeout(async  () => {
    const firstScreenData = await getFirstData()
    res.write(`<link rel='preload' href='${firstScreenData.src}' as='image'> `)
  },1000)

  // 再返回复杂计算部分
  // todo
})


```

## Early Hints 103

适用于服务器响应时间较长、想要最大程度优化用户感知加载速度的场景。

```js

app.get('/', (req, res) => {
  res.status(103).set({
    Link: [
      '</styles/main.css>; rel=preload; as=style',
      '</images/a.jpg>; rel=preload; as=image'
    ].join(',')
  })
  .end()

  //  再返回真实的内容
  const rs = fs.createReadStream('content')
  res.set('Content-Type', 'text/html')
  rs.pipe(res)
})

```

