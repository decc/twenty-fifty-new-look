define(['knockout', 'text!/components/share.html', 'bindings/chart'], function(ko, html) {
  'use strict';

  var ViewModel = function(params) {
    self.data = params.pathway().chartData;

    // TODO: get this from a mutual source with charttabs
    self.chart = { "id": 1, "name": "OverviewChart", "title": "Overview" };
    self.chartKeys = Object.keys(self.data()[self.chart.name]);


    var minDate = 2015;
    var maxDate = 2050;

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

