---
title: "Nodejs Streams"
date: 2021-10-19T14:28:57+08:00
draft: true
tags:
- NodeJS
---


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

这样的问题是什么：data.txt会读取到内存中，导致用户体验变差，特别是低网络的情况

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

1 readable 可读
2 writable 可写
3 duplex： 复式：既可读也可写 a.pipe(b).pipe(a)
4 transform：duplex的一种类型 可读可写 输出是从输入转换过来

pipe方法将readable流转为writable/transform/duplex的流：stream是可读，res是可写的流

``` js
src.pipe(dst) // 返回一个可读的流 所以可以链式调用 和unix的管道操作符是一样的 比如 cat xx.txt | grep 'console'
```

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

自定义一个sock

在网络上怎么传输数据
在电脑上怎么传输数据




