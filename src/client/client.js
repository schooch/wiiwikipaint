/*global dump, Raphael, wwp:true, $, Event */

wwp = {};

(function(){
  'use strict';
  var paper;

  wwp.initializeDrawingArea = function(drawingAreaElement, width, height){
    paper = new Raphael(drawingAreaElement, width, height);
    handleDragEvents(drawingAreaElement);
    drawingAreaElement.onselectstart = function(event){
      return false;
    };
    return paper;
  };

  function handleDragEvents(drawingAreaElement){
    var start = null;
    var drawingArea = $(drawingAreaElement);

    drawingArea.mousedown(function(event){
      event.preventDefault();

      // Do not draw if click event was outside drawing area
      var offset = relativeOffset(drawingArea, event.pageX, event.pageY);
      start = offset;
    });

    drawingArea.on('selectstart', function(event){
      event.preventDefault();
    });

    drawingArea.mousemove(function(event) {
      if(start === null) return;

      var end = relativeOffset(drawingArea, event.pageX, event.pageY);
      drawLine(start.x, start.y, end.x, end.y);
      start = end;
    });

    drawingArea.mouseup(function(event){
      start = null;
    });

    drawingArea.mouseleave(function(event){
      start = null;
    }); 
  }

  function drawLine(startX, startY, finishX, finishY){
    paper.path('M'+startX+','+startY+'L'+finishX+','+finishY);
  }

  function relativeOffset(element, absoluteX, absoluteY){
    var pageOffset = element.offset();

    return{
      x: absoluteX - pageOffset.left,
      y: absoluteY - pageOffset.top
    };
  }
    
}());