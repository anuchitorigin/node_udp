import dgram from 'node:dgram';

const server = dgram.createSocket('udp4');

// const dgram = require('node:dgram');
// const server = dgram.createSocket('udp4');

server.on('error', (err) => {
  const now = new Date();
  console.error(`[${now.toLocaleString()}] server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  const now = new Date();
  console.log(`[${now.toLocaleString()}] server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
});

server.on('listening', () => {
  const now = new Date();
  const address = server.address();
  console.log(`[${now.toLocaleString()}] server listening ${address.address}:${address.port}`);
});

server.bind(55062);
// Prints: server listening 0.0.0.0:55062