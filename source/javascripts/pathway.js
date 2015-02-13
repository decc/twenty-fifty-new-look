define(['knockout', 'ajax', 'config', 'chartParser'], function(ko, Ajax, config, ChartParser) {
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
    { name: "Home heating electrification", categoryId: 1, typeId: 3, value: 'A', pathwayStringIndex: 34, pdf: "/assets/onepage/31.pdf" },
    { name: "Home heating that isn't electric", categoryId: 1, typeId: 3, value: 'A', pathwayStringIndex: 35, pdf: "/assets/onepage/31.pdf" },
    { name: "Home lighting &amp; appliances", categoryId: 1, typeId: 1, pathwayStringIndex: 37, pdf: "/assets/onepage/34.pdf" },
    { name: "Electrification of home cooking", categoryId: 1, typeId: 3, value: 'A', max: 2, pathwayStringIndex: 38, pdf: "/assets/onepage/35.pdf" },
    { name: "Growth in industry", categoryId: 1, typeId: 3, value: 'A', max: 3, pathwayStringIndex: 40, pdf: "/assets/onepage/37.pdf" },
    { name: "Energy intensity of industry", categoryId: 1, typeId: 1, max: 3, pathwayStringIndex: 41, pdf: "/assets/onepage/38.pdf" },
    { name: "Commercial demand for heating and cooling", categoryId: 1, typeId: 1, pathwayStringIndex: 43, pdf: "/assets/onepage/40.pdf" },
    { name: "Commercial heating electrification", categoryId: 1, typeId: 3, value: 'A', pathwayStringIndex: 44, pdf: "/assets/onepage/31.pdf" },
    { name: "Commercial heating that isn't electric", categoryId: 1, typeId: 3, value: 'A', pathwayStringIndex: 45, pdf: "/assets/onepage/31.pdf" },
    { name: "Commercial lighting &amp; appliances", categoryId: 1, typeId: 1, pathwayStringIndex: 47, pdf: "/assets/onepage/44.pdf" },
    { name: "Electrification of commercial cooking", categoryId: 1, typeId: 3, value: 'A', max: 2, pathwayStringIndex: 48, pdf: "/assets/onepage/35.pdf" },
    { name: "Nuclear power stations", categoryId: 2, typeId: 2, pathwayStringIndex: 0, pdf: "/assets/onepage/0.pdf" },
    { name: "CCS power stations", categoryId: 2, typeId: 2, pathwayStringIndex: 2, pdf: "/assets/onepage/2.pdf" },
    { name: "CCS power station fuel mix", categoryId: 2, typeId: 3, value: 'A', pathwayStringIndex: 3, pdf: "/assets/onepage/3.pdf" },
    { name: "Offshore wind", categoryId: 2, typeId: 2, pathwayStringIndex: 4, pdf: "/assets/onepage/4.pdf" },
    { name: "Onshore wind", categoryId: 2, typeId: 2, pathwayStringIndex: 5, pdf: "/assets/onepage/5.pdf" },
    { name: "Wave", categoryId: 2, typeId: 2, pathwayStringIndex: 6, pdf: "/assets/onepage/6.pdf" },
    { name: "Tidal Stream", categoryId: 2, typeId: 2, pathwayStringIndex: 7, pdf: "/assets/onepage/TidalStream.pdf" },
    { name: "Tidal Range", categoryId: 2, typeId: 2, pathwayStringIndex: 8, pdf: "/assets/onepage/TidalRange.pdf" },
    { name: "Biomass power stations", categoryId: 2, typeId: 2, pathwayStringIndex: 9, pdf: "/assets/onepage/7.pdf" },
    { name: "Solar panels for electricity", categoryId: 2, typeId: 2, pathwayStringIndex: 10, pdf: "/assets/onepage/8.pdf" },
    { name: "Solar panels for hot water", categoryId: 2, typeId: 2, pathwayStringIndex: 11, pdf: "/assets/onepage/9.pdf" },
    { name: "Geothermal electricity", categoryId: 2, typeId: 2, pathwayStringIndex: 12, pdf: "/assets/onepage/10.pdf" },
    { name: "Hydroelectric power stations", categoryId: 2, typeId: 2, pathwayStringIndex: 13, pdf: "/assets/onepage/11.pdf" },
    { name: "Small-scale wind", categoryId: 2, typeId: 2, pathwayStringIndex: 14, pdf: "/assets/onepage/12.pdf" },
    { name: "Electricity imports", categoryId: 2, typeId: 2, pathwayStringIndex: 15, pdf: "/assets/onepage/13.pdf" },
    { name: "Land dedicated to bioenergy", categoryId: 2, typeId: 1, pathwayStringIndex: 17, pdf: "/assets/onepage/15.pdf" },
    { name: "Livestock and their management", categoryId: 2, typeId: 1, pathwayStringIndex: 18, pdf: "/assets/onepage/16.pdf" },
    { name: "Volume of waste and recycling", categoryId: 2, typeId: 3, value: 'A', pathwayStringIndex: 19, pdf: "/assets/onepage/17.pdf" },
    { name: "Marine algae", categoryId: 2, typeId: 1, pathwayStringIndex: 20, pdf: "/assets/onepage/18.pdf" },
    { name: "Type of fuels from biomass", categoryId: 2, typeId: 3, value: 'A', pathwayStringIndex: 21, pdf: "/assets/onepage/19.pdf" },
    { name: "Bioenergy imports", categoryId: 2, typeId: 1, pathwayStringIndex: 22, pdf: "/assets/onepage/20.pdf" },
    { name: "Geosequestration", categoryId: 3, typeId: 1, pathwayStringIndex: 50, pdf: "/assets/onepage/47.pdf" },
    { name: "Storage, demand shifting &amp; interconnection", categoryId: 3, typeId: 1, pathwayStringIndex: 51, pdf: "/assets/onepage/48.pdf" }
  ];

  var ACTION_CATEGORIES = [
    { "id": 1, "name": "Demand" },
    { "id": 2, "name": "Supply" },
    { "id": 3, "name": "Other" }
  ];

  var ACTION_TYPES = [
    { "id": 1, "name": "rangeInt" },
    { "id": 2, "name": "rangeFloat" },
    { "id": 3, "name": "radio" }
  ];

  var EXAMPLES = [
      { category: 'Extreme Pathways', name: 'Doesn\'t tackle climate change', slug: 'blank-example', values: '10111111111111110111111001111110111101101101110110111' },
      { category: 'Extreme Pathways', name: 'Maximum demand, no supply', slug: 'max-demand-no-supply-example', values: '10111111111111110111111004424440444404204304440420111' },
      { category: 'Extreme Pathways', name: 'Maximum supply, no demand', slug: 'max-supply-no-demand-example', values: '40444444444444440443424001121110111101102101110110111' },
      { category: 'Extreme Pathways', name: 'Nathans example', slug: 'nathans-example', values: '40111111211111110324132004314110434104103204440410111' },
      { category: 'Extreme Pathways', name: 'Jolyons example', slug: 'nathans-example', values: 'q0111111211111110324132004314110434104103204440410111' },

      { category: 'Government Pathways', name: 'Analagous to MARKAL 3.26', slug: 'markal-326-example', values: 'i0g2dd2pp1121f1i032211p004314110433304202304320420121' },
      { category: 'Government Pathways', name: 'Higher renewables, more energy efficiency', slug: 'high-renewables-more-energy-effficiency-example', values: 'e0d3jrg221ci12110222112004423220444404202304440420141' },
      { category: 'Government Pathways', name: 'Higher nuclear, less energy efficiency', slug: 'high-nuclear-less-energy-effficiency-example', values: 'r013ce1111111111042233B002322220233302202102330220121' },
      { category: 'Government Pathways', name: 'Higher CCS, more bioenergy', slug: 'high-css-more-bioenergy-example', values: 'f023df111111111f0322123003223220333203102303430310221' },
      { category: 'Government Pathways', name: 'Low cost pathway', slug: 'low-cost-example', values: 'q011111111111111032413l004314110434104103204440410111' },

      { category: '3rd Party Pathways', name: 'Friends of the Earth', slug: 'friends-of-the-earth-example', values: '10h4nn4431w23y110244111004424440343304202304430420441' },
      { category: '3rd Party Pathways', name: 'Campaign to Protect Rural England', slug: 'campaign-to-protect-rural-england', values: '10h2pdppp12332130233122004414430343304102304430410231' },
      { category: '3rd Party Pathways', name: 'Mark Brinkley', slug: 'mark-brinkley', values: '20222144411341110343321003422440423404203203340420141' },
      { category: '3rd Party Pathways', name: 'National Grid', slug: 'national-grid', values: 'h0h2gg1211cj1j110322222003313230234102102203440320121' },
      { category: '3rd Party Pathways', name: 'Atkins', slug: 'atkins-example', values: 'g0f2oj11t1rgqj1j0343111003324240244104201304430420231' }
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
    self.min = args.min || 1;
    self.max = args.max || 4;
    self.step = args.step || 1;
    self.info = args.info;
    self.pdf = config.apiUrl + args.pdf;
    self.pathwayStringIndex = args.pathwayStringIndex;
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
    var args = args || {},
        self = this;


    self.name = args.name;
    self.values = args.values; // TODO: Map values to pathway action values

    // Do not make requests until after all binding updates
    self.locked = true;

    self.actions = ko.observableArray(self.getActions());
    self.chartParser = new ChartParser();
    self.chartData = ko.observable();
    ko.computed(function() {
      var pathwayString = self.getPathwayString();

      if(!self.locked) {
        Ajax.request({
          method: 'GET',
          url: config.apiUrl + '/pathways/' + pathwayString+'/data',
          onSuccess: function(data){
            var data = JSON.parse(data.response);
            var energyDemandChartData = self.chartParser.energyDemand(data.final_energy_demand, data.primary_energy_supply);
            self.chartData(energyDemandChartData);
          },
          onError: function(){}
      }
    });

  }

  Pathway.prototype = {
    lock: function() {
      this.locked = true;
    },

    unlock: function() {
      this.locked = false;
      this.actions.valueHasMutated();
    },

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

    getMagicChar: function(char) {
      if(typeof(char) === "number") {
        var mapping = { '0.0': 0, '1.0': 1, '1.1': "b", '1.2': "c", '1.3': "d", '1.4': "e", '1.5': "f", '1.6': "g", '1.7': "h", '1.8': "i", '1.9': "j", '2.0': 2, '2.1': "l", '2.2': "m", '2.3': "n", '2.4': "o", '2.5': "p", '2.6': "q", '2.7': "r", '2.8': "s", '2.9': "t", '3.0': 3, '3.1': "v", '3.2': "w", '3.3': "x", '3.4': "y", '3.5': "z", '3.6': "A", '3.7': "B", '3.8': "C", '3.9': "D", '4.0': 4 };
        char = mapping[char.toFixed(1)];
      } else if(typeof(char) === "string") {
        char = char.charCodeAt() - 64;
      }
      return char;
    },

    getActionFromMagicChar: function(char, actionType) {
      if(actionType === "rangeFloat") {
        var mapping = { '0': 0.0, '1': 1.0, 'b': 1.1, 'c': 1.2, 'd': 1.3, 'e': 1.4, 'f': 1.5, 'g': 1.6, 'h': 1.7, 'i': 1.8, 'j': 1.9, '2': 2.0, 'l': 2.1, 'm': 2.2, 'n': 2.3, 'o': 2.4, 'p': 2.5, 'q': 2.6, 'r': 2.7, 's': 2.8, 't': 2.9, '3': 3.0, 'v': 3.1, 'w': 3.2, 'x': 3.3, 'y': 3.4, 'z': 3.5, 'A': 3.6, 'B': 3.7, 'C': 3.8, 'D': 3.9, '4': 4.0 };
        var value = mapping[char];

      } else if(actionType === "radio") {
        var value = String.fromCharCode(parseInt(char) + 64);
      } else {
        var value = parseInt(char);
      }
      return value;
    },

    setPathwayString: function(magicString) {
      var magicStringLength = 53;
      var actions = this.actions();

      this.lock();

      for(var i = 0; i < magicStringLength; i++) {
        // search for correct action at this point in pathway string
        for(var j = 0; j < actions.length; j++) {
          if(actions[j].pathwayStringIndex === i) {
            actions[j].value(this.getActionFromMagicChar(magicString[i], actions[j].getTypeName()));
          }
        }
      }

      this.unlock();
    },

    getPathwayString: function() {
      var magicString = "";
      var magicStringLength = 53;
      var actions = this.actions();

      // i in pathway string
      var found = false;
      for(var i = 0; i < magicStringLength; i++) {
        // search for correct action at this point in pathway string
        for(var j = 0; j < actions.length; j++) {
          if(actions[j].pathwayStringIndex === i) {
            magicString += this.getMagicChar(actions[j].value());
            found = true;
          }
        }
        // Zero fill unused string indices
        if(!found) {
          magicString += 0;
        }
        found = false;
      }

      // MagicString has a 1 at the end
      var magicString = magicString.substring(0, magicString.length - 1) + 1;

      return magicString
    }
  };

  /** @returns {array} Array of PathwayCategory instances. */
  Pathway.categories = function() {
    return ACTION_CATEGORIES;
  };

  /** @returns {array} Pathway categories */
  Pathway.exampleCategories = function() {
    var exampleCategories = [];
    Pathway.examples().map(function(example) {
      // Don't duplicate
      if(exampleCategories.indexOf(example.category) === -1) {
        exampleCategories.push(example.category);
      }
    });
    return exampleCategories;
  };

    /** @returns {array} Pathway examples (all or by category) */
  Pathway.examples = function(category) {
    if(typeof category === "undefined") {
      return EXAMPLES;
    } else {
      // Search by category
      var examples = EXAMPLES;
      examples.filter(function(example) {
        example.category === category
      });
      debugger
      return examples;
    }
  };

  /** @returns {object|null} Pathway instance if found else null */
  Pathway.find = function(slug) {
    // find example by slug
    var example = ko.utils.arrayFirst(Pathway.examples(), function(ex) {
      if(ex.slug === slug) {
        return ex;
      }
    });
    console.log(example)
    return example ? new Pathway(example) : null;
  };

  /** @returns {string} Default pathway values as bitwise string */
  Pathway.defaultValues = function() {
    return '10111111111111110111111001111110111101101101110110111';
  };

  return Pathway;
});

