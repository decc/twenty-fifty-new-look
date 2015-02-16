define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.radio = {
    init: function(element, valueAccessor, allBindings, vm, context) {
      var value = valueAccessor();
      var params = allBindings.get('params');
      var max = params.max || 4;

      // Create radio elements
      for (var i = 0; i < params.max; i++) {
        var radio = document.createElement('input');

        radio.setAttribute('type', 'radio');
        radio.setAttribute('name', params.name);
        radio.setAttribute('value', String.fromCharCode(65 + i));

        radio.addEventListener('click', function(e) {
            value(e.target.value)
        });

        element.appendChild(radio);
      };

      element.childNodes[0].checked = true;

      var valueLabel = document.createElement('span');
      element.appendChild(valueLabel);
    },

    update: function(element, valueAccessor, allBindings, vm, context) {
      var value = valueAccessor();
      var data = allBindings.get('data');

      element.querySelector('input[value="' + value() + '"]').checked = true

      var valueLabel = element.querySelector('span');
      valueLabel.innerHTML = value();
    }
  };

});