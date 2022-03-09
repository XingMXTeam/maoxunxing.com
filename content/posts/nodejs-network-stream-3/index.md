---
title: "NodeJS Stream from Beginner to Master"
date: 2021-10-19T14:28:57+08:00
tags:
- NodeJS 
description: "Streams are one of the most difficult and powerful features of nodejs, and this article composes the content of streams"
images:
- nodejs-network-stream/images.jpeg
---

## What is a stream

Streams are not only found in Nodejs, there are similar concepts in unix operating systems. For example, the pipe operation symbol

``` shell
cat xx.ts | grep 'console.log'
```

can find the corresponding matching content from the file. In fact, the concept of streams in node comes from unix systems, first from Douglas McIlroy's concept of pipes [Initial source](http://cm.bell-labs.co/who/dmr/mdmpipe.html)。

Wikipedia：

> Malcolm Douglas McIlroy (born 1932) is a mathematician, engineer, and programmer. As of 2019 he is an Adjunct Professor of Computer Science at Dartmouth College. **McIlroy is best known for having originally proposed Unix pipelines** and developed several Unix tools, such as spell, diff, sort, join, graph, speak, and tr.[1] He was also one of the pioneering researchers of macro processors and programming language extensibility. He participated in the design of multiple influential programming languages, particularly PL/I, SNOBOL, ALTRAN, TMG and C++. 

Essentially, a stream is a format for data exchange. For example, we are operating on file reading and writing, network transfers, etc. Personally, I think streams are one of the most difficult and powerful features of nodejs to understand.

