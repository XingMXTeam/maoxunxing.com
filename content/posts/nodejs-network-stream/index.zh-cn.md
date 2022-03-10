---
title: "NodeJS Stream系列第一篇之什么是流"
date: 2021-10-19T14:28:57+08:00
tags:
- NodeJS 
description: "什么是流？"
images:
- nodejs-network-stream/streams.png
---

## 什么是流

流不是仅存在于Nodejs, 在unix操作系统中也有类似的概念。 比如管道操作符号

``` shell
cat xx.ts | grep 'console.log'
```

能从文件中找到对应的匹配内容。实际上，node的流的概念是来源于unix系统，最早是来自Douglas McIlroy管道的概念
[最初的来源](http://cm.bell-labs.co/who/dmr/mdmpipe.html)。

维基百科：

> Malcolm Douglas McIlroy (born 1932) is a mathematician, engineer, and programmer. As of 2019 he is an Adjunct Professor of Computer Science at Dartmouth College. **McIlroy is best known for having originally proposed Unix pipelines** and developed several Unix tools, such as spell, diff, sort, join, graph, speak, and tr.[1] He was also one of the pioneering researchers of macro processors and programming language extensibility. He participated in the design of multiple influential programming languages, particularly PL/I, SNOBOL, ALTRAN, TMG and C++. 

本质上，流是一种数据交换的格式。比如我们在操作文件的读写，网络传输等。个人认为流是nodejs中最难理解也是最强大的一个特性。

流是否和我们相关，nodejs中流几乎无处不在。比如请求流、响应流、文件流。搜索一下[Node运行时代码](https://github.com/nodejs/node/blob/863d13c192a8d315fa274194e64c1c9e5820e8f2/lib/internal/console/constructor.js)，随处可见：

``` js
...
  if (ignoreErrors === false) return stream.write(string);

      // There may be an error occurring synchronously (e.g. for files or TTYs
      // on POSIX systems) or asynchronously (e.g. pipes on POSIX systems), so
      // handle both situations.
      try {
        // Add and later remove a noop error handler to catch synchronous
        // errors.
        if (stream.listenerCount('error') === 0)
          stream.once('error', noop);

        stream.write(string, errorHandler);
      } catch (e) {
        // Console is a debugging utility, so it swallowing errors is not
        // desirable even in edge cases such as low stack space.
        if (isStackOverflowError(e))
          throw e;
        // Sorry, there's no proper way to pass along the error here.
      } finally {
        stream.removeListener('error', noop);
...
```

### 为什么需要流？

这段代码大家都比较熟悉：

``` js
const http = require('http')
const fs = require('fs')
const server = http.createServer(function(req, res) {
  fs.readFile(__dirname + '/data.txt', (err, data) => {
    res.end(data)
  })
})
server.listen(3000)
```

在Nodejs里面我们读取一个文件的时候，是读取整个文件到内存中，然后处理这个文件内容。这样的问题是什么：data.txt会读取到内存中，导致用户体验变差，特别是低网络的情况。
通过流，可以一个片段一个片段地处理，而不是一次性都都读取到内存里面。

通过流的方式改写：

``` js
const http = require('http')
const fs = require('fs')
const server = http.createServer(function(req, res) {
  const stream = fs.createReadStream(__dirname + '/data.txt');
  stream.pipe(res)
})
server.listen(3000)
```

这里pipe做了两件事：1 是监听数据 2 相当于调用res.end 它会自动管理数据片段的缓存
甚至我们可以进行数据压缩：

``` js
const http = require('http')
const fs = require('fs')
const oppressor = require('oppressor')

const server = http.createServer(function(req, res) {
  const stream = fs.createReadStream(__dirname + '/data.txt');
  stream.pipe(oppressor(req)).pipe(res)
})
server.listen(3000)
```

### 其他文章

[NodeJS Stream系列第五篇之实际场景](../nodejs-network-stream)  
[NodeJS Stream系列第二篇之流的类型](../nodejs-network-stream2)  
[NodeJS Stream系列第三篇之基本用法](../nodejs-network-stream3)  
[NodeJS Stream系列第四篇之高级用法](../nodejs-network-stream4)  
[NodeJS Stream系列第五篇之实际场景](../nodejs-network-stream5)  
