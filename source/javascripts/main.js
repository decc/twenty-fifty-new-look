(function(require) {
  'use strict';

  require.config({
    urlArgs: 'bust=' + (new Date()).getTime(), // Cache busting for dev only
    deps: ['main'],
    paths: {
      knockout: 'vendor/knockout-3.2.0.min',
      crossroads: 'vendor/crossroads',
      hasher: 'vendor/hasher',
      signals: 'vendor/signals',
      ajax: 'vendor/ajax',
      scroller: 'vendor/scroller',
      text: 'vendor/text',
      d3: 'vendor/d3',
      tabber: 'vendor/tabber',
      range: 'vendor/ranges',
      modernizr: 'vendor/modernizr',
      selects: 'vendor/styled-selects',

      // For sankey
      raphael: 'vendor/raphael.min',
      sankey: 'vendor/sankey'
    }
  });

  require(['app', 'vendor/modernizr', 'componentLoader', 'customElements'], function(app) {
    // TODO: create test for polyfills e.g.
    // Modernizr.load({
    //   test : Modernizr.geolocation,
    //   nope : ['/javascripts/vendor/polyfills/classList.js']
    // });

    Modernizr.load({load: ['/javascripts/vendor/polyfills/classList.js']});
    Modernizr.load({load: ['/javascripts/vendor/polyfills/es5.js']});

    app.init();
  });
})(require, define);

