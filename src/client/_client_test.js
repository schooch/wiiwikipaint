/*global desc, task, jake, fail, complete, chai, describe, it, dump, wwp */

(function(){
  "use strict";

  var assert = chai.assert;

  describe('Nothing', function(){
    it('should run', function(){
      wwwp.createElement();


      assert.equal('foo', 'foo');

      // var extractedDiv = document.getElementById('hello');
      // assert.equal(extractedDiv.getAttribute('class'), 'bar');

      
    });
  });
}());
