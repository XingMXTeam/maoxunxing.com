const rs = new (require('stream').Readable);
rs.push('beep');
rs.push(null);
rs.pipe(process.stdout);