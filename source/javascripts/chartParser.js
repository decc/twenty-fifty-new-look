define([], function() {
  'use strict';

  var ChartParser = function() {};

  ChartParser.prototype = {

    // Generic stacked area vs line chart
    areaVsLine: function(layerData, lineData, skipLayers) {
      var chartLayers = [];
      var chartLine = [];
      for(var layerName in layerData) {

        // Don't parse unused/total layers
        if(!skipLayers.some(function(skip){ return layerName === skip })) {
          // Loop data points of each layer
          for(var i = 0; i < layerData[layerName].length; i++) {
            var value = layerData[layerName][i];
            var date = 2010 + i * 5;

            chartLayers.push({ key: layerName, date: date, value: Math.abs(value) });
          }
        }
      }

      // Loop data points of line
      for(var i = 0; i < lineData.length; i++) {
        var value = lineData[i];
        var date = 2010 + i * 5;

        chartLine.push({ date: date, value: Math.abs(value) });
      }

      return {
        chartLayers: chartLayers,
        chartLine: chartLine
      };
    },

    energyDemand: function(primaryData, secondaryData) {
      var lineData = secondaryData["Total Primary Supply"];
      var skipLayers = ["Total Use", "Food consumption [UNUSED]"];
      return this.areaVsLine(primaryData, lineData, skipLayers);
    },

    energySupply: function(primaryData, secondaryData) {
      var lineData = secondaryData["Total Use"];
      var skipLayers = ["Total Primary Supply", "Electricity oversupply (imports)"];
      return this.areaVsLine(primaryData, lineData, skipLayers);
    },


    electricityDemand: function(primaryData, secondaryData) {
      var lineData = secondaryData["Total generation supplied to grid"];
      var skipLayers = ["Total"];
      return this.areaVsLine(primaryData, lineData, skipLayers);
    },

    electricitySupply: function(primaryData, secondaryData) {
      var lineData = secondaryData["Total"];
      var skipLayers = ["Total generation supplied to grid", "Tidal [UNUSED - See III.c]"];
      return this.areaVsLine(primaryData, lineData, skipLayers);
    },


    costsContext: function(data) {
      // Calculates total of all cost components
      var total = 0;

      for(var cost in data) {
        total += data[cost].point;
      }

      return total;
    },

    costsCompared: function(data) {

      var categories = {};

      // Map of cost to category
      var cost_categories = {
        "Conventional thermal plant": "Electricity",
        "Combustion + CCS": "Electricity",
        "Nuclear power": "Electricity",
        "Onshore wind": "Electricity",
        "Offshore wind": "Electricity",
        "Hydroelectric": "Electricity",
        "Wave and Tidal": "Electricity",
        "Geothermal": "Electricity",
        "Distributed solar PV": "Electricity",
        "Distributed solar thermal": "Buildings",
        "Micro wind": "Electricity",
        "Biomatter to fuel conversion": "Bioenergy",
        "Bioenergy imports": "Bioenergy",
        "Agriculture and land use": "Bioenergy",
        "Energy from waste": "Bioenergy",
        "Waste arising": "Bioenergy",
        "Marine algae": "Bioenergy",
        "Electricity imports": "Electricity",
        "Electricity Exports": "Electricity",
        "Electricity grid distribution": "Electricity",
        "Storage, demand shifting, backup": "Electricity",
        "H2 Production": "Transport",
        "Domestic heating": "Buildings",
        "Domestic insulation": "Buildings",
        "Commercial heating and cooling": "Buildings",
        "Domestic lighting, appliances, and cooking": "Buildings",
        "Commercial lighting, appliances, and catering": "Buildings",
        "Industrial processes": "Industry",
        "Conventional cars and buses": "Transport",
        "Hybrid cars and buses": "Transport",
        "Electric cars and buses": "Transport",
        "Fuel cell cars and buses": "Transport",
        "Bikes": "Transport",
        "Rail": "Transport",
        "Domestic aviation": "Transport",
        "Domestic freight": "Transport",
        "International aviation": "Transport",
        "International shipping (maritime bunkers)": "Transport",
        "Geosequestration": "Other",
        "Petroleum refineries": "Industry",
        "Coal": "Fossil fuels",
        "Oil": "Fossil fuels",
        "Gas": "Fossil fuels",
        "Fossil fuel transfers": "Fossil fuels",
        "District heating effective demand": "Buildings",
        "Power Carbon Capture": "Electricity",
        "Industry Carbon Capture": "Industry",
        "Storage of captured CO2": "Other",
        "Finance cost": "Finance"
      };

      // Populate categories object
      for(var cost in data) {
        // Lookup cost's category
        var categoryName = cost_categories[cost];

        // Add costs for each category encountered
        if(categories[categoryName]) {
          categories[categoryName] += data[cost].point
        } else {
          categories[categoryName] = data[cost].point
        }
      }

      // Flattened categories array
      var categoriesFlattened = Object.keys(categories).map(function(key) { return { key: key, value: categories[key] } })

      return categoriesFlattened;
    }
  };

  return ChartParser;
});

