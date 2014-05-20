
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

  exports.test_isOnWeb = function(test){
    httpGet('http://wiiwikipaint.herokuapp.com/', function(response, receivedData){

      var foundHomePage = receivedData.indexOf('wiiwikipaint home page') !== -1;
      test.ok(foundHomePage, 'Home page should have contained wiiwikipaint marker');
      test.done();
    });
  };

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

