/*global dump, Raphael, wwp:true, $ */

wwp = {};

(function(){
  'use strict';
  var paper;

  wwp.initializeDrawingArea = function(drawingAreaElement, width, height){
    var startX = null;
    var startY = null;
    var isDragging = false;
    var jqArea = $(drawingAreaElement);
    var divPageX = jqArea.offset().left;
    var divPageY = jqArea.offset().top;

    paper = new Raphael(drawingAreaElement, width, height);

    $(document).mousedown(function(event){
      isDragging = true;
    });

    $(document).mouseup(function(event){
      isDragging = false;
    });

    var drawingArea = $(drawingAreaElement);
    drawingArea.mousemove(function(event) {
      var pageOffset = drawingArea.offset();

      var endX = event.pageX - pageOffset.left;
      var endY = event.pageY - pageOffset.top;

      if (startX !== null && isDragging) wwp.drawLine(startX, startY, endX, endY);

      startX = endX;
      startY = endY;
    });

    // jqArea.mousedown(function(){
    //   isDragging = true;
    // });

    // jqArea.mouseup(function(){
    //   isDragging = false;
    // });

    // jqArea.mouseleave(function(){
    //   isDragging = false;
    // });

    // jqArea.mouseenter(function(e){
    //   if(e.which === 1){
    //     isDragging = true;
    //   }
    // });

    // jqArea.mousemove(function(){
    //   var relativeX = event.pageX - divPageX;
    //   var relativeY = event.pageY - divPageY;

    //   if(prevX !== null && isDragging) wwp.drawLine(prevX, prevY, relativeX, relativeY);

    //   prevX = relativeX;
    //   prevY = relativeY;
    // });
    
    return paper;
  };

  wwp.drawLine = function(startX, startY, finishX, finishY){
    paper.path('M'+startX+','+startY+'L'+finishX+','+finishY);
  };
    
}());