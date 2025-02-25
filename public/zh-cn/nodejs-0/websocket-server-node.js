var http = require("http");
var through = require("through2");
var wsock = require("websocket-stream");

var server = http.createServer(function (req, res) {
  res.end("not found\n");
});
server.listen(5000);

wsock.createServer({ server: server }, function (stream) {
  stream.pipe(loud()).pipe(stream);
});

function loud() {
  return through(function (buf, enc, next) {
    next(null, buf.toString().toUpperCase());
  });
}
