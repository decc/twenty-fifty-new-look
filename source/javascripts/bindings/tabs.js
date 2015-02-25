define(['knockout', 'tabber'], function(ko, Tabber) {
  'use strict';

  ko.bindingHandlers.tabs = {
    init: function(el, valueAccessor) {
      // value accessor is callback function. called on tab change
      new Tabber(el, valueAccessor());
    }
  };
});

