define(['knockout', 'text!../../components/all-pathway-actions.html', 'pathway'],
  function(ko, html, Pathway) {

  'use strict';

  var ViewModel = function(params) {
    var self = this;

    self.pathway = params.pathway;
    self.visible = params.visible;
    self.toggle = params.toggle;
    self.pathwayCategories = Pathway.categories();

  };

  return {
    viewModel: ViewModel,
    template: html
  }

});

