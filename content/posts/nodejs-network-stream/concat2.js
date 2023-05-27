// const concat = require('concat-stream')
// const http = require('http')
// const qs = require('querystring')

// const server = http.createServer(function(req, res) {
//     req.pipe(concat({ encoding: 'string' }, function(body) {
//         const params = qs.parse(body)
//         console.log(params)
//         res.end('ok\n')
//     }))
// })

// server.listen(6000)

const concat = require("concat-stream");
const http = require("http");
const qs = require("querystring");
const through = require("through2");
function counter() {
  let size = 0;
  return through(function (buf, enc, next) {
    size += buf.length;
    console.log(size);
    if (size > 20) next(null, null);
    else next(null, buf);
  });
}

const server = http.createServer(function (req, res) {
  req.pipe(counter()).pipe(
    concat({ encoding: "string" }, function (body) {
      const params = qs.parse(body);
      console.log(params);
      res.end("ok\n");
    })
  );
});

server.listen(6000);
