define(['knockout', 'range'], function(ko, Range) {
  'use strict';

  ko.bindingHandlers.range = {
    init: function(el) {
      el.rangeInstance = Range.create(el, { pointerWidth: 15 });
    },

    update: function(el) {
      el.rangeInstance.update();
    }
  };
});

