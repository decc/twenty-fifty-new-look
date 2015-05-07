define([], function() {
  'use strict';

  /**
   * @class Loader
   * @param path - image path
   * @param callback - called after image at path is loaded
   */
  var Loader = function(path, callback) {
    this.path = path;
    this.callback = callback;
  };

  /** @lends @Loader */
  Loader.prototype = {
    /** @returns Loader instance */
    load: function() {
      var image = this.image = new Image();
      image.onload = this.callback;
      image.src = this.path;

      return this;
    }
  };

  /**
   * Preload an array of image paths
   *
   * @static
   * @param paths - array of paths
   * @param callback - function to be called when batch has loaded
   */
  Loader.batch = function(paths, callback) {
    var loaded = 0;

    var handleLoad = function() {
      loaded++;

      if (loaded === paths.length) {
        if(callback) {
          callback();
        }
      }
    };

    for (var i = 0, l = paths.length; i < l; i++) {
      new Loader(paths[i], handleLoad).load();
    }
  };

  return Loader;
});

