define(['knockout', 'text!/components/calculator-header.html', 'bindings/chart'],
  function(ko, html) {

  'use strict';

  var ViewModel = function(params) {
    var self = this;

    var navState = params.navState;

    self.pathwayName = params.pathwayName;
    self.pathway = params.pathway;

    self.targetReachedVisible = ko.observable(false);
    self.targetReachedOnce = false;
    ko.computed(function() {
      // Show target reached tooltip once if target reached
      if(!self.targetReachedOnce && self.pathway().chartData()["SummaryChart"] >= 80) {
        self.targetReachedOnce = true;
        self.targetReachedVisible(true);
      }
    });

    self.toggleMainNav = function() {
      var state = (navState() >= 1) ? 0 : 1;
      navState(state);
    };

    self.closeTargetReached = function() {
      self.targetReachedVisible(false);
    }
  };

  return {
    viewModel: ViewModel,
    template: html
  };
});

