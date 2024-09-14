const rs = new (require("stream").Readable)();
rs.push("beep");
rs.push(null); // null告诉消费者数据结束
rs.pipe(process.stdout);
