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
