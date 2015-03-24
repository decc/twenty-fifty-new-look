define(['knockout', 'bindings/range'], function(ko) {
  'use strict';

  ko.bindingHandlers.tooltip = {
    update: function(element, value) {
      var val = Math.round(element.value);

      var parent = element.parentNode;

      var text = element.getAttribute("tip"+val);
      var tooltip = parent.querySelector('.tooltip');
      var tooltipText = parent.querySelector('.tooltip .text');

      tooltipText.innerHTML = text;

      var classmap = {
        "1":"a",
        "2":"b",
        "3":"c",
        "4":"d"
      }

      tooltip.className = "tooltip "+classmap[val];

      var endValue = 3;
      var endPosition = 250;
      var arrowPosition = Math.round(((element.value - 1) / endValue * endPosition) + 2);

      var tooltipArrow = parent.querySelector('.tooltip .arrow');
      var w = tooltipArrow.offsetWidth / 2;
      var limited = Math.min(Math.max(arrowPosition, w), 255);

      tooltipArrow.style.left = [limited - w, "px"].join('');
    }
  };
});

