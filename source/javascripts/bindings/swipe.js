define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.swipe = {
    init: function(el, valueAccessor) {
      var callback = valueAccessor();

      var touchStartX = 0;

      el.addEventListener('touchstart', function(e){
        touchStartX = e.changedTouches[0].pageX;
      });

      el.addEventListener('touchend', function(e){
        var touchEndX = e.changedTouches[0].pageX,
            minSwipe = 100;

        if((touchStartX - touchEndX) >= minSwipe){
          callback('left');
        }else if((touchEndX - touchStartX) >= minSwipe){
          callback('right');
        }
      });

    }
  };
});

