---
title: "Understanding Streams in Node.js"
date: 2021-10-19T14:28:57+08:00
tags:
  - nodejs
description: "What are streams? This article provides a detailed introduction to Node.js stream technology, taking you from beginner to advanced. You will also learn about advanced technologies like networking, RPC, and WebSockets."
images:
  - nodejs-1/node-js.jpeg
---
## What is a Stream?
Streams don't just exist in Node.js; similar concepts are found in Unix-like operating systems. For example, the pipe operator:
```shell
cat xx.ts | grep 'console.log'
```
can find matching content in a file. In fact, the concept of streams in Node.js originates from Unix systems, initially from Douglas McIlroy's concept of pipelines
[Original source](http://cm.bell-labs.co/who/dmr/mdmpipe.html).
Wikipedia:
> Malcolm Douglas McIlroy (born 1932) is a mathematician, engineer, and programmer. As of 2019 he is an Adjunct Professor of Computer Science at Dartmouth College. **McIlroy is best known for having originally proposed Unix pipelines** and developed several Unix tools, such as spell, diff, sort, join, graph, speak, and tr.[1] He was also one of the pioneering researchers of macro processors and programming language extensibility. He participated in the design of multiple influential programming languages, particularly PL/I, SNOBOL, ALTRAN, TMG and C++.
Essentially, a stream is a format for data exchange, for example, when we are reading/writing files or transmitting data over a network. I personally believe that streams are one of the most difficult to understand yet most powerful features in Node.js.
Are streams relevant to us? In Node.js, streams are almost everywhere. For example, request streams, response streams, and file streams. A search of the [Node runtime code](https://github.com/nodejs/node/blob/863d13c192a8d315fa274194e64c1c9e5820e8f2/lib/internal/console/constructor.js) shows them everywhere:
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
### Why Do We Need Streams?
Everyone is quite familiar with this piece of code:
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
In Node.js, when we read a file, the entire file is read into memory, and then its content is processed. What's the problem with this? The `data.txt` file will be read into memory, which can lead to a poor user experience, especially in low-network conditions.
With streams, you can process data piece by piece, instead of reading everything into memory at once.
Rewritten using streams:
```js
const http = require("http");
const fs = require("fs");
const server = http.createServer(function (req, res) {
  const stream = fs.createReadStream(__dirname + "/data.txt");
  stream.pipe(res);
});
server.listen(3000);
```
Here, `pipe` does two things: 1. It listens for data. 2. It's equivalent to calling `res.end`, and it automatically manages the caching of data chunks.
We can even perform data compression:
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
## Types of Streams
1. Readable: `readable.pipe(A)`
2. Writable: `A.pipe(writable)`
3. Duplex: Both readable and writable `A.pipe(duplex).pipe(A)`
4. Transform: A type of Duplex stream that is both readable and writable, where the output is a transformation of the input `A.pipe(transform).pipe(B)`
The pipe method:
All readable/transform/duplex streams have this method, and it returns a readable/transform/duplex stream.
```js
src.pipe(dst); // Returns a readable stream, so it can be chained, just like the Unix pipe operator, e.g., cat xx.txt | grep 'console'
```
Common methods for Readable streams:
- `stream.pipe(...)`
- `stream.once('end', function() {})`
Two modes: The default is paused mode, which means you need to manually call `next`/`read` methods. You can switch to flowing mode.
- `stream.resume()`
- `stream.on('data', function(buf) {}) ` // Binding this event automatically triggers flowing mode
The data from the source does not flow directly to the consumer. Instead, it is first pushed to a buffer pool, which has a high water mark. If this level is exceeded, `push` will return `false`. For example:
- The consumer actively executes `.pause()`
- The consumption speed is slower than the production speed of data being pushed into the buffer pool.
Both will cause it to return `false`. This situation is also called "Backpressure".
Common methods for Writable streams:
- `.write(buf)`
- `.end()`
- `.end(buf)`
- `.on('finish',function() {})`
- (...).pipe(stream)
The data stream first goes to a resource pool. If writing is slow or paused, it will be buffered. If it's too fast, `write` will return `false`, triggering a `drain` event.
Transform/Duplex streams can use all the methods mentioned above.
## Creating a Readable Stream: [readable.js](./readable.js)
```js
const rs = new (require("stream").Readable)();
rs.push("beep");
rs.push(null); // null tells the consumer that the data has ended
rs.pipe(process.stdout);
```
## Creating a Writable Stream: [writable.js](./writable.js)
```js
const Stream = require("stream");
const writableStream = new Stream.Writable({
  decodeString: false,
  write(chunk, encoding, next) {
    // Called when writing
    console.log(chunk.toString());
    next(); // Signals to read more data
  },
});
process.stdin.pipe(writableStream);
```
## Consuming a Readable Stream: [consume0.js](./consume0.js)
```js
//(echo abc; sleep 1; echo def; sleep 1; echo ghi) | node consume0.js
process.stdin.on("readable", function () {
  var buf = process.stdin.read(); // You can pass an argument to read() to specify how many bytes to read
  console.dir(buf); // Prints all properties of the object
  process.stdin.read(0); /// 0 tells it to read all subsequent bytes
});
//output:
//<Buffer 61 62 63 0a> abc\0
//<Buffer 64 65 66 0a> def\0
//<Buffer 67 68 69 0a> ghi\0
```
You can also buffer content when the consumer reads data: [read1.js](./read1.js)
```js
const rs = new (require("stream").Readable)();
let c = 97;
rs._read = function () {
  // Called when reading
  rs.push(String.fromCharCode(c++));
  if (c > "z".charCodeAt(0)) rs.push(null);
};
rs.pipe(process.stdout);
process.on("exit", function () {
  console.error("\n_read() called " + (c - 97) + " times");
});
```
Reading data from a readable stream: [read2.js](./read2.js)
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
// or because all stream classes inherit from EventEmitter, they come with some basic events (like close...) and extended events
// readableStream.on('readable', () => {
//   console.log(readableStream.read().toString())
// })
readableStream.push("hi!");
readableStream.push("ho!");
```
## Writing Data to a Writable Stream: [write1.js](./write1.js)
```js
const Stream = require("stream");
const writableStream = new Stream.Writable();
// var fs = require('fs');
// var ws = fs.createWriteStream('message.txt');
writableStream.write("hey!\n");
```
## How to Close a Stream: [close1.js](./close1.js)
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
  // writableStream.write('111') // Writing after closing will trigger an error event.
}); // Close the writable stream.
writableStream.on("close", () => console.log("ended"));
readableStream.destroy(); // Destroys the readable stream, triggering the 'close' event
```
## How to Create a Transform Stream: [transform.js](./transform.js)
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
To reduce instantiation every time, we often use `through2`: through2.js
```js
// node through2.js hello.txt
const f = require("fs");
const through = require("through2");
fs.createReadStream(process.argv[2]).pipe(toUpper()).pipe(process.stdout);
function toUpper() {
  return through(function (chunk, enc, next) {
    next(null, chunk.toString().toUpperCase());
    // or the two are equivalent
    // this.push(chunk.toString().toUpperCase())
    // next()
  });
}
```
## How to Create a Duplex Stream: [duplex.js](./duplex.js)
```js
// nc localhost 8000
const net = require("net"); // create tcp server
net
  .createServer(function (stream) {
    stream.pipe(stream);
  })
  .listen(8000);
```
A more complex example. We can create a proxy server that forwards requests (a bit like a VPN): duplex2.js
```js
// nc localhost 8001, the result is forwarded through the server on port 8000
const net = require("net"); // create tcp server
net
  .createServer(function (stream) {
    stream.pipe(net.connect(8000, "localhost")).pipe(stream);
  })
  .listen(8001);
```
## Object Streams [object.js](./object.js)
Normally, you can only read and write buffers (like text files) and strings. If you want to read objects, you need to enable object mode.
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
### Built-in Streams
- process.stdin: A readable stream
- process.stdout: A writable stream
- process.stderr: A writable stream
- fs.createReadStream()
- fs.createWriteStream()
- net.connect(): A Duplex stream used to establish a TCP connection
- net.createServer()
- http.request()
- http.createServer()
- zlib.createGzip()
- zlib.createGunzip(): Decompress gzip
- zlib.createDeflate(): Compress using the deflate algorithm
- zlib.createInflate(): Decompress using the deflate algorithm
- tls.connect()
- tls.createServer()
- child_process spawn: Creates a new process
## Core Stream Modules:
- crypto: Encryption
- zlib: Compression
- split2: Returns data line by line, e.g., when reading a file
- websocket-stream
- collect-stream
- from2: Directly convert to a readable stream
- to2: Directly convert to a writable stream
- duplexify: Supports converting a stream to a duplex type
- pump
- pumpify
- end-of-stream: Determines if a stream has ended, accepts a callback function
### collect-stream
[collect.js](./collect.js)
It's the same thing as `concat-stream`, but it has error handling. It can be used for unit testing.
### duplexify
[duplexify.js](./duplexify.js)
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
How to buffer a stream to read it all at once: Outputs the stream as a buffer; if it's an object stream, it becomes an array of objects.
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
    console.log(body.length); // ctrl+d will print it all at once
  })
);
```
Complex scenarios. For example, we wait for the complete response data (like an image) before proceeding to the next step: concat2.js
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
    if (size > 20) next(null, null); // Need to check the length of the request parameters: terminate the stream if it exceeds 20
    else next(null, buf);
  });
}
const server = http.createServer(function (req, res) {
  req.pipe(counter()).pipe(
    concat({ encoding: "string" }, function (body) {
      const params = qs.parse(body); // Reads as empty
      console.log(params);
      res.end("ok\n");
    })
  );
});
server.listen(6000);
```
### pump
Solves the problem from before Node.js v10.x where the source stream was not automatically destroyed and there was no callback when the destination stream was destroyed. Handles exceptions.
```js
var pump = require("pump");
var fs = require("fs");
var source = fs.createReadStream("/dev/random");
var dest = fs.createWriteStream("/dev/null");
// source.pipe(dst) but with an error callback
pump(source, dest, function (err) {
  console.log("pipe finished", err);
});
setTimeout(function () {
  dest.destroy(); // when dest is closed pump will destroy source
}, 1000);
```
After Node.js v10.x, you can use `pipeline`
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
A combination of `pump` and `duplexify`. It returns a duplex stream.
## How to Buffer a Stream to Read It All at Once: [concat.js](./concat.js)
### concat-stream
```js
const concat = require("concat-stream");
process.stdin.pipe(
  concat(function (body) {
    console.log(body.length); // ctrl+d will print it all at once
  })
);
```
Complex scenarios. For example, we need to check the length of request parameters: [concat2.js](./concat2.js)
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
    if (size > 20) next(null, null); // Terminate the stream
    else next(null, buf);
  });
}
const server = http.createServer(function (req, res) {
  req.pipe(counter()).pipe(
    concat({ encoding: "string" }, function (body) {
      const params = qs.parse(body); // Reads as empty
      console.log(params);
      res.end("ok\n");
    })
  );
});
server.listen(6000);
```
## rpc-stream
RPC (Remote Procedure Call)
It's essentially calling a function on another machine, usually based on TCP. For example, our group's HSF is a remote call. The source code is well worth reading to learn about how to design good interfaces.
[rpc-server.js](./rpc-server.js)
```js
const rpc = require("rpc-stream");
const net = require("net");
net
  .createServer(function (stream) {
    const server = rpc({
      // duplex type
      hello: function (name, cb) {
        cb(null, "hello, " + name);
      },
    });
    server.pipe(stream).pipe(server); // needs to be passed to the server
  })
  .listen(8001);
