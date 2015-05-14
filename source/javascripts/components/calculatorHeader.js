define(['knockout', 'text!../../components/calculator-header.html'],
  function(ko, html) {

  'use strict';

  var ViewModel = function(params) {
    var self = this;

    var navState = params.navState;

    self.pathwayName = params.pathwayName;
    self.pathway = params.pathway;

    self.cityscapeVisible = params.cityscapeVisible;

    self.targetReachedVisible = ko.observable(false);
    self.targetDismissed = false;

    ko.computed(function() {
      // Show target reached tooltip if target reached; do not show if user has closed it before
      if(!self.targetDismissed && self.pathway().targetReached()) {
        self.targetReachedVisible(true);
      }

      // Hide if user drops below target
      if(!self.pathway().targetReached()) {
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
    };

    self.swipeNav = function(direction) {
      if(direction.left) {
        navState(0);
      } else if (direction.right) {
        navState(1);
      }
    };
  };

  return {
    viewModel: ViewModel,
    template: html
  };
});

