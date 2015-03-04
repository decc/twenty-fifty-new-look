define(['knockout', 'charts/summary', 'charts/energyDemand', 'charts/energySupply', 'charts/electricityDemand', 'charts/electricitySupply', 'charts/costsContext', 'charts/costsCompared', 'charts/costsSensitivity'], function(ko, SummaryChart, EnergyDemandChart, EnergySupplyChart, ElectricityDemandChart, ElectricitySupplyChart, CostsContextChart, CostsComparedChart, CostsSensitivityChart) {
  'use strict';

  ko.bindingHandlers.chart = {
    init: function(element, valueAccessor, allBindings) {
      var name = valueAccessor();
      var data = allBindings.get('data');
      var params = allBindings.get('params') || {};
      console.log(data())
      //            ||
      // TODO: this \/
      self.chart = eval("new " + name);
      self.chart.init(element, params);
      element.chart = self.chart;

      window.addEventListener("resize", function () {
        var containerStyle = window.getComputedStyle(element);
        var width = parseInt(containerStyle.width, 10) - parseInt(containerStyle.paddingLeft, 10) - parseInt(containerStyle.paddingRight, 10);
        var height = parseInt(containerStyle.height, 10) - parseInt(containerStyle.paddingTop, 10) - parseInt(containerStyle.paddingBottom, 10);
        element.chart.draw(data()[name], width, height);
      });
    },
    update: function(element, valueAccessor, allBindings, vm, context) {
      var name = valueAccessor();
      var data = allBindings.get('data');

      var containerStyle = window.getComputedStyle(element);
      var width = parseInt(containerStyle.width, 10) - parseInt(containerStyle.paddingLeft, 10) - parseInt(containerStyle.paddingRight, 10);
      var height = parseInt(containerStyle.height, 10) - parseInt(containerStyle.paddingTop, 10) - parseInt(containerStyle.paddingBottom, 10);

      element.chart.draw(data()[name], width, height);
    }
  };

});
