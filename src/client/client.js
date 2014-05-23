/*global dump, Raphael, wwp:true, $ */

wwp = {};

(function(){
  'use strict';
  var paper;

  wwp.initializeDrawingArea = function(drawingAreaElement, width, height){
    paper = new Raphael(drawingAreaElement, width, height);
    handleDragEvents(drawingAreaElement);
    return paper;
  };

  function handleDragEvents(drawingAreaElement){
    var start = null;
    var end = null;
    var isDragging = false;
    var jqArea = $(drawingAreaElement);
    var divPageX = jqArea.offset().left;
    var divPageY = jqArea.offset().top;
    var drawingArea = $(drawingAreaElement);
    var pageOffset = drawingArea.offset();

    $(document).mousedown(function(event){
      isDragging = true;
      start = relativeOffset(drawingArea, event.pageX, event.pageY);
    });

    $(document).mouseup(function(event){
      isDragging = false;
    });
    
    drawingArea.mousemove(function(event) {
      if (start === null) return;

      var end = relativeOffset(drawingArea, event.pageX, event.pageY);
      if (isDragging) wwp.drawLine(start.x, start.y, end.x, end.y);
      start = end;
    });
  }

  wwp.drawLine = function(startX, startY, finishX, finishY){
    paper.path('M'+startX+','+startY+'L'+finishX+','+finishY);
  };

  function relativeOffset(element, absoluteX, absoluteY){
    var pageOffset = element.offset();

    return{
      x: absoluteX - pageOffset.left,
      y: absoluteY - pageOffset.top
    };
  }
    
}());