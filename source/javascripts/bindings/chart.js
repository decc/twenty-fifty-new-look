define(['knockout', 'charts/summary', 'charts/energyDemand', 'charts/energySupply', 'charts/electricityDemand', 'charts/electricitySupply', 'charts/energyEmissions', 'charts/flows', 'charts/map', 'charts/airQuality', 'charts/costsContext', 'charts/costsCompared', 'charts/costsSensitivity', 'charts/costsSensitivityComponents', 'charts/overview'], function(ko, SummaryChart, EnergyDemandChart, EnergySupplyChart, ElectricityDemandChart, ElectricitySupplyChart, EnergyEmissionsChart, FlowsChart, MapChart, AirQualityChart, CostsContextChart, CostsComparedChart, CostsSensitivityChart, CostsSensitivityComponentsChart, OverviewChart) {
  'use strict';

  ko.bindingHandlers.chart = {
    init: function(element, valueAccessor, allBindings) {
      var name = valueAccessor();
      var data = allBindings.get('data');

      element.params = allBindings.get('params') || {};

      self.chart = eval("new " + name);
      self.chart.init(element, element.params);
      element.chart = self.chart;

      // Redraw on window resize
      window.addEventListener("resize", function () {
        ko.bindingHandlers.chart.draw(element, name, data);
      });
    },

    update: function(element, valueAccessor, allBindings) {
      var name = valueAccessor();
      var data = allBindings.get('data');

      var deferDrawing = element.params.deferDrawing;
      var autoSize = element.params.autoSize;

      // TODO: map needs data to be evaluated so update called?
      if(typeof data !== "object") {
        data();
      }

      // If data observable not (yet) set
      // (Data can be both object and KO observable)
      if(typeof deferDrawing !== "undefined" && deferDrawing() === true) {
        return false;
      }

      // Chart can be sized based on background image
      if(autoSize !== true) {
        // Normal draw
        ko.bindingHandlers.chart.draw(element, name, data);
      } else {
        // Defer loading until first child (image) has loaded
        if(element.drawn) {
          ko.bindingHandlers.chart.draw(element, name, data);
        } else {
          element.children[0].onload = function() {
            element.drawn = true;
            ko.bindingHandlers.chart.draw(element, name, data);
          }
        }
      }
    },

    draw: function(element, name, data) {
      var containerStyle = window.getComputedStyle(element);
      var width = parseInt(containerStyle.width, 10) - parseInt(containerStyle.paddingLeft, 10) - parseInt(containerStyle.paddingRight, 10);
      var height = parseInt(containerStyle.height, 10) - parseInt(containerStyle.paddingTop, 10) - parseInt(containerStyle.paddingBottom, 10);

      // Whether data is object or KO observable
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
