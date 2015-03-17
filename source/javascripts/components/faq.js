define(['knockout', 'text!/components/faq-overlay.html'], function(ko, html) {
  'use strict';

  var ViewModel = function(params) {
    console.log("hi")
  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

