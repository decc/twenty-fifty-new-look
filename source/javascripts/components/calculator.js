define(['knockout', 'text!/components/calculator.html', 'pathway'],
  function(ko, html, Pathway) {

  'use strict';

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

