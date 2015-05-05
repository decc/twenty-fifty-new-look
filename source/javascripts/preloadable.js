define([], function() {
  'use strict';

  /**
   * @class Preloader
   * @param path - image path
   * @param callback - called after image at path is loaded
   */
  var Preloader = function(path, callback) {
    this.path = path;
    this.callback = callback;
  };

  /** @lends @Preloader */
  Preloader.prototype = {
    /** @returns Preloader instance */
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
  Preloader.batch = function(paths, callback) {
    var loaded = 0;

    var handleLoad = function() {
      loaded++;

      if (loaded === paths.length) {
        callback();
      }
    };

    for (var i = 0, l = paths.length; i < l; i++) {
      new Preloader(paths[i], handleLoad).load();
    }
  };

  return Preloader;
});

