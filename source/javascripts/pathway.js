define(['knockout', 'dataRequester', 'config', 'chartParser', 'action', 'hasher', 'data/pathwayData'],
  function(ko, DataRequester, config, ChartParser, Action, hasher, PathwayData) {

  'use strict';

  /** Represents a dataset for a 2050 calculation */
  var Pathway = function(args) {
    var args = args || {},
        self = this;

    // check values are probably valid (server does not check this)
    self.valid = true;

    self.name = args.name;
    self.values = ko.observable(args.values); // TODO: Map values to pathway action values

    // Do not make requests until after all binding updates
    self.locked = ko.observable(true);

    // True between data request and response
    self.updating = ko.observable(false);

    self.actions = ko.observableArray(self.getActions());
    self.chartData = ko.observable({});

    ko.computed(function() {
      var pathwayString = self.getPathwayString();
      if(!self.locked()) {
        self.updating(true);

        DataRequester.pathway(pathwayString, function(data){
          var data = JSON.parse(data.responseText);
          self.chartParser = new ChartParser(data);
          self.chartData(self.chartParser.all());
          self.validateValues();

          self.values(self.getPathwayString());
          self.updating(false);
        });
      }
    });

    self.setActionsFromPathwayString();

    self.targetReached = ko.computed(function() {
      return self.chartData()['SummaryChart'] >= 80;
    });

    // make this work... replace this.values?!?!?!?
    self.shareString = ko.computed(function() {
      return [config.siteUrl, 'share', self.values()].join('/');
    });
  }

  Pathway.prototype = {
    validateValues: function() {
      var values = this.values();

      if(!/^[0-9a-z]+$/.test(values) || values.length !== 53) {
        hasher.replaceHash('not-found');
      }
    },

    /** is pathway and example or mine? */
    isMine: function() {
      return (this.name === 'Your pathway');
    },

    /** find action by slug*/
    findAction: function(slug) {
      var actions = this.actions();
      var found;

      actions.forEach(function(action) {
        if(action.name === slug) {
          return found = action;
        }
      });

      return found || false;
    },

    lock: function() {
      this.locked(true);
    },

    toggle: function(data, event){
    },

    unlock: function() {
      this.locked(false);
      this.actions.valueHasMutated();
    },

    getActions: function() {
      return ko.utils.arrayMap(PathwayData.PATHWAY_ACTIONS, function(action) {
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

    setActionsFromPathwayString: function() {
      var magicStringLength = 53;
      var actions = this.actions();

      this.lock();

      var self = this;

      for(var i = 0; i < magicStringLength; i++) {
        // search for correct action at this point in pathway string
        for(var j = 0, l = actions.length; j < l; j++) {
          if(actions[j].pathwayStringIndex === i) {
            actions[j].value(this.getActionFromMagicChar(self.values()[i], actions[j].getTypeName()));
          }
        }
      }

      this.unlock();
    },

    // TODO: cache this?
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
    return PathwayData.ACTION_CATEGORIES;
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
    var EXAMPLES = PathwayData.EXAMPLES;

    if(typeof category === "undefined") {
      return EXAMPLES;
    } else {
      // Search by category
      var examples = EXAMPLES;
      return examples.filter(function(example) {
        return (example.category === category)
      });
    }
  };

  /** @returns {object|null} Pathway instance if found */
  Pathway.find = function(slug) {
    // Find example by slug
    var example = ko.utils.arrayFirst(Pathway.examples(), function(ex) {
      if(ex.slug === slug) {
        return ex;
      }
    });
    return example ? new Pathway(example) : null;
  };

  /** @returns {string} Default pathway values as magical string */
  Pathway.defaultValues = function() {
    return '10111111111111110111111001111110111101101101110110111';
  };

  return Pathway;
});

