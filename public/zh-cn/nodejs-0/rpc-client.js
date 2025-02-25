const rpc = require("rpc-stream");
const net = require("net");

const client = rpc();
client.pipe(net.connect(8001, "localhost")).pipe(client); // 需要再次pipe(client)

const remote = client.wrap(["hello"]);

remote.hello("JIM", function (err, mess) {
  if (err) throw err;
  console.log(mess);
});
