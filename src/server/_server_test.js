
(function(){
  "use strict";

  var server = require('./server.js');
  var http = require('http');
  var fs = require('fs');
  var assert = require('assert');
  var PORT = 5020;
  var BASE_URL = 'http://localhost:' + PORT;
  var TEST_HOME_PAGE = 'generated/test/test_homepage.html';
  var TEST_404_PAGE = 'generated/test/404.html';
  var TEST_DATA_HOME = 'This is the homepage';
  var TEST_DATA_404 = 'There was an error';

  exports.tearDown = function(done){
    cleanUpFile(TEST_HOME_PAGE);
    cleanUpFile(TEST_404_PAGE);
    done();
  };

  exports.test_serverServesHomepage = function(test){
    fs.writeFileSync(TEST_HOME_PAGE, TEST_DATA_HOME);

    httpGet(BASE_URL, function(response, responseData){
      test.equal(response.statusCode, 200, '');
      test.equal(TEST_DATA_HOME, responseData, 'Check response is ' + TEST_DATA_HOME);
      test.done();
    });
  };

  exports.test_serverReturns404FromFileForEverythingExceptForHomePage = function(test){
    fs.writeFileSync(TEST_404_PAGE, TEST_DATA_404);

    httpGet(BASE_URL+'/thisPageDoesntExist', function(response, responseData){
      test.equal(response.statusCode, 404, '');
      test.done();
    });
  };

  exports.test_serverReturnsHomePageWhenAskedForIndex = function(test){
    fs.writeFileSync(TEST_HOME_PAGE, TEST_DATA_HOME);

    httpGet(BASE_URL+'/index.html', function(response, responseData){
      test.equal(response.statusCode, 200);
      test.done();
    });
  };

  exports.test_serverRequiresHomePageParameter = function(test){
    test.throws(function(){
      server.start();
    });
    test.done();
  };

  exports.test_serverRequires404PageParameter = function(test){
    test.throws(function(){
      server.start(TEST_HOME_PAGE);
    });
    test.done();
  };

  exports.text_serverRequiresPortNumber = function(test){
    test.throws(function(){
      server.start(TEST_HOME_PAGE, TEST_404_PAGE);
    });
    test.done();
  };

  exports.text_serverRunsCallbackWhenStopCompletes = function(test){
    server.start(TEST_HOME_PAGE, TEST_404_PAGE, PORT, function(){
      server.stop(function(){
        test.done();
      });
    });
  };


  exports.test_stopCalledWhenServerIsntRunning = function(test){
    test.throws(function(){
      server.stop();
    });
    test.done();
  };

  // Helper functions

  function httpGet(url, callback){
    server.start(TEST_HOME_PAGE, TEST_404_PAGE, PORT, function(){
      var request = http.get(url);

      request.on('response', function(response){
        var receivedData = '';
        response.setEncoding('utf8');

        response.on('data', function(chunk){
          receivedData += chunk;
        });

        response.on('end', function(){
          server.stop(function(){
            callback(response, receivedData);
          });
        });
      });
    });
  }

  function cleanUpFile(file){
    if(fs.existsSync(file)){
      fs.unlinkSync(file);
      assert.ok(!fs.existsSync(file), 'Could not delete file [' + file + ']');
    }
  }

}());

