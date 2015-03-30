define(['knockout', 'text!../../components/guide.html'],
  function(ko, html){

  'use strict';

  var ViewModel = function() {
    var self = this;
  };

  return {
    viewModel: ViewModel,
    template: html
  };
});

