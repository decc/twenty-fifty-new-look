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

  var PathwayCategory = function(args) {
    var self = this;

    self.id = args.id;
    self.name = args.name;
  }

  PathwayCategory.prototype = {
    /**
     * @returns {array} Array of action instances representing category
     * actions
     */
    actions: function() {
      var self = this;

      return ko.utils.arrayFilter(PATHWAY_ACTIONS, function(action) {
        if(action.categoryId === self.id) {
          return new Action(action);
        }
      });
    }
  };

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

    self.id = args.id;
    self.categoryId = args.categoryId;
    self.typeId = args.typeId;
    self.value = args.value;
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
    var self = this;

    self.actions = [self.getActions()];
  }

  Pathway.prototype = {
    getActions: function() {
      ko.utils.arrayMap(PATHWAY_ACTIONS, function(action) {
        return new Action(action);
      });
    }
  };

  /** @returns {array} Array of PathwayCategory instances. */
  Pathway.categories = function() {
    return ko.utils.arrayMap(ACTION_CATEGORIES, function(category) {
      return new PathwayCategory(category);
    });
  };

  return Pathway;
});

