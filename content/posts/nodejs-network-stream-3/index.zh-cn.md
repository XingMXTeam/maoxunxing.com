---
title: "NodeJS Stream系列 - 基本用法"
date: 2021-10-19T14:28:57+08:00
tags:
- NodeJS 
description: "流的基本用法"
images:
- nodejs-network-stream/streams.png
---

## 创建可读的流：[readable.js](./readable.js)

``` js
const rs = new (require('stream').Readable);
rs.push('beep');
rs.push(null); // null告诉消费者数据结束
rs.pipe(process.stdout);
```

## 创建一个可写的流： [writable.js](./writable.js)

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


## 消费一个可读的流：[consume0.js](./consume0.js)

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

你也可以在消费者读取数据的时候，再缓存内容: [read1.js](./read1.js)

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

从readable流读取数据：[read2.js](./read2.js)

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

## 写入数据到可写的流： [write1.js](./write1.js)

``` js
const Stream = require('stream')
const writableStream = new Stream.Writable()

// var fs = require('fs');
// var ws = fs.createWriteStream('message.txt');
writableStream.write('hey!\n')

```

## 如何关闭流： [close1.js](./close1.js)

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

## 如何创建transform流： [transform.js](./transform.js)

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

## 如何创建duplex流： [duplex.js](./duplex.js)

``` js
// nc localhost 8000
const net = require('net') // create tcp server
net.createServer(function(stream) {
  stream.pipe(stream)
}).listen(8000)
```

复杂的例子。我们可以创建一个代理的服务器，中间转发一下(有点像vpn)：duplex2.js

``` js
// nc localhost 8001 结果是通过8000服务器转发的
const net = require('net') // create tcp server
net.createServer(function(stream) {
  stream.pipe(net.connect(8000, 'localhost')).pipe(stream)
}).listen(8001)
```

## 对象流 [object.js](./object.js)

正常情况下，你只能读和写buffers（比如文本文件） 和字符串。 如果要读取对象，
需要开启对象模式

``` js
const through = require('through2')
const tr = through.obj(function(row, enc, next) {
  next(null, (row.n * 1000) + '\n')
})
tr.pipe(process.stdout)
tr.write({ n: 5 })
tr.write({ n: 10 })
tr.write({ n: 3 })
tr.end()
```

### 内置的流

* process.stdin: 可读的流
* process.stdout：可写的流
* process.stderr：可写的流
* fs.createReadStream()
* fs.createWriteStream()
* net.connect()： Duplex流 建立tcp连接用的
* net.createServer()
* http.request()
* http.createServer()
* zlib.createGzip()
* zlib.createGunzip() : gzip解压
* zlib.createDeflate(): 用deflate算法压缩
* zlib.createInflate(): 用deflate算法解压
* tls.connect()
* tls.createServer()
* child_process spawn: 创建一个新进程

### 其他文章

[NodeJS Stream系列第五篇之实际场景](../nodejs-network-stream)  
[NodeJS Stream系列 - 流的类型](../nodejs-network-stream-2)  
[NodeJS Stream系列 - 基本用法](../nodejs-network-stream-3)  
[NodeJS Stream系列第四篇之高级用法](../nodejs-network-stream-4)  
[NodeJS Stream系列第五篇之实际场景](../nodejs-network-stream-5)  
