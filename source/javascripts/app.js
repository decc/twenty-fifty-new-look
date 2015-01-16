define(['knockout', 'router', 'appViewModel'],
  function(ko, router, AppViewModel) {

  'use strict';

  return {
    init: function() {
      var appViewModel = new AppViewModel();
      router.init(appViewModel);
      ko.applyBindings(appViewModel);
    }
  };
});

