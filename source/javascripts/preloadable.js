define([], function() {
  'use strict';

  var Preloadable = function(path, callback) {
    var self = this;

    self.hasLoaded = false;
    self.path = path;
    self.callback = callback;

    self.img = new Image();
    self.img.onload = function() {
      self.loaded();
    };

    self.img.src = self.path;
  }

  Preloadable.prototype = {
    loaded: function() {
      this.hasLoaded = true;

      if(this.callback) {
        this.callback();
      }
    }
  };

  return Preloadable;
});

