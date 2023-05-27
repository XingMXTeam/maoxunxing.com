const fs = require("fs");
const through = require("through2");
fs.createReadStream(process.argv[2]).pipe(toUpper()).pipe(process.stdout);

function toUpper() {
  return through(function (chunk, enc, next) {
    //next(null, chunk.toString().toUpperCase())
    this.push(chunk.toString().toUpperCase());
    next();
  });
}
