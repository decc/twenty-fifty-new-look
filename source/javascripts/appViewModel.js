define(['knockout'], function(ko) {
  'use strict';

  var AppViewModel = function() {
    var self = this;

    self.pageComponent = ko.observable('splash-component');
    self.pageParams = ko.observable();

    self.getPage = function(component, params) {
      self.pageComponent(component);
      self.pageParams(params);
    };
  };

  return AppViewModel;
});

