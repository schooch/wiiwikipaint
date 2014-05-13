
"use strict";

var server = require('./server.js');
var http = require('http');

exports.tearDown = function(done){
  server.stop(function(){
    done();
  });
};

exports.test_serverRespondsToGetRequests = function(test){
  server.start();

  http.get('http://localhost:8080', function(response){
    response.on('data', function(){});
    test.done();
  });  
};

exports.test_serverReturnesHelloWorld = function(test){
  server.start(); // TODO remove duplocation
  var request = http.get('http://localhost:8080');
  request.on('response', function(response){
    response.on('data', function(){});
    test.equal(response.statusCode, 200, 'Status code 200');
    test.done();
  });
};
