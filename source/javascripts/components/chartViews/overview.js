define(['knockout', 'text!/components/chartViews/overview.html'],
  function(ko, html) {

  'use strict';

  var ViewModel = function(params) {
    var self = this;

    self.charts = params.charts;
    self.data = params.data;
    self.date = ko.observable(2015);

    self.rangeAttributes = ko.observable({
      min: 2015,
      max: 2050,
      step: 5
    });
  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

