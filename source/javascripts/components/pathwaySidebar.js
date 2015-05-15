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

    var navToggled = function() {
      if(window.localStorage) {
        localStorage.setItem('nav_toggled', '1');
      }

      self.navToggled(true);
    };

    self.navToggled = ko.observable(!!localStorage.getItem('nav_toggled'));


    self.listenForClose = function() {
      // when i click outside of opened sidebar, close it.

      var handleClick = function(e) {
        var inSidebar = false;
        var sideBar = document.querySelector('pathway-sidebar');
        var parent = e.target.parentNode;

        while(parent) {
          if(parent === sideBar) {
            inSidebar = true;
            break;
          }

          parent = parent.parentNode;
        }

        if(!inSidebar) {
          self.navVisible(false);
          window.removeEventListener('click', handleClick);
          window.removeEventListener('tauchstart', handleClick);
        }
      }

      window.addEventListener('click', handleClick);
      window.addEventListener('touchstart', handleClick);
    };


    self.toggleNav = function() {
      navToggled();
      self.navVisible(!self.navVisible());

      if (self.navVisible()) {
        self.listenForClose()
      }
    }

    self.swipeNav = function(direction) {
      navToggled()

      if(direction.left) {
        self.navVisible(true);
        self.listenForClose();
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

