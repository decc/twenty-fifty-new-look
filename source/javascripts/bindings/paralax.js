define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.paralax = {
    init: function(el) {
      var landscape = el;

      var unParalax = function() {
        window.removeEventListener('mousemove', ko.bindingHandlers.paralax.paralaxLandscape);
      };

      var checkParalax = function() {
        // TODO: detect mouse instead
        if(window.innerWidth > 800 && window.innerHeight > 600) {
          window.addEventListener("mousemove", ko.bindingHandlers.paralax.paralaxLandscape);
        } else {
          unParalax();
        }
      }

      ko.utils.domNodeDisposal.addDisposeCallback(el, function() {
        unParalax();
      });

      var handleMouseMove = function() {
        //user has mouse!! do paralax
        checkParalax();

        var timer;
        window.addEventListener('resize', function() {
          timer = setTimeout(checkParalax, 500);
        });

        window.removeEventListener('mousemove', handleMouseMove);
      };

      window.addEventListener('mousemove', handleMouseMove);
    },

    paralaxLandscape: function(e) {
      var layerWidth = 1200, // could set dynamically?
          landscapeWidth = landscape.clientWidth,
          landscapeHeight = landscape.clientHeight,
          xOffset = -((landscapeWidth / 2) - (e.pageX - landscape.offsetLeft)), // adjust for offsetLeft
          yOffset = ((landscapeHeight + landscape.offsetTop) - e.pageY); // adjust for offsetTop

      var layers = [
        {
          el: document.getElementById('landscape-layer-1'),
          width: (landscapeWidth > layerWidth ? landscapeWidth : layerWidth),
          yThreshold: 0.1
        },
        {
          el: document.getElementById('landscape-layer-2'),
          width: (landscapeWidth > layerWidth ? landscapeWidth + 20 : layerWidth + 20),
          yThreshold: 0.07
        },
        {
          el: document.getElementById('landscape-layer-3'),
          width: (landscapeWidth > layerWidth ? landscapeWidth + 60 : layerWidth + 60),
          yThreshold: 0.05
        },
        {
          el: document.getElementById('landscape-layer-4'),
          width: (landscapeWidth > layerWidth ? landscapeWidth + 115 : layerWidth + 115),
          yThreshold: -0.01
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

            yParallax = yOffset * ((layer.yThreshold / (window.innerHeight / 200)) * ( landscapeHeight / (landscapeHeight + landscape.offsetTop) ) );

            layer.el.style[transform] = 'translate(' + xParallax + 'px, ' + yParallax + 'px)';

          });
        });
      });
    }
  }
});

