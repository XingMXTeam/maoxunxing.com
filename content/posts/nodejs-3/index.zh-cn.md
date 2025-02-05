---
title: "NodeJS #3期：Node Stream Complete Guide Notes"
description: ""
date: 2025-02-04
tags:
  - NodeJS
images:
  - nodejs-1/node-js.jpeg
---

## Networking、Servers、and Clients  

### networking  

### servers and clients  

Any networked computer can be a server  
Any networked computer can be a client  

tiny chunks of data  
For example, if we have a payload:

`This is the message we want to send. It contains information. XXX SFDSDF sdafEFAEFwqf`

it might get broken up into multiple packets
tcp vs udp

TCP - reliable transport : if a packet is not acknowledged(ACK) on the other end, it get resent
UDP - unreliable transport: packets are sent but there is no confirmation that the packet was received at the other end

tcp vs udp uses
UDP  -  sometimes used for streaming video and audio, some games
TCP  -  everything else

protocols
the language that computer programs speak to each other
Exmaples of network protocols

* HTTP - browse web pages
* HTTPS - browse web pages with encryption
* SMTP - send and receive emails
* IMAP, POP3 - load emails from an inbox
* IRC - chat
* FTP - file transfer
* SSH - remote shell over an encrypted connecton
* SSL - low-level secure data transfer(used by HTTPS)

Stream Types
stream types
There are many kinds of streams. We've seen two types already: transform(through2) and writable(concat - stream)

* readable - produces data: you can pipe FROM it
* writable - consumes data: you can pipe TO it
* transform - consumes data, producing transformed data
* duplex - consumes data separately from producing data

stream stypes in code

* readable: `readable.pipe(A)`
* writable: `A.pipe(writable)`
* transform: `A.pipe(transform).pipe(B)`
* duplex: `A.pipe(duplex).pipe(A)`

readable stream methods

* `stream.pipe(...)`
* `stream.once('end', function() {})`
you probably won't need to call these very oftern:
* `stream.read()`
* `stream.on('readable', function() {} )`
you can let a module or `.pipe()` take care of calling those

example:

```
var fs = require('fs')
var r = fs.createReadStream()
r.pipe(process.stdout)
```

writable stream methods
 `.pipe()` which is a method of all readable streams(readable, transform, and duplex).

Any stream you can write to (writable, transform, and duplex streams) has these methods:

* `.write(buf)`
* `.end()`
* `.end(buf)`
* `.on('finish', function() {})`
* `.once('finish', function() {})`
* (...).pipe(stream)

example:

```
const fs = require('fs');
const w = fs.createWriteStream('cool.txt`)
w.write('hi\n');
w.write('wow\n');
w.end();
```

readable : paused mode
default behavior with automatic backpressure

readable: flowing mode
data is consumed as soon as chunks are available (no backpressure)
turn on flowing mode with:

* `stream.resume()`
* `stream.on('data', function(buf) {})`

core streams
http core streams

```js
// req: readable, res: writable
http.createServer(function(req, res) {})

// req: writable, res: readable
var req = http.request(opts, function(res) {} )
```

example:
http-server.js:

```js
var http = require('http')
var fs = require('fs')
var server = http.createServer(function(req, res) {
    if(req.method == 'POST') {
       req.pipe(process.stdout)
       req.once('end', function() {
            res.end('ok\n')
       })       
    }
  else  {
    res.setHeader('content-type', 'text/plain')
    fs.createReadStream('hello.txt').pipe(res)
  }
})
```
 No newline at end of file
