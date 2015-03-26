define(['knockout', 'text!/components/chartViews/costs.html', 'charts/costsContext', 'charts/costsCompared', 'charts/costsSensitivity', 'bindings/select'],
  function(ko, html, CostsContextChart, CostsComparedChart, CostsSensitivityChart) {
  'use strict';

  var ViewModel = function(args) {
    var self = this;

    self.calculator = args.calculator;

    self.tabs = args.charts;
    self.contextTab = self.tabs[0];
    self.comparedTab = self.tabs[1];
    self.sensitivityTab = self.tabs[2];

    // Build all charts in this view
    // They are passed in to costs sensitivity components chart for redrawing
    self.yourCostsContextChart = new CostsContextChart();
    self.comparisonCostsContextChart = new CostsContextChart();
    self.yourCostsComparedChart = new CostsComparedChart();
    self.comparisonCostsComparedChart = new CostsComparedChart();
    self.yourCostsSensitivityChart = new CostsSensitivityChart();
    self.comparisonCostsSensitivityChart = new CostsSensitivityChart();

    self.data = args.data;

    self.examples = args.Pathway.examples();

    // Selected example same for all tabs
    self.selectedExample = ko.observable(); // Set by select ko value
    self.selectedExampleName = ko.observable(self.examples[0].name); // Set by change event

    // Observable comparison chart data
    self.comparisonData = ko.observable({});

    // Update comparison charts
    ko.computed(function() {
      if(self.selectedExample()) {
        self.calculator.pathwayUpdating(true);

        // TODO: remove delay once on same domain
        setTimeout(function() {
          args.DataRequester.pathway(self.selectedExample(), function(data) {
            var data = JSON.parse(data.responseText);

            var chartParser = new args.ChartParser(data);

            // Only parse data for charts in this chart view
            var comparedData = chartParser.costsCompared();
            var sensitivityData = chartParser.costsSensitivity();

            self.comparisonData({
              CostsContextChart: sensitivityData,
              CostsComparedChart: comparedData,
              CostsSensitivityChart: sensitivityData,
              CostsSensitivityComponentsChart: sensitivityData
            });

            self.calculator.pathwayUpdating(false);
          });
        }, 2000);
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

