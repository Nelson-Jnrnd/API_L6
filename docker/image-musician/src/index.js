const Musician = require('./musician.js');

var args = process.argv.slice(2);

let musician = new Musician('230.185.192.108', 2205, 1000, args);

process.on('SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    process.exit(0);
  });