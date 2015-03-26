define(['knockout', 'range'], function(ko, Range) {
  'use strict';

  ko.bindingHandlers.range = {
    init: function(el) {
      el.rangeInstance = Range.new(el);
    },

    update: function(el) {
      el.rangeInstance.update();
    }
  };
});

