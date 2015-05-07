define(['knockout', 'text!../../../components/chartViews/tabbed.html'],
  function(ko, html) {

  'use strict';

  var ViewModel = function(params) {
    var self = this;

    self.charts = params.charts;
    self.data = params.data;

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

