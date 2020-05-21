const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(
`<html maaa=a >
<head>
  <style>
    body img+img {
      height: 200px;
      background-color: #ff1111;
    }
    body div.container > #myid.img.icon {
      width: 200px;
      background-color: #ff5000;
    }
    div > img {
      width: 100px;
      height: 100px;
    }
  </style>
</head>
<body>
  <div class="container">
    <img id="myid" class="img icon"/>
    <img />
  </div>
</body>
</html>`);
});

server.listen(8088);
