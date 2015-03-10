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

      crossroads.addRoute('calculator/:slug:', function(slug) {
        var pathway = Pathway.find(slug) || app.userPathway;

        // 404 if invalid slug
        if(slug && !pathway) {
          hasher.replaceHash('not-found');
          return;
        }
        var actionSection = document.querySelector('.pathway-category-tab-nav');
        pathway.setActionsFromPathwayString(pathway.values);

        // check if calculator already made
        var oldHash = arguments[0] || '';

        if(oldHash.split('/')[0] !== 'calculator') {
          app.getPage('calculator', { pathway: pathway });
        }

      });

      crossroads.addRoute('not-found', function() {
        console.log('404');
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

