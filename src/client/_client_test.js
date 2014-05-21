/*global desc, task, jake, fail, complete, chai, expect, describe, it, dump, wwp, Raphael, $ */

(function(){
  "use strict";

  var width = 400;
  var height = 200;
  var paperId = 'wwp-drawing-area';
  var drawingAreaDiv = '<div id="' +paperId+ '"></div>';

  describe('Drawing area', function(){
    it('should be initialized in pre-defined div', function(){
      // Create div
      var div = $(drawingAreaDiv);
      $(document.body).append(div);

      // Verify initalized correctly
      wwp.inializeDrawingArea(div[0]);

      var tagName = $(div).children()[0].tagName.toLowerCase();
      var type = Raphael.type.toLowerCase();

      // verify initialized corretly
      if(type === 'svg'){
        // Browser support svg
        expect(tagName).to.equal('svg');
      }else if(type === 'vml'){
        // Browser doesn't support svg (<=IE8)
        expect(tagName).to.equal('div');
      }else{
        throw new Error('Browser does not support Raphael');
      }
      
    });

    it('should have the same dimensions as the enclosing div', function(){
      // Create div
      var div = $(drawingAreaDiv);
      $(document.body).append(div);

      // Initialize div

      // Verify initalized correctly
      var paper = wwp.inializeDrawingArea(div[0], width, height);
      expect(paper.width).to.equal(width);
      expect(paper.height).to.equal(height);
    });

    it('should draw a line', function(){
      var div = $(drawingAreaDiv);
      $(document.body).append(div);

      wwp.drawLine(20,30,30,200);

      var totalElements = 0;
      paper.forEach(functino(element){
        totalElements++;
      });
      expect(totalElements = 1);

    });
  });
}());
