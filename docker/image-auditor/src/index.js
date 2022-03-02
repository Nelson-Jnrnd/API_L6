var udp = require('dgram');
const Auditor = require('./auditor.js');

let auditor = new Auditor('230.185.192.108', 2205, 5000);

process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    process.exit(0);
  });