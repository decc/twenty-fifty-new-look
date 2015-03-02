define(['knockout', 'charts/energyDemand', 'charts/energySupply', 'charts/electricityDemand', 'charts/electricitySupply', 'charts/costsContext', 'charts/costsCompared'], function(ko, EnergyDemandChart, EnergySupplyChart, ElectricityDemandChart, ElectricitySupplyChart, CostsContextChart, CostsComparedChart) {
  'use strict';

  ko.bindingHandlers.chart = {
    init: function(element, valueAccessor, allBindings) {
      var name = valueAccessor();
      var data = allBindings.get('data');
      var params = allBindings.get('params') || {};

      // TODO: chart tab is not yet initialised so can't get its height
      var width = document.getElementById('chart-tabs').clientWidth;
      var height = document.getElementById('chart-tabs').clientHeight - 90;
      params.width = width;
      params.height = height;

      //            ||
      // TODO: this \/
      self.chart = eval("new " + name);
      self.chart.init(element, params);

      element.chart = self.chart;

      window.addEventListener("resize", function () {
        var width = element.clientWidth;
        var height = element.clientHeight;
        element.chart.draw(data()[name], width, height);
      });
    },
    update: function(element, valueAccessor, allBindings, vm, context) {
      var name = valueAccessor();
      var data = allBindings.get('data');

      var width = element.clientWidth;
      var height = element.clientHeight;

      element.chart.draw(data()[name], width, height);
    }
  };

});
