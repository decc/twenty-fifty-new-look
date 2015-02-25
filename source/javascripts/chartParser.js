define([], function() {
  'use strict';

  var ChartParser = function() {};

  ChartParser.prototype = {

    energy: function(layerData, lineData) {
      var chartLayers = [];
      var chartLine = [];
      for(var layerName in layerData) {
        for(var i = 0; i < layerData[layerName].length; i++) {
          var value = layerData[layerName][i];
          var date = 2010 + i * 5;

          // Remove totals: Demand and supply charts use different names here
          // Electricity oversupply (imports) not used
          if(layerName !== "Total Use" && layerName !== "Total Primary Supply" && layerName !== "Electricity oversupply (imports)") {
            chartLayers.push({ key: layerName, date: date, value: Math.abs(value) });
          }
        }
      }

      // Demand and supply charts use different names here
      lineData = lineData["Total Use"] ? lineData["Total Use"] : lineData["Total Primary Supply"];
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

