const net = require("net");
const multiplex = require("multiplex");
const rpc = require("rpc-stream");
const fs = require("fs");

net
  .createServer(function (stream) {
    const plex = multiplex();
    stream.pipe(plex).pipe(stream);
    const client = rpc({
      read: function (name, cb) {
        if (!/^[\w-]+$/.test(name)) {
          return cb(new Error("file not allowed"));
        }
        const r = fs.createReadStream("files/" + name);
        r.on("error", cb);
        r.pipe(plex.createStream("file-" + name)).pipe(r);
        cb(null);
      },
    });
    client.pipe(plex.createSharedStream("rpc")).pipe(client);
  })
  .listen(8000);
