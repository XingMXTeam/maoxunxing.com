const Stream = require("stream");

const readableStream = new Stream.Readable({
  read() {},
});
const writableStream = new Stream.Writable();

writableStream._write = (chunk, encoding, next) => {
  console.log(chunk.toString());
  next();
};

writableStream.on("error", (err) => {
  console.log(err);
});

readableStream.pipe(writableStream);

readableStream.push("hi!");
readableStream.push("ho!");

readableStream.on("close", () => {
  writableStream.end();
  // writableStream.write('111') 关闭后再写会触发error事件。
}); // 关闭可写流。
writableStream.on("close", () => console.log("ended"));

readableStream.destroy(); // 销毁可读流。 触发close事件
