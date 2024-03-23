const Stream = require("stream");
const writableStream = new Stream.Writable({
  decodeStrings: false, // 默认都会转为Buffer， false则不会
  write(chunk, encoding, next) {
    console.dir(chunk);
    next();
  },
});
process.stdin.pipe(writableStream);
