define(['knockout', 'scroller'], function(ko, Scroller) {
  'use strict';

  ko.bindingHandlers.scrolls = {
    init: function(el, valueAccessor) {
      var scroller = new Scroller(el, { nav: true, next: true });
      scroller._activateCurrent();

      ko.utils.domNodeDisposal.addDisposeCallback(el, function() {
        scroller.destroy();
      });
    }
  };
});

