define(['knockout', 'ajax', 'config'], function(ko, Ajax, config) {
  'use strict';

  ko.bindingHandlers.factsheet = {
    init: function(el, valueAccessor) {
    },

    update: function(el, valueAccessor) {
      var factsheet = valueAccessor();
      var loadingClass= "is-loading";

      el.innerHTML = '';
      el.classList.add(loadingClass);

      // TODO: remove delay once on same domain
      setTimeout(function() {
        Ajax.request({
          method: 'GET',
          XDomainRequest: true,
          url: config.siteUrl + '/components/factsheets/' + factsheet + '.html',
          onSuccess: function(data) {
            el.innerHTML = data.responseText;
            el.classList.remove(loadingClass);
          }
        });
      }, 4000);
    }
  };
});

