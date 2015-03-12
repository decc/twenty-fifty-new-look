define(['knockout', 'pathway'], function(ko, Pathway) {
  'use strict';

  var AppViewModel = function() {
    var self = this;

    self.pageComponent = ko.observable('splash');
    self.pageParams = ko.observable();

    self.userPathway = new Pathway({ name: 'You', values: Pathway.defaultValues() });

    self.currentPathway = ko.observable(self.userPathway);

    self.getPage = function(component, params) {
      self.pageComponent(component);
      self.pageParams(params);
    };
  };

  return AppViewModel;
});

