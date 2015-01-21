define(['knockout', 'text!/components/pathway-sidebar.html', 'pathway'],
  function(ko, html, Pathway) {

  'use strict';

  var ViewModel = function(params) {
    var self = this;

    self.toggleOverview = params.toggleOverview;
    /** @todo pathway should be dynamic... so we can load named */
    self.pathway = new Pathway();
    self.pathwayCategories = Pathway.categories();
    self.currentTabId = ko.observable(1);

    /** Sets visible tab */
    self.setActiveTab = function(pathwayCategory) {
      self.currentTabId(pathwayCategory.id);
    };

    self.setActionValue = function(action) {
      self.pathway.updateAction(action);
    };

  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

