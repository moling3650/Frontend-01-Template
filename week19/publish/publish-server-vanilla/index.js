const http = require('http')
const fs = require('fs')
const unzip = require('unzipper')

//Create an HTTP server
const server = http.createServer((req, res) => {
  let writeStream = unzip.Extract({ path: '../server/public' })
  req.pipe(writeStream)

  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('okay')
  })
})

server.listen(8081)
