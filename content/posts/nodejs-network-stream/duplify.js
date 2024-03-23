const duplexify = require("duplexify");
const fs = require("fs");

function log() {
  const d = duplexify();
  var w = fs.createWriteStream("logs/test.log");
  d.setWritable(w);
  return d;
}

const stream = log();
stream.write(Date.now() + "\n");
stream.end();
