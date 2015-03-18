define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.cityscape = {
    init: function(el) {
      
      var landscape = el;
      
      var parallaxLandscape = function(e) {

        var landscapeWidth = landscape.clientWidth,
            landscapeHeight = landscape.clientHeight,
            xOffset = -( (landscapeWidth / 2) - (e.pageX - landscape.offsetLeft) ), // adjust for offsetLeft
            yOffset = ((landscapeHeight + landscape.offsetParent.offsetTop) - e.pageY); // adjust for offsetTop - for some reason I needed to use offsetParent
        
        console.log(landscape.offsetTop)
        
        var layers = [
          {
            el: document.getElementById('landscape-layer-1'),
            width: 1200,
            yThreshold: 0.04
          },
          {
            el: document.getElementById('landscape-layer-2'),
            width: 1220,      
            yThreshold: 0.08
          },
          {
            el: document.getElementById('landscape-layer-3'),
            width: 1260,
            yThreshold: 0.15
          },
          {
            el: document.getElementById('landscape-layer-4'),
            width: 1315,
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
      
      console.log(landscape)

      landscape.addEventListener("mousemove", parallaxLandscape);
    }
  }
});

