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
      tabber: 'vendor/tabber'
    }
  });

  require(['app', 'componentLoader', 'customElements'], function(app) {

    app.init();
  });
})(require, define);

