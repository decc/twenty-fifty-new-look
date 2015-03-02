define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.rangeInt = {
    init: function(element, valueAccessor, allBindings, vm, context) {
      var value = valueAccessor();
      var params = allBindings.get('params')

      var min = params.min;
      var max = params.max;
      var step = params.step;

      element.setAttribute('type', 'range');
      element.setAttribute('min', min);
      element.setAttribute('max', max);
      element.setAttribute('step', step);

      element.addEventListener('change', function(){
        value(parseInt(element.value));
      })

      element.addEventListener('input', function(){
        var valueLabel = element.parentNode.querySelector('span');
        valueLabel.innerHTML = element.value;
      })

      var valueLabel = document.createElement('span');
      element.parentNode.appendChild(valueLabel);
      valueLabel.innerHTML = value();
    },

    update: function(element, valueAccessor, allBindings, vm, context) {
      var value = valueAccessor();
      var data = allBindings.get('data');

      element.value = value();

      var valueLabel = element.parentNode.querySelector('span');
      valueLabel.innerHTML = value();
    }
  };

});
