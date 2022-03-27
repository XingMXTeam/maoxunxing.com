---
title: "NodeJS Stream系列第五篇之实际场景"
date: 2021-10-19T14:28:57+08:00
tags:
- NodeJS 
description: "流有哪些实际的应用场景"
images:
- nodejs-network-stream/streams.png
---

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

### 其他文章

[NodeJS Stream系列第五篇之实际场景](../nodejs-network-stream)  
[NodeJS Stream系列第二篇之流的类型](../nodejs-network-stream2)  
[NodeJS Stream系列第三篇之基本用法](../nodejs-network-stream3)  
[NodeJS Stream系列第四篇之高级用法](../nodejs-network-stream4)  
[NodeJS Stream系列第五篇之实际场景](../nodejs-network-stream5)  
