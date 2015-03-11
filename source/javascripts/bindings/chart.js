define(['knockout', 'charts/summary', 'charts/energyDemand', 'charts/energySupply', 'charts/electricityDemand', 'charts/electricitySupply', 'charts/flows', 'charts/map', 'charts/costsContext', 'charts/costsCompared', 'charts/costsSensitivity', 'charts/costsSensitivityComponents', 'charts/overview'], function(ko, SummaryChart, EnergyDemandChart, EnergySupplyChart, ElectricityDemandChart, ElectricitySupplyChart, FlowsChart, MapChart, CostsContextChart, CostsComparedChart, CostsSensitivityChart, CostsSensitivityComponentsChart, OverviewChart) {
  'use strict';

  ko.bindingHandlers.chart = {
    init: function(element, valueAccessor, allBindings) {
      var name = valueAccessor();
      var data = allBindings.get('data');

      element.params = allBindings.get('params') || {};

      //            ||
      // TODO: this \/
      self.chart = eval("new " + name);
      self.chart.init(element, element.params);
      element.chart = self.chart;

      window.addEventListener("resize", function () {
        ko.bindingHandlers.chart.draw(element, name, data);
      });
    },

    update: function(element, valueAccessor, allBindings) {
      var name = valueAccessor();
      var data = allBindings.get('data');
      var autoSize = element.params.autoSize;

      if(autoSize !== true) {
        // Normal draw
        ko.bindingHandlers.chart.draw(element, name, data);
      } else {
        // Defer loading until first child (image) has loaded
        element.children[0].onload = function() {
          ko.bindingHandlers.chart.draw(element, name, data);
        }
      }
    },

    draw: function(element, name, data) {
      var containerStyle = window.getComputedStyle(element);
      var width = parseInt(containerStyle.width, 10) - parseInt(containerStyle.paddingLeft, 10) - parseInt(containerStyle.paddingRight, 10);
      var height = parseInt(containerStyle.height, 10) - parseInt(containerStyle.paddingTop, 10) - parseInt(containerStyle.paddingBottom, 10);

      if(typeof data === "object") {
        // Multiple pathway chart
        element.chart.draw(data, width, height);
      } else {
        // Single pathway chart
        element.chart.draw(data()[name], width, height);
      }
    }
  };

});
