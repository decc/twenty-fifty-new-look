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
      selects: 'vendor/styled-selects'
    }
  });

  require(['app', 'componentLoader', 'customElements'], function(app) {
    app.init();
  });
})(require, define);

