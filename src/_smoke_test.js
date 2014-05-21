
// Launch server same way it happens in production

// Confirm we have something


(function(){
  "use strict";
  // Helper functions

  var jake = require('jake');
  var child_process = require('child_process');
  var http = require('http');
  var fs = require('fs');
  var child;
  var PORT = 9876;

  exports.setUp = function(done){
    runServer(done);
  };

  exports.tearDown = function(done){
    child.on('exit', function(code, signal){
      done();
    });
    child.kill();
  };

  exports.test_canGetHomePage = function(test){
    httpGet('http://localhost:5000', function(response, receivedData){
      var foundHomePage = receivedData.indexOf('wiiwikipaint home page') !== 1;
      test.ok(foundHomePage, 'Home page should have contained wiiwikipaint marker');
      test.done();
    });
  };

  exports.test_canGet404Page = function(test){
     httpGet('http://localhost:5000/nonexistantpage', function(response, receivedData){
      var foundHomePage = receivedData.indexOf('wiiwikipaint 404 page') !== 1;
      test.ok(foundHomePage, 'Home page should contain 404 marker');
      test.done();
    });
  };

  function runServer(callback){
    var commandLine = parseProcfile();

    child = child_process.spawn(commandLine.command, commandLine.options);
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function(chunk){
      if(chunk.trim() === 'Server started') callback();
    });
  }

  function parseProcfile(){
    var procfile = require('procfile');
    var file = fs.readFileSync('Procfile', 'utf8');
    var parsed = procfile.parse(file).web;

    parsed.options = parsed.options.map(function(element){
      if (element === '$PORT') return '5000';
      else return element;
    });

    return parsed;
  }

  function httpGet(url, callback){
    var request = http.get(url);
    request.on('response', function(response){
      var receivedData = '';
      response.setEncoding('utf8');

      response.on('data', function(chunk){
        receivedData += chunk;
      });

      response.on('end', function(){
          callback(response, receivedData);
      });
    });
  }


}());

