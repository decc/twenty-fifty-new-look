(function(document) {
  'use strict';

  // fix scrolling in ios safari
  var scrollableDivs = document.querySelectorAll('.js-scrollable');

  // document.addEventListener('touchmove', function(e) {
  //   e.preventDefault();
  // }, false);

  document.body.addEventListener('touchmove', function(e) {
    var targetScrollable = false;

    for (var i = 0; i < scrollableDivs.length; i++) {
      if (!scrollableDivs[i].contains(e.target)) {

        e.preventDefault();
      };
    };
   }, false);
})(document);

