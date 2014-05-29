/*global dump, Raphael, wwp:true, $, Event */

wwp = {};

(function(){
  'use strict';

  var paper = null;
  var start = null;

  wwp.initializeDrawingArea = function(drawingAreaElement, width, height){
    if(paper !== null) throw new Error('Client js is not re-entrant');
    
    paper = new Raphael(drawingAreaElement, width, height);
    handleDragEvents(drawingAreaElement);
    return paper;
  };

  wwp.drawingAreaRemovedFromDOM = function(drawingArea){
    paper = null;
  };

  function startDrag(drawingArea, pageX, pageY){
    var offset = relativeOffset(drawingArea, pageX, pageY);
    start = offset;
  }

  function endDrag(){
    start = null;
  }

  function handleDragEvents(drawingAreaElement){
    var drawingArea = $(drawingAreaElement);

    drawingArea.on('selectstart', function(event){
      event.preventDefault();
    });

    drawingArea.mousedown(function(event){
      event.preventDefault();
      startDrag(drawingArea, event.pageX, event.pageY);
    });

    drawingArea.mousemove(function(event) {
      if(start === null) return;

      var end = relativeOffset(drawingArea, event.pageX, event.pageY);
      drawLine(start.x, start.y, end.x, end.y);
      start = end;
    });

    drawingArea.mouseup(function(event){
      endDrag();
    });

    drawingArea.mouseleave(function(event){
      endDrag();
    }); 

    drawingArea.on('touchstart', function(event){
      event.preventDefault();

      var originalEvent = event.originalEvent;

      if(originalEvent.touches && originalEvent.touches.length !== 1){
        endDrag();
        return;
      }

      // Do not draw if click event was outside drawing area
      var offset = relativeOffset(drawingArea, originalEvent.pageX, originalEvent.pageY);
      start = offset;
    });

    drawingArea.on('touchmove', function(event) {
      if(start === null) return;

      var originalEvent = event.originalEvent;
      var end = relativeOffset(drawingArea, originalEvent.pageX, originalEvent.pageY);
      drawLine(start.x, start.y, end.x, end.y);
      start = end;
    });

    drawingArea.on('touchcancel', function(event){
      endDrag();
    });

    drawingArea.on('touchend', function(event){
      endDrag();
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