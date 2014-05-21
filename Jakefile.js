(function() {
  /*global desc, task, jake, fail, complete, path*/
  "use strict";

  var path = require('path');
  var lint = require('./build/lint/lint_runner.js');
  var runner = require('karma').runner;
  var reporter = require('nodeunit').reporters['default'];

  var REQUIRED_BROWSERS = [
    "IE 8.0.0 (Windows 7)",
    "IE 8.0.0 (Windows Vista)",
    "Firefox 27.0.0 (Mac OS X 10.9)",
    "Chrome 34.0.1847 (Mac OS X 10.9.2)",
    "Safari 7.0.3 (Mac OS X 10.9.2)",
    "Mobile Safari 7.0.0 (iOS 7.0.3)"  // iOS
  ];

  desc('Build and test');
  task('default', ['lint', 'test'], function(){
    console.log('\n\nOK!');
  });

  // Linting
  desc('Lint everything');
  task('lint', ['lintNode', 'lintClient']);

  desc('lint node');
  task('lintNode', [], function() {
    var passed = lint.validateFileList(nodeFiles(), nodeLintOptions(), {});
    if(!passed) fail('Node lint failed');
  });

  desc('lint client');
  task('lintClient', [], function() {
    var passed = lint.validateFileList(clientFiles(), browserLintOptions(), {});
    if(!passed) fail('Client lint failed');
  });

  // Testing
  desc('Test everything');
  task('test', ['testNode', 'testClient']);

  desc('Test node code');
  task('testNode', [], function(){
    reporter.run(nodeTestFiles(), null, function(failures){
      if(failures){
        fail('testServer failed');
      }else{
        complete();
      }
    });
  }, {async: true});

  desc('Test client code');
  task('testClient', [], function(){
    var stdout = new CapturedStdout();
    var config = {
      configFile: path.resolve('build/karma.conf.js')
    };

    runner.run(config, function(exitCode){
      if(exitCode) fail('testClient failed');
     
      var browserMissing = checkRequiredBrowsers(REQUIRED_BROWSERS, stdout);
      if (browserMissing) fail('Did not test all the required browsers');
      if (stdout.capturedOutput.indexOf("TOTAL: 0 SUCCESS") !== -1) fail("No tests were run!");
      
      complete();
    });
  }, {async: true});


  desc('integrate');
  task('integrate', ['default'], function(){
    console.log('1. Make sure git status is clean');
    console.log('2. Build on the integration box');
    console.log(' a. Walk over to integration box');
    console.log(' b. git pull');
    console.log(' c. jake');
    console.log(' d. if jake fails, stop! Try again');
    console.log('3. git checkout integration');
    console.log('4. git merge master --no-ff --log');
    console.log('5. git checkout master');
  });

  desc('deploy to Heroku');
  task('deploy', ['default'], function(){
    console.log('1. Make sure git status is clean');
    console.log('2. git push heroku master');
    console.log('3. jake release test');
  });

  function checkRequiredBrowsers(requiredBrowsers, stdout) {
    var browserMissing = false;
    requiredBrowsers.forEach(function(browser) {
      browserMissing = lookForBrowser(browser, stdout.capturedOutput) || browserMissing;
    });
    return browserMissing;
  }

  function lookForBrowser(browser, output) {
    var missing = output.indexOf(browser + ": Executed") === -1;
    if (missing) console.log(browser + " was not tested!");
    return missing;
  }

  function CapturedStdout() {
    var self = this;
    self.oldStdout = process.stdout.write;
    self.capturedOutput = "";

    process.stdout.write = function(data) {
      self.capturedOutput += data;
      self.oldStdout.apply(this, arguments);
    };
  }

  function nodeFiles(){
    var files = new jake.FileList();

    files.include('*.js');
    files.include('src/server/**/*.js');
    files.include('src/_smoke_test.js');

    return files.toArray();
  }

  function nodeTestFiles(){
    var files = new jake.FileList();

    files.include('src/server/**/_*_test.js');
    files.include('src/_*_test.js');

    return files.toArray();
  }

  function clientFiles(){
    var files = new jake.FileList();
    files.include('src/client/**/*.js');

    return files.toArray();
  }

  function nodeLintOptions(){
    var options = globalLintOptions();
    options.node = true;
    return options;
  }

  function browserLintOptions(){
    var options = globalLintOptions();
    options.browser = true;
    return options;
  }

  function globalLintOptions(){
    var options = {
      bitwise: true,
      curly: false,
      eqeqeq: true,
      forin: true,
      immed: true,
      latedef: true,
      newcap: true,
      noarg: true,
      noempty: true,
      nonew: true,
      regexp: true,
      undef: true,
      strict: true,
      trailing: true,
      browser: true
    };

    return options;
  }
}());
