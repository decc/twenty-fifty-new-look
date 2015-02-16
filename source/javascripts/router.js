define(['crossroads', 'hasher', 'pathway'], function(crossroads, hasher, Pathway) {
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

      crossroads.addRoute('calculator/:slug:', function(slug) {
        var pathway = Pathway.find(slug) || app.userPathway;
        hello = pathway

        // 404 if invalid slug
        if(slug && !pathway) {
          hasher.replaceHash('not-found');
          return;
        }

        pathway.setPathwayString(pathway.values);
        app.getPage('calculator', { pathway: pathway });
      });

      crossroads.addRoute('not-found', function() {
        console.log('404');
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

