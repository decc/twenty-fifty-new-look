define(['knockout', 'selects'], function(ko, Selects) {
  'use strict';

  ko.bindingHandlers.select = {
    init: function(el, valueAccessor) {
      // value accessor is callback function. called on tab change
      new Tabber(el, valueAccessor());
    }
  };
});

