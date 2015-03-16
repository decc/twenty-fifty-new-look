define(['knockout', 'ajax', 'config'], function(ko, Ajax, config) {
  'use strict';

  ko.bindingHandlers.factsheet = {
    init: function(el, valueAccessor) {
    },

    update: function(el, valueAccessor) {
      var factsheet = valueAccessor();

      Ajax.request({
        method: 'GET',
        url: config.apiUrl + '/components/factsheets/' + factsheet,
        onSuccess: function(data) {
          el.innerHTML = data.responseText;
        }
      });
    }
  };
});

