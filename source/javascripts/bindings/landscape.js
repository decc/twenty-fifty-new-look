define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.cityscape = {
    init: function(el) {
      var landscape = el;

      var parallaxLandscape = function(e) {

        var landscapeWidth = landscape.clientWidth,
            xOffset = -( (landscapeWidth / 2) - (e.pageX - landscape.offsetLeft) );

        var layers = [
          {
            el: document.getElementById('landscape-layer-1'),
            width: 1200
          },
          {
            el: document.getElementById('landscape-layer-2'),
            width: 1220
          },
          {
            el: document.getElementById('landscape-layer-3'),
            width: 1260
          },
          {
            el: document.getElementById('landscape-layer-4'),
            width: 1315
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

            layer.el.style[transform] = 'translateX(' + parallaxOffset + 'px)';

          });
        });

      };

      landscape.addEventListener("mousemove", parallaxLandscape);
    }
  }
});

