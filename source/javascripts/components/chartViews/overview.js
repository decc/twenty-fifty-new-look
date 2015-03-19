define(['knockout', 'text!/components/chartViews/overview.html'],
  function(ko, html) {

  'use strict';

  var ViewModel = function(params) {
    var self = this;

    var minDate = 2015;
    var maxDate = 2050;

    self.chart = params.charts[0];
    self.data = params.data;
    self.chartKeys = Object.keys(self.data()[self.chart.name]);
    self.date = ko.observable(maxDate);

    self.rangeAttributes = ko.observable({
      min: minDate,
      max: maxDate,
      step: 5
    });
  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

