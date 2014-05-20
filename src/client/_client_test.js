/*global desc, task, jake, fail, complete, chai, describe, it */

(function(){
  "use strict";

  var assert = chai.assert;

  describe('Nothing', function(){
    it('should run', function(){
      assert.equal('foo', 'foo');
    });
  });
}());
