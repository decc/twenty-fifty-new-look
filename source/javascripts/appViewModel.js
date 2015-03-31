define(['knockout', 'pathway'], function(ko, Pathway) {
  'use strict';

  var AppViewModel = function() {
    var self = this;

    // Set viewport for small screen
    if(screen.width <= 1024) {
      document.getElementById('viewport').setAttribute('content','width=1140');
    }

    self.pageComponent = ko.observable('splash');
    self.pageParams = ko.observable();

    self.userPathway = ko.observable(
      new Pathway({ name: 'Your Pathway', values: Pathway.defaultValues() })
    );

    self.examplePathway = ko.observable();

    self.pathway = ko.observable('user')

    self.currentPathway = ko.computed(function() {
      // console.dir(self[self.pathway() + 'Pathway']().actions());
      return self[self.pathway() + 'Pathway']();
    });

    self.getPage = function(component, params) {
      self.pageComponent(component);
      self.pageParams(params);
    };
  };

  return AppViewModel;
});

