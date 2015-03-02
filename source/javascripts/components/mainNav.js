define(['knockout', 'text!/components/main-nav.html', 'ajax', 'pathway', 'bindings/tabs'], function(ko, html, Ajax, Pathway) {
  'use strict';

  var ViewModel = function() {
    var self = this;

    self.exampleCategories = Pathway.exampleCategories();
    self.pathway = Pathway;
    self.subNavSection = ko.observable('mine');

    self.showSubNav = function() {};

    self.currentTabId = ko.observable(1);

    self.setActiveTab = function(id, event) {
      self.currentTabId(event.toElement.getAttribute('data-tab'));
    };
  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

