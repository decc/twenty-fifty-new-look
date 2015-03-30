define(['knockout', 'text!../../../components/chartViews/airQuality.html'],
  function(ko, html) {
  'use strict';

  var ViewModel = function(args) {
    var self = this;

    self.calculator = args.calculator;

    self.chart = args.charts[0];
    self.data = args.data || {};
    self.comparison1 = ko.observable({});
    self.comparison2 = ko.observable({});

    self.example = args.Pathway.examples()[0];

    // self.deferDrawing = ko.observable(true);
    self.deferDrawing = ko.observable(false);

    // TODO: request data
    // Request comparison chart data
    // (function(args) {
    //   self.calculator.pathwayUpdating(true);
    //   args.DataRequester.pathway(self.example.values, function(data) {
    //     var data = JSON.parse(data.response);
    //     var chartParser = new args.ChartParser(data);

    //     self.comparison1(chartParser.airQuality());
    //     self.deferDrawing(false);

    //     self.calculator.pathwayUpdating(false);
    //   });
    // })(args);

  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

