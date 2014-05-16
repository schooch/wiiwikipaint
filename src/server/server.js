
(function(){
  "use strict";

  var http = require('http');
  var fs = require('fs');
  var server;

  exports.start = function(homePage, errorPage, portNumber, callback){
    if(!portNumber){throw new Error(['No port number defined']);}
    if(!errorPage){throw new Error(['No 404 page defined']);}

    server = http.createServer();

    server.on('request', function(request, response){
      if(request.url === '/' || request.url === '/index.html'){
        response.statusCode = 200;
        serverFile(response, homePage);
      }else{
        response.statusCode = 404;
        serverFile(response, errorPage);
      }
    });

    server.listen(portNumber);

    callback();
  };

  function serverFile(response, file){
    fs.readFile(file, function(err, data){
      if (err) throw err;
      response.end(data);
    });
  }

  exports.stop = function(callback){
    server.close(callback);
  };
}());
