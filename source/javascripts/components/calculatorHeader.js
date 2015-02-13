define(['knockout', 'text!/components/calculator-header.html'],
  function(ko, html) {

  'use strict';

  var ViewModel = function(params) {
    var self = this,
        navVisible = params.mainNavVisible;

    self.pathwayName = params.pathwayName;

    self.toggleMainNav = function() {
      navVisible(!navVisible());
    };
  };

  return {
    viewModel: ViewModel,
    template: html
  };
});

