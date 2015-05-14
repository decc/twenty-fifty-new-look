define(['knockout', 'router', 'appViewModel', 'preloader'],
  function(ko, router, AppViewModel, Preloader) {

  'use strict';

  return {
    preloadImages: function() {
      // preload first few images from next view
      var images = [
        // incase they come in not on splash
        '/images/landscape.svg',

        // first few images of guide
        '/images/guide/map.svg',
        '/images/guide/screenshot.jpg',
        '/images/guide/graph.png'
      ];

      Preloader.batch(images);
    },

    init: function() {
      this.preloadImages();

      var appViewModel = new AppViewModel();
      router.init(ko, appViewModel);
      ko.applyBindings(appViewModel);
    }
  };
});

