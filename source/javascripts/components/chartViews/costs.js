define(['knockout', 'text!/components/chartViews/costs.html'],
  function(ko, html) {
  'use strict';

  var ViewModel = function(args) {
    var self = this;

    self.calculator = args.calculator;

    self.comparisonChartsEnabled = ko.observable(false);

    self.tabs = args.charts;
    self.contextTab = self.tabs[0];
    self.comparedTab = self.tabs[1];
    self.sensitivityTab = self.tabs[2];
    self.data = args.data;

    self.examples = args.Pathway.examples();

    // Selected example same for all tabs
    self.selectedExample = ko.observable(); // Set by select ko value
    self.selectedExampleName = ko.observable(); // Set by change event

    // Observable comparison chart data
    self.comparisonData = ko.observable({});

    // Update comparison charts
    ko.computed(function() {

      self.calculator.pathwayUpdating(true);

      args.DataRequester.pathway(self.selectedExample(), function(data) {
        var data = JSON.parse(data.response)
        var chartParser = new args.ChartParser(data);

        // Only parse data for charts in this chart view
        var contextData = chartParser.costsContext()
        var comparedData = chartParser.costsCompared()
        var sensitivityData = chartParser.costsSensitivity()

        self.comparisonData({
          CostsContextChart: contextData,
          CostsComparedChart: comparedData,
          CostsSensitivityChart: sensitivityData
        });

        self.calculator.pathwayUpdating(false);
      });

      if(self.selectedExample()) {
        self.comparisonChartsEnabled(true);
      } else {
        self.comparisonChartsEnabled(false);
      }
    });

    self.changeSelectedExampleName = function(_, event) {
      self.selectedExampleName(event.target[event.target.selectedIndex].innerHTML)
    };


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

