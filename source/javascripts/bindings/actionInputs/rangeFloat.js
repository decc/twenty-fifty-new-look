define(['knockout', 'bindings/range'], function(ko) {
  'use strict';

  ko.bindingHandlers.rangeFloat = {
    init: function(element, valueAccessor, allBindings, vm, context) {
      var value = valueAccessor();
      var params = allBindings.get('params');

      element.label = '.value-label';

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
        var valueLabel = element.parentNode.previousSibling.querySelector(element.label);
        valueLabel.innerHTML = element.value;
        ko.bindingHandlers.rangeFloat.setTooltip(element, element.value);
      })

      if(element.parentNode.previousSibling.querySelector(element.label) == null){
        var valueLabel = document.createElement('span');
        valueLabel.classList.add('value-label');
        element.parentNode.insertBefore(valueLabel, element);

        valueLabel.innerHTML = value();
      } else {
        element.parentNode.previousSibling.querySelector(element.label).innerHTML = '0';
      }

      ko.bindingHandlers.range.init(element);
    },

    update: function(element, valueAccessor, allBindings, vm, context) {
      var value = valueAccessor();
      var data = allBindings.get('data');

      element.value = value();

      var valueLabel = element.parentNode.previousSibling.querySelector(element.label);
      valueLabel.innerHTML = element.value;

      ko.bindingHandlers.rangeFloat.setTooltip(element, element.value);
      ko.bindingHandlers.range.update(element);
    },

    setTooltip: function(element, value) {
      var val = Math.round(element.value);

      var text = element.getAttribute("tip"+val);
      var tooltip = element.parentNode.querySelector('.tooltip');
      var tooltipText = element.parentNode.querySelector('.tooltip .text');
      tooltipText.innerHTML = text;

      var classmap = {
        "1":"a",
        "2":"b",
        "3":"c",
        "4":"d"
      }

      tooltip.className = "tooltip "+classmap[val];

      var endValue = 3;
      var endPosition = 233;
      var arrowPosition = Math.round(((element.value - 1) / endValue * endPosition) + 2)
      var tooltipArrow = element.parentNode.querySelector('.tooltip .arrow');
      tooltipArrow.style.left = arrowPosition + "px";
    }
  };

});
