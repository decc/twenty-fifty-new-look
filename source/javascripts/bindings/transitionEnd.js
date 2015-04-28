define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.transitionEnd = {
    init: function(el, valueAccessor) {
      var value = valueAccessor();
      var transition = ko.bindingHandlers.transitionEnd.getTransitionProperty();

      if(transition) {
        el.addEventListener(transition, value);
      }
    },

    getTransitionProperty: function() {
      var transEndEventNames = {
        'WebkitTransition' : 'webkitTransitionEnd',// Saf 6, Android Browser
        'MozTransition'    : 'transitionend',      // only for FF < 15
        'transition'       : 'transitionend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
      };

      return transEndEventNames[ Modernizr.prefixed('transition') ];
    }
  };
});

