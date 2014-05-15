
"use strict";

var http = require('http');
var fs = require('fs');
var server;

exports.start = function(file, portNumber){
  if(!portNumber){throw new Error(['No port number defined']);}

  server = http.createServer();

  server.on('request', function(request, response){
    fs.readFile(file, function(err, data){
      if (err) throw err;
      response.end(data);
    });
  });

  server.listen(portNumber);
};

exports.stop = function(callback){
  server.close(callback);
};