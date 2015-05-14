define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.fixable = {
    init: function(el) {
      ko.bindingHandlers.fixable.check(el);
    },

    update: function(el) {
      ko.bindingHandlers.fixable.check(el);
    },

    check: function(el) {
      if(el.offsetHeight < el.parentNode.offsetHeight) {
        el.classList.add('is-fixed');
      }
    }
  }
});

