var through = require('through2')
var wsock = require('websocket-stream')
var stream = wsock('ws://' + location.host)
var html = require('yo-yo')
var root = document.body.appendChild(document.createElement('div'))
var output = [];

update()

stream.pipe(through(function (buf, enc, next) {
  output.push(buf.toString())
  update()
  next()
}))

function update() {
  function onsubmit(ev) {
    ev.preventDefault();
    var msg = this.elements.msg.value;
    stream.write(msg + '\n')
    this.reset()
  }

  html.update(root, html`<div>
    <form onsubmit=${onsubmit}>
      <input type='text' name='msg'>
    </form>
    <pre>${output.join('')}</pre>
  </div>`)
}




