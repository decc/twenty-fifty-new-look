define(['knockout', 'scroller'], function(ko, Scroller) {
  'use strict';

  ko.bindingHandlers.scrolls = {
    init: function(el, valueAccessor) {
      var scroller = new Scroller(el, { nav: true, next: true });
      scroller._activateCurrent();

      var activeClass = 'is-active';

      // todo: this should not be coupled to scroll binding
      scroller.on('activatesection', function() {
        var logo = document.getElementById('fixed-logo');
        var slideId = this.currentSectionId;

        if(slideId === 0) {
          logo.classList.add(activeClass);
        } else {
          logo.classList.remove(activeClass);
        }
      });

      ko.utils.domNodeDisposal.addDisposeCallback(el, function() {
        scroller.destroy();
      });
    }
  };
});

