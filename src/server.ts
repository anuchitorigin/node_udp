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

// const loop = () => {
//   const now = new Date();
//   console.log(`[${now.toLocaleString()}] client is running...`);
//   // creating a client socket
//   var client = dgram.createSocket('udp4');

//   //buffer msg
//   // var data = Buffer.from('SI\r\n');
//   const data = 'SI\r\n';

//   //sending msg
//   client.send([data], 55061, '192.168.1.250', function(error) {
//     if(error){
//       client.close();
//     }else{
//       console.log('Data sent !!!');
//     }
//   });
//   setTimeout(loop, 5000);
// }

// loop();

