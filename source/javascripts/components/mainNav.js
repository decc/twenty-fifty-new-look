define(['knockout', 'text!/components/main-nav.html', 'ajax', 'pathway', 'bindings/tabs'], function(ko, html, Ajax, Pathway) {
  'use strict';

  var ViewModel = function() {
    var self = this;

    self.exampleCategories = Pathway.exampleCategories();
    self.pathway = Pathway;
    debugger
    self.subNavSection = ko.observable('mine');

    self.showSubNav = function() {};
  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

