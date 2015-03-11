var hello;
define(['knockout', 'router', 'appViewModel'],
  function(ko, router, AppViewModel) {

  'use strict';

  return {
    init: function() {
      var appViewModel = new AppViewModel();
      router.init(ko, appViewModel);
      ko.applyBindings(appViewModel);
    }
  };
});

