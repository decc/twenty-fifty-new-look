(function(require) {
  'use strict';

  require.config({
    urlArgs: 'bust=' + (new Date()).getTime(), // Cache busting for dev only
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
      selects: 'vendor/styled-selects'
    }
  });

  require([
    'componentLoader',
    'customElements',
    'bindings/cityscape',
    'bindings/landscape',
    'bindings/factsheet',
    'bindings/chart',
    'bindings/faqs',
    'bindings/scrolls',
    'bindings/tabs',
    'bindings/actionInputs/rangeInt',
    'bindings/actionInputs/rangeFloat',
    'bindings/actionInputs/radio',
    'bindings/select'
  ]);

  require(['app', 'vendor/modernizr', 'componentLoader'], function(app) {
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

