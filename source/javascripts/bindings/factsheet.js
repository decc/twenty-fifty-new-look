define(['knockout', 'ajax', 'config'], function(ko, Ajax, config) {
  'use strict';

  ko.bindingHandlers.factsheet = {
    init: function(el, valueAccessor) {
      console.log("di")
    },

    update: function(el, valueAccessor) {
      var factsheet = valueAccessor();
console.log(factsheet())
      Ajax.request({
        method: 'GET',
        url: config.siteUrl + '/components/factsheets/' + factsheet + '.html',
        onSuccess: function(data) {
          el.innerHTML = data.responseText;
        }
      });
    }
  };
});

