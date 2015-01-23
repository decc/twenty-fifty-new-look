define(['knockout', 'scroller'], function(ko, Scroller) {
  'use strict';

  ko.bindingHandlers.scrolls = {
    init: function(el, valueAccessor) {
      new Scroller(el, { nav: true, next: true });
    },

    update: function(el, valueAccessor) {
      // hide / show next button
    }
  };
});

