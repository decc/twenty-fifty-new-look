define(['knockout', 'config'], function(ko, config) {
  'use strict';

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
    self.min = args.min || 1;
    self.max = args.max || 4;
    self.step = args.step || 1;
    self.info = args.info;
    self.pdf = config.apiUrl + args.pdf;
    self.pathwayStringIndex = args.pathwayStringIndex;
    self.tooltips = args.tooltips;
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
    },
    
    getMaxValue: function(){
      var self = this;
      
      // if we're a radio we're A-D
      if(self.getTypeName() == 'radio'){
        var map = { 1 : "A", 2: "B", 3: "C", 4: "D" }
        return map[self.max];
      } else {
        return self.max;
      }
    },
    
    getMedValue: function(){
      var self = this;
      
      if(self.max > 2){
        
        if(self.getTypeName() == 'radio'){
          return self.max < 4 ? "B" : "C";
        } else {
          return self.max < 4 ? 2 : 3;
        }
      } else { return false; }
    }
    
  };

  return Action;

});

