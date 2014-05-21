/*global dump, Raphael, wwp:true */

wwp = {};

(function(){
  'use strict';
  var paper;

  wwp.inializeDrawingArea = function(drawingAreaElement, width, height){
      paper = new Raphael(drawingAreaElement, width, height);
      return paper;
  };
    
}());