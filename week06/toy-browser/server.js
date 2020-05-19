const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(
`<html maaa=a >
<head>
  <style>
    body div #myid.img.icon {
      width:100px;
      background-color: #ff5000;
    }
    body div img {
      width:30px;
      background-color: #ff1111;
    }
  </style>
</head>
<body>
  <div>
    <img id="myid" class="img icon"/>
    <img />
  </div>
</body>
</html>`);
});

server.listen(8088);
