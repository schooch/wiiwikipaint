/*global dump, Raphael, wwp:true */

wwp = {};

(function(){
  'use strict';
  var paper;

  wwp.inializeDrawingArea = function(drawingAreaElement, width, height){
      paper = new Raphael(drawingAreaElement, width, height);
      return paper;
  };

  wwp.drawLine = function(startX, startY, finishX, finishY){
    paper.path('M'+startX+','+startY+'L'+finishX+','+finishY);
  };
    
}());