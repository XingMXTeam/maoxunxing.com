---
title: "Understanding Stream in Node.js"
date: 2021-10-19T14:28:57+08:00
tags:
  - NodeJS
description: "What is Streaming? This article details Nodejs' streaming technology, taking you from introductory to advanced. And learn about networking, RPC, WebSocket and other high level technologies"
images:
  - nodejs-1/node-js.jpeg
---

## What is a stream

Streams are not only found in Nodejs, there are similar concepts in unix operating systems. For example, the pipe operation symbol

```shell
cat xx.ts | grep 'console.log'
```

can find the corresponding matching content from the file. In fact, the concept of streams in node comes from unix systems, first from Douglas McIlroy's concept of pipes
[Initial source](http://cm.bell-labs.co/who/dmr/mdmpipe.html)。

Wikipedia:

> Malcolm Douglas McIlroy (born 1932) is a mathematician, engineer, and programmer. As of 2019 he is an Adjunct Professor of Computer Science at Dartmouth College. **McIlroy is best known for having originally proposed Unix pipelines** and developed several Unix tools, such as spell, diff, sort, join, graph, speak, and tr.[1] He was also one of the pioneering researchers of macro processors and programming language extensibility. He participated in the design of multiple influential programming languages, particularly PL/I, SNOBOL, ALTRAN, TMG and C++.

Essentially, a stream is a format for data exchange. For example, we are operating on file reading and writing, network transfers, etc. Personally, I think streams are one of the most difficult and powerful features of nodejs to understand.

Whether streams are relevant to us or not, streams are almost everywhere in nodejs. For example, request streams, response streams, file streams. Do a search for [Node runtime code](https://github.com/nodejs/node/blob/863d13c192a8d315fa274194e64c1c9e5820e8f2/lib/internal/console/constructor.js)，随处可见：

```js
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

### Why do we need streams?

This code is familiar to everyone:

```js
const http = require("http");
const fs = require("fs");
const server = http.createServer(function (req, res) {
  fs.readFile(__dirname + "/data.txt", (err, data) => {
    res.end(data);
  });
});
server.listen(3000);
```

When we read a file inside Nodejs, we read the whole file into memory and then process the contents of this file. What is the problem with this: data.txt is read into memory, which leads to a poor user experience, especially with low networks.
With streams, it is possible to process one fragment at a time, instead of reading it all into memory at once.

Rewritten by means of streams:

```js
const http = require("http");
const fs = require("fs");
const server = http.createServer(function (req, res) {
  const stream = fs.createReadStream(__dirname + "/data.txt");
  stream.pipe(res);
});
server.listen(3000);
```

Here pipe does two things:
1 is listening to the data  
2 is equivalent to calling res.end which automatically manages the caching of data fragments
We can even do data compression:

```js
const http = require("http");
const fs = require("fs");
const oppressor = require("oppressor");

const server = http.createServer(function (req, res) {
  const stream = fs.createReadStream(__dirname + "/data.txt");
  stream.pipe(oppressor(req)).pipe(res);
});
server.listen(3000);
```

## Type of stream

1 readable `readable.pipe(A)`
2 writable `A.pipe(writable)`
3 duplex `A.pipe(duplex).pipe(A)`
4 transform：A type of duplex Readable and writable Output is converted from input `A.pipe(transform).pipe(B)`

pipe method.
All readable/transform/duplex streams have this method, and return the readable/transform/duplex stream

```js
src.pipe(dst); // 返回一个可读的流 所以可以链式调用 和unix的管道操作符是一样的 比如 cat xx.txt | grep 'console'
```

Common methods for readable streams:

- `stream.pipe(...)`
- `stream.once('end', function() {})`

Two modes: The default is pause mode, which means you need to call the next/read method manually and can turn on flow mode

- `stream.resume()`
- `stream.on('data', function(buf) {}) ` Binding will automatically trigger flow mode

The data stream of the resource does not flow directly to the consumer, but is first pushed to the cache pool, with a water level, and if this level is exceeded, the push returns false: for example

- the consumer actively performs a .pause()
- the consumption rate is slower than the production rate of the data pushed to the cache pool

Both return false, which is also called "backpressure".

Common methods for writable streams:

- `.write(buf)`
- `.end()`
- `.end(buf)`
- `.on('finish',function() {})`
- (...).pipe(stream)

The data stream goes to the resource pool first, if the write is slow or paused, it will be cached; if it is too fast, the write will return false, triggering the drain event

The transform/duplex stream can be used with all the methods above

## Create readable streams:[readable.js](./readable.js)

```js
const rs = new (require("stream").Readable)();
rs.push("beep");
rs.push(null); // null告诉消费者数据结束
rs.pipe(process.stdout);
```

## Create a writable stream:[writable.js](./writable.js)

```js
const Stream = require("stream");
const writableStream = new Stream.Writable({
  decodeString: false,
  write(chunk, encoding, next) {
    // 当写入的时候会调用
    console.log(chunk.toString());
    next(); // 告知读取更多数据
  },
});
process.stdin.pipe(writableStream);
```

## Consumption of a readable stream:[consume0.js](./consume0.js)

```js
//(echo abc; sleep 1; echo def; sleep 1; echo ghi) | node consume0.js
process.stdin.on("readable", function () {
  var buf = process.stdin.read(); // 可以给read传参数 告知读取几个字节
  console.dir(buf); // 打印对象所有属性
  process.stdin.read(0); /// 0告知读取后续的所有字节
});
//output:
//<Buffer 61 62 63 0a> abc\0
//<Buffer 64 65 66 0a> def\0
//<Buffer 67 68 69 0a> ghi\0
```

You can also cache the content while the consumer is reading the data.[read1.js](./read1.js)

```js
const rs = new (require("stream").Readable)();

let c = 97;
rs._read = function () {
  // 当读取的时候会调用
  rs.push(String.fromCharCode(c++));
  if (c > "z".charCodeAt(0)) rs.push(null);
};

rs.pipe(process.stdout);

process.on("exit", function () {
  console.error("\n_read() called " + (c - 97) + " times");
});
```

Reading data from readable streams:[read2.js](./read2.js)

```js
const Stream = require("stream");

const readableStream = new Stream.Readable({
  read() {},
});
const writableStream = new Stream.Writable();

writableStream._write = (chunk, encoding, next) => {
  console.log(chunk.toString());
  next();
};

readableStream.pipe(writableStream);
// or Since all classes inherit from EventEmitter, they come with some basic events, such as (close...) and extended events
// readableStream.on('readable', () => {
//   console.log(readableStream.read().toString())
// })

readableStream.push("hi!");
readableStream.push("ho!");
```

## Writing data to a writable stream: [write1.js](./write1.js)

```js
const Stream = require("stream");
const writableStream = new Stream.Writable();

// var fs = require('fs');
// var ws = fs.createWriteStream('message.txt');
writableStream.write("hey!\n");
```

## How to close the stream: [close1.js](./close1.js)

```js
const Stream = require("stream");

const readableStream = new Stream.Readable({
  read() {},
});
const writableStream = new Stream.Writable();

writableStream._write = (chunk, encoding, next) => {
  console.log(chunk.toString());
  next();
};

writableStream.on("error", (err) => {
  console.log(err);
});

readableStream.pipe(writableStream);

readableStream.push("hi!");
readableStream.push("ho!");

readableStream.on("close", () => {
  writableStream.end();
  // writableStream.write('111') 关闭后再写会触发error事件。
}); // 关闭可写流。
writableStream.on("close", () => console.log("ended"));

readableStream.destroy(); // 销毁可读流。 触发close事件
```

## How to create a transforms stream:[transform.js](./transform.js)

```js
const { Transform } = require("stream");
const TransformStream = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  },
});

