define(['ajax', 'config'], function(Ajax, config) {
  'use strict';

  var DataRequester = function() {};

  DataRequester.pathway = function(pathwayString, callback) {
    Ajax.request({
      url: config.apiUrl + '/pathways/' + pathwayString + '/data',
      XDomainRequest: true,
      onSuccess: callback,
      onError: function(){
        alert("Sorry, there was an error connecting to the server.")
      }
    });
  };

  return DataRequester;
});

