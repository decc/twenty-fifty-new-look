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

    // Main navigation state.
    // 0: closed, 1: primary, 2: secondary
    self.navState = ko.observable(0);

    self.overviewVisible = ko.observable(false);
    self.mainNavVisible = ko.observable(false);
    self.subNavVisible = ko.observable(false);
    self.shareVisible = ko.observable(false);
    self.faqVisible = ko.observable(false);

    window.onresize = function () {
      self.cityspaceVisible(window.innerWidth > 768);
    };

    self.cityscapeVisible = ko.observable(window.innerWidth > 768);
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
    self.pathwayUpdating = params.pathway.updating;

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

    /** toggle share page visibility */
    self.toggleShare = function() {
      if(!self.faqVisible()){
        toggleObservableBool(self, 'shareVisible');
      } else {
        toggleObservableBool(self, 'faqVisible');
        toggleObservableBool(self, 'shareVisible');
      }
    }

    /** toggle faq page visibility */
    self.toggleFaq = function() {
      if(!self.shareVisible()){
        toggleObservableBool(self, 'faqVisible');
      } else {
        toggleObservableBool(self, 'shareVisible');
        toggleObservableBool(self, 'faqVisible');
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