process.stdin.pipe(TransformStream).pipe(process.stdout);
```

Generally, to reduce each instantiation, we will use through2: through2.js

```js
// node through2.js hello.txt
const f = require("fs");
const through = require("through2");
fs.createReadStream(process.argv[2]).pipe(toUpper()).pipe(process.stdout);

function toUpper() {
  return through(function (chunk, enc, next) {
    next(null, chunk.toString().toUpperCase());
    // or 两个是等价的
    // this.push(chunk.toString().toUpperCase())
    // next()
  });
}
```

## How to create a duplex stream: [duplex.js](./duplex.js)

```js
// nc localhost 8000
const net = require("net"); // create tcp server
net
  .createServer(function (stream) {
    stream.pipe(stream);
  })
  .listen(8000);
```

A complex example. We can create a proxy server that forwards a bit in between (kind of like a vpn)：duplex2.js

```js
// nc localhost 8001 The results are forwarded through the 8000 server
const net = require("net"); // create tcp server
net
  .createServer(function (stream) {
    stream.pipe(net.connect(8000, "localhost")).pipe(stream);
  })
  .listen(8001);
```

## Object Flow [object.js](./object.js)

Normally, you can only read and write buffers (like text files) and strings. If you want to read objects, the
you need to enable object mode

```js
const through = require("through2");
const tr = through.obj(function (row, enc, next) {
  next(null, row.n * 1000 + "\n");
});
tr.pipe(process.stdout);
tr.write({ n: 5 });
tr.write({ n: 10 });
tr.write({ n: 3 });
tr.end();
```

### Built-in streams

- process.stdin: Readable streams
- process.stdout：Writable streams
- process.stderr：Writable streams
- fs.createReadStream()
- fs.createWriteStream()
- net.connect()： Duplex streams for establishing tcp connections
- net.createServer()
- http.request()
- http.createServer()
- zlib.createGzip()
- zlib.createGunzip() : gzip decompression
- zlib.createDeflate(): Compression with deflate algorithm
- zlib.createInflate(): Decompress with deflate algorithm
- tls.connect()
- tls.createServer()
- child_process spawn: Create a new process

## Core stream module:

- crypto: Encryption
- zlib： Compression
- split2： Return data by line, e.g. read a file
- websocket-stream
- collect-stream
- from2: Direct to readable stream
- to2： Direct to writable stream
- duplexify: Support for converting streams to duplex types
- pump
- pumpify
- end-of-stream： Determine if the stream is finished and receive a callback function

### collect-stream

[collect.js](./collect.js)

The same thing as concat-stream, except it has exception handling. Can be used for unit testing

### duplexify

[duplify.js](./duplify.js)

```js
const duplexify = require("duplexify");
const fs = require("fs");

