define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.parallax = {
    init: function(el) {
      var landscape = el;

      ko.utils.domNodeDisposal.addDisposeCallback(el, function() {
        ko.bindingHandlers.parallax.unParallax();
      });

      var handleMouseMove = function() {
        //user has mouse!! do parallax
        window.addEventListener("mousemove", ko.bindingHandlers.parallax.mouseMove);
        window.addEventListener('resize', ko.bindingHandlers.parallax.handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
      };

      // Mouse test
      window.addEventListener('mousemove', handleMouseMove);

      // Device orientation test
      if(window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", ko.bindingHandlers.parallax.deviceMove);
      }

    },

    timer: {},

    handleResize: function() {
      this.timer = setTimeout(ko.bindingHandlers.parallax.checkParallax, 500);
    },


    unParallax: function() {
      window.removeEventListener('mousemove', ko.bindingHandlers.parallax.parallaxLandscape);
      window.removeEventListener('resize', ko.bindingHandlers.parallax.handleResize);
    },

    mouseMove: function(e) {
      var layerWidth = 1200; // could set dynamically?
      var landscapeWidth = landscape.clientWidth;
      var landscapeHeight = landscape.clientHeight

      var xOffset = -((landscapeWidth / 2) - (e.pageX - landscape.offsetLeft)); // adjust for offsetLeft
      var yOffset = ((landscapeHeight + landscape.offsetTop) - e.pageY); // adjust for offsetTop
      ko.bindingHandlers.parallax.parallaxLandscape(xOffset, yOffset);
    },

    deviceMove: function(eventData) {
      var layerWidth = 1200; // could set dynamically?
      var landscapeWidth = landscape.clientWidth;
      var landscapeHeight = landscape.clientHeight;

      // Assuming landscape orientation

      // Beta is roll
      var roll = eventData.beta;
      // Limit roll to be active between 0 and 90 deg
      var boundedRoll = roll > 45 ? 45 : roll < -45 ? -45 : roll;
      // Make the roll from 0-X to meet weird offset formula
      boundedRoll = boundedRoll + 45;

      var xOffset = -((landscapeWidth / 2) - (boundedRoll * 15 - landscape.offsetLeft));


      // Gamma is pitch
      var pitch = eventData.gamma;
      // Symmetric directions
      pitch = Math.abs(pitch);
      // Limit pitch to be active between 0 and 45 deg
      var boundedPitch = pitch > 90 ? 90 : pitch;

      var yOffset = -((landscapeHeight - landscape.offsetTop) - boundedPitch * 15);


      ko.bindingHandlers.parallax.parallaxLandscape(xOffset, yOffset);
    },

    parallaxLandscape: function(xOffset, yOffset) {
      var layerWidth = 1200, // could set dynamically?
          landscapeWidth = landscape.clientWidth,
          landscapeHeight = landscape.clientHeight

      var layers = [
        {
          el: document.getElementById('landscape-layer-1'),
          width: (landscapeWidth > layerWidth ? landscapeWidth : layerWidth),
          yThreshold: 0.09
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
          width: (landscapeWidth > layerWidth ? landscapeWidth + 70 : layerWidth + 70),
          yThreshold: 0.03
        },
        {
          el: document.getElementById('landscape-layer-5'),
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

            yParallax = yOffset * ((layer.yThreshold / (window.innerHeight / 200)) * ( landscapeHeight / (landscapeHeight + landscape.offsetTop) ) ) + 4;

            layer.el.style[transform] = 'translate(' + xParallax + 'px, ' + yParallax + 'px)';

          });
        });
      });
    }
  }
});

