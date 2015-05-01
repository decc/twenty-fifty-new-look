define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.swipe = {
    init: function(el, valueAccessor) {
      var callback = valueAccessor();

      var touchStartX = 0;
      var touchStartY = 0;

      el.addEventListener('touchstart', function(e){
        var changedTouch = e.changedTouches[0];

        touchStartX = changedTouch.pageX;
        touchStartY = changedTouch.pageY;
      });

      el.addEventListener('touchend', function(e){
        var changedTouch = e.changedTouches[0];

        var touchEndX = changedTouch.pageX;
        var touchEndY = changedTouch.pageY;
        var minSwipe = 100;
        var out = {};

        if((touchStartX - touchEndX) >= minSwipe){
          out.left = true;
        }else if((touchEndX - touchStartX) >= minSwipe){
          out.right = true;
        }

        if((touchStartY - touchEndY) >= minSwipe){
          out.up = true;
        }else if((touchEndY - touchStartY) >= minSwipe){
          out.down = true;
        }

        callback(out)
      });

    }
  };
});

