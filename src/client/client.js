/*global dump */

(function(){
  'use strict';

  wwp.createElememt = functino(){
    var div = document.createElement('div');
    div.setAttribute('id', 'hello');
    div.setAttribute('class', 'bar');
    document.body.appendChild(div);

    dump('window loaded');
  }
    
}());