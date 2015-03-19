define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.landscape = {
    init: function(el) {

      var landscape = el;

      var parallaxLandscape = function(e) {

        var layerWidth = 1200, // could set dynamically?
            landscapeWidth = landscape.clientWidth,
            landscapeHeight = landscape.clientHeight,
            xOffset = -( (landscapeWidth / 2) - (e.pageX - landscape.offsetLeft) ), // adjust for offsetLeft
            yOffset = ((landscapeHeight + landscape.offsetParent.offsetTop) - e.pageY); // adjust for offsetTop - for some reason

        var layers = [
          {
            el: document.getElementById('landscape-layer-1'),
            width: (landscapeWidth > layerWidth ? landscapeWidth : layerWidth),
            yThreshold: 0.04
          },
          {
            el: document.getElementById('landscape-layer-2'),
            width: (landscapeWidth > layerWidth ? landscapeWidth + 20 : layerWidth + 20),
            yThreshold: 0.08
          },
          {
            el: document.getElementById('landscape-layer-3'),
            width: (landscapeWidth > layerWidth ? landscapeWidth + 60 : layerWidth + 60),
            yThreshold: 0.15
          },
          {
            el: document.getElementById('landscape-layer-4'),
            width: (landscapeWidth > layerWidth ? landscapeWidth + 115 : layerWidth + 115),
            yThreshold: 0.3
          }
        ];

        var transforms = [
          'msTransform',
          'webkitTransform',
          'mozTransform',
          'transform'
        ];

        layers.forEach(function(layer) {

          transforms.forEach(function(transform) {

            var parallaxOffset = -( (xOffset / landscapeWidth) * (layer.width - landscapeWidth) );

            layer.el.style[transform] = 'translate(' + parallaxOffset + 'px, ' + (yOffset * layer.yThreshold) + 'px)';

          });
        });

      };

      landscape.addEventListener("mousemove", parallaxLandscape);
    }
  }
});

