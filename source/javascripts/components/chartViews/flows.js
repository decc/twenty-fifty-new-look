define(['knockout', 'text!../../../components/chartViews/flows.html'],
  function(ko, html) {

  'use strict';

  var ViewModel = function(params) {
    var self = this;

    self.chart = params.charts[0];
    self.data = params.data;
  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

