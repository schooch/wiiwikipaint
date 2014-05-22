/*global desc, task, jake, fail, complete, chai, expect, beforeEach, afterEach, describe, it, dump, wwp, Raphael, $ */

(function(){
  "use strict";

  var width = 400;
  var height = 400;
  var paperId = 'wwp-drawing-area';
  var drawingAreaDiv = '<div id="' +paperId+ '" style="border: solid 1px red;"></div>';
  var type;

  describe('Drawing area', function(){
    var drawingArea;
    var paper;

    beforeEach(function(){
      drawingArea = $(drawingAreaDiv);
      $(document.body).append(drawingArea);

      // Initialize drawing area
      paper = wwp.initializeDrawingArea(drawingArea[0]);
    });

    afterEach(function(){
      drawingArea.remove();
    });

    it('should be initialized in pre-defined div', function(){
      var tagName = $(drawingArea).children()[0].tagName.toLowerCase();

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
      // Verify initalized correctly
      paper = wwp.initializeDrawingArea(drawingArea[0], width, height);
      expect(paper.width).to.equal(width);
      expect(paper.height).to.equal(height);
    });

    it('should draw a line', function(){
      paper = wwp.initializeDrawingArea(drawingArea[0]);
      var startX = 20;
      var startY = 30;
      var finishX = 30;
      var finishY = 300;
      var elements = 0;

      wwp.drawLine(startX,startY,finishX,finishY);

      paper.forEach(function(element){

        dump(JSON.stringify(element.getBBox()));

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
