var collect = require("collect-stream");
var split = require("split2");
var sp = process.stdin.pipe(split());
collect(sp, function (err, rows) {
  if (err) console.error(err);
  else console.log(rows);
});
