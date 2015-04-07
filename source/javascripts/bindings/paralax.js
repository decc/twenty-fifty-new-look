define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.paralax = {
    init: function(el) {

      var landscape = el;

      var parallaxLandscape = function(e) {

        var layerWidth = 1200, // could set dynamically?
            landscapeWidth = landscape.clientWidth,
            landscapeHeight = landscape.clientHeight,
            xOffset = -((landscapeWidth / 2) - (e.pageX - landscape.offsetLeft)), // adjust for offsetLeft
            yOffset = ((landscapeHeight + landscape.offsetTop) - e.pageY); // adjust for offsetTop

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

        // For all you ie fans out there
        window.requestAnimFrame = (function(){
          return  window.requestAnimationFrame       ||
                  window.webkitRequestAnimationFrame ||
                  window.mozRequestAnimationFrame    ||
                  function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                  };
        })();

        window.requestAnimFrame(function() {
          layers.forEach(function(layer) {

            transforms.forEach(function(transform) {
              
              var xParallax = -((xOffset / landscapeWidth) * (layer.width - landscapeWidth)),
                  yParallax = 0;

              if (e.pageY <= (landscapeHeight + landscape.offsetTop))
                yParallax = yOffset * (layer.yThreshold * ( landscapeHeight / (landscapeHeight + landscape.offsetTop) ) );

              layer.el.style[transform] = 'translate(' + xParallax + 'px, ' + yParallax + 'px)';
              
            });
          });

        });

      };

      window.addEventListener("mousemove", parallaxLandscape);
    }
  }
});

