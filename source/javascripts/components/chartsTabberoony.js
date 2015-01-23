define(['knockout', 'text!/components/chart-tabs.html'], function(ko, html) {
  'use strict';

  var ViewModel = function() {
    var self = this;

    var CHARTS = [
      { "id": 1, "name": "energy", "title": "Energy", "data": {sponk:true} },
      { "id": 2, "name": "electricity", "title": "Electricity" },
      { "id": 3, "name": "emissions", "title": "Emissions" },
      { "id": 4, "name": "flows", "title": "Flows" },
      { "id": 5, "name": "map", "title": "Map" },
      { "id": 6, "name": "air", "title": "Air" },
      { "id": 7, "name": "energy-security", "title": "Energy Security" },
      { "id": 8, "name": "costs", "title": "Costs" },
      { "id": 9, "name": "overview", "title": "Overview" }
    ];

    self.charts = CHARTS;
    self.currentTabId = ko.observable(1);

    /** Sets visible tab */
    self.setActiveTab = function(chart) {
      self.currentTabId(chart.id);
    };

    self.setCSS = function(chart) {
      var css = 'icon-'+name+'-before';
      if(self.currentTabId() === id) {
        css += 'is-active';
      }
      return css;
    };
  };

  return {
    viewModel: ViewModel,
    template: html
  }

});

