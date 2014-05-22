/*global dump, Raphael, wwp:true, $ */

wwp = {};

(function(){
  'use strict';
  var paper;

  wwp.initializeDrawingArea = function(drawingAreaElement, width, height){
    var prevX = null;
    var prevY = null;
    var isDragging = false;
    var jqArea = $(drawingAreaElement);
    var divPageX = jqArea.offset().left;
    var divPageY = jqArea.offset().top;

    paper = new Raphael(drawingAreaElement, width, height);

    var drawingArea = $(drawingAreaElement);
    drawingArea.click(function(event) {
      var topLeft = drawingArea.offset();
      var topBorder = parseInt(drawingArea.css('border-top-width'),10);
      var leftBorder = parseInt(drawingArea.css('border-left-width'),10);

      wwp.drawLine(0, 0, event.pageX-topLeft.left, event.pageY-topLeft.top);
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