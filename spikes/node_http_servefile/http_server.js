// This is a simple spike of how to serve a file

"use strict";

var http = require('http');

var server = http.createServer();
var fs = require('fs');

server.on('request', function(request, response){
  console.log('recieved request');

  fs.readFile('file.html', function(err, data){
    response.end(data);
  });
});

server.listen(8080);

console.log('Server started');

