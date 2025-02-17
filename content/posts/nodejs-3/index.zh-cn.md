---
title: "Node Stream Complete Guide Notes"
description: ""
date: 2025-02-04
tags:
  - NodeJS
images:
  - nodejs-1/node-js.jpeg
---

## 网络基础
任何联网的计算机都可以作为**服务器**或**客户端**。  
在网络通信中，数据通常会被分割成**小块（tiny chunks）**进行传输。例如，如果我们有一个需要发送的消息：
```
This is the message we want to send. It contains information. XXX SFDSDF sdafEFAEFwqf
```
它可能会被拆分成多个数据包（packets）。

---

## TCP 与 UDP 协议
### TCP（传输控制协议）
- **可靠传输**：如果一个数据包未被接收方确认（ACK），则会重新发送。
- **应用场景**：广泛应用于大多数网络通信场景，如网页浏览、文件传输等。

### UDP（用户数据报协议）
- **不可靠传输**：数据包发送后，不保证接收方是否收到。
- **应用场景**：常用于实时性要求较高的场景，如流媒体视频、音频传输和某些在线游戏。

---

## 常见网络协议
网络协议是计算机程序之间通信的语言。以下是一些常见的网络协议及其用途：
- **HTTP**：用于浏览网页。
- **HTTPS**：通过加密方式浏览网页。
- **SMTP**：用于发送和接收电子邮件。
- **IMAP/POP3**：用于从邮箱加载邮件。
- **IRC**：用于聊天。
- **FTP**：用于文件传输。
- **SSH**：通过加密连接实现远程操作。
- **SSL**：低级别的安全数据传输协议（被 HTTPS 使用）。

---

## 流（Streams）类型
在 Node.js 中，流是一种处理数据的方式。以下是几种常见的流类型：

### 流的基本分类
1. **可读流（Readable）**
   - 生产数据，可以从中管道化（pipe）数据。
   - 示例代码：
     ```javascript
     var fs = require('fs');
     var r = fs.createReadStream('file.txt');
     r.pipe(process.stdout);
     ```

2. **可写流（Writable）**
   - 消费数据，可以将数据管道化到其中。
   - 示例代码：
     ```javascript
     const fs = require('fs');
     const w = fs.createWriteStream('cool.txt');
     w.write('hi\n');
     w.write('wow\n');
     w.end();
     ```

3. **转换流（Transform）**
   - 消费数据并生成转换后的数据。
   - 示例代码：
     ```javascript
     A.pipe(transform).pipe(B);
     ```

4. **双工流（Duplex）**
   - 同时消费和生产数据，但两者独立。
   - 示例代码：
     ```javascript
     A.pipe(duplex).pipe(A);
     ```

---

### 可读流的方法
- `stream.pipe(...)`：将数据管道化到另一个流。
- `stream.once('end', function() {})`：监听流结束事件。
- 其他方法（通常由模块或 `.pipe()` 自动调用）：
  - `stream.read()`
  - `stream.on('readable', function() {})`

---

### 可写流的方法
- `.write(buf)`：写入数据。
- `.end()` 或 `.end(buf)`：结束写入。
- `.on('finish', function() {})` 或 `.once('finish', function() {})`：监听写入完成事件。
- `(...).pipe(stream)`：将数据管道化到可写流。

---

### 可读流的模式
1. **暂停模式（Paused Mode）**
   - 默认行为，具有自动背压（backpressure）。
   
2. **流动模式（Flowing Mode）**
   - 数据在可用时立即被消费（无背压）。
   - 开启流动模式的方法：
     - `stream.resume()`
     - `stream.on('data', function(buf) {})`

---

## 核心流（Core Streams）
Node.js 的核心模块中提供了多种流的实现，例如 HTTP 模块中的流。

### HTTP 核心流
```javascript
// req: 可读流, res: 可写流
http.createServer(function(req, res) {});

// req: 可写流, res: 可读流
var req = http.request(opts, function(res) {});
```

---

### 示例：HTTP 服务器
以下是一个简单的 HTTP 服务器示例，展示了如何使用流处理请求和响应：

```javascript
var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res) {
    if (req.method === 'POST') {
        // 将 POST 请求的数据输出到标准输出
        req.pipe(process.stdout);
        req.once('end', function() {
            res.end('ok\n');
        });
    } else {
        // 返回文件内容作为响应
        res.setHeader('content-type', 'text/plain');
        fs.createReadStream('hello.txt').pipe(res);
    }
});

server.listen(8080, function() {
    console.log('Server is running on port 8080');
});
```

---

## 总结
本文介绍了网络通信的基础知识，包括 TCP 和 UDP 的区别、常见网络协议、流的类型及其使用方法，并通过代码示例展示了如何在 Node.js 中实现 HTTP 服务器。这些内容为理解网络编程和流式数据处理奠定了基础。