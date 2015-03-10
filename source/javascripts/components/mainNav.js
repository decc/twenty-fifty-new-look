define(['knockout', 'text!/components/main-nav.html', 'ajax', 'pathway', 'bindings/tabs'], function(ko, html, Ajax, Pathway) {
  'use strict';

  var ViewModel = function(params) {
    var self = this;

    self.navState = params.navState;

    self.exampleCategories = Pathway.exampleCategories();
    self.pathway = Pathway;


    self.toggleSubnav = function() {
      var state = (self.navState() === 2) ? 1 : 2;
      self.navState(state);
      console.log(self.navState())
    };

    self.closeSubnav = function() {
      self.navState(1);
      return true;
    }
  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

