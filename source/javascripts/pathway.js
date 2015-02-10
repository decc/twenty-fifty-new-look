define(['knockout', 'ajax'], function(ko, Ajax) {
  'use strict';

  var PATHWAY_ACTIONS = [
    { name: "Domestic transport behaviour", categoryId: 1, typeId: 1, pathwayStringIndex: 25, pdf: "/assets/onepage/23.pdf" },
    { name: "Shift to zero emission transport", categoryId: 1, typeId: 1, pathwayStringIndex: 26, pdf: "/assets/onepage/24.pdf" },
    { name: "Choice of fuel cells or batteries", categoryId: 1, typeId: 1, pathwayStringIndex: 27, pdf: "/assets/onepage/FuelCellsOrBatteries.pdf" },
    { name: "Domestic freight", categoryId: 1, typeId: 1, pathwayStringIndex: 28, pdf: "/assets/onepage/25.pdf" },
    { name: "International aviation", categoryId: 1, typeId: 1, pathwayStringIndex: 29, pdf: "/assets/onepage/InternationalAviation.pdf" },
    { name: "International shipping", categoryId: 1, typeId: 1, pathwayStringIndex: 30, pdf: "/assets/onepage/InternationalShipping.pdf" },
    { name: "Average temperature of homes", categoryId: 1, typeId: 1, pathwayStringIndex: 32, pdf: "/assets/onepage/29.pdf" },
    { name: "Home insulation", categoryId: 1, typeId: 1, pathwayStringIndex: 33, pdf: "/assets/onepage/30.pdf" },
    { name: "Home heating electrification", categoryId: 1, typeId: 3, pathwayStringIndex: 34, pdf: "/assets/onepage/31.pdf" },
    { name: "Home heating that isn't electric", categoryId: 1, typeId: 3, pathwayStringIndex: 35, pdf: "/assets/onepage/31.pdf" },
    { name: "Home lighting &amp; appliances", categoryId: 1, typeId: 1, pathwayStringIndex: 37, pdf: "/assets/onepage/34.pdf" },
    { name: "Electrification of home cooking", categoryId: 1, typeId: 3, pathwayStringIndex: 38, pdf: "/assets/onepage/35.pdf" },
    { name: "Growth in industry", categoryId: 1, typeId: 3, pathwayStringIndex: 40, pdf: "/assets/onepage/37.pdf" },
    { name: "Energy intensity of industry", categoryId: 1, typeId: 1, pathwayStringIndex: 41, pdf: "/assets/onepage/38.pdf" },
    { name: "Commercial demand for heating and cooling", categoryId: 1, typeId: 1, pathwayStringIndex: 43, pdf: "/assets/onepage/40.pdf" },
    { name: "Commercial heating electrification", categoryId: 1, typeId: 3, pathwayStringIndex: 44, pdf: "/assets/onepage/31.pdf" },
    { name: "Commercial heating that isn't electric", categoryId: 1, typeId: 3, pathwayStringIndex: 45, pdf: "/assets/onepage/31.pdf" },
    { name: "Commercial lighting &amp; appliances", categoryId: 1, typeId: 1, pathwayStringIndex: 47, pdf: "/assets/onepage/44.pdf" },
    { name: "Electrification of commercial cooking", categoryId: 1, typeId: 3, pathwayStringIndex: 48, pdf: "/assets/onepage/35.pdf" },
    { name: "Nuclear power stations", categoryId: 2, typeId: 1, pathwayStringIndex: 0, pdf: "/assets/onepage/0.pdf" },
    { name: "CCS power stations", categoryId: 2, typeId: 1, pathwayStringIndex: 2, pdf: "/assets/onepage/2.pdf" },
    { name: "CCS power station fuel mix", categoryId: 2, typeId: 3, pathwayStringIndex: 3, pdf: "/assets/onepage/3.pdf" },
    { name: "Offshore wind", categoryId: 2, typeId: 1, pathwayStringIndex: 4, pdf: "/assets/onepage/4.pdf" },
    { name: "Onshore wind", categoryId: 2, typeId: 1, pathwayStringIndex: 5, pdf: "/assets/onepage/5.pdf" },
    { name: "Wave", categoryId: 2, typeId: 1, pathwayStringIndex: 6, pdf: "/assets/onepage/6.pdf" },
    { name: "Tidal Stream", categoryId: 2, typeId: 1, pathwayStringIndex: 7, pdf: "/assets/onepage/TidalStream.pdf" },
    { name: "Tidal Range", categoryId: 2, typeId: 1, pathwayStringIndex: 8, pdf: "/assets/onepage/TidalRange.pdf" },
    { name: "Biomass power stations", categoryId: 2, typeId: 1, pathwayStringIndex: 9, pdf: "/assets/onepage/7.pdf" },
    { name: "Solar panels for electricity", categoryId: 2, typeId: 1, pathwayStringIndex: 10, pdf: "/assets/onepage/8.pdf" },
    { name: "Solar panels for hot water", categoryId: 2, typeId: 1, pathwayStringIndex: 11, pdf: "/assets/onepage/9.pdf" },
    { name: "Geothermal electricity", categoryId: 2, typeId: 1, pathwayStringIndex: 12, pdf: "/assets/onepage/10.pdf" },
    { name: "Hydroelectric power stations", categoryId: 2, typeId: 1, pathwayStringIndex: 13, pdf: "/assets/onepage/11.pdf" },
    { name: "Small-scale wind", categoryId: 2, typeId: 1, pathwayStringIndex: 14, pdf: "/assets/onepage/12.pdf" },
    { name: "Electricity imports", categoryId: 2, typeId: 1, pathwayStringIndex: 15, pdf: "/assets/onepage/13.pdf" },
    { name: "Land dedicated to bioenergy", categoryId: 2, typeId: 1, pathwayStringIndex: 17, pdf: "/assets/onepage/15.pdf" },
    { name: "Livestock and their management", categoryId: 2, typeId: 1, pathwayStringIndex: 18, pdf: "/assets/onepage/16.pdf" },
    { name: "Volume of waste and recycling", categoryId: 2, typeId: 3, pathwayStringIndex: 19, pdf: "/assets/onepage/17.pdf" },
    { name: "Marine algae", categoryId: 2, typeId: 1, pathwayStringIndex: 20, pdf: "/assets/onepage/18.pdf" },
    { name: "Type of fuels from biomass", categoryId: 2, typeId: 3, pathwayStringIndex: 21, pdf: "/assets/onepage/19.pdf" },
    { name: "Bioenergy imports", categoryId: 2, typeId: 1, pathwayStringIndex: 22, pdf: "/assets/onepage/20.pdf" },
    { name: "Geosequestration", categoryId: 3, typeId: 1, pathwayStringIndex: 50, pdf: "/assets/onepage/47.pdf" },
    { name: "Storage, demand shifting &amp; interconnection", categoryId: 3, typeId: 1, pathwayStringIndex: 51, pdf: "/assets/onepage/48.pdf" }
  ];

  var ACTION_CATEGORIES = [
    { "id": 1, "name": "Supply" },
    { "id": 2, "name": "Demand" },
    { "id": 3, "name": "Other" }
  ];

  var ACTION_TYPES = [
    { "id": 1, "name": "rangeInt" },
    { "id": 2, "name": "rangeFloat" },
    { "id": 3, "name": "radio" }
  ];

  /**
   * Represents a single datapoint of a pathway calculation
   *
   * @class Action
   * @param {object} args - arguments object
   * @param {number} args.id - action id
   * @param {number} args.categoryId
   * @param {number} args.typeId
   * @param {number} args.value
   * @param {string} args.info - html string describing action
   * @param {strung} args.pdf - URI of related pdf
   */
  var Action = function(args) {
    var self = this;

    self.name = args.name;
    self.categoryId = args.categoryId;
    self.typeId = args.typeId;
    self.value = ko.observable(args.value || 1);
    self.info = args.info;
    self.pdf = args.pdf;
  };

  /** @lends Action */
  Action.prototype = {
    /** Type of input data provided by action */
    type: function() {},

    /** Category */
    category: function() {},

    /**
     * setter for this.value
     * @param {number} value
     */
    setValue: function(value) {
      this.value = value;
    },

    getTypeName: function() {
      var self = this
      var action = ko.utils.arrayFirst(ACTION_TYPES, function(action) {
        return action.id === self.typeId;
      });
      return action.name
    }
  };

  /** Represents a dataset for a 2050 calculation */
  var Pathway = function(args) {
    var self = this;

    self.actions = ko.observableArray(self.getActions());
    self.chartData = ko.observable();
    ko.computed(function() {
      var pathwayString = self.getPathwayString();

      Ajax.request({
        method: 'GET',
        url: 'http://2050-calculator-tool.decc.gov.uk/pathways/'+pathwayString+'/data',
        onSuccess: function(data){
          var data = JSON.parse(data.response);
          var energyDemandData = data.final_energy_demand;

          var energyDemandChartData = [];
          for(var layerName in energyDemandData) {
            for(var i = 0; i < energyDemandData[layerName].length; i++) {
              var value = energyDemandData[layerName][i];
              var date = 2010 + i * 5
              energyDemandChartData.push({ key: layerName, date: date, value: value });
            }
          }
          self.chartData(energyDemandChartData)
        },
        onError: function(){

        }
      });
    });

  }

  Pathway.prototype = {
    getActions: function() {
      return ko.utils.arrayMap(PATHWAY_ACTIONS, function(action) {
        return new Action(action);
      });
    },

    /** Updates pathway action by name */
    updateAction: function(action) {
      this.actions().forEach(function(a) {
        if(a.name === action.name) {
          a.value = action.value;
        }
      });
    },

    /** Get actions by category id */
    actionsForCategory: function(id) {
      return ko.utils.arrayFilter(this.actions(), function(action) {
        if(action.categoryId === id) {
          return action;
        }
      });
    },

    getPathwayString: function() {
      var magicString = "20244444444432130233122002411110111401203201310420211";

      var index = 25;
      var value = this.actions()[0].value()
      magicString = magicString.substr(0, index) + value + magicString.substr(index + 1);

      return magicString
    }
  };

  /** @returns {array} Array of PathwayCategory instances. */
  Pathway.categories = function() {
    return ACTION_CATEGORIES;
  };

  return Pathway;
});

