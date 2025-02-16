---
title: "HTTP/2 协议详解"
date: 2019-11-25
tags:
  - HTTP
  - Web Development
  - Networking
---

## 目录

1. [名词解释](#名词解释)
2. [解决了什么问题](#解决了什么问题)
3. [SPDY 协议](#spdy-协议)
4. [哪些优化手段不再需要](#哪些优化手段不再需要)
5. [参考资料](#参考资料)

---

## 名词解释

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

---

## 解决了什么问题

1. **保持 HTTP 协议语义不变**：
   - 不会修改 HTTP 协议原有的语义（如请求头字段等）。

2. **改进数据链路层**：
   - 减少了网络往返传输的数量。
   - 使用多路复用和快速丢弃不需要的流，完全避免了线头阻塞（Head of Line Blocking）问题。
   - 支持大量并行流，即使网站的数据分布在不同位置也不会成为瓶颈。
   - 合理利用流的优先级，让客户端优先接收更重要的数据。

---

## SPDY 协议

- **定义**：由 Google 开发的协议，旨在解决 HTTP/1.1 的性能问题。
- **目标**：提高页面加载速度。
- **影响**：由于效果显著，HTTP 工作组（HTTP-WG）将其纳入 HTTP/2 标准。

---

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

---

## 参考资料

- [HTTP/2 - High Performance Browser Networking](https://hpbn.co/http2/)
- [http2-explained](https://bagder.gitbooks.io/http2-explained/content/zh/part4.html)
- [HTTP/2.0 相比 1.0 有哪些重大改进](https://www.zhihu.com/question/34074946/answer/108588042)
- [HTTP/2 资料汇总](https://imququ.com/post/http2-resource.html)
- [What is HTTP/2 – The Ultimate Guide](https://kinsta.com/learn/what-is-http2/#how_you_can_start_using_http2)
- [HTTP/2 简介](https://developers.google.com/web/fundamentals/performance/http2/)
- [掘金文章：HTTP/2 实践](https://juejin.im/entry/583e9e52ac502e006c30d28c)
