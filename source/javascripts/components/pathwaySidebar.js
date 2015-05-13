define(['knockout', 'text!../../components/pathway-sidebar.html', 'pathway', 'cookie'],
  function(ko, html, Pathway, Cookie) {

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

    var navToggled = function() {
      Cookie.set('nav_clicked', true, 10);
      self.navToggled(true);
    };

    self.navToggled = ko.observable(!!Cookie.get('nav_clicked'));
    self.toggleNav = function() {
      navToggled();
      self.navVisible(!self.navVisible());
    }

    self.swipeNav = function(direction) {
      navToggled()

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

