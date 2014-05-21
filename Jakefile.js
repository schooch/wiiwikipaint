(function() {
  /*global desc, task, jake, fail, complete */
  "use strict";

  var lint = require('./build/lint/lint_runner.js');
  var reporter = require('nodeunit').reporters['default'];

  desc('Build and test');
  task('default', ['lint', 'test']);

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
    var config = {
      port:8080
    };
    require('karma/lib/runner').run(config, function(failures){
      if(failures){
        fail('testClient failed');
      }else{
        complete();
      }
    }, function(output){
      console.log('hello');
      console.log(output);
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

  function nodeFiles(){
    var files = new jake.FileList();

    files.include('**/*.js');
    files.exclude('node_modules');
    files.exclude('karma.conf.js');
    files.exclude('src/client/**');

    return files.toArray();
  }

  function nodeTestFiles(){
    var files = new jake.FileList();

    files.include('**/_*_test.js');
    files.exclude('node_modules');
    files.exclude('karma.conf.js');
    files.exclude('src/client/**');

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
