define(['knockout', 'text!../../components/calculator-header.html'],
  function(ko, html) {

  'use strict';

  var ViewModel = function(params) {
    var self = this;

    var navState = params.navState;

    self.pathwayName = params.pathwayName;
    self.pathway = params.pathway;

    self.toggleMainNav = function() {
      var state = (navState() >= 1) ? 0 : 1;
      navState(state);
    };
  };

  return {
    viewModel: ViewModel,
    template: html
  };
});