function log() {
  const d = duplexify();
  var w = fs.createWriteStream("logs/test.log");
  d.setWritable(w);
  return d;
}

const stream = log();
stream.write(Date.now() + "\n");
stream.end();
concat - stream;
```

How to cache the stream for a one-time read: Output the stream as a buffer; or, in the case of objects, an array of objects.

Normal implementation:

```js
function ResponseReader(encoding) {
  stream.Transform.call(this);
  this._chuncks = [];
  this._encoding = encoding;
}
util.inherits(ResponseReader, stream.Transform);

ResponseReader.prototype._transform = function (chunk, encoding, callback) {
  this._chuncks.push(chunk);
  callback();
};

ResponseReader.prototype._flush = function (callback) {
  this.push(Buffer.concat(this._chuncks).toString(this._encoding));
  callback();
};
concat.js;

const concat = require("concat-stream");
process.stdin.pipe(
  concat(function (body) {
    console.log(body.length); //ctr+d 会一次性打印出来
  })
);
```

Complex scenarios. For example, we respond by returning complete data (such as an image) before proceeding to the next operation concat2.js
// curl -d msg=hello localhost:6000

```js
const concat = require("concat-stream");
const http = require("http");
const qs = require("querystring");
const through = require("through2");
function counter() {
  let size = 0;
  return through(function (buf, enc, next) {
    size += buf.length;
    if (size > 20) next(null, null); // 需要判断请求参数的长度: 超过20 则终止流
    else next(null, buf);
  });
}

const server = http.createServer(function (req, res) {
  req.pipe(counter()).pipe(
    concat({ encoding: "string" }, function (body) {
      const params = qs.parse(body); // 读取的是空
      console.log(params);
      res.end("ok\n");
    })
  );
});

server.listen(6000);
```

### pump

Solve the problem that before version 10.x, when the target stream is destroyed, the source stream is not automatically destroyed and there is no callback. Handle exceptions

```js
var pump = require("pump");
var fs = require("fs");

var source = fs.createReadStream("/dev/random");
var dest = fs.createWriteStream("/dev/null");

// source.pipe(dst) But there will be exception function callbacks
pump(source, dest, function (err) {
  console.log("pipe finished", err);
});

setTimeout(function () {
  dest.destroy(); // when dest is closed pump will destroy source
}, 1000);
```

After version 10.x you can use pipeline

```js
const { pipeline } = require("stream");
const fs = require("fs");
const zlib = require("zlib");

// Use the pipeline API to easily pipe a series of streams
// together and get notified when the pipeline is fully done.

// A pipeline to gzip a potentially huge tar file efficiently:

