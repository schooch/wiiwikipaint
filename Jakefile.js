task('default', ['lint']);

desc('lint everything');
task('lint', [], function(){
  var lint = require('./build/lint/lint_runner.js');
  lint.validateFile('jakeFile.js', {}, {});
});
