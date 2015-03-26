define(['knockout', 'text!../../components/actionModal.html'], funciton(ko, html) {
  'use strict';

  var ViewModel = function(params) {
    var self = this;

    self.action = params.action;
    self.visible = ko.observable();
  };

  return {
    viewModel: ViewModel,
    template: html
  };
});

