---
title: "Node Stream Complete Guide Notes"
description: ""
date: 2025-02-04
tags:
  - nodejs
images:
  - nodejs-1/node-js.jpeg
---

## Network Basics
Any connected computer can function as a **server** or a **client**.  
In network communication, data is typically split into **small pieces (tiny chunks)** for transmission. For example, if we have a message that needs to be sent:  
This is the message we want to send. It contains information. XXX SFDSDF sdafEFAEFwqf
```
It may be split into multiple packets.
```

## TCP and UDP Protocols

### TCP (Transmission Control Protocol)
---
- **Reliable transmission**: If a packet is not acknowledged (ACK) by the receiver, it will be retransmitted.
- **Application Scenarios**: Widely used in most network communication scenarios, such as web browsing, file transfer, etc.

### UDP (User Datagram Protocol)
- **Unreliable Transmission**: After sending the data packet, it does not guarantee whether the receiving end has received it.
- **Application Scenarios**: Often used in scenarios with high real-time requirements, such as streaming video, audio transmission, and certain online games.

## Common Network Protocols

Network protocols are the language of communication between computer programs. Here are some common network protocols and their uses:
- **HTTP**: Used for browsing web pages.
- **HTTPS**: Used for browsing web pages with encryption.
- **SMTP**: Used for sending and receiving email.
---
- **IMAP/POP3**: Used for loading emails from the mailbox.
- **IRC**: Used for chatting.
- **FTP**: Used for file transfer.
- **SSH**: Remote operations are achieved through encrypted connections.
- **SSL**: A low-level secure data transmission protocol (used by HTTPS).

## Stream Types

In Node.js, streams are a way of handling data. Here are some common stream types:
### Basic Classification of Streams

1. **Readable Stream**
   - Produces data, from which data can be piped.
   - Example code:
```javascript
---
     var fs = require('fs');
     var r = fs.createReadStream('file.txt');
     r.pipe(process.stdout);
```
2. **Writable stream**

   - Consumes data, can pipe data into it.
   - Example code:
     ```javascript
const fs = require('fs');
     const w = fs.createWriteStream('cool.txt');
     w.write('hi\n');
     w.write('wow\n');
w.end();
     ```
3. **Transform Stream**

   - Consumes data and generates transformed data.
   - Example code:
```javascript
     A.pipe(transform).pipe(B);
4. **Duplex streams**
   - Can both consume and produce data, but the two operations are independent.

- Sample code:
     ```javascript
     A.pipe(duplex).pipe(A);
     ```
### Methods of readable streams
- `stream.pipe(...)`：Pipes data to another stream.

- `stream.once('end', function() {})` : Listen for the stream end event.

- Other methods (usually called automatically by modules or `.pipe()`):
- `stream.read()`
- `stream.on('readable', function() {})`
     ```
### Methods for Writable Streams
- `.write(buf)`：Write data.

- `.end()` or `.end(buf)`：End writing.

- `.on('finish', function() {})` or `.once('finish', function() {})`: Listen for the write completion event.
- `(...).pipe(stream)`: Pipe data to a writable stream.
### Readable Stream Modes
     ```
1. **Paused Mode**

---

- Default behavior, with automatic backpressure.
2. **Flowing Mode**
   - Data is consumed immediately when available (no backpressure).
   
   - How to enable Flowing Mode:
- `stream.resume()`
     - `stream.on('data', function(buf) {})`
## Core Streams
Node.js's core modules provide various implementations of streams, such as those in the HTTP module.

---

### HTTP Core Flow
// req: readable stream, res: writable stream

http.createServer(function(req, res) {});
// req: writable stream, res: readable stream
var req = http.request(opts, function(res) {});
### Example: HTTP Server

Here is a simple HTTP server example that demonstrates how to use stream processing for requests and responses:
---
var http = require('http');

var fs = require('fs');

var server = http.createServer(function(req, res) {
    if (req.method === 'POST') {

        // Output POST request data to standard output
req.pipe(process.stdout);
        req.once('end', function() {

            res.end('ok\n');
        });
} else {
        // Return file content as response
---
        res.setHeader('content-type', 'text/plain');
        fs.createReadStream('hello.txt').pipe(res);
server.listen(8080, function() {
    console.log('Server is running on port 8080');
This article introduces the basics of network communication, including the differences between TCP and UDP, common network protocols, types of streams and their usage methods, and demonstrates how to implement an HTTP server in Node.js through code examples. These contents lay the foundation for understanding network programming and stream-based data processing.
```javascript
```
---

```javascript
    }
});
});

```