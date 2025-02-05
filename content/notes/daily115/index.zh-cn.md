---
title: "http2"
date: 2019-11-25
---


## 名词解释

HTTP Pipelining: 把多个HTTP请求放到一个TCP连接中一一发送，而在发送过程中不需要等待服务器对前一个请求的响应；只不过，客户端还是要按照发送请求的顺序来接收响应
线头阻塞（Head of line blocking）

RTT(Round-Trip Time): 表示从发送端发送数据开始，到发送端收到来自接收端的确认（接收端收到数据后便立即发送确认，不包含数据传输时间）总共经历的时间

RTT由三个部分决定：链路的传播时间、末端系统的处理时间、路由器的缓存中的排队和处理时间。其中前两个部分的值作为一个TCP连接相对固定，路由器的缓存中的排队和处理时间会随着整个网络拥塞程度的变化而变化。所以RTT的变化在一定程度上反映了网络拥塞程度的变化。简单来说就是发送方从发送数据开始，到收到来自接受方的确认信息所经历的时间
若RTT为1毫秒的时间，这意味着在1秒时间内只能完成1000次RPC往返响应

TLS(Transport Layer Security)

在TCP/IP协议中，如果接收方成功的接收到数据，那么会回复一个ACK数据。通常ACK信号有自己固定的格式,长度大小,由接收方回复给发送方。

http2是一个二进制协议

多路复用的流：多路复用的能力可以极大的改善在高网络延迟下的体验

## 解决了什么问题
1 不会修改http协议原先的语义。比如请求头的字段等等。
2 改进了数据链路层
http2减少了网络往返传输的数量，并且用多路复用和快速丢弃不需要的流的办法来完全避免了head of line blocking(线头阻塞)的困扰。
它也支持大量并行流，所以即使网站的数据分发在各处也不是问题。
合理利用流的优先级，可以让客户端尽可能优先收到更重要的数据。

## SPDY
它是Google开发的一个协议，目的是为了解决HTTP/1.1的一些问题，比如：提高页面加载速度
因为它的效果显著，HTTP Working Group (HTTP-WG)官方发布了HTTP/2，并把SPDY加入了进去。

## 哪些优化手段不再需要
1 域名分片：多个域名
2 内联图片
3 雪碧图

## 使用
<https://juejin.im/entry/583e9e52ac502e006c30d28c>

参考：
[HTTP/2 - High Performance Browser Networking](https://hpbn.co/http2/)
[http2-explained](https://bagder.gitbooks.io/http2-explained/content/zh/part4.html)
[HTTP/2.0 相比1.0有哪些重大改进](https://www.zhihu.com/question/34074946/answer/108588042)
[HTTP/2 资料汇总](https://imququ.com/post/http2-resource.html)
[What is HTTP/2 – The Ultimate Guide](https://kinsta.com/learn/what-is-http2/#how_you_can_start_using_http2)
[HTTP/2 简介](https://developers.google.com/web/fundamentals/performance/http2/)
