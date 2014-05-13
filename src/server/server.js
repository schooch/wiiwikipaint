
"use strict";

var http = require('http');

exports.start = function(){
  var server = http.createServer();

  server.on('request', function(request, response){
    console.log('recieved request');

    //var body = "<html><head><title>Node Server</title></head><body><h1>This is node's HTTP server</h1></body></html>";

    response.end('foo');
  });
  server.listen(8080);

  console.log('Started :)');
};