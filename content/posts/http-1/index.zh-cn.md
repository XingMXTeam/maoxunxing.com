---
title: "资源优化与加载策略"
description: "dns-prefetch vs preload vs preconnect vs prefetch vs Early Hints 103"
date: 2024-09-10
tags:
  - 性能优化
  - Web开发
images:
  - http-1/a.jpg
---
在现代 Web 开发中，优化资源加载是提升用户体验的重要手段。以下是一些常见的资源加载优化技术及其使用方法。

## **1. Prefetch**

**用途**：  
`prefetch` 用于在浏览器空闲时间加载资源，对当前页面性能影响较小，适用于提前获取下一页面的资源并存入浏览器缓存。

**特点**：
- 默认情况下，`prefetch` 请求不带 Cookie。
- 可通过 `credentials` 属性让请求带上 Cookie。

**示例代码**：
```html
<link rel="prefetch" href="next-page.js" as="script" credentials="include">
```

**动态设置缓存时间**：
可以通过服务端动态设置资源的缓存时间，以控制资源的有效期。
```js
app.get('/next-page', (req, res) => {
  const header = req.headers['purpose'] || req.headers['sec-purpose'];
  if (header === 'prefetch') {
    res.set('Cache-Control', 'max-age=10'); // 设置缓存时间为 10 秒
  }
  res.send('next page content');
});
```

**扩展**：  
还可以结合 Service Worker 控制资源的加载和缓存策略。

---

## **2. Preload**

**用途**：  
`preload` 用于立即加载关键资源（如字体、CSS、JS、图像等），无需等待 DOM 树解析完成。当某个资源是页面加载的关键部分但无法通过正常加载顺序立即获得时，可以使用 `preload`。

**特点**：
- 资源加载是同步的，确保关键资源优先加载。

**示例代码**：
```html
<link rel="preload" href="styles.css" as="style">
```

---

## **3. Preconnect**

**用途**：  
`preconnect` 提前建立到外部资源服务器的网络连接，包括 DNS 解析、TCP 握手和 TLS 协商。如果仅需要提前解析域名，可以使用 `dns-prefetch`。

**适用场景**：
- 访问第三方资源（如字体库、CDN 资源）时，减少请求外部资源时的延迟。

**示例代码**：
```html
<link rel="preconnect" href="https://example.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
```

**服务端动态设置**：
可以在服务端通过响应头动态设置 `preconnect`。
```js
app.get('/', (req, res) => {
  res.set('Link', [
    '<https://example.com>; rel=preconnect',
    '<https://fonts.googleapis.com>; rel=preconnect'
  ]);
  res.flushHeaders(); // 立即发送
  const rs = fs.createReadStream('content');
  rs.pipe(res);
});
```

---

## **4. 启发：SSR 场景下的资源优化**

在 SSR（服务端渲染）场景下，可以先返回静态部分内容（包含资源加载提示），然后再处理耗时的核心 HTML 生成逻辑。

**问题背景**：  
如果服务器响应较慢，浏览器会等到整个响应完成后才开始加载资源。为解决这一问题，可以结合 `Early Hints 103` 或分块传输（Chunked Transfer Encoding）来优化。

**示例代码**：
```js
http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'Transfer-Encoding': 'chunked'
  });

  // 先返回静态部分
  setTimeout(async () => {
    const firstScreenData = await getFirstData();
    res.write(`<link rel="preload" href="${firstScreenData.src}" as="image">`);
  }, 1000);

  // 再返回复杂计算部分
  // TODO: 处理核心 HTML 生成逻辑
});
```

---

## **5. Early Hints 103**

**用途**：  
`Early Hints 103` 是一种 HTTP 响应状态码，适用于服务器响应时间较长、想要最大程度优化用户感知加载速度的场景。

**特点**：
- 在主响应之前，提前告知浏览器需要预加载的资源。
- 减少关键资源的加载延迟。

**示例代码**：
```js
app.get('/', (req, res) => {
  res.status(103).set({
    Link: [
      '</styles/main.css>; rel=preload; as=style',
      '</images/a.jpg>; rel=preload; as=image'
    ].join(',')
  }).end();

  // 再返回真实的内容
  const rs = fs.createReadStream('content');
  res.set('Content-Type', 'text/html');
  rs.pipe(res);
});
```

---

## **总结**

以上介绍了几种常见的资源加载优化技术及其使用场景：

1. **Prefetch**：提前加载下一页面资源，适合空闲时间加载。
2. **Preload**：立即加载关键资源，确保页面加载流畅。
3. **Preconnect**：提前建立网络连接，减少第三方资源加载延迟。
4. **Early Hints 103**：在主响应之前提前告知浏览器需要加载的资源，优化用户感知速度。

这些技术可以根据具体场景灵活组合使用，从而显著提升页面加载性能和用户体验。