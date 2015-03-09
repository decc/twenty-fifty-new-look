define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.radio = {
    init: function(element, valueAccessor, allBindings, vm, context) {
      var value = valueAccessor();
      var params = allBindings.get('params');
      var max = params.max || 4;

      var label = '.value-label';
      var tooltips = params.tooltips;


      // Create radio elements
      for (var i = 0; i < params.max; i++) {
        var radio = document.createElement('input');

        radio.setAttribute('type', 'radio');
        radio.setAttribute('name', params.name);
        radio.setAttribute('value', String.fromCharCode(65 + i));

        for(var tip in tooltips){
          radio.setAttribute('tip'+tip[0], tooltips[tip]);
        }

        radio.addEventListener('click', function(e) {
            value(e.target.value)
        });

        element.appendChild(radio);
      };

      element.childNodes[0].checked = true;

      if(element.parentNode.previousSibling.querySelector(label) == null){
        var valueLabel = document.createElement('span');
        valueLabel.classList.add('value-label');
        element.parentNode.insertBefore(valueLabel, element);
      } else {
        element.parentNode.previousSibling.querySelector(label).innerHTML = '0';
      }

    },

    update: function(element, valueAccessor, allBindings, vm, context) {
      var value = valueAccessor();
      var data = allBindings.get('data');
      var map = { "A":"1", "B": "2", "C":"3", "D": "4" };
      var label = '.value-label';

      element.querySelector('input[value="' + value() + '"]').checked = true

      var valueLabel = element.parentNode.previousSibling.querySelector(label)
      valueLabel.innerHTML = value();

      var val = map[value()];
      var text = element.querySelector('input[value="' + value() + '"]').getAttribute("tip"+val);

      var tooltip = element.parentNode.querySelector('.tooltip');
      tooltip.innerHTML = text;
      tooltip.className = "tooltip "+ value().toLowerCase();

    }
  };

});
