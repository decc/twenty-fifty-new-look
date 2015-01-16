define(['crossroads', 'hasher'], function(crossroads, hasher) {
  'use strict';

  /** @todo Layer of abstraction between appViewModel and router */

  return {
    init: function(app) {
      crossroads.addRoute('home', function() {
        app.getPage('splash', {});
      });

      crossroads.addRoute('guide', function() {
        app.getPage('guide', {});
      });

      crossroads.addRoute('calculator', function() {
        app.getPage('calculator', {});
      });

      crossroads.addRoute('share', function() {
        app.getPage('share', {});
      });

      var parseHash = function(newHash) {
        crossroads.parse(newHash);
      };

      hasher.initialized.add(parseHash);
      hasher.changed.add(parseHash);
      hasher.init();

      if(!window.location.hash) { hasher.setHash('home'); }
    }
  };
});

