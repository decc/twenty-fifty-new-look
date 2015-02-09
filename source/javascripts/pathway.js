define(['knockout'], function(ko) {
  'use strict';

  var PATHWAY_ACTIONS = [
    { name: 'Domestic transport behaviour', categoryId: 1, typeId: 1, info: 'lorem', pdf: 'http://2050-calculator-tool.decc.gov.uk/assets/onepage/23.pdf' },
    { name: 'Nuclear power stations', categoryId: 2, typeId: 1, info: 'lorem', pdf: 'http://2050-calculator-tool.decc.gov.uk/assets/onepage/23.pdf' },
    { name: 'Geosequestration', categoryId: 3, typeId: 1, info: 'lorem', pdf: 'http://2050-calculator-tool.decc.gov.uk/assets/onepage/23.pdf' }
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

  var EXAMPLES = [
    { name: 'Nathans example', slug: 'nathans-example', values: '111232321132323' }
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
    self.value = ko.observable(args.value || 0);
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
    }
  };

  /** Represents a dataset for a 2050 calculation */
  var Pathway = function(args) {
    var args = args || {},
        self = this;

    self.name = args.name;
    self.values = args.values; // TODO: Map values to pathway action values

    self.actions = self.getActions();
  }

  Pathway.prototype = {
    getActions: function() {
      return ko.utils.arrayMap(PATHWAY_ACTIONS, function(action) {
        return new Action(action);
      });
    },

    /** Updates pathway action by name */
    updateAction: function(action) {
      this.actions.forEach(function(a) {
        if(a.name === action.name) {
          a.value = action.value;
        }
      });
    },

    /** Get actions by category id */
    actionsForCategory: function(id) {
      return ko.utils.arrayFilter(this.actions, function(action) {
        if(action.categoryId === id) {
          return action;
        }
      });
    }
  };

  /** @returns {array} Array of PathwayCategory instances. */
  Pathway.categories = function() {
    return ACTION_CATEGORIES;
  };

  /** @returns {object|null} Pathway instance if found else null */
  Pathway.find = function(slug) {
    // find example by slug
    var example = ko.utils.arrayFirst(EXAMPLES, function(ex) {
      if(ex.slug === slug) {
        return ex;
      }
    });

    return example ? new Pathway(example) : null;
  };

  /** @returns {string} Default pathway values as bitwise string */
  Pathway.defaultValues = function() {
    return null; // TODO: return default values
  };

  return Pathway;
});

