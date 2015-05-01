define(['config', 'preloadable'], function(config, Preloadable) {
  'use strict';

  return {
    Preloadable: Preloadable,

    /** send user to a bigger screen at this point */
    tooSmall: function() {
      var height = window.innerHeight,
          width = window.innerWidth,
          minWidth = config.MIN_WIDTH,
          minHeight = config.MIN_HEIGHT;

      return ((width < minWidth || height < minHeight)) &&
        ((width < minHeight || height < minWidth));
    },

    /** make user go landscape at this point */
    shouldRotate: function() {
      var width = window.innerWidth;

      return (!this.tooSmall() && width < config.ROTATE_WIDTH && window.innerHeight > width)
    }
  }
});

