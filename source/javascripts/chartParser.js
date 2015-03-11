define([], function() {
  'use strict';

  var ChartParser = function(data) {
    var self = this;
    self.data = data;
  };

  ChartParser.prototype = {

    all: function() {
      return {
        SummaryChart: this.summary(),

        OverviewChart: this.overview(),

        EnergyDemandChart: this.energyDemand(),
        EnergySupplyChart: this.energySupply(),

        ElectricityDemandChart: this.electricityDemand(),
        ElectricitySupplyChart: this.electricitySupply(),

        MapChart: this.map(),

        CostsContextChart: this.costsContext(),
        CostsComparedChart: this.costsCompared(),
        CostsSensitivityChart: this.costsSensitivity(),
        CostsSensitivityComponentsChart: this.costsSensitivityComponents(),
      }
    },

    // CO2 reduction overview chart
    summary: function() {
      return this.data.ghg.percent_reduction_from_1990;
    },

    overview: function() {
      var data = this.data.ghg;

      // Calculates total of all GHGs at 2050
      var total = 0;

      for(var cost in data) {
        if(typeof data[cost] === "object") {
          total += data[cost][data[cost].length - 1];
        }
      }

      return total;
    },

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

    energyDemand: function() {
      var primaryData = this.data.final_energy_demand;
      var secondaryData = this.data.primary_energy_supply;

      var lineData = secondaryData["Total Primary Supply"];
      var skipLayers = ["Total Use", "Food consumption [UNUSED]"];
      return this.areaVsLine(primaryData, lineData, skipLayers);
    },

    energySupply: function() {
      var primaryData = this.data.primary_energy_supply;
      var secondaryData = this.data.final_energy_demand;

      var lineData = secondaryData["Total Use"];
      var skipLayers = ["Total Primary Supply", "Electricity oversupply (imports)"];
      return this.areaVsLine(primaryData, lineData, skipLayers);
    },


    electricityDemand: function() {
      var primaryData = this.data.electricity.demand;
      var secondaryData = this.data.electricity.supply;

      var lineData = secondaryData["Total generation supplied to grid"];
      var skipLayers = ["Total"];
      return this.areaVsLine(primaryData, lineData, skipLayers);
    },

    electricitySupply: function() {
      var primaryData = this.data.electricity.supply;
      var secondaryData = this.data.electricity.demand;

      var lineData = secondaryData["Total"];
      var skipLayers = ["Total generation supplied to grid", "Tidal [UNUSED - See III.c]"];
      return this.areaVsLine(primaryData, lineData, skipLayers);
    },


    map: function() {
      var data = this.data.map;

      var labels = {
        'III.a.2': 'Offshore wind',
        'III.a.1': 'Onshore wind',
        'IV.c': 'Micro wind',
        'VI.a.Biocrop': 'Energy crops',
        'VI.a.Forestry': 'Forest',
        'VI.c': 'Marine algae',
        'V.b': 'Biocrops',
        'IV.a': 'Solar PV',
        'IV.b': 'Solar thermal',
        'VII.a': 'Solar PV',
        'III.b': 'Hydro',
        'III.c.TidalRange': 'Tidal range',
        'III.c.TidalStream': 'Tidal stream',
        'I.a': '2 GW coal gas or biomass power stations without CCS',
        'I.b': '1.2 GW coal gas or biomass power stations with CCS',
        'II.a': '3 GW nuclear power station',
        'III.d': '0.01 GW geothermal stations',
        'VII.c': '1 GW gas standby power stations',
        'VI.b': '215 kt/y waste to energy conversion facilities'
      };

      data = {
        land: [
          { "key": labels["III.b"], "value": data["III.b"] },
          { "key": labels["IV.b"], "value": data["IV.b"] },
          { "key": labels["IV.a"], "value": data["IV.a"] },
          { "key": labels["IV.c"], "value": data["IV.c"] },
          { "key": labels["III.a.1"], "value": data["III.a.1"] },
          { "key": labels["VI.a.Forestry"], "value": data["VI.a.Forestry"] },
          { "key": labels["VI.a.Biocrop"], "value": data["VI.a.Biocrop"] }
        ],
        "wave": 240.99441907661074,
        "III.a.1": 724.0079999999999,
        "III.b": 60.54545454545453,
        "IV.a": 0,
        "IV.b": 39.954878820088204,
        "IV.c": 0,
        "VI.a.Biocrop": 23849.5728797235,
        "III.a.2": 3240,
        "III.c.TidalStream": 380.51750380517524,
        "III.c.TidalRange": 525.8928571428571,
        "VI.c": 0,
        "V.b": 19963.495322838233,
        "VII.a": 214.73339506918438,
        "I.a": 0,
        "I.b": 20.61666666666667,
        "II.a": 10.453333333333335,
        "III.d": 0,
        "VII.c": 7.465371722718342,
        "VI.b": 103.29001860465115
      };

      return data;
    },


    costsContext: function() {
      var data = this.data.cost_components;

      // Calculates total of all cost components
      var total = 0;

      for(var cost in data) {
        total += data[cost].point;
      }

      return total;
    },

    costsCompared: function() {
      var data = this.data.cost_components;

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
    },

    costsSensitivity: function() {
      var data = this.data.cost_components;

      // Calculates total of all cost components
      var total = 0;

      for(var cost in data) {
        total += data[cost].point;
      }

      return total;
    },

    costsSensitivityComponents: function() {
      var data = this.data.cost_components;
      var flattenedData = Object.keys(data).map(function(key) { return { key: key, value: data[key] } })

      return flattenedData;
    },
  };



  return ChartParser;
});

