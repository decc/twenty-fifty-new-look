define(['knockout', 'text!../../components/calculator.html', 'pathway', 'helpers'],
  function(ko, html, Pathway, Helpers) {

  'use strict';

  /**
   * Tracks calculator
   * @class CalculatorViewModel
   */
  var ViewModel = function(params) {
    var params = params || {};

    var self = this;

    self.pathway = params.pathway
    // Main navigation state.
    // 0: closed, 1: primary, 2: secondary
    self.navState = ko.observable(0);

    self.overviewVisible = ko.observable(false);
    self.mainNavVisible = ko.observable(false);
    self.subNavVisible = ko.observable(false);
    self.shareVisible = ko.observable(false);
    self.fullscreenVisible = ko.observable(false);
    self.faqVisible = ko.observable(false);
    self.mainViewVisible = ko.observable(true);

    self.buttonColor = ko.observable('pink');

    self.fullscreenVisible = ko.observable(false);
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

      self.buttonColor('white');
    };

    self.hideOverlay = function() {
      self.overlayVisible(false);
      self.buttonColor('pink');
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

        self.buttonColor('pink');

        // Redraw any newly visible charts by touching data
        self.pathway().chartData.notifySubscribers();

      } else {
        self.faqCloseMode(true);
        self.faqVisible(false);
        self.overlayVisible(false);
        self.mainViewVisible(false);
        self.fullscreenVisible(false);
        self.shareVisible(true);

        self.buttonColor('share-closer');

        // Explicitly draw charts now they are visible
        var shareCharts = document.querySelectorAll('.share .OverviewChart');
        ko.bindingHandlers.chart.redrawElements(shareCharts);
      }
    }

    /** toggle faq page visibility */
    self.toggleFaq = function() {
      if(self.faqCloseMode()){
        self.faqCloseMode(false);
        self.mainViewVisible(true);
        self.overlayVisible(false);
        self.shareVisible(false);
        self.fullscreenVisible(false);
        self.faqVisible(false);

        self.buttonColor('pink');

      } else {
        self.faqCloseMode(true);
        self.faqVisible(true);

        self.buttonColor('blue');
      }
    }

    /** toggle faq page visibility */
    self.toggleFullscreen = function() {
      self.faqCloseMode(true);
      self.fullscreenVisible(true);

      self.buttonColor('blue');

      // Explicitly draw chart now it's visible
      var flowsFullscreen = document.querySelectorAll('#sankey-fullscreen');
      ko.bindingHandlers.chart.redrawElements(flowsFullscreen);
    }

    /** set active tab */
    self.setActiveTab = function(tab) {
      self.activeTab(id)
    }

    /** toggle city scape */
    self.toggleCity = function(){
      toggleObservableBool(self, 'cityscapeVisible');
      // Redraw charts by touching data
      self.pathway().chartData.notifySubscribers();
    }

  };

  return {
    viewModel: ViewModel,
    template: html,
  };
});

