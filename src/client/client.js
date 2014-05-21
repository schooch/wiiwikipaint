/*global dump */

(function(){
  'use strict';

  $(function(){
    var div = document.createElement('div');
    div.setAttribute('id', 'hello');
    div.setAttribute('class', 'bar');
    document.body.appendChild(div);

    dump('window loaded');
  });
    
}());