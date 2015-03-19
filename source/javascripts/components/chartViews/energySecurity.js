define(['knockout', 'text!/components/chartViews/energySecurity.html'],
  function(ko, html) {

  'use strict';

  var ViewModel = function(args) {
    var self = this;

    self.data = ko.computed(function() {
      return args.data()[args.charts[0].name];
    });

    self.auto = ko.computed(function() { return self.data().electricity.auto || 0; });
    self.peak = ko.computed(function() { return self.data().electricity.peak || 0; });
  };

  return {
    viewModel: ViewModel,
    template: html
  };
});

