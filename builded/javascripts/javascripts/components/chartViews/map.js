define(['knockout', 'text!/components/chartViews/map.html'],
  function(ko, html) {
  'use strict';

  var ViewModel = function(args) {
    var self = this;

    self.chart = args.charts[0];
    self.data = args.data;

    self.thermalData = ko.computed(function() {
      var chartData = args.data()[args.charts[0].name];

      return (chartData)? chartData["thermal"] : [];
    });
  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

