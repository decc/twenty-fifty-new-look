define(['knockout', 'text!../../components/pathway-sidebar.html', 'pathway'],
  function(ko, html, Pathway) {

  'use strict';

  var ViewModel = function(params) {
    var self = this;

    self.pathwayCategories = Pathway.categories();
    self.pathway = params.pathway;

    self.overviewVisible = params.overviewVisible;
    self.currentTabId = ko.observable(1);

    self.setActiveTab = function(pathwayCategory) {
      self.currentTabId(pathwayCategory.id);
    };

    self.setActionValue = function(action, e) {
      action.value = e.target.value;
      self.pathway.updateAction(action);
    };

    self.navVisible = ko.observable(false);

    self.toggleNav = function() {
      self.navVisible(!self.navVisible());
    }

    self.swipeNav = function(direction) {
      if(direction.left) {
        self.navVisible(true);
      } else if (direction.right) {
        self.navVisible(false);
      }
    }


    self.toggleOverview = function() {
      self.overviewVisible(!self.overviewVisible());
    };

    self.swipeOverview = function(direction) {
      if(direction.left) {
        self.overviewVisible(true);
      } else if (direction.right) {
        self.overviewVisible(false);
      }
    }
  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