pipeline(
  fs.createReadStream("archive.tar"),
  zlib.createGzip(),
  fs.createWriteStream("archive.tar.gz"),
  (err) => {
    if (err) {
      console.error("Pipeline failed.", err);
    } else {
      console.log("Pipeline succeeded.");
    }
  }
);
```

### pumpify

pump and duplexify will return a duplex stream

## How to cache the stream for a one-time read:[concat.js](./concat.js)

### concat-stream

```js
const concat = require("concat-stream");
process.stdin.pipe(
  concat(function (body) {
    console.log(body.length); //ctr+d 会一次性打印出来
  })
);
```

Complex scenarios. For example, we need to determine the length of the request parameters.[concat2.js](./concat2.js)

```js
// curl -d msg=hello localhost:6000
const concat = require("concat-stream");
const http = require("http");
const qs = require("querystring");
const through = require("through2");
function counter() {
  let size = 0;
  return through(function (buf, enc, next) {
    size += buf.length;
    if (size > 20) next(null, null); // 终止流
    else next(null, buf);
  });
}

const server = http.createServer(function (req, res) {
  req.pipe(counter()).pipe(
    concat({ encoding: "string" }, function (body) {
      const params = qs.parse(body); // 读取的是空
      console.log(params);
      res.end("ok\n");
    })
  );
});

server.listen(6000);
```

## rpc-stream

RPC (Remote Procedure Call) is the Chinese name for "Remote Procedure Call".
It is actually a call to a function on another machine. For example, our group's HSF is actually a remote call. The source code is worth reading about how to design a good interface.

[rpc-server.js](./rpc-server.js)

```js
const rpc = require("rpc-stream");
const net = require("net");

net
  .createServer(function (stream) {
    const server = rpc({
      // duplex类型
      hello: function (name, cb) {
        cb(null, "hello, " + name);
      },
    });
    server.pipe(stream).pipe(server);
  })
  .listen(8001);
```

[rpc-client.js](./rpc-client.js)

```js
const rpc = require("rpc-stream");
const net = require("net");

const client = rpc();
client.pipe(net.connect(8001, "localhost")).pipe(client); // 需要再次pipe(client)

const remote = client.wrap(["hello"]);

remote.hello("JIM", function (err, mess) {
  if (err) throw err;
  console.log(mess);
});
```

Using the rpc protocol does not require json format. This is an advantage.

## Practical application scenarios

### 1 File download/import/export

https://www.eggjs.org/api/node_modules_egg-multipart_app_extend_context.js.html

```js
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
        // File handling, uploading to cloud storage, etc.
        object = yield ctx.oss.put('egg-oss-demo-' + part.filename, part);
    }
    part = yield parts;
}


```

### 2 Network transfer: e.g. downloading files from a remote location

```js
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

Too much code: Please open the file to see:

[vpn-client.js](./vpn-client.js)
[vpn-server.js](./vpn-server.js)

```shell
node vpn-client.js
node vpn-server.js
node echo.js
```

### 4 Real-time communication websocket

[websocket-client.js](./websocket-client.js)
[websocket-server.js](./websocket-server.js)

```shell
browserify websocket-client.js > public/bundle.js (或者nodejs client也行）
node websocket-server.js
```

### 5 p2p

A peer-to-peer (P2P) service is a decentralized platform where two people interact directly with each other without a third party interme.[webrtc.js](./webrtc.js)

```shell
tnpm run signalhub
budo webrtc.js
```

Question: Is discord peer-to-peer?

### 6 Engineering

> gulp requires frequent file manipulation

### 7 webassembly

https://developers.google.com/web/updates/2018/04/loading-wasm

### Extensions

Extensions may be needed to implement customizations in real-world applications

1 Custom implementation

Implement a writable stream
This can be used to customize the timing of stream writes, so that when the chunk size exceeds a certain threshold, the file is actually written, improving the write speed

```js
// strace -cfe trace=write node index.js
var Writable = require("stream").Writable;
var util = require("util");

function MyWritable(options) {
  Writable.call(this, options);
}
util.inherits(MyWritable, Writable); // 继承自Writable
MyWritable.prototype._write = function (chunk, encoding, callback) {
  console.log("The data being written is:", chunk.toString());
  //this.data.push(chunk);
  callback();
};
process.stdin.pipe(new MyWritable());

const Readable = require("stream").Readable;

class MyReadable extends Readable {
  constructor(dataSource, options) {
    super(options);
    this.dataSource = dataSource;
  }
  _read() {
    const data = this.dataSource.makeData();
    this.push(data);
  }
}
```

Implementing pipe

```js
Readable.prototype.pipe = function (writable, options) {
  this.on("data", (chunk) => {
    let ok = writable.write(chunk);
    !ok && this.pause();
  });
  writable.on("drain", () => {
    this.resume();
  });
  writable.emit("pipe", this);
  return writable;
};
```
