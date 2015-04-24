define(['knockout', 'range'], function(ko, Range) {
  'use strict';

  ko.bindingHandlers.range = {
    init: function(el, valueAccessor) {

      ZeroClipboard.config( { swfPath: "/swf/ZeroClipboard.swf" } );

      var args = {};
      var pointerWidth;

      if(pointerWidth = parseInt(el.getAttribute('data-pointer-width'))) {
        args.pointerWidth = pointerWidth;
      }

      el.rangeInstance = Range.init(el, args, true);
    },

    update: function(el) {
      el.rangeInstance.update();
    }
  };
});

