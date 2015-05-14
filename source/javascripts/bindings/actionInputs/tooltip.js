define(['knockout', 'bindings/range'], function(ko) {
  'use strict';

  ko.bindingHandlers.tooltip = {
    update: function(element, value, left) {
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

      tooltip.className = "tooltip " + classmap[val];

      var endValue = 3;
      var offsetMultiplier = -4;
      var endPosition = element.rangeInstance.el.offsetWidth;
      var value = element.value;
      var arrowPosition = Math.round(((value - 1) / endValue * endPosition) + offsetMultiplier * value);

      var tooltipArrow = tooltip.querySelector('.arrow');
      var w = tooltipArrow.offsetWidth / 2;
      var limited = Math.min(Math.max(arrowPosition, 0), endPosition - 20);

      tooltipArrow.style.left = limited + 'px';
    }
  };
});

