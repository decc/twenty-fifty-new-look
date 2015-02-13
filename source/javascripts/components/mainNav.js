define(['knockout', 'text!/components/main-nav.html', 'ajax', 'pathway', 'bindings/tabs'], function(ko, html, Ajax, Pathway) {
  'use strict';

  var ViewModel = function() {
    var self = this;

    self.examplePathways = ko.observableArray();
    self.subNavSection = ko.observable('mine');

    self.showSubNav = function() {};

    self.examplePathways(Pathway.examples);
  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

