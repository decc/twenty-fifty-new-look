define(['knockout', 'text!../../components/share.html', 'config']
  , function(ko, html, config) {
  'use strict';

  var ViewModel = function(params) {
    self.data = params.pathway().chartData;

    // TODO: get this from a mutual source with charttabs
    self.chart = { "id": 1, "name": "OverviewChart", "title": "Overview" };

    self.chartOptions = [
      { name: 'Demand', title: 'Demand (TWh/yr)', xMin: 0, xMax: 5000 },
      { name: 'Supply', title: 'Supply (TWh/yr)', xMin: 0, xMax: 5000 },
      { name: 'Emissions', title: 'Emissions (MtCO2e/yr)', xMin: -500, xMax: 1500 }
    ];

    var minDate = 2015;
    var maxDate = 2050;

    self.date = ko.observable(maxDate);
    self.pathway = params.pathway;

    self.shareTitle = "My DECC 2050 Pathway";
    self.shareSummary = "My DECC 2050 Pathway";

    self.shareString = self.pathway().shareString;
    //   // needs to update when any action value changes
    //   return config.siteUrl + "/share/" + self.pathway().values
    // })

    self.rangeAttributes = ko.observable({
      min: minDate,
      max: maxDate,
      step: 5
    });

    self.highlightText = function(element) {
      var textBox = document.getElementById("share-string");
      textBox.select();

      textBox.onmouseup = function() {
          // Prevent further mouseup intervention
          textBox.onmouseup = null;
          return false;
      };
    }
  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

