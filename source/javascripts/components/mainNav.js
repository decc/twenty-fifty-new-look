define(['knockout', 'text!/components/main-nav.html', 'ajax'], function(ko, html, Ajax) {
  'use strict';

  var ViewModel = function() {
    var self = this;

    self.exampleCategories = ko.observableArray();

    Ajax.request({
      url: '/data/examples.json',
      onSuccess: function(xhr) {
        var response = JSON.parse(xhr.responseText);

        self.exampleCategories(response.exampleCategories);
      }
    });
  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

