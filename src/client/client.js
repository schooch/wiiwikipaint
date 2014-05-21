/*global dump, Raphael, wwp:true */

wwp = {};

(function(){
  'use strict';
  var paper;

  wwp.inializeDrawingArea = function(drawingAreaElement, width, height){
      paper = new Raphael(drawingAreaElement, width, height);

      paper.path('M20,30L200,300');

      return paper;
  };

  wwp.drawLine = function(startX, startY, finishX, finishY){
    
  };
    
}());