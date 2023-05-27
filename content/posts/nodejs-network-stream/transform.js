const { Transform } = require("stream");
const TransformStream = new Transform({
  transform(chunk, encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  },
});

process.stdin.pipe(TransformStream).pipe(process.stdout);
