/*global jQuery, desc, task, jake, fail, complete, chai, expect, beforeEach, afterEach, describe, it, dump, wwp, Raphael, $ */

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
      paper = wwp.initializeDrawingArea(drawingArea[0], width, height);
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
      expect(paper.width).to.equal(width);
      expect(paper.height).to.equal(height);
    });

    it('should draw a line', function(){
      var x = 20;
      var y = 30;
      var x2 = 30;
      var y2 = 300;

      wwp.drawLine(x,y,x2,y2);

      paper.forEach(function(element){
        var expectedPath = 'M'+x+','+y+'L'+x2+','+y2;
        expect(checkPath(element)).to.equal(expectedPath);
      });
    });

    it('draws line segments in response to clicks', function(){
      var x = 0;
      var y = 0;
      var x2 = 30;
      var y2 = 300;

      clickMouse(x, y);
      clickMouse(x2, y2);

      var position = relativePosition(x2, y2);
      
      paper.forEach(function(element){
        var expectedPath = 'M'+x+','+y+'L'+position.x+','+position.y;
        expect(checkPath(element)).to.equal(expectedPath);
      });
    });

    function clickMouse(x2, y2){
      var eventData = new jQuery.Event('click');
      eventData.pageX = x2;
      eventData.pageY = y2;

      drawingArea.trigger(eventData);
    }

    function relativePosition(x2, y2){
      // click inside drawing area
      var topLeftOfDrawingArea = drawingArea.offset();
      var expectedX = x2 - topLeftOfDrawingArea.left;
      var expectedY = y2 - topLeftOfDrawingArea.top;

      return {x: expectedX, y:expectedY};
    }

    function checkPath(element){
      var box = element.getBBox();

      return 'M'+box.x+','+box.y+'L'+box.x2+','+box.y2;
    }

  });
}());
