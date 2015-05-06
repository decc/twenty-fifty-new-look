define(['knockout', 'text!../../../components/chartViews/airQuality.html'],
  function(ko, html) {
  'use strict';

  var ViewModel = function(args) {
    var self = this;

    self.calculator = args.calculator;

    self.title = args.title;
    self.chart = args.charts[0];
    self.data = args.data || {};
    self.comparison1 = ko.observable({});
    self.comparison2 = ko.observable({});

    self.example = args.Pathway.examples()[0];

    self.deferDrawing = ko.observable(true);

    // Request comparison chart data
    ko.computed(function() {
      self.calculator.currentPathway().updating(true);

      // Request first example
      args.DataRequester.pathway(self.example.values, function(data) {
        var data = JSON.parse(data.response);
        var chartParser = new args.ChartParser(data);

        self.comparison1({key: "2010", low: 100, high: 100});

        var comparison2 = chartParser.airQuality();
        comparison2.key = "2050 - Doesn't tackle climate change (All at level 1)";
        self.comparison2(comparison2);

        self.deferDrawing(false);
        self.calculator.currentPathway().updating(true);
      });
    });

  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

