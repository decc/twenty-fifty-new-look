define(['knockout', 'scroller'], function(ko, Scroller) {
  'use strict';

  ko.bindingHandlers.scrolls = {
    init: function(el, valueAccessor) {
      new Scroller(el, { nav: true, next: true })._activateCurrent();
    },

    update: function(el, valueAccessor) {
    }
  };
});

