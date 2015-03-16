define(['knockout', 'pathway'], function(ko, Pathway) {
  'use strict';

  var AppViewModel = function() {
    var self = this;

    self.pageComponent = ko.observable('splash');
    self.pageParams = ko.observable();

    self.userPathway = ko.observable(new Pathway({ name: 'You', values: Pathway.defaultValues() }));
    self.examplePathway = ko.observable();

    self.pathway = ko.observable('user')

    self.currentPathway = ko.computed(function() {
      return self[self.pathway() + 'Pathway']();
    });

    self.getPage = function(component, params) {
      self.pageComponent(component);
      self.pageParams(params);
    };
  };

  return AppViewModel;
});

