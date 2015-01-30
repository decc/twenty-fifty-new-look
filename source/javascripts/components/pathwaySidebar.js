define(['knockout', 'text!/components/pathway-sidebar.html', 'pathway'],
  function(ko, html, Pathway) {

  'use strict';

  var ViewModel = function(params) {
    var self = this;

    self.pathwayCategories = Pathway.categories();
    self.pathway = params.pathway;

    self.toggleOverview = params.toggleOverview;
    self.currentTabId = ko.observable(1);

    /** Sets visible tab */
    self.setActiveTab = function(pathwayCategory) {
      self.currentTabId(pathwayCategory.id);
    };

    self.setActionValue = function(action, e) {
      /** @todo use observables!! */
      action.value = e.target.value;
      self.pathway.updateAction(action);
    };
  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

