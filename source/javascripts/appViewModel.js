define(['knockout', 'pathway'], function(ko, Pathway) {
  'use strict';

  var AppViewModel = function() {
    var self = this;

    self.pageComponent = ko.observable('splash-component');
    self.pageParams = ko.observable();

    self.userPathway = new Pathway({ name: 'You', values: Pathway.defaultValues() });

    self.getPage = function(component, params) {
      self.pageComponent(component);
      self.pageParams(params);
    };
  };

  return AppViewModel;
});

