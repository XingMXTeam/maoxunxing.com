const concat = require('concat-stream')
const http = require('http')
const qs = require('querystring')
const through = require('through2')

const server = http.createServer(function(req, res) {
    req
    .pipe(concat({ encoding: 'string' }, function(body) {
        res.end(`${body}ok\n`)
    }))
})

server.listen(6000)
