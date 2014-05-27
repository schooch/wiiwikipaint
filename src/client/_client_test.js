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
  var outsideX = 800;
  var outsideY = 800;
  var paperId = 'wwp-drawing-area';
  var drawingAreaDiv = '<div id="' +paperId+ '" style="border: solid 1px red;"></div>';
  var type;

  describe('Drawing area: ', function(){
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
      $(document).unbind();
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

    it('does not draw segments when mouse is not down', function(){
      mouseEvent('mousemove', x, y);
      mouseEvent('mousemove', x2, y2);

      expect(lineSegments()).to.eql([]);
    });

    it('draws a line in response to mouse drag', function(){
      mouseEvent('mousedown', x, y);
      mouseEvent('mousemove', x2, y2);

      expect(lineSegments()).to.eql([ [x, y, x2, y2] ]);
    });

    it('draws multiple line segments in response to clicks', function(){
      mouseEvent('mousedown', x, y);
      mouseEvent('mousemove', x2, y2);
      mouseEvent('mousemove', x3, y3);

      expect(lineSegments()).to.eql([ [x, y, x2, y2], [x2, y2, x3, y3] ]);
    });

    it('does not draw a line when mouse is not moved', function(){
      mouseEvent('mousedown', x, y);
      mouseEvent('mouseup', x, y);

      expect(lineSegments()).to.eql([ ]);
    });

    it('stops drawing when mouse leaves drawing area', function(){
      mouseEvent('mousedown', x, y);
      mouseEvent('mouseleave', outsideX, outsideY);
      mouseEvent('mousemove', x2, x2);

      expect(lineSegments()).to.eql([ ]);
    });

    it('does not start drawing if drag is started outside drawing area', function(){
      // Top
      mouseEvent('mousedown', 200, -1, $(document));
      mouseEvent('mousemove', x, y);
      // Right
      mouseEvent('mousedown', 401, 200, $(document));
      mouseEvent('mousemove', x, y);
      // Bottom
      mouseEvent('mousedown', 200, 401, $(document));
      mouseEvent('mousemove', x, y);
      // Left
      mouseEvent('mousedown', -1, 200, $(document));
      mouseEvent('mousemove', x, y);

      expect(lineSegments()).to.eql([ ]);
    });

    it('does not allow elements (like text) to be selected when dragging outside drawing area', function(){
      drawingArea.mousedown(function(event){
        expect(event.isDefaultPrevented()).to.be(true);
      });
      mouseEvent('mousedown',x, y);
    });

    it('does not allow text to be selected outside drawing area -- Including ie8', function(){
      drawingArea.on('selectstart', function(event){
        expect(event.isDefaultPrevented()).to.be(true);
      });
      mouseEvent('selectstart',x, y);
    });

    function relativeOffset(relativeX, relativeY){
      var topLeftOfDrawingArea = drawingArea.offset();
      return {
        x : relativeX + topLeftOfDrawingArea.left,
        y : relativeY + topLeftOfDrawingArea.top
      };
    }

    function mouseEvent(event, clickX, clickY, optionalElement){
      var jqElement = optionalElement || drawingArea;

      var relativePosition = relativeOffset(clickX, clickY);

      var eventData = new jQuery.Event(event);
      eventData.pageX = relativePosition.x;
      eventData.pageY = relativePosition.y;

      jqElement.trigger(eventData);
    }

    function lineSegments(){
      var result = [];

      paper.forEach(function(element){
        var path = pathFor(element);
        result.push([ path.x, path.y, path.x2, path.y2 ]);
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
