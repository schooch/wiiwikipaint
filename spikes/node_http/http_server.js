// This is a simple spike of node's HTTP protocol

"use strict";

var http = require('http');

var server = http.createServer();

server.on('request', function(request, response){
  console.log('recieved request');

  var body = "<html><head><title>Node Server</title></head><body><h1>This is node's HTTP server</h1></body></html>";

  response.end(body);
});

server.listen(8080);

console.log('Server started');

