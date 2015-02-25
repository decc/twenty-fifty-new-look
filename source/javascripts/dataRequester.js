define(['ajax', 'config'], function(Ajax, config) {
  'use strict';


  var DataRequester = function() {};

  DataRequester.pathway = function(pathwayString, callback) {
    Ajax.request({
      method: 'GET',
      url: config.apiUrl + '/pathways/' + pathwayString + '/data',
      onSuccess: callback,
      onError: function(){
        alert("Sorry, there was an error connecting to the server.")
      }
    });
  };

  return DataRequester;
});

