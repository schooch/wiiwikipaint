
"use strict";

var http = require('http');
var server;

exports.start = function(portNumber){
  if(!portNumber){throw new Error(['No port number defined']);}

  server = http.createServer();

  server.on('request', function(request, response){
    response.end('Hello World');
  });

  server.listen(portNumber);
};

exports.stop = function(callback){
  server.close(callback);
};