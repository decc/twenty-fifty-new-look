define(['knockout', 'pathway'], function(ko, Pathway) {
  'use strict';

  var AppViewModel = function() {
    var self = this;

    self.pageComponent = ko.observable('splash');
    self.pageParams = ko.observable();

    self.userPathway = new Pathway({ name: 'You', values: Pathway.defaultValues() });

    self.getPage = function(component, params) {
      self.pageComponent(component);
      self.pageParams(params);
    };

    // TODO: remove this if can change pathways without reload
    self.reload = function(element) {
      window.location.hash = "#/calculator/" + element.slug
      window.location.reload();
    };
  };

  return AppViewModel;
});

