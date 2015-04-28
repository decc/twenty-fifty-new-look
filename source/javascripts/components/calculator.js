define(['knockout', 'text!../../components/calculator.html', 'pathway', 'helpers', 'hasher', 'config'],
  function(ko, html, Pathway, Helpers, hasher, config) {

  'use strict';

  /**
   * Tracks calculator
   * @class CalculatorViewModel
   */
  var ViewModel = function(params) {
    var params = params || {};

    var self = this;


    // check screen is big enough
    var timer;

    self.handleResize = function() {
      timer = setTimeout(function() {
        if(window.innerWidth < config.MIN_WIDTH || window.innerHeight < config.MIN_HEIGHT) {
          hasher.replaceHash('too-small');
          window.removeEventListener('resize', self.handleResize);
        }
        console.log('resize')

      }, 500);
    };

    window.addEventListener('resize', self.handleResize);


    self.pathway = params.pathway

    // Main navigation state.
    // 0: closed, 1: primary, 2: secondary
    self.navState = ko.observable(0);

    self.overviewVisible = ko.observable(false);
    self.subNavVisible = ko.observable(false);
    self.shareVisible = ko.observable(false);
    self.fullscreenVisible = ko.observable(false);
    self.faqVisible = ko.observable(false);
    self.mainViewVisible = ko.observable(true);

    self.buttonColor = ko.observable('question');

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
      self.buttonColor('question');
    };

    self.currentPathway = params.pathway;

    self.pathwayUpdating = ko.computed(function() {
      return self.currentPathway().updating();
    });

    self.pathwayCategories = Pathway.categories();

    var toggleObservableBool = function(context, boolName) {
      var toggleable = context[boolName];
      context[boolName](!toggleable());
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

        self.buttonColor('question');

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

        self.buttonColor('question');

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

    self.cityscapeVisible = ko.observable(true);

    /** toggle city scape */
    self.toggleCity = function(){
      toggleObservableBool(self, 'cityscapeVisible');

      // TODO: this could be handled by transitionEnd binding
      // cause ie9 dont do transitions
      if(!Modernizr.csstransitions) {
        setTimeout(self.redrawCharts, 10);
      }
    }

    self.redrawCharts = function() {
      // Redraw charts by touching data
      self.pathway().chartData.notifySubscribers();
    };

  };

  return {
    viewModel: ViewModel,
    template: html,
  };
});

