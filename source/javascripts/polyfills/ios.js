(function(document) {
  'use strict';

  // fix scrolling in ios safari
  document.body.addEventListener('touchmove', function(e) {
    var scrollableDivs = document.querySelectorAll('.js-scrollable');
    var canScroll = false;

    for (var i = 0; i < scrollableDivs.length; i++) {
      if(scrollableDivs[i].contains(e.target)) {
        canScroll = true;
      }
    };

    if (!canScroll) {
      e.preventDefault();
    }
   }, false);
})(document);

