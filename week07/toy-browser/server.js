const http = require('http');

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end(
`<html>

<head>
  <style>
    .container {
      display: flex;
      width: 450px;
      flex-direction: row;
      flex-wrap: wrap;
      background-color: #eee;
    }

    .item {
      width: 100px;
      height: 100px;
    }

    .item-1 {
      background-color: #c23531;
    }

    .item-2 {
      height: 200px;
      background-color: #2f4554;
    }

    .item-3 {
      width: 250px;
      background-color: #61a0a8;
    }

    .item-4 {
      height: 300px;
      background-color: #d48265;
    }
  </style>
</head>

<body>
  <div class="container">
    <div class="item item-1"></div>
    <div class="item item-2"></div>
    <div class="item item-3"></div>
    <div class="item item-4"></div>
  </div>
</body>

</html>`);
});

server.listen(8088);
