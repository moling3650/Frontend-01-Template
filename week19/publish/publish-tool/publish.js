const http = require('http')
const querystring = require('querystring')
const fs = require('fs')
const archiver = require('archiver')

const packname = './package'

const options = {
  host: 'localhost',
  port: 8081,
  path: '/?filename=package.zip',
  method: 'POST',
  headers: {
    'Content-Type': 'application/octet-stream',
  },
}

const req = http.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`)
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`)
})
req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`)
})

var archive = archiver('zip', {
  zlib: { level: 9 },
})

archive.directory(packname, false)

archive.finalize()

archive.pipe(req)

archive.on('end', () => {
  req.end()
})
