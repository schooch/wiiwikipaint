/*global jQuery, desc, task, jake, fail, complete, chai, expect, beforeEach, afterEach, describe, it, dump, wwp, Raphael, $, Touch, TouchList */

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
      wwp.drawingAreaRemovedFromDOM();
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
      event('mouse', 'mousemove', x, y);
      event('mouse', 'mousemove', x2, y2);

      expect(lineSegments()).to.eql([]);
    });

    it('draws a line in response to mouse drag', function(){
      event('mouse', 'mousedown', x, y);
      event('mouse', 'mousemove', x2, y2);

      expect(lineSegments()).to.eql([ [x, y, x2, y2] ]);
    });

    it('draws multiple line segments in response to clicks', function(){
      event('mouse', 'mousedown', x, y);
      event('mouse', 'mousemove', x2, y2);
      event('mouse', 'mousemove', x3, y3);

      expect(lineSegments()).to.eql([ [x, y, x2, y2], [x2, y2, x3, y3] ]);
    });

    it('does not draw a line when mouse is not moved', function(){
      event('mouse', 'mousedown', x, y);
      event('mouse', 'mouseup', x, y);

      expect(lineSegments()).to.eql([ ]);
    });

    it('stops drawing when mouse leaves drawing area', function(){
      event('mouse', 'mousedown', x, y);
      event('mouse', 'mouseleave', outsideX, outsideY);
      event('mouse', 'mousemove', x2, x2);

      expect(lineSegments()).to.eql([ ]);
    });

    it('does not start drawing if drag is started outside drawing area', function(){
      // Top
      event('mouse', 'mousedown', 200, -1, $(document));
      event('mouse', 'mousemove', x, y);
      // Right
      event('mouse', 'mousedown', 401, 200, $(document));
      event('mouse', 'mousemove', x, y);
      // Bottom
      event('mouse', 'mousedown', 200, 401, $(document));
      event('mouse', 'mousemove', x, y);
      // Left
      event('mouse', 'mousedown', -1, 200, $(document));
      event('mouse', 'mousemove', x, y);

      expect(lineSegments()).to.eql([ ]);
    });

    it('does not allow elements (like text) to be selected when dragging outside drawing area', function(){
      drawingArea.mousedown(function(event){
        expect(event.isDefaultPrevented()).to.be(true);
      });
      event('mouse', 'mousedown',x, y);
    });

    it('does not allow text to be selected outside drawing area -- Including ie8', function(){
      drawingArea.on('selectstart', function(event){
        expect(event.isDefaultPrevented()).to.be(true);
      });
      event('mouse', 'selectstart',x, y);
    });

    // Skip browser test if browser doesn't support it
    if(browserSupportsTouchEvents()){
      describe('touch events', function(){
        it('draws lines in responds to touch events', function(){
          event('touch', 'touchstart', x, y);
          event('touch', 'touchmove', x2, y2);
          event('touch', 'touchend', x, y);

          expect(lineSegments()).to.eql([ [x, y, x2, y2] ]);
        });

        it('stops drawing lines when touch is cancelled', function(){
          event('touch', 'touchstart', x, y);
          event('touch', 'touchmove', x2, y2);
          event('touch', 'touchcancel', x, y);

          expect(lineSegments()).to.eql([ [x, y, x2, y2] ]);
        });

        it('does not scroll the window when user is drawing with finger', function(){
          drawingArea.on('touchstart', function(event){
            expect(event.isDefaultPrevented()).to.be(true);
          });
          event('touch', 'touchstart', x, y);
          event('touch', 'touchmove', x2, y2);
          event('touch', 'touchend', x, y);
        });

        it('stops drawing with multiple touches', function(){
          event('touch', 'touchstart', x, y);
          event('touch', 'touchmove', x2, y2);
          event('touch', 'touchmultiple', x, y, false, x2, y2);
          event('touch', 'multipletouchmove', x2, y2, false, x, y);
          event('touch', 'touchend');

          expect(lineSegments()).to.eql([ [x, y, x2, y2] ]);
        });
      });
    }

    function relativeOffset(relativeX, relativeY){
      var topLeftOfDrawingArea = drawingArea.offset();
      return {
        x : relativeX + topLeftOfDrawingArea.left,
        y : relativeY + topLeftOfDrawingArea.top
      };
    }

    function event(mode, type, position1X, position1Y, optionalElement, position2X, position2Y){
      var jqElement = optionalElement || drawingArea;
      var touchList = false;

      var page = relativeOffset(position1X, position1Y);
      var eventData = new jQuery.Event(type);

      // Touch screen
      if(mode === 'touch'){
        // Multiple touches
        if(position2X){
          var page2 = relativeOffset(position2X, position2Y);
          var touchB = createTouch(jqElement, page2);
          var touchA = createTouch(jqElement, page);

          touchList = new TouchList(touchA, touchB);
        }

        var touchEvent = document.createEvent('TouchEvent');
        touchEvent.initTouchEvent(
          type, 
          true, 
          true,
          window,
          null,
          0, 0,
          page.x, page.y,
          false, false, false, false,
          touchList, touchList, touchList
        );

        eventData.type = type;
        eventData.originalEvent = touchEvent;
      }

      eventData.pageX = page.x;
      eventData.pageY = page.y;

      jqElement.trigger(eventData);
    }

    function createTouch(jqElement, pageOffset){
      var target = jqElement;
      var identifier = 0;
      var pageX = pageOffset.x;
      var pageY = pageOffset.y;
      var screenX = 0;
      var screenY = 0;

      var touch = new Touch(undefined, target, identifier, pageX, pageY, screenX, screenY);
      return touch;
    }

    function browserSupportsTouchEvents(){
      return (typeof Touch !== 'undefined') && ('ontouchstart' in window);
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
