---
title: "HTTP协议"
date: 2021-12-22T20:10:28+08:00
tags:
  - HTTP
---

## 请求参数可以是数组吗？

### **1. 答案**

请求参数可以是数组。  
以前我误以为 JSON 的请求参数只能是对象，或者以 `key=value` 的形式传递。

### **2. 示例代码**

以下是一个通过 AJAX 发送 JSON 数据的示例：

```ts
$.ajax({
  type: "POST",
  url: "index.php",
  dataType: "json",
  data: JSON.stringify({ paramName: info }),
  success: function (msg) {
    $(".answer").html(msg);
  },
});
```

### **3. 参考资料**

- [Pass array to AJAX request in AJAX - Stack Overflow](https://stackoverflow.com/questions/8890524/pass-array-to-ajax-request-in-ajax)

### **4.1 请求参数的形式**

- **JSON 对象**：可以通过 `JSON.stringify` 将 JavaScript 对象序列化为 JSON 字符串。
- **数组**：同样可以作为请求参数传递，例如：
  ```ts
  $.ajax({
    type: "POST",
    url: "index.php",
    dataType: "json",
    data: JSON.stringify([1, 2, 3, 4]),
    success: function (msg) {
      console.log(msg);
    },
  });
  ```

---

## HTTPS

https://www.wosign.com/News/news_2018082801.htm


---

## LightProxy

除了chrome，一般有些场景需要全局代理，之前用charles比较多，最近用`LightProxy`较多。 但是发现firefox代理的时候提示证书问题，表现就是访问浏览器时提示:  **网页不安全**

解决办法： 

1、是安装证书，除了本机安装外，还需要在浏览器导入证书 

![导入证书](image.png)

2、禁用HSTS 
在 Firefox 地址栏输入 about:config，搜索 network.stricttransportsecurity.preloadlist，将其设置为 false。


**LightProxy** 是一个基于 Node.js 的轻量级代理工具，主要用于调试和拦截 HTTP/HTTPS 请求。它通过中间人攻击（Man-in-the-Middle, MITM）的方式来解密 HTTPS 流量，从而允许用户查看和修改加密的请求内容。

---

## HTTP2协议

### HTTP Pipelining

- **定义**：将多个 HTTP 请求放到一个 TCP 连接中依次发送，而无需等待服务器对前一个请求的响应。
- **特点**：
  - 客户端仍需按照发送请求的顺序接收响应。
  - 存在线头阻塞（Head of Line Blocking）的问题。

### 线头阻塞（Head of Line Blocking）

- **定义**：由于 HTTP Pipelining 的限制，后续请求必须等待前面请求的响应返回后才能被处理，导致延迟增加。

### RTT (Round-Trip Time)

- **定义**：从发送方发送数据开始，到收到来自接收方的确认信息所经历的时间。
- **组成部分**：
  1. **链路传播时间**：数据在链路上传播所需的时间。
  2. **末端系统处理时间**：发送方和接收方处理数据的时间。
  3. **路由器缓存中的排队和处理时间**：受网络拥塞程度影响。
- **影响**：RTT 的变化反映了网络拥塞程度的变化。
- **示例**：若 RTT 为 1 毫秒，则 1 秒内只能完成 1000 次 RPC 往返响应。

### TLS (Transport Layer Security)

- **定义**：传输层安全协议，用于加密通信，确保数据的机密性和完整性。

### HTTP/2 的二进制协议特性

- **多路复用的流**：支持在一个 TCP 连接上同时传输多个请求和响应，极大改善高延迟网络下的体验。

## 解决了什么问题

1. **保持 HTTP 协议语义不变**：
   - 不会修改 HTTP 协议原有的语义（如请求头字段等）。

2. **改进数据链路层**：
   - 减少了网络往返传输的数量。
   - 使用多路复用和快速丢弃不需要的流，完全避免了线头阻塞（Head of Line Blocking）问题。
   - 支持大量并行流，即使网站的数据分布在不同位置也不会成为瓶颈。
   - 合理利用流的优先级，让客户端优先接收更重要的数据。

## SPDY 协议

- **定义**：由 Google 开发的协议，旨在解决 HTTP/1.1 的性能问题。
- **目标**：提高页面加载速度。
- **影响**：由于效果显著，HTTP 工作组（HTTP-WG）将其纳入 HTTP/2 标准。

## 哪些优化手段不再需要

1. **域名分片**：
   - 在 HTTP/1.1 中，通过使用多个域名来突破浏览器对单个域名的连接数限制。
   - 在 HTTP/2 中，多路复用已经解决了这个问题，域名分片不再必要。

2. **内联图片**：
   - 将小图片直接嵌入 HTML 或 CSS 中以减少请求数量。
   - HTTP/2 的多路复用能力使得这种优化手段变得多余。

3. **雪碧图**：
   - 将多个小图标合并成一张大图以减少请求数量。
   - HTTP/2 的高效请求处理能力使得雪碧图的优势不再明显。

## 参考资料

- [HTTP/2 - High Performance Browser Networking](https://hpbn.co/http2/)
- [http2-explained](https://bagder.gitbooks.io/http2-explained/content/zh/part4.html)
- [HTTP/2.0 相比 1.0 有哪些重大改进](https://www.zhihu.com/question/34074946/answer/108588042)
- [HTTP/2 资料汇总](https://imququ.com/post/http2-resource.html)
- [What is HTTP/2 – The Ultimate Guide](https://kinsta.com/learn/what-is-http2/#how_you_can_start_using_http2)
- [HTTP/2 简介](https://developers.google.com/web/fundamentals/performance/http2/)
- [掘金文章：HTTP/2 实践](https://juejin.im/entry/583e9e52ac502e006c30d28c)

## 问题记录

### 百度认证

搜索结果直接跳转到https站点，需要通过百度认证。
百度认证的时候只会爬不需要登录的页面

### 问题记录

1. 后端做redirect的时候https 转为http。
2. 当页面请求为https时，如果其中的图片请求为http时，在ie8版本以下无法正常访问。
3. 前端localstorage 不能跨http和https使用。全站顶部搜索历史记录http和https下不能同步。
4.

### 图片

http访问htttps 可以的
https访问http 浏览器会提示不安全。 IE8下面，图片都会挂掉
iframe里面的http图片会有影响吗

### js

https访问http 会block