Whether streams are relevant to us or not, streams are almost everywhere in nodejs. For example, request streams, response streams, file streams. Do a search for[Node runtime code](https://github.com/nodejs/node/blob/863d13c192a8d315fa274194e64c1c9e5820e8f2/lib/internal/console/constructor.js). Everywhere you look you see.

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


## How to use streams

### Basic usage

This code is familiar to everyone.

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

When we read a file inside Nodejs, we read the whole file into memory and then process the contents of this file. What is the problem with this: data.txt is read into memory, which leads to a poor user experience, especially with low networks.
With streams, it is possible to process one fragment at a time, instead of reading it all into memory at once.

Rewritten by means of streams.

``` js
const http = require('http')
const fs = require('fs')
const server = http.createServer(function(req, res) {
  const stream = fs.createReadStream(__dirname + '/data.txt');
  stream.pipe(res)
})
server.listen(3000)
```

Here pipe does two things: 
1 is listening to the data 
2 is equivalent to calling res.end which automatically manages the caching of data fragments

We can even do data compression: 

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

### Types of streams

1 readable readable `readable.pipe(A)`
2 writable writable `A.pipe(writable)`
3 duplex: multiplex: both readable and writable `A.pipe(duplex).pipe(A)`
4 transform: a type of duplex readable and writable output is transformed from input `A.pipe(transform).pipe(B)`

pipe method:
All readable/transform/duplex streams have this method, and return readable/transform/duplex streams

``` js
src.pipe(dst) // 返回一个可读的流 所以可以链式调用 和unix的管道操作符是一样的 比如 cat xx.txt | grep 'console'
```

Common methods for readable streams.

* ``stream.pipe(...) `
* ``stream.once('end', function() {})`
  
Two modes: the default is pause mode, which means you need to call the next/read method manually and can turn on flow mode

* `stream.resume()`
* `stream.on('data', function(buf) {}) ` The binding will automatically trigger flow mode

The data stream of the resource does not flow directly to the consumer, but first pushes to the cache pool, with a water level, and if it exceeds this level, the push returns false: for example

+ the consumer actively performs a .pause()
+ the consumption rate is slower than the production rate of the data pushed to the cache pool

Both will return false, which is also called "backpressure".

Common methods for writable streams.

* `.write(buf)`
* `.end()`
* `.end(buf)`
* `.on('finish', function() {})`
* (...) .pipe(stream)

The stream goes to the resource pool first, if the write is slow or paused, it will be cached; if it is too fast, write will return false, triggering the drain event

transform/duplex streams can use all the above methods

### Create a readable stream: [readable.js](. /readable.js)

``` js
const rs = new (require('stream').Readable);
rs.push('beep');
rs.push(null); // null tells the consumer that the data is finished
rs.pipe(process.stdout);
```

### Create a writeable stream: [writeable.js](. /writable.js)

``` js
const Stream = require('stream')
const writableStream = new Stream.Writable(({
  decodeString: false,
  write(chunk, encoding, next) { // Called when writing
    console.log(chunk.toString())
    next();// tell to read more data
  }
}))
process.stdin.pipe(writableStream)
```


### Consume a readable stream: [consume0.js](. /consume0.js)

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

Reading data from readable streams：[read2.js](./read2.js)

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

### Writing data to a writable stream： [write1.js](./write1.js)

``` js
const Stream = require('stream')
const writableStream = new Stream.Writable()

// var fs = require('fs');
// var ws = fs.createWriteStream('message.txt');
writableStream.write('hey!\n')

```

### How to turn off the stream： [close1.js](./close1.js)

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

### How to create a transforms stream： [transform.js](./transform.js)

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

Generally, to reduce each instantiation, we will use through2: through2.js

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

### How to create a duplex stream： [duplex.js](./duplex.js)

``` js
// nc localhost 8000
const net = require('net') // create tcp server
net.createServer(function(stream) {
  stream.pipe(stream)
}).listen(8000)
```

A complex example. We can create a proxy server that forwards a bit in between (kind of like a vpn)：duplex2.js

``` js
// nc localhost 8001 结果是通过8000服务器转发的
const net = require('net') // create tcp server
net.createServer(function(stream) {
  stream.pipe(net.connect(8000, 'localhost')).pipe(stream)
}).listen(8001)
```

### Object Stream [object.js](./object.js)

Normally, you can only read and write buffers (like text files) and strings. If you want to read objects, the
you need to enable object mode

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

### How to cache streams for one-time reading： [concat.js](./concat.js)

``` js
const concat = require('concat-stream')
process.stdin.pipe(concat(function(body) {
    console.log(body.length) //ctr+d 会一次性打印出来
}))
```

complex scenarios. For example, we need to determine the length of the request parameters: [concat2.js](./concat2.js)

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

### Built-in streams

* process.stdin: Readable streams
* process.stdout：Writable streams
* process.stderr：Writable streams
* fs.createReadStream()
* fs.createWriteStream()
* net.connect()： Duplex streams, for establishing tcp connections
* net.createServer()
* http.request()
* http.createServer()
* zlib.createGzip()
* zlib.createGunzip() : gzip decompression
* zlib.createDeflate(): Compression with deflate algorithm
* zlib.createInflate(): Decompress with deflate algorithm
* tls.connect()
* tls.createServer()
* child_process spawn: Create a new process

Other commonly used streaming modules.

* crypto: encryption
* zlib: compression
* split2: return data by line, e.g. read a file
* websocket-stream
* collect-stream
* from2: direct to readable stream
* to2: direct to writable streams
* duplexify: supports converting streams to duplex types
* pump
* pumpify
* end-of-stream: determines if the stream has ended, receives a callback function

#### collect-stream

[collect.js](./collect.js)

The same thing as `concat-stream` , except it has exception handling. Can be used for unit testing

#### duplexify

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

How to cache the stream for a one-time read: Output the stream as a buffer; if it is an object, it is an array of objects.

Normal implementation.

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

Complex scenarios. For example, we respond by returning complete data (such as an image) before proceeding to the next operation
[concat2.js](./concat2.js)

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

#### pump

Solve the problem that before nodejs version 10.x, when the target stream is destroyed, the source stream is not automatically destroyed and there is no callback. Handle exceptions

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

After version 10.x you can use `pipeline`:

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

#### pumpify

The combination of `pump` and `duplexify` will return a duplex stream

#### rpc-stream

RPC（Remote Procedure Call）中文名『远程过程调用』

It is actually a call to a function on another machine. For example, our group's HSF is actually a remote call. The source code is well worth reading about how to design a good interface. 


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

Using rpc protocol does not require json format. This is an advantage.

#### multiplex 

Ability to package multiple streams into a single stream [mul1.js](./mul1.js)

``` js
const net = require('net')
const multiplex = require('multiplex')
const rpc = require('rpc-stream')
const fs = require('fs')

net.createServer(function (stream) {
  const plex = multiplex()
  stream.pipe(plex).pipe(stream);
  const client = rpc({
    read: function(name , cb) {
      if(!/^[\w-]+$/.test(name)) {
        return cb(new Error('file not allowed'))
      }
      const r = fs.createReadStream('files/' + name)
      r.on('error', cb)
      r.pipe(plex.createStream('file-'+name)).pipe(r)
      cb(null)
    }
  })
  client.pipe(plex.createSharedStream('rpc')).pipe(client)
}).listen(8000)
//node mul1-client.js hello
const net = require('net')
const multiplex = require('multiplex')
const rpc = require('rpc-stream')

const plex = multiplex(function(stream, id) {
  if(/^file-/.test(id)) {
    console.log('reveived file ' + id.replace(/^file-/, ''))
    stream.pipe(process.stdout)
  }
})

plex.pipe(net.connect(8000)).pipe(plex)

const client = rpc()
client.pipe(plex.createSharedStream('rpc')).pipe(client)
const remote = client.wrap(['read'])
remote.read(process.argv[2], function(err) {
  if(err) console.error(err)
})

```

### Practical application scenarios

#### 1 File download/import/export

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

#### 2 Network transfer

eg. downloading files from a remote location 

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

#### 3 vpn

[vpn-client.js](./vpn-client.js)
[vpn-server.js](./vpn-server.js)

``` shell
node vpn-client.js
node vpn-server.js
node echo.js
```

#### 4 Real-time communication

[websocket-client.js](./websocket-client.js)
[websocket-server.js](./websocket-server.js)

``` shell
browserify websocket-client.js > public/bundle.js (或者nodejs client也行）
node websocket-server.js
```

Question： websocket和[socket.io](https://github.com/socketio/socket.io/blob/master/lib/index.ts)的区别？

#### 5 p2p

Peer-to-peer (P2P) services are a decentralized platform where two people interact directly with each other without a third party intermediary。[webrtc.js](./webrtc.js)

``` shell
tnpm run signalhub
budo webrtc.js
```

Question: Is [discord](https://discord.com/) peer-to-peer?

#### 6 Engineering

> gulp requires frequent manipulation of files

#### 7 webassembly

https://developers.google.com/web/updates/2018/04/loading-wasm

### Read More

1 Custom implementation

Implement a writable stream
This can be used to customize the timing of stream writes, so that when the chunk size exceeds a certain threshold, the file is actually written, increasing the write speed

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

Implementing `pipe`

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

2 Follow Guys：

[substack](https://github.com/substack)
https://github.com/nodejs/readable-stream 

3 Understand the concept of streams by [Visualize](https://blog.insiderattack.net/a-visual-guide-to-nodejs-streams-9d2d594a9bf5?gi=5c2a70f05af9)

## References

https://nodejs.org/api/stream.html#stream  
https://nodejs.dev/learn/nodejs-streams  
https://nodesource.com/blog/understanding-streams-in-nodejs/  
https://nodejs.org/api/stream.html  
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array  
https://frontendmasters.com/courses/networking-streams/  
