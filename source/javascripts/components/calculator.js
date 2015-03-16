define(['knockout', 'text!/components/calculator.html', 'pathway', 'bindings/factsheet'],
  function(ko, html, Pathway) {

  'use strict';

  /**
   * Tracks calculator
   * @class CalculatorViewModel
   */
  var ViewModel = function(params) {
    var params = params || {};

    var self = this;

    // Main navigation state.
    // 0: closed, 1: primary, 2: secondary
    self.navState = ko.observable(0);

    self.overviewVisible = ko.observable(false);
    self.mainNavVisible = ko.observable(false);
    self.subNavVisible = ko.observable(false);
    self.shareVisible = ko.observable(false);
    self.faqVisible = ko.observable(false);
    self.mainViewVisible = ko.observable(true);

    window.onresize = function () {
      self.cityspaceVisible(window.innerWidth > 768);
    };

    self.cityscapeVisible = ko.observable(window.innerWidth > 768);
    self.overlayVisible = ko.observable(false);
    self.overlayContent = ko.observable();

    self.faqCloseMode = ko.observable(false);

    self.overlayAction = ko.observable({});

    self.showOverlay = function(action) {
      if(self.overlayVisible()) {
        self.faqCloseMode(false);
        self.overlayVisible(false);
      } else {
        self.faqCloseMode(true);
        self.overlayVisible(true);
        self.overlayAction(action);
      }
    };

    self.hideOverlay = function() {
      self.overlayVisible(false);
    };

    self.currentPathway = params.pathway;
    self.pathwayUpdating = self.currentPathway().updating;

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

    /** toggle share page visibility */
    self.toggleShare = function() {
      if(self.shareVisible()) {
        self.faqCloseMode(false);
        self.mainViewVisible(true);
        self.shareVisible(false);
      } else {
        self.faqCloseMode(true);
        self.faqVisible(false);
        self.overlayVisible(false);
        self.mainViewVisible(false);
        self.shareVisible(true);
      }
    }

    /** toggle faq page visibility */
    self.toggleFaq = function() {
      if(self.faqCloseMode()){
        self.faqCloseMode(false);
        self.mainViewVisible(true);
        self.overlayVisible(false);
        self.shareVisible(false);
        self.faqVisible(false);
      } else {
        self.faqCloseMode(true);
        self.faqVisible(true);
      }
    }

    /** set active tab */
    self.setActiveTab = function(tab) {
      self.activeTab(id)
    }

    /** toggle city scape */
    self.toggleCity = function(){
      toggleObservableBool(self, 'cityscapeVisible');
    }

  };

  return {
    viewModel: ViewModel,
    template: html,
  };
});

