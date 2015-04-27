define(['crossroads', 'hasher', 'pathway'], function(crossroads, hasher, Pathway) {
  'use strict';

  /** @todo Layer of abstraction between appViewModel and router */

  return {
    init: function(ko, app) {
      crossroads.addRoute('home', function() {
        app.getPage('splash', {});
      });

      crossroads.addRoute('guide', function() {
        app.getPage('guide', {});
      });

      crossroads.addRoute('too-small', function() {
        app.getPage('too-small', {});
      });

      crossroads.addRoute('calculator/:slug:', function(lastRoute, slug) {
        var pathway;

        if(pathway = Pathway.find(slug)) {
          app.examplePathway(pathway);
          app.pathway('example');
        } else {
          app.pathway('user');
        }

        // 404 if invalid slug
        if(slug && !pathway) {
          hasher.replaceHash('not-found');
          return;
        }

        // check if calculator already made
        var oldHash = lastRoute || '';

        if(oldHash.split('/')[0] !== 'calculator') {
          app.getPage('calculator', { pathway: app.currentPathway });
        }
      });

      crossroads.addRoute('share/:code:', function(lastRoute, pathwayString) {
        app.userPathway(
          new Pathway({ name: 'Your Pathway', values: pathwayString })
        );
        app.pathway('user');
        app.getPage('calculator', { pathway: app.currentPathway });

        hasher.replaceHash('calculator');
      });

      crossroads.addRoute('not-found', function() {
        app.getPage('notFound', {});
      });

      var parseHash = function(newHash, oldHash) {
        crossroads.parse(newHash, [oldHash]);
      };

      hasher.initialized.add(parseHash);
      hasher.changed.add(parseHash);

      hasher.init();

      if(!window.location.hash) { hasher.setHash('home'); }
    }
  };
});

