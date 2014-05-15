
"use strict";

var server = require('./server.js');
var http = require('http');

// exports.test_serverRespondsToGetRequests = function(test){
//   server.start();

//   http.get('http://localhost:8080', function(response){
//     response.on('data', function(){});
//     test.done();
//   });  
// };

exports.test_serverReturnesHelloWorld = function(test){
  server.start(8080);

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
      server.stop(function(){
        test.done();
      });
    });
    
  });
};

exports.test_serverServesAFile = function(test){
  // TODO
  test.done();
};

exports.text_serverRquiresPortNumber = function(test){
  test.throws(function(){
    server.start();
  });
  test.done();
};

exports.text_serverRunsCallbackWhenStopCompletes = function(test){
  server.start(8080);
  server.stop(function(){
    test.done();
  });
};


exports.test_stopCalledWhenServerIsntRunning = function(test){
  test.throws(function(){
    server.stop();
  });
  test.done();
};
