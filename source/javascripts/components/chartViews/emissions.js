define(['knockout', 'text!/components/chartViews/emissions.html'],
  function(ko, html) {

  'use strict';

  var ViewModel = function(params) {
    var self = this;

    self.charts = params.charts;
    self.data = params.data;

    self.charts[0].note = "1990-2050 Target Reduction is 80%.";
    self.charts[1].note = "";


    self.currentTabId = ko.observable(1);

    /** Sets visible tab */
    self.setActiveTab = function(chart) {
      self.currentTabId(chart.id);
    };
  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

