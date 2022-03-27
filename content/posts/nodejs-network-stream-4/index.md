---
title: "NodeJS Stream系列第四篇之高级用法"
date: 2021-10-19T14:28:57+08:00
tags:
- NodeJS 
description: "流的高级用法"
images:
- nodejs-network-stream/streams.png
---

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

### 其他文章

[NodeJS Stream系列第五篇之实际场景](../nodejs-network-stream)  
[NodeJS Stream系列第二篇之流的类型](../nodejs-network-stream-2)  
[NodeJS Stream系列第三篇之基本用法](../nodejs-network-stream-3)  
[NodeJS Stream系列第四篇之高级用法](../nodejs-network-stream-4)  
[NodeJS Stream系列第五篇之实际场景](../nodejs-network-stream-5)  
