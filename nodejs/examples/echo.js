/* echo server */

const WebSocketServer = require('./dist/uws').Server;
const wss = new WebSocketServer({ port: 3000 });

wss.on('connection', function connection(ws) {
  // console.log('Client IP: ' + ws._socket.remoteAddress);
  // console.log('Client Port: ' + ws._socket.remotePort);

  ws.on('message', function incoming(message) {
    ws.send(message, { binary: Buffer.isBuffer(message) });
  });
});

wss.on('error', function error(e) {
  console.log('Error: ' + e);
});
