define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.rangeInt = {
    init: function(element, valueAccessor, allBindings, vm, context) {
      var value = valueAccessor();
      var params = allBindings.get('params');

      var label = '.value-label';

      var min = params.min;
      var max = params.max;
      var step = params.step;
      var tooltips = params.tooltips;

      //console.log(tooltips);

      element.setAttribute('type', 'range');
      element.setAttribute('min', min);
      element.setAttribute('max', max);
      element.setAttribute('step', step);

      for(var tip in tooltips){
        element.setAttribute('tip'+tip[0], tooltips[tip]);
      }

      element.addEventListener('change', function(){
        value(parseInt(element.value));
      })

      element.addEventListener('input', function(){
        var valueLabel = element.parentNode.previousSibling.querySelector(label);
        valueLabel.innerHTML = element.value;

        var text = element.getAttribute("tip"+element.value);
        var tooltip = element.parentNode.querySelector('.tooltip');
        tooltip.innerHTML = text;

        var classmap = {
          "1":"a",
          "2":"b",
          "3":"c",
          "4":"d"
        }

        tooltip.className = "tooltip "+classmap[element.value];

      })

      if(element.parentNode.previousSibling.querySelector(label) == null){
        var valueLabel = document.createElement('span');
        valueLabel.classList.add('value-label');
        element.parentNode.insertBefore(valueLabel, element);

        valueLabel.innerHTML = value();
      } else {
        element.parentNode.previousSibling.querySelector(label).innerHTML = '1';
      }

    },

    update: function(element, valueAccessor, allBindings, vm, context) {
      var value = valueAccessor();
      var data = allBindings.get('data');

      element.value = value();

      var text = element.getAttribute("tip"+element.value);
      var tooltip = element.parentNode.querySelector('.tooltip');
      tooltip.innerHTML = text;
    }
  };

});
