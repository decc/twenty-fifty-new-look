define(['knockout', 'text!/components/calculator.html', 'pathway'], function(ko, html, Pathway) {
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
   * The main app view model. Tracks app state
   * @class AppViewModel
   */
  var ViewModel = function() {
    var self = this;

    self.overviewVisible = ko.observable(false);
    self.mainNavVisible = ko.observable(false);

    self.activeTab = ko.observable(0)
    self.pathway = new Pathway();
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
      console.dir(tab)
      self.activeTab(id)
    }

  };

  return {
    viewModel: ViewModel,
    template: html
  };
});

