let c = 97;

const Stream = require("stream");
const rs = new Stream.Readable({
  read() {
    rs.push(String.fromCharCode(c++));
    if (c > "z".charCodeAt(0)) rs.push(null);
  },
});

// or
// rs._read = function() {
// }

rs.pipe(process.stdout);

process.on("exit", function () {
  console.error("\n_read() called " + (c - 97) + " times");
});
