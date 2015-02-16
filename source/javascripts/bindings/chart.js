define(['knockout', 'chart'], function(ko, Chart) {
  'use strict';

  ko.bindingHandlers.chart = {
    init: function(element, valueAccessor, allBindings, vm, context) {
      var value = valueAccessor();
      var data = allBindings.get('data')

      self.chart = new Chart().init(element)

      context.chart = self.chart;
    },
    update: function(element, valueAccessor, allBindings, vm, context) {
      var value = valueAccessor();
      var data = allBindings.get('data');
      context.chart.draw(data())
    }
  };

});