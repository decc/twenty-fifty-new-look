define(['knockout', 'text!/components/chartViews/energySecurity.html'],
  function(ko, html) {

  'use strict';

  var ViewModel = function(args) {
    var self = this;

    self.data = ko.computed(function() {
      return args.data()[args.charts[0].name];
    });

    self.knowsBalance = ko.computed(function() {
      return true;
    });
  };

  return {
    viewModel: ViewModel,
    template: html
  };
});

