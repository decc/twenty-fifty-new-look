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

        EnergyEmissionsChart: this.energyEmissions(),
        ElectricityEmissionsChart: this.electricityEmissions(),

        FlowsChart: this.flows(),

        MapChart: this.map(),

        AirQualityChart: this.airQuality(),

        EnergySecurity: this.energySecurity(),

        CostsContextChart: this.costsSensitivity(),
        CostsComparedChart: this.costsCompared(),
        CostsSensitivityChart: this.costsSensitivity(),
        CostsSensitivityComponentsChart: this.costsSensitivity(),
      }
    },


    energyDemandUnused: function() {
      return ["Total Use", "Food consumption [UNUSED]"];
    },

    energySupplyUnused: function() {
      return ["Total Primary Supply", "Electricity oversupply (imports)"];
    },

    energyEmissionsUnused: function() {
      return ["Total"];
    },

    electricityEmissionsUnused: function() {
      return ["Total"];
    },

    // CO2 reduction overview chart
    summary: function() {
      return this.data.ghg.percent_reduction_from_1990;
    },

    overview: function() {
      var data = {
        "Demand": this.data.final_energy_demand,
        "Supply": this.data.primary_energy_supply,
        "Emissions": this.data.ghg
      };

      // Data organised by chart -> date
      var overviewYearlyData = {
        "Demand": {
          "2010": [], "2015": [], "2020": [], "2025": [], "2030": [], "2035": [], "2040": [], "2045": [], "2050": []
        },
        "Supply": {
          "2010": [], "2015": [], "2020": [], "2025": [], "2030": [], "2035": [], "2040": [], "2045": [], "2050": []
        },
        "Emissions": {
          "2010": [], "2015": [], "2020": [], "2025": [], "2030": [], "2035": [], "2040": [], "2045": [], "2050": []
        }
      };


      for(var topicName in data) {
        var skipLayers = this["energy" + topicName + "Unused"]();
        var topic = data[topicName]

        for(var item in topic) {
          // Don't parse unused/total layers
          if(!skipLayers.some(function(skip){ return item === skip })) {
            // Loop data points of each GHG
            for(var i = 0; i < topic[item].length; i++) {
              var value = topic[item][i];
              var date = 2010 + i * 5;
              overviewYearlyData[topicName][date].push({ key: item, value: Math.abs(value) });
            }
          }
        }
      }

      return overviewYearlyData;
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

            chartLayers.push({ key: layerName, date: date, value: value });
          }
        }
      }

      // Loop data points of line
      for(var i = 0; i < lineData.length; i++) {
        var value = lineData[i];
        var date = 2010 + i * 5;

        chartLine.push({ date: date, value: value });
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
      var skipLayers = this.energyDemandUnused();
      return this.areaVsLine(primaryData, lineData, skipLayers);
    },

    energySupply: function() {
      var primaryData = this.data.primary_energy_supply;
      var secondaryData = this.data.final_energy_demand;

      var lineData = secondaryData["Total Use"];
      var skipLayers = this.energySupplyUnused();
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


    energyEmissions: function() {
      var primaryData = this.data.ghg;
      var secondaryData = this.data.ghg["Total"];

      var skipLayers = this.energyEmissionsUnused();
      return this.areaVsLine(primaryData, secondaryData, skipLayers);
    },

    electricityEmissions: function() {
      var primaryData = this.data.electricity.emissions;
      var secondaryData = this.data.electricity.emissions["Total"];

      var skipLayers = this.energyEmissionsUnused();
      return this.areaVsLine(primaryData, secondaryData, skipLayers);
    },


    flows: function() {
      var data = this.data.sankey;

      var nodes = {};
      var links = [];

      // Populate node object
      // Keys: names for searching
      // Values: IDs for sankey
      var count = 0;
      data.forEach(function(d) {
        if(d[1] === 0) {
          return true;
        }

        // Set any source node once and iterate counter
        if(!nodes[d[0]]) {
          nodes[d[0]] = count;
          count++;
        }

        // Set any target node once and iterate counter
        if(!nodes[d[2]]) {
          nodes[d[2]] = count;
          count++;
        }
      })

      // Populate links object
      data.forEach(function(d) {
        if(d[1] === 0) {
          return true;
        }

        links.push({
          "source": nodes[d[0]],
          "target": nodes[d[2]],
          "value": d[1]
        })
      });

      // Convert nodes object to array of objects
      var nodes = Object.keys(nodes).map(function(d) { return { "name": d }; });

      var data = {
        nodes: nodes,
        links: links
      };

      return data;
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
        thermal: [
          { "key": labels["III.d"], "icon": "geothermal-stations-facilities", "value": Math.ceil(data["III.d"]) },
          { "key": labels["II.a"], "icon": "nuclear-power-stations", "value": Math.ceil(data["II.a"]) },
          { "key": labels["VII.c"], "icon": "gas-power-stations", "value": Math.ceil(data["VII.c"]) },
          { "key": labels["I.b"], "icon": "power-stations-with-ccs", "value": Math.ceil(data["I.b"]) },
          { "key": labels["I.a"], "icon": "power-stations-without-ccs", "value": Math.ceil(data["I.a"]) },
          { "key": labels["VI.b"], "icon": "energy-conversion-facilities", "value": Math.ceil(data["VI.b"]) }
        ],
        land: [
          { "key": labels["III.b"], "value": data["III.b"] },
          { "key": labels["IV.b"], "value": data["IV.b"] },
          { "key": labels["IV.a"], "value": data["IV.a"] },
          { "key": labels["IV.c"], "value": data["IV.c"] },
          { "key": labels["III.a.1"], "value": data["III.a.1"] },
          { "key": labels["VI.a.Forestry"], "value": data["VI.a.Forestry"] },
          { "key": labels["VI.a.Biocrop"], "value": data["VI.a.Biocrop"] }
        ],
        offshore: [
          { "key": labels["III.a.2"], "value": data["III.a.2"] },
          { "key": labels["VI.c"], "value": data["VI.c"] },
          { "key": labels["III.c.TidalStream"], "value": data["III.c.TidalStream"] },
          { "key": labels["III.c.TidalRange"], "value": data["III.c.TidalRange"] }
        ],
        imports: [
          { "key": labels["VII.a"], "value": data["VII.a"] },
          { "key": labels["V.b"], "value": data["V.b"] }
        ],
        wave: [
          { "key": "wave", "value": data["wave"] }
        ]
      };

      return data;
    },

    airQuality: function() {
      var data = this.data.air_quality;

      return data;
    },

    energySecurity: function() {
      var data = this.data;

      var out = {
        imports: [],
        diversity: [],
        electricity: {
          auto: Math.round(data.electricity.automatically_built),
          peak: Math.round(data.electricity.peaking)
        }
      };

      var a;
      var value;

      ['imports', 'diversity'].forEach(function(importType) {
        a = data[importType];

        for(var prop in a) {
          if(a.hasOwnProperty(prop)) {
            value = a[prop];
            out[importType].push({ name: prop, t2007: value[2007], t2050: value[2050] });
          }
        }
      });

      return out;
    },

    // Groups cost sensitivity data by category
    costsCompared: function() {
      var data = this.data.cost_components;
      return data;
    },

    costsSensitivity: function() {
      var data = this.data.cost_components;
      var flattenedData = Object.keys(data).map(function(key) { return { key: key, value: data[key] } })

      return flattenedData;
    },
  };



  return ChartParser;
});