```
[rpc-client.js](./rpc-client.js)
```js
const rpc = require("rpc-stream");
const net = require("net");
const client = rpc();
client.pipe(net.connect(8001, "localhost")).pipe(client); // needs to be piped to client again
const remote = client.wrap(["hello"]);
remote.hello("JIM", function (err, mess) {
  if (err) throw err;
  console.log(mess);
});
```
The RPC protocol doesn't require JSON format. This is an advantage.
## Practical Application Scenarios
### 1. File Download / Import & Export
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
        // File processing, uploading to cloud storage, etc.
        object = yield ctx.oss.put('egg-oss-demo-' + part.filename, part);
    }
    part = yield parts;
}
```
### 2. Network Transmission: e.g., Downloading a File from a Remote Server
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
### 3. VPN
Too much code: Please open the files to view:
[vpn-client.js](./vpn-client.js)
[vpn-server.js](./vpn-server.js)
```shell
node vpn-client.js
node vpn-server.js
node echo.js
```
### 4. Real-time Communication: WebSocket
[websocket-client.js](./websocket-client.js)
[websocket-server.js](./websocket-server.js)
```shell
browserify websocket-client.js > public/bundle.js (or a Node.js client would also work)
node websocket-server.js
```
Question: What is the difference between WebSocket and [socket.io](https://github.com/socketio/socket.io/blob/master/lib/index.ts)?
### 5. P2P
Peer-to-peer (P2P) service is a decentralized platform where two individuals interact directly without a third-party intermediary. [webrtc.js](./webrtc.js)
```shell
tnpm run signalhub
budo webrtc.js
```
Question: Is Discord peer-to-peer?
### 6. Build Engineering
> Gulp needs to perform frequent file operations
### 7. WebAssembly
https://developers.google.com/web/updates/2018/04/loading-wasm
### Extensions
In practical applications, you may need to extend streams to implement custom requirements.
1. Custom Implementation
Implement a Writable stream
You can use it to customize the timing of stream writes. For example, only actually writing to the file when the chunk size exceeds a certain threshold, to improve writing speed.
```js
// strace -cfe trace=write node index.js
var Writable = require("stream").Writable;
var util = require("util");
function MyWritable(options) {
  Writable.call(this, options);
} // constructor
util.inherits(MyWritable, Writable); // Inherits from Writable
MyWritable.prototype._write = function (chunk, encoding, callback) {
  console.log("Data being written:", chunk.toString()); // The written data can be processed here
  //this.data.push(chunk); // buffer it first
  callback(); // finally write
};
process.stdin.pipe(new MyWritable()); // stdin as the input source, MyWritable as the output destination
Implement a readable stream;
const Readable = require("stream").Readable;
// Stream implementation
class MyReadable extends Readable {
  constructor(dataSource, options) {
    super(options);
    this.dataSource = dataSource;
  }
  // Classes that inherit from Readable must implement this function
  // Triggers the underlying system to read from the stream
  _read() {
    const data = this.dataSource.makeData();
    this.push(data);
  }
}
```
Implement pipe
```js
Readable.prototype.pipe = function (writable, options) {
  this.on("data", (chunk) => {
    let ok = writable.write(chunk);
    // backpressure, pause
    !ok && this.pause();
  });
  writable.on("drain", () => {
    // resume
    this.resume();
  });
  // Tell the writable that a stream is being piped to it
  writable.emit("pipe", this);
  // Support chaining
  return writable;
};
```
## Streams Cannot Be Consumed More Than Once
You need to use a `clone()` method to clone it before processing. For example, the `Response` object in a Service Worker.
