(function() {
  /*global desc, task, jake, fail, complete, directory */
  "use strict";

  var mkdirp = require('mkdirp').mkdirp;

  var NODE_VERSION = 'v0.10.26\n';
  var GENERATED_DIR = 'generated';
  var TEMP_TESTFILE_DIR = GENERATED_DIR + '/test';

  // Create temporary dir
  mkdirp.sync(TEMP_TESTFILE_DIR, '0755', function (err) {
      if (err) console.error('There was a problem creating: ' + TEMP_TESTFILE_DIR + ' ' + err);
  });

  desc('Delete all generated files');
  task('clean', [], function(){
   jake.rmRf(GENERATED_DIR);
  });

  desc('Build and test');
  task('default', ['lint', 'test']);

  desc('lint everything');
  task('lint', [], function() {
    var lint = require('./build/lint/lint_runner.js');

    var files = new jake.FileList();
    files.include('**/*.js');
    files.exclude('node_modules');
    //files.exclude('spikes');

    var passed = lint.validateFileList(files.toArray(), nodeLintOptions(), {});
    if(!passed) fail('Lint failed');
  });

  desc('integrate');
  task('integrate', ['default'], function(){
    console.log('1. Make sure git status is clean');
    console.log('2. Build on the integration box');
    console.log(' a. Walk over to integration box');
    console.log(' b. git pull');
    console.log(' c. jake');
    console.log(' d. if jake fails, stop! Try again');
    console.log('3. git checkout integration');
    console.log('4. git merge --noff --log');
    console.log('5. git checkout master');
  });

  desc('Test everything');
  task('test', [], function(){
    console.log('test everything');
    var reporter = require('nodeunit').reporters['default'];
    reporter.run(['src/server/_server_test.js'], null, function(failures){
      if(failures){
        fail('tests failed');
      }else{
        complete();
      }
    });
  }, {async: true});

  // desc('ensure correct version of node is present');
  task('node', [], function(){
    sh('node --version', function(stdout){
        if(stdout !== NODE_VERSION) fail('Incorrect node version. Expected: '+ NODE_VERSION);
        complete();
    });
  }, {async: true});

  function sh(command, callback){
    console.log('> ' + command);

    var stdout = '';
    var process = jake.createExec(command, {printStdout: true, printStderr: true});
    process.on('stdout', function(chunk){
      stdout += chunk;
    });
    process.on('cmdEnd', function(){
      callback(stdout);
    });
    
    process.run();

  }

  function nodeLintOptions(){
    return {
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
      node: true
    };
  }
}());
