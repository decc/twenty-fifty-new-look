define(['knockout', 'text!/components/calculator.html', 'pathway', 'bindings/cityscape', 'bindings/landscape', 'bindings/factsheet'],
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

    self.pinkButton = ko.observable(true);
    self.blueButton = ko.observable(false);
    self.whiteButton = ko.observable(false);
    self.greyButton = ko.observable(false);

    // OPTIMIZE: Button colour function
    self.buttonColor =  function(color){
      if(color == 'pink'){
        self.blueButton(false);
        self.whiteButton(false);
        self.greyButton(false);
        self.pinkButton(true);
      } else if(color == 'white'){
        self.blueButton(false);
        self.pinkButton(false);
        self.greyButton(false);
        self.whiteButton(true);
      } else if(color == 'blue'){
        self.whiteButton(false);
        self.pinkButton(false);
        self.greyButton(false);
        self.blueButton(true);
      } else if(color == 'grey'){
        self.whiteButton(false);
        self.pinkButton(false);
        self.blueButton(false);
        self.greyButton(true);
      }
    }

    window.onresize = function () {
      self.cityspaceVisible(window.innerWidth > 768);
    };

    self.cityscapeVisible = ko.observable(window.innerWidth > 768);
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

      } else {
        self.faqCloseMode(true);
        self.faqVisible(false);
        self.overlayVisible(false);
        self.mainViewVisible(false);
        self.shareVisible(true);

        self.buttonColor('white');
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

        self.buttonColor('pink');

      } else {
        self.faqCloseMode(true);
        self.faqVisible(true);

        self.buttonColor('blue');
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
