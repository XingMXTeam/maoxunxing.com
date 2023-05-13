---
title: "Nodejs中Stream的理解"
date: 2021-10-19T14:28:57+08:00
tags:
- NodeJS 
- RPC
- WebSocket
- Network
- VPN
- P2P
description: "什么是流？这篇文章详细介绍了Nodejs的流技术，带你从入门到进阶。并且了解网络、RPC、WebSocket等高阶技术"
images:
- nodejs-network-stream/juanjo-jaramillo-mZnx9429i94-unsplash.jpg
---

{{< img src="juanjo-jaramillo-mZnx9429i94-unsplash.jpg" alt="bg" maxWidth="960px" align="center" caption="Photo by Juanjo Jaramillo on Unsplash" >}}

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


## 核心流模块：

* crypto:  加密
* zlib： 压缩
* split2： 按行返回数据，比如读取一个文件
* websocket-stream
* collect-stream
* from2: 直接转为可读流
* to2： 直接转为可写流
* duplexify: 支持将流转为duplex类型
* pump
* pumpify
* end-of-stream： 判断流是否结束，接收一个回调函数

### collect-stream

[collect.js](./collect.js)

和concat-stream是同一个东西， 只不过它有异常处理。 可以用于单元测试

### duplexify

[duplify.js](./duplify.js)

``` js
const duplexify = require('duplexify')
const fs = require('fs')

function log() {
	const d = duplexify();
  var w = fs.createWriteStream('logs/test.log')
  d.setWritable(w)
  return d
}

const stream = log();
stream.write(Date.now() + '\n')
stream.end();
concat-stream

```

如何把流缓存起来一次性读取: 将流输出为一个buffer； 如果是对象，则是对象数组。

正常实现方式：

``` js
function ResponseReader(encoding) {
  stream.Transform.call(this);
  this._chuncks = [];
  this._encoding = encoding;
}
util.inherits(ResponseReader, stream.Transform);

ResponseReader.prototype._transform = function(chunk, encoding, callback) {
  this._chuncks.push(chunk);
  callback();
};

ResponseReader.prototype._flush  = function(callback) {
  this.push(Buffer.concat(this._chuncks).toString(this._encoding));
  callback();
};
 concat.js

const concat = require('concat-stream')
process.stdin.pipe(concat(function(body) {
    console.log(body.length) //ctr+d 会一次性打印出来
}))
```

复杂的场景。比如我们响应返回完整数据(比如图片)才进行下一步操作 concat2.js
// curl -d msg=hello localhost:6000

``` js
const concat = require('concat-stream')
const http = require('http')
const qs = require('querystring')
const through = require('through2')
function counter() {
  let size = 0
  return through(function(buf, enc, next) {
    size += buf.length
    if(size > 20) next(null, null) // 需要判断请求参数的长度: 超过20 则终止流
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

### pump

解决10.x版本前，当目标流被销毁的时候，源流不会自动销毁，也没有回调的问题。处理异常

``` js
var pump = require('pump')
var fs = require('fs')

var source = fs.createReadStream('/dev/random')
var dest = fs.createWriteStream('/dev/null')

// source.pipe(dst) 但是会有异常函数回调
pump(source, dest, function(err) {
  console.log('pipe finished', err)
})

setTimeout(function() {
  dest.destroy() // when dest is closed pump will destroy source
}, 1000)
```

10.x版本后可以用pipeline

``` js
const { pipeline } = require('stream');
const fs = require('fs');
const zlib = require('zlib');

// Use the pipeline API to easily pipe a series of streams
// together and get notified when the pipeline is fully done.

// A pipeline to gzip a potentially huge tar file efficiently:

pipeline(
  fs.createReadStream('archive.tar'),
  zlib.createGzip(),
  fs.createWriteStream('archive.tar.gz'),
  (err) => {
    if (err) {
      console.error('Pipeline failed.', err);
    } else {
      console.log('Pipeline succeeded.');
    }
  }
);

```

### pumpify

pump and duplexify 的结合 会返回一个duplex流

## 如何把流缓存起来一次性读取： [concat.js](./concat.js)

### concat-stream

``` js
const concat = require('concat-stream')
process.stdin.pipe(concat(function(body) {
    console.log(body.length) //ctr+d 会一次性打印出来
}))
```

复杂的场景。比如我们需要判断请求参数的长度: [concat2.js](./concat2.js)

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

## rpc-stream

RPC（Remote Procedure Call）中文名『远程过程调用』
其实就是调用其他机器上的函数。一般是基于TCP。比如我们集团的HSF 其实就是一个远程调用。源码很值得读一读，关于如何设计好的接口。 

[rpc-server.js](./rpc-server.js)

``` js
const rpc = require('rpc-stream')
const net = require('net')

