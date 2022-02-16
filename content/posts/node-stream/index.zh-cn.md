---
title: "Node.js网络和流"
date: 2022-02-15T23:19:14+08:00
draft: true
---

## 什么是流

流不是仅存在于Nodejs, 在unix操作系统中也有类似的概念。 比如管道操作符号

``` shell
cat xx.ts | grep 'console.log'
```

能从文件中找到对应的匹配内容。

本质上，流是一种数据交换的格式。比如我们在操作文件的读写，网络传输等。在Nodejs里面我们读取一个文件的时候，是读取整个文件到内存中，然后处理这个文件内容。通过流，可以一个片段一个片段地处理，而不是一次性都都读取到内存里面。

## 怎么使用流

创建一个流的实例： 

``` ts
const stream = require('stream')
```

## 引用

https://nodejs.org/api/stream.html#stream
https://nodejs.dev/learn/nodejs-streams
https://nodesource.com/blog/understanding-streams-in-nodejs/

