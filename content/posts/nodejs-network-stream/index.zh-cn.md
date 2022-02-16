---
title: "Nodejs Streams"
date: 2021-10-19T14:28:57+08:00
draft: true
tags:
- NodeJS
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

本质上，流是一种数据交换的格式。比如我们在操作文件的读写，网络传输等。

## 怎么用流

### 基本用法

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

### 流的类型

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
  
两种模式： 默认是暂停模式，也就是你需要手动调用next方法，可以开启流动模式

* `stream.resume()`
* `stream.on('data', function(buf) {}) `


可写流的常用方法：

* `.write(buf)`
* `.end()`
* `.end(buf)`
* `.on('finish',function() {})`
* (...).pipe(stream)

transform/duplex流可以用上面的所有方法

### 创建可读的流：readable.js

``` js
const rs = new (require('stream').Readable);
rs.push('beep');
rs.push(null); // null告诉消费者数据结束
rs.pipe(process.stdout);
```

### 创建一个可写的流： writable.js

``` js
const Stream = require('stream')
const writableStream = new Stream.Writable(({
  decodeString: false,
  write(chunk, encoding, next) { // 当写入的时候会调用
    console.log(chunk.toString())
    next();// 告知读取更多数据
  }
}))
process.stdin.pipe(writableStream)
```


### 消费一个可读的流：consume0.js

``` js
//(echo abc; sleep 1; echo def; sleep 1; echo ghi) | node consume0.js 
process.stdin.on('readable', function () {
    var buf = process.stdin.read();// 可以给read传参数 告知读取几个字节
    console.dir(buf);// 打印对象所有属性
    process.stdin.read(0); /// 0告知读取后续的所有字节
});
//output:
//<Buffer 61 62 63 0a> abc\0
//<Buffer 64 65 66 0a> def\0
//<Buffer 67 68 69 0a> ghi\0
```

你也可以在消费者读取数据的时候，再缓存内容: read1.js

``` js
const rs = new (require('stream').Readable);

let c = 97
rs._read = function() { // 当读取的时候会调用
  rs.push(String.fromCharCode(c++))
  if(c > 'z'.charCodeAt(0)) rs.push(null)
}

rs.pipe(process.stdout)


process.on('exit', function () {
  console.error('\n_read() called ' + (c - 97) + ' times');
});

```

从readable流读取数据：read2.js

``` js
const Stream = require('stream')

const readableStream = new Stream.Readable({
  read() {}
})
const writableStream = new Stream.Writable()

writableStream._write = (chunk, encoding, next) => {
  console.log(chunk.toString())
  next()
}

readableStream.pipe(writableStream)
// or 因为所有的类都继承自EventEmitter， 所有自带一些基本的事件，比如（close...） 和扩展的事件
// readableStream.on('readable', () => {
//   console.log(readableStream.read().toString())
// })

readableStream.push('hi!')
readableStream.push('ho!')

```

### 写入数据到可写的流： write1.js

``` js
const Stream = require('stream')
const writableStream = new Stream.Writable()

// var fs = require('fs');
// var ws = fs.createWriteStream('message.txt');
writableStream.write('hey!\n')

```

### 如何关闭流： close1.js

``` js
const Stream = require('stream')

const readableStream = new Stream.Readable({
  read() {}
})
const writableStream = new Stream.Writable()

writableStream._write = (chunk, encoding, next) => {
  console.log(chunk.toString())
  next()
}

writableStream.on('error', (err) => {
  console.log(err)
})

readableStream.pipe(writableStream)

readableStream.push('hi!')
readableStream.push('ho!')

readableStream.on('close', () => {
  writableStream.end()
  // writableStream.write('111') 关闭后再写会触发error事件。
})// 关闭可写流。
writableStream.on('close', () => console.log('ended'))

readableStream.destroy() // 销毁可读流。 触发close事件

```

### 如何创建transform流： transform.js

``` js
const { Transform } = require('stream')
const TransformStream = new Transform(({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase())
    callback()
  }
}));

process.stdin.pipe(TransformStream).pipe(process.stdout)

```

一般为了减少每次实例化，我们会用through2: through2.js

``` js
// node through2.js hello.txt
const f = require('fs')
const through = require('through2')
fs.createReadStream(process.argv[2]).pipe(toUpper()).pipe(process.stdout)

function toUpper() {
  return through(function(chunk, enc, next) {
    next(null, chunk.toString().toUpperCase())
    // or 两个是等价的
    // this.push(chunk.toString().toUpperCase())
    // next()
  })
}

```

### 如何创建duplex流： duplex.js

``` js
// nc localhost 8000
const net = require('net') // create tcp server
net.createServer(function(stream) {
  stream.pipe(stream)
}).listen(8000)
```

复杂的例子。我们可以创建一个代理的服务器，中间转发一下：duplex2.js

``` js
// nc localhost 8001 结果是通过8000服务器转发的
const net = require('net') // create tcp server
net.createServer(function(stream) {
  stream.pipe(net.connect(8000, 'localhost')).pipe(stream)
}).listen(8001)
```

### 内置的流

1 process.stdin: 可读的流
2 process.stdout：可写的流
3 process.stderr：可写的流
4 fs.createReadStream()
5 fs.createWriteStream()
6 net.connect()： Duplex流 建立tcp连接用的
7 http.request()
8 zlib.createGzip()
9 zlib.createGunzip() : gzip解压
10 zlib.createDeflate(): 用deflate算法压缩
11 zlib.createInflate(): 用deflate算法解压


### 好玩的用法

### 如何把流缓存起来一次性读取： concat.js

``` js
const concat = require('concat-stream')
process.stdin.pipe(concat(function(body) {
    console.log(body.length) //ctr+d 会一次性打印出来
}))
```

复杂的场景。比如我们需要判断请求参数的长度: concat2.js

``` js
// curl -d msg=hello localhost:6000
const concat = require('concat-stream')
const http = require('http')
const qs = require('querystring')
const through = require('through2')
function counter() {
  let size = 0
  return through(function(buf, enc, next) {
    size += buf.length
    if(size > 20) next(null, null) // 终止流
    else next(null, buf)
  })
}

const server = http.createServer(function(req, res) {
    req
    .pipe(counter())
    .pipe(concat({ encoding: 'string' }, function(body) {
        const params = qs.parse(body) // 读取的是空
        console.log(params)
        res.end('ok\n')
    }))
})

server.listen(6000)

```


自定义一个sock

在网络上怎么传输数据
在电脑上怎么传输数据


### 一张图总结


### 实际应用场景

## 引用

https://nodejs.org/api/stream.html#stream
https://nodejs.dev/learn/nodejs-streams
https://nodesource.com/blog/understanding-streams-in-nodejs/

