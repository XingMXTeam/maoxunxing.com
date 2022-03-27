---
title: "NodeJS Stream系列第二篇之流的类型"
date: 2021-10-19T14:28:57+08:00
tags:
- NodeJS 
description: "流的类型有哪些"
images:
- nodejs-network-stream/streams.png
---

## 流的类型

1 readable 可读 `readable.pipe(A)`
2 writable 可写 `A.pipe(writable)`
3 duplex： 复式：既可读也可写  `A.pipe(duplex).pipe(A)`
4 transform：duplex的一种类型 可读可写 输出是从输入转换过来 `A.pipe(transform).pipe(B)`

pipe方法:
所有的readable/transform/duplex流都有这个方法, 并且返回readable/transform/duplex的流

``` js
src.pipe(dst) // 返回一个可读的流 所以可以链式调用 和unix的管道操作符是一样的 比如 cat xx.txt | grep 'console'
```

可读流的常用方法：

* `stream.pipe(...)`
* `stream.once('end', function() {})`
  
两种模式： 默认是暂停模式，也就是你需要手动调用next/read方法，可以开启流动模式

* `stream.resume()`
* `stream.on('data', function(buf) {}) ` 绑定会自动触发流动模式

资源的数据流并不是直接流向消费者，而是先 push 到缓存池，有水位，如果超过这个水位，push 的时候会返回 false：比如

+ 消费者主动执行了 .pause()
+ 消费速度比数据 push 到缓存池的生产速度慢

都会返回false, 这种情况也叫做「背压」Backpressure

可写流的常用方法：

* `.write(buf)`
* `.end()`
* `.end(buf)`
* `.on('finish',function() {})`
* (...).pipe(stream)

数据流先到资源池，如果写入较慢或者暂停，会被缓存；如果太快，write会返回false,触发drain事件

transform/duplex流可以用上面的所有方法

### 其他文章

[NodeJS Stream系列第五篇之实际场景](../nodejs-network-stream)  
[NodeJS Stream系列第二篇之流的类型](../nodejs-network-stream-2)  
[NodeJS Stream系列第三篇之基本用法](../nodejs-network-stream-3)  
[NodeJS Stream系列第四篇之高级用法](../nodejs-network-stream-4)  
[NodeJS Stream系列第五篇之实际场景](../nodejs-network-stream-5)  
