/*global jQuery, desc, task, jake, fail, complete, chai, expect, beforeEach, afterEach, describe, it, dump, wwp, Raphael, $ */

(function(){
  "use strict";

  var width = 400;
  var height = 400;
  var x = 20;
  var y = 30;
  var x2 = 70;
  var y2 = 80;
  var x3 = 340;
  var y3 = 350;
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
      wwp.drawLine(x,y,x2,y2);
  
      expect(paperPath()).to.eql([[x,y,x2,y2]]);
    });

    it('does not draw segments when mouse is not down', function(){
      mouseMove(x, y);
      mouseMove(x2, y2);

      expect(paperPath()).to.eql([]);
    });

    it('draws a line in response to mouse drag', function(){
      mouseDown(x, y);
      mouseMove(x2, y2);

      expect(paperPath()).to.eql([ [x2, y2, x3, y3] ]);
    });

    it('draws line segments in response to clicks', function(){
      mouseDown(x, y);
      mouseMove(x2, y2);
      mouseMove(x3, y3);
      mouseUp(x,y);

      expect(paperPath()).to.eql([ [x2, y2, x3, y3] ]);
    });

    function mouseDown(clickX, clickY){
      var topLeftOfDrawingArea = drawingArea.offset();
      var x = clickX + topLeftOfDrawingArea.left;
      var y = clickY + topLeftOfDrawingArea.top;

      var eventData = new jQuery.Event('mousedown');
      eventData.pageX = x;
      eventData.pageY = y;

      drawingArea.trigger(eventData);
    }

    function mouseMove(clickX, clickY){
      var topLeftOfDrawingArea = drawingArea.offset();
      var x = clickX + topLeftOfDrawingArea.left;
      var y = clickY + topLeftOfDrawingArea.top;

      var eventData = new jQuery.Event('mousemove');
      eventData.pageX = x;
      eventData.pageY = y;

      drawingArea.trigger(eventData);
    }

    function mouseUp(clickX, clickY){
      var topLeftOfDrawingArea = drawingArea.offset();
      var x = clickX + topLeftOfDrawingArea.left;
      var y = clickY + topLeftOfDrawingArea.top;

      var eventData = new jQuery.Event('mouseup');
      eventData.pageX = x;
      eventData.pageY = y;

      drawingArea.trigger(eventData);
    }

    function paperPath(){
      var box;
      var result = [];

      for (var i = 0; i < drawingElements().length; i++) {
        box = pathFor(drawingElements()[i]);
        result.push([ box.x, box.y, box.x2, box.y2 ]);
      }

      return result;
    }

    function drawingElements() {
      var result = [];

      paper.forEach(function(element) {
        result.push(element);
      });
      return result;
    }

    function pathFor(element) {
      if (Raphael.vml) return vmlPathFor(element);
      if (Raphael.svg) return svgPathFor(element);
      else throw new Error("Unknown Raphael type");
    }

    function svgPathFor(element) {
      var pathRegex;

      var path = element.node.attributes.d.value;
      if (path.indexOf(",") !== -1)
        // We're in Firefox, Safari, Chrome, which uses format "M20,30L30,300"
        pathRegex = /M(\d+),(\d+)L(\d+),(\d+)/;
      else {
        // We're in IE9, which uses format "M 20 30 L 30 300"
        pathRegex = /M (\d+) (\d+) L (\d+) (\d+)/;
      }
      var pathComponents = path.match(pathRegex);
      return {
        x: pathComponents[1],
        y: pathComponents[2],
        x2: pathComponents[3],
        y2: pathComponents[4]
      };
    }

    function vmlPathFor(element) {
      // We're in IE 8, which uses format "m432000,648000 l648000,67456800 e"
      var VML_MAGIC_NUMBER = 21600;

      var path = element.node.path.value;

      var ie8PathRegex = /m(\d+),(\d+) l(\d+),(\d+) e/;
      var ie8 = path.match(ie8PathRegex);

      var startX = ie8[1] / VML_MAGIC_NUMBER;
      var startY = ie8[2] / VML_MAGIC_NUMBER;
      var endX = ie8[3] / VML_MAGIC_NUMBER;
      var endY = ie8[4] / VML_MAGIC_NUMBER;

      return {
        x: startX,
        y: startY,
        x2: endX,
        y2: endY
      };
    }


  });
}());
