define(['knockout', 'text!/components/calculator.html'], function(ko, html) {
  'use strict';

  /** Constants for pathway */
  var PATHWAY_DATA = {
    actions: [
      { category: 1 }
    ]
  };

  /**
   * Represents a pathway route
   *
   * @param {object} args - arguments object
   * @param {string} args.longCode - Actual 2050 code
   * @param {string} args.description - Short description of pathway actions
   * @param {number} args.categoryId - PathwayRouteCategory id
   */
  var PathwayRoute = function(args) {
    var self = this;

    self.longCode = args.longCode;
    self.description = args.description || null;
    self.name = args.name || null;
    self.categoryId = args.categoryId || null;
  };

  /** For route lookup inflection */
  var PATHWAY_ROUTES = {
  //   new PathwayRoute({
  //      longCode: '10111111111111110111111001111110111101101101110110111',
  //      description: 'Dosent tackle climate change' })
  };

  /**
   * Represents a single datapoint of a pathway calculation
   *
   * @param {object} args - arguments object
   * @param {number} args.id - action id
   * @param {number} args.categoryId
   * @param {number} args.typeId
   * @param {number} args.value
   * @param {string} args.info - html string describing action
   * @param {strung} args.pdf - URI of related pdf
   */
  var Action = function(args) {
    var self = this;

    self.id = args.id;
    self.categoryId = args.categoryId;
    self.typeId = args.categoryType;
    self.value = args.value;
    self.info = args.info;
    self.pdf = args.pdf;
  };

  /** Represents a dataset for a 2050 calculation */
  var Pathway = function() {
    var self = this;

    self.actions = [];
  }

  /**
   * The main app view model. Tracks app state
   * @class AppViewModel
   */
  var ViewModel = function() {
    var self = this;

    self.overviewVisible = ko.observable(false);
    self.mainNavVisible = ko.observable(false);

    self.activeTab = ko.observable(0)

    /**
     * Togglews value of observable boolean
     * @param {object} context - context of boolName
     * @param {string} boolName - name of ko observable to toggle
     */
    var toggleObservableBool = function(context, boolName) {
      var toggleable = context[boolName];
      toggleable(!toggleable());
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
      console.dir(tab)
      self.activeTab(id)
    }

  };

  return {
    viewModel: ViewModel,
    template: html
  };
});

