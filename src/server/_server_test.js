
"use strict";

var server = require('./server.js');
var asset = require('assert');

exports.testNothing = function(test){
  test.equal(server.number(), 3, "number");
  test.done();
};