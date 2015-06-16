define(['knockout', 'ajax', 'config'], function(ko, Ajax, config) {
  'use strict';

  ko.bindingHandlers.factsheet = {
    init: function(el, valueAccessor) {
    },

    update: function(el, valueAccessor) {
      var factsheet = valueAccessor();
      var loadingClass= "is-loading";
      var parent = el.parentNode;

      el.innerHTML = '';
      el.classList.add(loadingClass);

      if(!!factsheet) {
        // TODO: remove delay once on same domain
        setTimeout(function() {
          Ajax.request({
            method: 'GET',
            // XDomainRequest: true,
            url: config.siteUrl + '/components/factsheets/' + factsheet + '.html',
            onSuccess: function(data) {
              el.innerHTML = data.responseText;

              // Show items with the magic class
              var showables = parent.querySelectorAll(".factsheet-hidden");
              for (var i = 0; i < showables.length; i++) {
                showables[i].setAttribute("data-state", "active");
              };

              el.classList.remove(loadingClass);
            }
          });
        }, 4000);
      }
    }
  };
});

