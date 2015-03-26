define(['knockout', 'text!/components/calculator-header.html', 'bindings/chart'],
  function(ko, html) {

  'use strict';

  var ViewModel = function(params) {
    var self = this;

    var navState = params.navState;

    self.pathwayName = params.pathwayName;
    self.pathway = params.pathway;

    self.targetReachedVisible = ko.observable(false);
    self.targetDismissed = false;
    ko.computed(function() {
      // Show target reached tooltip if target reached; do not show if user has closed it before
      if(!self.targetDismissed && self.pathway().chartData()["SummaryChart"] >= 80) {
        self.targetReachedVisible(true);
      }

      // Hide if user drops below target
      if(self.pathway().chartData()["SummaryChart"] < 80) {
        self.targetReachedVisible(false);
      }
    });

    self.toggleMainNav = function() {
      var state = (navState() >= 1) ? 0 : 1;
      navState(state);
    };

    self.closeTargetReached = function() {
      if(self.targetReachedVisible) {
        self.targetDismissed = true;
        self.targetReachedVisible(false);
      }
    }
  };

  return {
    viewModel: ViewModel,
    template: html
  };
});

