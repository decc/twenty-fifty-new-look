define(['knockout', 'text!/components/calculator-header.html'],
  function(ko, html) {

  'use strict';

  var ViewModel = function(params) {
    var self = this;

    var navVisible = params.mainNavVisible;

    self.toggleMainNav = function() {
      navVisible(!navVisible());
    };
  };

  return {
    viewModel: ViewModel,
    template: html
  };
});

