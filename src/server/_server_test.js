
"use strict";

var server = require('./server.js');
var asset = require('assert');

exports.testNothing = function(test){
  test.equals(3, server.number(), "number");
  test.done();
};