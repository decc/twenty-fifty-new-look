define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.radio = {
    init: function(element, valueAccessor, allBindings, vm, context) {
      var value = valueAccessor();
      var params = allBindings.get('params');
      var max = params.max || 4;

      element.label = '.value-label';
      var tooltips = params.tooltips;

      // Create radio elements
      for (var i = 0; i < params.max; i++) {

        var label = document.createElement('label');
        var radio = document.createElement('input');

        var id = 'radio-' + params.name.toLowerCase().replace(/ /g, '-') + '-' + i;

        radio.id = id;

        label.setAttribute('for', id);
        label.className = 'r'


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
        element.appendChild(label);
      };

      element.childNodes[0].checked = true;

      if(element.parentNode.previousSibling.querySelector(element.label) == null){
        var valueLabel = document.createElement('span');
        valueLabel.classList.add('value-label');
        element.parentNode.insertBefore(valueLabel, element);
      } else {
        element.parentNode.previousSibling.querySelector(element.label).innerHTML = '0';
      }

    },

    update: function(element, valueAccessor, allBindings, vm, context) {
      var value = valueAccessor();
      var data = allBindings.get('data');
      var map = { "A":"1", "B": "2", "C":"3", "D": "4" };
      var val = map[value()];

      element.querySelector('input[value="' + value() + '"]').checked = true

      var valueLabel = element.parentNode.previousSibling.querySelector(element.label)
      valueLabel.innerHTML = value();

      ko.bindingHandlers.radio.setTooltip(element, val, value());
    },

    // TODO: this should be shared with tooltip binding
    setTooltip: function(element, value, className) {
      var text = element.querySelector('input[value="' + className + '"]').getAttribute("tip"+value);

      var tooltip = element.parentNode.querySelector('.tooltip');
      tooltip.className = "tooltip "+ className.toLowerCase();

      var tooltipText = element.parentNode.querySelector('.tooltip .text');
      tooltipText.innerHTML = text;

      var endValue = 3;
      var endPosition = 177;
      var arrowPosition = Math.round(((value - 1) / endValue * endPosition) + 2)
      var tooltipArrow = element.parentNode.querySelector('.tooltip .arrow');
      tooltipArrow.style.left = arrowPosition + "px";
    }
  };

});
