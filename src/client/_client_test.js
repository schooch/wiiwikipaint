/*global desc, task, jake, fail, complete, chai, expect, describe, it, dump, wwp, Raphael, $ */

(function(){
  "use strict";

  var width = 400;
  var height = 200;
  var paperId = 'wwp-drawing-area';
  var drawingAreaDiv = '<div id="' +paperId+ '" style="border: solid 1px red;"></div>';
  var type;

  describe('Drawing area', function(){
    it('should be initialized in pre-defined div', function(){
      // Create div
      var div = $(drawingAreaDiv);
      $(document.body).append(div);

      // Verify initalized correctly
      wwp.initializeDrawingArea(div[0]);

      var tagName = $(div).children()[0].tagName.toLowerCase();

      // verify initialized corretly
      if(Raphael.svg){
        // Browser support svg
        expect(tagName).to.equal('svg');
      }else if(Raphael.vml){
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
      var paper = wwp.initializeDrawingArea(div[0], width, height);
      expect(paper.width).to.equal(width);
      expect(paper.height).to.equal(height);
    });

    it('should draw a line', function(){
      var div = $(drawingAreaDiv);
      $(document.body).append(div);

      var paper = wwp.initializeDrawingArea(div[0]);
      var startX = 20;
      var startY = 30;
      var finishX = 30;
      var finishY = 300;
      var elements = 0;

      wwp.drawLine(startX,startY,finishX,finishY);

      paper.forEach(function(element){
        var type = Raphael.type.toLowerCase();
        var actualPath = element.attr().path;
        var expectedPath = 'M'+startX+','+startY+'L'+finishX+','+finishY;

        if(Raphael.svg){
          // Browser support svg
          expect($.trim(actualPath)).to.equal(expectedPath);
        }else if(Raphael.vml){
          // Browser doesn't support svg (<=IE8)
          expect(actualPath).to.equal(expectedPath);
        }else{
          throw new Error('Browser does not return expected path string');
        }
      });
    });
  });
}());
