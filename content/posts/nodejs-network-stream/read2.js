const Stream = require("stream");
const readableStream = new Stream.Readable({
  read() {},
});
const writableStream = new Stream.Writable({
  write(chunk, encoding, next) {
    console.log(chunk.toString());
    next();
  },
});

readableStream.pipe(writableStream);
// or
// readableStream.on('readable', () => {
//   console.log(readableStream.read().toString())
// })

readableStream.push("hi!");
readableStream.push("ho!");
// or
// writableStream.write('hey!\n')

readableStream;
