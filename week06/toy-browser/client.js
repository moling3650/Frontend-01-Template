const net = require('net');
const { parseHTML } = require('./parser')

class Request {
  constructor (options) {
    this.method = options.method || 'GET';
    this.host = options.host;
    this.port = options.port || 80;
    this.path = options.path || '/';
    this.headers = options.headers || {};
    this.body = options.body || {};

    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }

    if (this.headers['Content-Type'] === 'application/json') {
      this.bodyText = JSON.stringify(this.body);
    } else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      this.bodyText = Object.entries(this.body)
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
    }
    this.headers['Content-Length'] = this.bodyText.length;
  }

  toString () {
    return [
      `${this.method} ${this.path} HTTP/1.1`,
      `${Object.entries(this.headers).map(([k, v]) => `${k}: ${v}`).join('\r\n')}`,
      '',
      `${this.bodyText}`
    ].join('\r\n');
  }

  send (connection) {
    return new Promise((resolve, reject) => {
      if (connection) {
        connection.write(this.toString());
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          connection.write(this.toString());
        })
        connection.on('data', (data) => {
          const parser = new ResponseParser();
          parser.receive(data.toString());
          if (parser.isFinished) {
            resolve(parser.response);
          }
          connection.end();
        });
        connection.on('error', (err) => {
          reject(err);
        });
        connection.on('end', () => {
          console.log('已从服务器断开');
        });
      }
    })
  }
}

class Response {

}

class ResponseParser {
  constructor () {
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_NAME_END = 3;
    this.WAITING_HEADER_SPACE = 4;
    this.WAITING_HEADER_VALUE = 5;
    this.WAITING_HEADER_LINE_END = 6;
    this.WAITING_HEADER_BLOCK_END = 7;
    this.WAITING_BODY = 8;

    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = '';
    this.headers = {};
    this.headerName = '';
    this.headerValue = '';

    this.bodyParser = null;
  }

  get isFinished () {
    return this.bodyParser && this.bodyParser.isFinished
  }

  get response () {
    this.statusLine.match(/^HTTP\/1\.1 ([1-5]\d{2}) (\w+)/);
    return {
      statusCode: RegExp.$1,
      statusTxet: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join('')
    }
  }

  receive (string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }

  receiveChar (char) {
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === '\r') {
        this.current = this.WAITING_STATUS_LINE_END;
      } else {
        this.statusLine += char;
      }
    } else if (this.current === this.WAITING_STATUS_LINE_END) {
      this.current = this.WAITING_HEADER_NAME;
    } else if (this.current === this.WAITING_HEADER_NAME) {
      if (char === '\r') {
        this.current = this.WAITING_HEADER_BLOCK_END
      } else if (char === ':') {
        this.current = this.WAITING_HEADER_SPACE;
      } else {
        this.headerName += char;
      }
    } else if (this.current === this.WAITING_HEADER_SPACE) {
      this.current = this.WAITING_HEADER_VALUE
    } else if (this.current === this.WAITING_HEADER_VALUE) {
      if (char === '\r') {
        this.current = this.WAITING_HEADER_LINE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = '';
        this.headerValue = '';
      } else {
        this.headerValue += char;
      }
    } else if (this.current === this.WAITING_HEADER_LINE_END) {
      this.current = this.WAITING_HEADER_NAME
    } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      this.current = this.WAITING_BODY
      if (this.headers['Transfer-Encoding'] === 'chunked') {
        this.bodyParser = new ChunkedBodyParser()
      }
    } else if (this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char)
    }
  }
}

class ChunkedBodyParser {
  constructor () {
    this.READING_LENGTH_FIRSR_CHAR = 0;
    this.READING_LENGTH = 1;
    this.READING_LENGTH_END = 2;
    this.READING_CHUNK = 3;
    this.READING_CHUNK_END = 4;
    this.BODY_BLOCK_END = 5;

    this.current = this.READING_LENGTH_FIRSR_CHAR;
    this.content = []
    this.chunkLength = 0
  }

  get isFinished () {
    return this.current === this.BODY_BLOCK_END
  }

  receiveChar (char) {
    if (this.current === this.READING_LENGTH_FIRSR_CHAR) { // Length的第一个字符是单独一个状态
      if (char === '0') { // Length的第一个字符是'0'的话就是终止块
        this.current = this.BODY_BLOCK_END;
      } else {
        this.chunkLength += Number(`0x${char}`); // chunk-length在包体是16进制
        this.current = this.READING_LENGTH;
      }
    } else if (this.current === this.READING_LENGTH) {
      if (char === '\r') {
        this.current = this.READING_LENGTH_END;
      } else {
        this.chunkLength = this.chunkLength * 16 + Number(`0x${char}`);
      }
    } else if (this.current === this.READING_LENGTH_END) {
      this.current = this.READING_CHUNK;
    } else if (this.current === this.READING_CHUNK) {
      if (char === '\r') {
        this.current = this.READING_CHUNK_END
        this.chunkLength = 0
      } else if (this.chunkLength > 0) {
        this.content.push(char);
        this.chunkLength -= 1;
      }
    } else if (this.current === this.READING_CHUNK_END) {
      this.current = this.READING_LENGTH_FIRSR_CHAR;
    }
  }
}

// 发送一个请求
void async function () {
  const request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: 8088,
    headers: {
      'X-Foo2': 'customed'
    },
    body: {
      name: 'moling3650'
    }
  });

  const response = await request.send()
  const dom = parseHTML(response.body);
  console.log(dom);

}();
