
"use strict";

var server = require('./server.js');
var http = require('http');

exports.tearDown = function(done){
  server.stop(function(){
    done();
  });
};

exports.setUp = function(done){
  server.start(8080);
}

// exports.test_serverRespondsToGetRequests = function(test){
//   server.start();

//   http.get('http://localhost:8080', function(response){
//     response.on('data', function(){});
//     test.done();
//   });  
// };

exports.test_serverReturnesHelloWorld = function(test){
  var request = http.get('http://localhost:8080');
  request.on('response', function(response){
    var receivedData = false;
    response.setEncoding('utf8');

    test.equal(response.statusCode, 200, 'Status code 200');

    response.on('data', function(chunk){
      receivedData = true;
      test.equal('Hello World', chunk, 'Check response is "Hello World"');
    });
    response.on('end', function(){
      test.ok(receivedData, 'Should have received data');
      test.done();
    });
    
  });
};

export.text_serverRunsCallbackWhenStopCompletes = function(){
  server.stop();
};