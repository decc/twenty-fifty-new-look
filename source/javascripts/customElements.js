define(['knockout'], function(ko) {
  'use strict';

  /**
   * As we are usign a custom component loader, we also need to register
   * components which we want to use as custom elements.
   *
   * @todo There must be a better way of doing this!
   */

  ko.components.register('main-nav', {});
  ko.components.register('calculator-header', {});
});

