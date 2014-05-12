(function() {
  /*global desc, task, jake, fail, complete */
  "use strict";

  task('default', ['lint']);

  desc('lint everything');
  task('lint', [], function() {
    var lint = require('./build/lint/lint_runner.js');

    var files = new jake.FileList();
    files.include('**/*.js');
    files.exclude('node_modules');

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

  desc('Integrate');
  task('Integrate', ['default'], function(){
    console.log('1. Make sure git status is clean');
    console.log('2. Build on the integration box');
    console.log(' a. Walk over to integration box');
    console.log(' b. git pull');
    console.log(' c. jake');
    console.log('3. git checkout integration');
    console.log('4. git merge --noff --log');
    console.log('5. git checkout master');
  });

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
