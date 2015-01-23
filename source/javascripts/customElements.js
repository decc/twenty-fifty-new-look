define(['knockout'], function(ko) {
  'use strict';

  /**
   * As we are using a custom component loader, we also need to register
   * components which we want to use as custom elements.
   *
   * @todo There must be a better way of doing this!
   */

  ['main-nav', 'calculator-header', 'pathway-sidebar', 'all-pathway-actions', 'charts-tabberoony']
  .forEach(function(c) {
    ko.components.register(c, {});
  });
});

