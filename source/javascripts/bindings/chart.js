define(['knockout', 'charts/energyDemand', 'charts/energySupply', 'charts/costsContext', 'charts/costsCompared'], function(ko, EnergyDemandChart, EnergySupplyChart, CostsContextChart, CostsComparedChart) {
  'use strict';

  ko.bindingHandlers.chart = {
    init: function(element, valueAccessor, allBindings) {
      var name = valueAccessor();
      var data = allBindings.get('data')
      var params = allBindings.get('params')

      // TODO: this
      self.chart = eval("new " + name + "(" + JSON.stringify(params) + ")");
      self.chart.init(element);

      element.chart = self.chart;
    },
    update: function(element, valueAccessor, allBindings, vm, context) {
      var name = valueAccessor();
      var data = allBindings.get('data');

      element.chart.draw(data()[name])
    }
  };

});