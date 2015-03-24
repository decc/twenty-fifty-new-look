define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.afterRendered = {
    update: function(el, valueAccessor, allBindings) {
      var callback = valueAccessor();

      console.log('hi there')
      callback();
    }
  };
});

