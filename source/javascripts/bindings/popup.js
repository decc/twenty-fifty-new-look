define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.popup = {
    init: function(el, valueAccessor) {
      var url = el.getAttribute('href');
      var name = el.innerHTML;

      el.addEventListener('click', function() {
        var newWindow = window.open(url, name, 'height=500, width=500');
        if(window.focus) { newWindow.focus; }
        return false;
      });
    }
  };
});

