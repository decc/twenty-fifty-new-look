define(['knockout', 'text!/components/chartViews/energySecurity.html'],
  function(ko, html) {

  'use strict';

  var ViewModel = function(params) {
    var self = this;

    self.data = params.data;
  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