net.createServer(function (stream) {
  const server = rpc({ // duplex类型
    hello: function (name, cb) {
      cb(null, 'hello, ' + name)
    }
  })
  server.pipe(stream).pipe(server) //需要传递给server
}).listen(8001)
```

[rpc-client.js](./rpc-client.js)

``` js
const rpc = require('rpc-stream')
const net = require('net')

const client = rpc()
client.pipe(net.connect(8001, 'localhost')).pipe(client) // 需要再次pipe(client)

const remote = client.wrap(['hello'])

remote.hello('JIM', function (err, mess) {
  if(err) throw err
  console.log(mess)
})

```

用rpc协议不需要json格式。这个是优势。

## 实际应用场景

### 1 文件下载/导入导出

https://www.eggjs.org/api/node_modules_egg-multipart_app_extend_context.js.html

``` js
const {
    ctx,
} = this;
const parts = ctx.multipart();
let object;
let part;
part = yield parts;
while (part) {
    if (part.length) {
        // arrays are busboy fields
    } else {
        // otherwise, it's a stream
        // 文件处理，上传到云存储等等
        object = yield ctx.oss.put('egg-oss-demo-' + part.filename, part);
    }
    part = yield parts;
}


```

### 2 网络传输：比如从远端下载文件 

``` js
yield new Promise((resolve, reject)=>{
  ctx.safeCurl(whitelistExcelLink).then(response => {
    const data = response.data;
    const stream = fs.createWriteStream(filepath)
    stream.write(data, () => {
      resolve && resolve()
    });
  }).catch(e => {
    ctx.logger.error(e)
  });
}); 

```

### 3 vpn

代码太多： 请打开文件查看：

[vpn-client.js](./vpn-client.js)
[vpn-server.js](./vpn-server.js)

``` shell
node vpn-client.js
node vpn-server.js
node echo.js
```

### 4 实时通信 websocket

[websocket-client.js](./websocket-client.js)
[websocket-server.js](./websocket-server.js)

``` shell
browserify websocket-client.js > public/bundle.js (或者nodejs client也行）
node websocket-server.js
```

问题： websocket和[socket.io](https://github.com/socketio/socket.io/blob/master/lib/index.ts)的区别？

### 5 p2p

点对点（P2P）服务是一个去中心化的平台，两个人在此平台上直接互动，没有第三方的中介。[webrtc.js](./webrtc.js)

``` shell
tnpm run signalhub
budo webrtc.js
```

问题： discord是不是点对点？

### 6 工程化

> gulp 需要频繁对文件操作

### 7 webassembly

https://developers.google.com/web/updates/2018/04/loading-wasm

### 扩展

在实际应用中可能需要扩展去实现定制化的需求  

1 自定义实现
实现一个writable流
可以用来自定义了 stream 写入的时机，当 chunk 大小超过某个阈值，才真的写入文件，提升写入速度

``` js
// strace -cfe trace=write node index.js
var Writable = require('stream').Writable;
var util = require('util');

function MyWritable(options) {
    Writable.call(this, options);
} // 构造函数
util.inherits(MyWritable, Writable); // 继承自Writable
MyWritable.prototype._write = function(chunk, encoding, callback) {
    console.log("被写入的数据是:", chunk.toString()); // 此处可对写入的数据进行处理
    //this.data.push(chunk); 先缓存
    callback();// 最终写入
};
process.stdin.pipe(new MyWritable()); // stdin作为输入源，MyWritable作为输出源
实现一个readable流
const Readable = require('stream').Readable;

// Stream 实现
class MyReadable extends Readable {
  constructor(dataSource, options) {
    super(options);
    this.dataSource = dataSource;
  }
  // 继承了 Readable 的类必须实现这个函数
  // 触发系统底层对流的读取
  _read() {
    const data = this.dataSource.makeData();
    this.push(data);
  }
}

```

实现pipe

``` js
Readable.prototype.pipe = function(writable, options) {
  this.on('data', (chunk) => {
    let ok = writable.write(chunk);
    // 背压，暂停
    !ok && this.pause();
  });
  writable.on('drain', () => {
    // 恢复
    this.resume();
  });
  // 告诉 writable 有流要导入
  writable.emit('pipe', this);
  // 支持链式调用
  return writable;
};

```

