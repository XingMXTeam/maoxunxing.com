var swarm = require("webrtc-swarm");
var signlahub = require("signalhub");
var through = require("through2");
var to = require("to2");
var onend = require("end-of-stream");
var html = require("yo-yo");
var root = document.body.appendChild(document.createElement("div"));

// var hub = signlahub('swarmtest', ['https://signalhub-jccqtwhdwc.now.sh'])
var hub = signlahub("swarmtest", ["http://localhost:8080"]);
// hub.subscribe('hello').on('data', console.log)

// hub.broadcast('hello', {hello: 'world'}, function () {
//   console.log('broadcasted message')
//   hub.close(function () {
//     console.log('closed client')
//   })
// })

var sw = swarm(hub);
var output = [];
var peers = [];
update();

function update() {
  function onsubmit(ev) {
    ev.preventDefault();
    var msg = this.elements.msg.value;
    Object.keys(peers).forEach(function (id) {
      peers[id].write(msg + "\n");
    });
    this.reset();
  }

  html.update(
    root,
    html`<div>
      <form onsubmit=${onsubmit}>
        <input type="text" name="msg" />
      </form>
      <pre>${output.join("")}</pre>
    </div>`
  );
}

sw.on("peer", function (peer, id) {
  peers[id] = peer;
  onend(peer, function () {
    delete peers[id];
  });
  peer.pipe(
    to(function (buf, enc, next) {
      output.push(buf.toString());
      update();
      next();
    })
  );
  // peer.on('data', function (buf) {
  //   console.log(buf)
  //   output.push(buf.toString())
  //   update()
  // })
});

function toupper() {
  return through(function (buf, enc, next) {
    next(null, buf.toString().toUpperCase());
  });
}
