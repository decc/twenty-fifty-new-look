define(['knockout', 'text!/components/calculator.html', 'pathway'],
  function(ko, html, Pathway) {

  'use strict';

  /**
   * Tracks calculator
   * @class CalculatorViewModel
   */
  var ViewModel = function(params) {
    var params = params || {};

    var self = this;

    self.overviewVisible = ko.observable(false);
    self.mainNavVisible = ko.observable(false);


    self.overlayVisible = ko.observable(false);
    self.overlayContent = ko.observable();

    self.overlayAction = ko.observable({});

    self.showOverlay = function(action) {
      self.overlayVisible(true);
      self.overlayAction(action);
    };

    self.hideOverlay = function() {
      self.overlayVisible(false);
    };


    self.currentPathway = ko.observable(params.pathway);


    // self.pathway = new Pathway();
    self.pathwayCategories = Pathway.categories();

    var toggleObservableBool = function(context, boolName) {
      var toggleable = context[boolName];
      context[boolName](!toggleable());
    };

    /** toggle overview visibility */
    self.toggleOverview = function() {
      toggleObservableBool(self, 'overviewVisible');
    };

    /** toggle main nav visibility */
    self.toggleMainNav = function() {
      toggleObservableBool(self, 'mainNavVisible');
    }

    /** set active tab */
    self.setActiveTab = function(tab) {
      self.activeTab(id)
    }

  };

  return {
    viewModel: ViewModel,
    template: html
  };
});

