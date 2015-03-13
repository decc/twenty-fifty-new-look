define(['knockout', 'text!/components/chartViews/airQuality.html'],
  function(ko, html) {
  'use strict';

  var ViewModel = function(args) {
    var self = this;

    self.calculator = args.calculator;

    self.chart = args.charts[0];
    self.data = args.data

    self.example = args.Pathway.examples()[0];

    self.deferDrawing = ko.observable(true);

    // Request comparison chart data
    (function(args) {
      self.calculator.pathwayUpdating(true);
      args.DataRequester.pathway(self.example.values, function(data) {
        var data = JSON.parse(data.response);
        var chartParser = new args.ChartParser(data);

        var d = args.data();
        d["AirQualityChart"] = {
          you: d["AirQualityChart"],
          comparison: chartParser.airQuality()
        }
        self.deferDrawing(false);
        self.data(d);

        self.calculator.pathwayUpdating(false);
      });
    })(args);

  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

