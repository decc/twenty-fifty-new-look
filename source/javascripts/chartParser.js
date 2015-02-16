define([], function() {
  'use strict';

  var ChartParser = function() {};

  ChartParser.prototype = {

    energyDemand: function(layerData, lineData) {
      var chartLayers = [];
      var chartLine = [];
      for(var layerName in layerData) {
        for(var i = 0; i < layerData[layerName].length; i++) {
          var value = layerData[layerName][i];
          var date = 2010 + i * 5;

          if(layerName !== "Total Use") {
            chartLayers.push({ key: layerName, date: date, value: value });
          }
        }
      }
      for(var i = 0; i < lineData["Total Primary Supply"].length; i++) {
        var value = lineData["Total Primary Supply"][i];
        var date = 2010 + i * 5;
        chartLine.push({ date: date, value: value });
      }

      return {
        chartLayers: chartLayers,
        chartLine: chartLine
      };
    },

    energySupply: function(data) {
      var chartData = [];
      for(var layerName in data) {
        for(var i = 0; i < data[layerName].length; i++) {
          var value = data[layerName][i];
          var date = 2010 + i * 5
          chartData.push({ key: layerName, date: date, value: value });
        }
      }
      return chartData;
    }
  };

  return ChartParser;
});

