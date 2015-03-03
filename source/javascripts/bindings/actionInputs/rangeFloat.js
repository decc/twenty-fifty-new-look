define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.rangeFloat = {
    init: function(element, valueAccessor, allBindings, vm, context) {
      var value = valueAccessor();
      var params = allBindings.get('params');

      var label = '.value-label';

      var min = params.min;
      var max = params.max;
      var id = params.name.replace(' ', '-').replace(/[^a-z0-9-?]/ig, '').toLowerCase();
      var tooltips = params.tooltips;

      element.setAttribute('type', 'range');
      element.setAttribute('list', id);
      element.setAttribute('min', min);
      element.setAttribute('max', max);
      element.setAttribute('step', 0.1);

      for(var tip in tooltips){
        element.setAttribute('tip'+tip[0], tooltips[tip]);
      }

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
        var valueLabel = element.parentNode.previousSibling.querySelector(label);
        valueLabel.innerHTML = element.value;

        var val = Math.round(element.value);

        var text = element.getAttribute("tip"+val);
        var tooltip = element.parentNode.querySelector('.tooltip');
        tooltip.innerHTML = text;

        var classmap = {
          "1":"a",
          "2":"b",
          "3":"c",
          "4":"d"
        }

        tooltip.className = "tooltip "+classmap[val];

      })

      if(element.parentNode.previousSibling.querySelector(label) == null){
        var valueLabel = document.createElement('span');
        valueLabel.classList.add('value-label');
        element.parentNode.insertBefore(valueLabel, element);

        valueLabel.innerHTML = value();
      } else {
        element.parentNode.previousSibling.querySelector(label).innerHTML = '0';
      }

    },

    update: function(element, valueAccessor, allBindings, vm, context) {
      var value = valueAccessor();
      var data = allBindings.get('data');

      element.value = value();

      var val = Math.round(element.value);

      var text = element.getAttribute("tip"+val);
      var tooltip = element.parentNode.querySelector('.tooltip');
      tooltip.innerHTML = text;

      var classmap = {
        "1":"a",
        "2":"b",
        "3":"c",
        "4":"d"
      }

      tooltip.className = "tooltip "+classmap[val];

    }
  };

});
