define(['utils', 'hasher'], function(Utils, hasher){

  'use strict';

  return {
    handleResizeUp: function(lastRoute) {
      var timer;
      timer = setTimeout(function() {
        if(!Utils.tooSmall()) {
          hasher.replaceHash(lastRoute);
          fn()
          window.removeEventListener('resize', handleResize);
        }
      }, 500);
    },

    handleResizeDown: function() {
      var remove = false;
      var timer;

      timer = setTimeout(function() {
        if(Utils.tooSmall()) {
          hasher.replaceHash('too-small');
          remove = true;
        } else if(Utils.shouldRotate()) {
          hasher.replaceHash('rotate');
          remove = true;
        }

        if(remove) {
          window.removeEventListener('resize', handleResize);
        }
      }, 500);
    },

    init: function() {
      // check screen is big enough
      window.addEventListener('resize', this.handleResizeDown);
      this.handleResizeDown();
    },

    destroy: function() {
      window.removeEventListener('resize', this.handleResizeUp);
      window.removeEventListener('resize', this.handleResizeDown);
    },

    checkBig: function(lastRoute) {
      var that = this;

      window.addEventListener('resize', function() {
        that.handleResizeUp(lastRoute);
      });

      this.handleResizeUp(lastRoute);
    }
  };

});

