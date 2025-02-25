const net = require("net");
const multiplex = require("multiplex");
const rpc = require("rpc-stream");

const plex = multiplex(function (stream, id) {
  if (/^file-/.test(id)) {
    console.log("reveived file " + id.replace(/^file-/, ""));
    stream.pipe(process.stdout);
  }
});

plex.pipe(net.connect(8000)).pipe(plex);

const client = rpc();
client.pipe(plex.createSharedStream("rpc")).pipe(client);
const remote = client.wrap(["read"]);
remote.read(process.argv[2], function (err) {
  if (err) console.error(err);
});
