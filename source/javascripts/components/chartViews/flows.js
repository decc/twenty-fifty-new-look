define(['knockout', 'text!../../../components/chartViews/flows.html'],
  function(ko, html) {

  'use strict';

  var ViewModel = function(params) {
    var self = this;

    self.chart = params.charts[0];
    self.data = params.data;

    self.fullscreen = function() {
      var chart = document.querySelector('.chart.flows');
      var modal = document.getElementById('flows-fullscreen');
      modal.appendChild(chart)
    };
  };

  return {
    viewModel: ViewModel,
    template: html
  };

});

