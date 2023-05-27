const net = require("net"); // create tcp server
net
  .createServer(function (stream) {
    stream.pipe(net.connect(8000, "localhost")).pipe(stream);
  })
  .listen(8001);
