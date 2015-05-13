define(['knockout', 'text!../../components/guide.html', 'sizeChecker'], function(ko, html, SizeChecker){

  'use strict';

  var ViewModel = function() {
    var self = this;

    SizeChecker.init();
  };

  return {
    viewModel: ViewModel,
    template: html
  };
});

