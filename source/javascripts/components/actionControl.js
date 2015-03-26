define(['knockout', 'text!../../components/action-control.html'], function(ko, html) {
  'use strict';

  var ViewModel = function(action) {
    var self = this;

    self.value = ko.observable();
  };

  return {
    viewModel: ViewModel,
    template: html
  }
});

