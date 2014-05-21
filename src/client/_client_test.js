/*global desc, task, jake, fail, complete, chai, describe, it, dump */

(function(){
  "use strict";

  var assert = chai.assert;

  describe('Nothing', function(){
    it('should run', function(){
      var div = document.createElement('div');
      div.setAttribute('id', 'hello');
      div.setAttribute('class', 'bar');
      document.body.appendChild(div);
      //assert.equal('foo', 'foo');

      var extractedDiv = document.getElementById('hello');
      assert.equal(extractedDiv.getAttribute('class'), 'bar');
    });
  });
}());
