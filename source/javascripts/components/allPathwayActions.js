define(['knockout', 'text!../../components/all-pathway-actions.html', 'pathway'],
  function(ko, html, Pathway) {

  'use strict';

  var ViewModel = function(params) {
    var self = this;

    self.pathway = params.pathway;
    self.visible = params.visible;
    self.pathwayCategories = Pathway.categories();

    self.hide = function() {
      self.visible(false);
    };

    self.swipe = function(direction) {
      if(direction.right) {
        self.hide();
      }
    };
  };

  return {
    viewModel: ViewModel,
    template: html
  }

});

