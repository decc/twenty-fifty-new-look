define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.rangeFloat = {
    init: function(element, valueAccessor, allBindings, vm, context) {
      var value = valueAccessor();
      var params = allBindings.get('params')

      var min = params.min;
      var max = params.max;
      var id = params.name.replace(' ', '-').replace(/[^a-z0-9-?]/ig, '').toLowerCase();

      element.setAttribute('type', 'range');
      element.setAttribute('list', id);
      element.setAttribute('min', min);
      element.setAttribute('max', max);
      element.setAttribute('step', 0.1);

      var datalist = document.createElement('datalist');
      datalist.setAttribute('id', id);
      for (var i = (min + 1); i < max; i++) {
        var option = document.createElement('option');
        option.innerHTML = i;
        datalist.appendChild(option);
      };
      element.parentNode.appendChild(datalist);

      element.addEventListener('change', function(){
        value(parseFloat(element.value));
      })

      element.addEventListener('input', function(){
        var valueLabel = element.parentNode.querySelector('span');
        valueLabel.innerHTML = element.value;
      })

      var valueLabel = document.createElement('span');
      valueLabel.classList.add('value-label');
      element.parentNode.insertBefore(valueLabel, element);

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
