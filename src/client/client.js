/*global dump, Raphael, wwp:true, $ */

wwp = {};

(function(){
  'use strict';
  var paper;

  wwp.initializeDrawingArea = function(drawingAreaElement, width, height){
      paper = new Raphael(drawingAreaElement, width, height);

      $(drawingAreaElement).click(function(){
        var divPageX = $(drawingAreaElement).offset().left;
        var divPageY = $(drawingAreaElement).offset().top;

        var relativeX = event.pageX - divPageX;
        var relativeY = event.pageY - divPageY;

        wwp.drawLine(0, 0, relativeX, relativeY);
      });
      
      return paper;
  };

  wwp.drawLine = function(startX, startY, finishX, finishY){
    paper.path('M'+startX+','+startY+'L'+finishX+','+finishY);
  };
    
}());