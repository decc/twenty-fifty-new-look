define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.cityscape = {
    init: function(element, valueAccessor, allBindings) {
    },

    update: function(element, valueAccessor, allBindings) {
      var pathway = valueAccessor()();

      if(!pathway) { return; }

      var activeClass = 'is-active';

      var Helpers = {
        /**
         * Shows correct num of els for each element type
         * to be used within elements[key]
         *
         * @example Helpers.showEls.call(this)
         * @returns {array} active els
         */
        showEls: function() {
          var count = Helpers.findLevel(this.levels, this.levelAction);
          var levelEls = element.querySelectorAll(this.selector);

          var out = [];

          for(var i = 0, el; el = levelEls[i]; i++) {
            if(i < count) {
              el.classList.add(activeClass);
              out.push(el);
            } else {
              el.classList.remove(activeClass);
            }
          }

          return out;
        },

        findLevel: function(levels, levelAction) {
          return levels[pathway.findAction(levelAction).value()];
        },

        setDataValue: function() {
          var el = document.getElementById(this.elementId);

          var levels = (this.levels) ? this.levels : Helpers.defaultLevels;

          var value = Helpers.findLevel(levels, this.levelAction);

          el.setAttribute('data-value', value);

          return value;
        },

        defaultLevels: {
          0: 1,
          1: 2,
          2: 3,
          3: 4,
          4: 5
        }
      };

      /**
       * Represents elements of cityscape.
       *
       * elements.key: is element type e.g. 'cars'
       *
       * element.key.levels: element count / value at each level.
       *   0 = 2015 (default)
       *   1..4 = action values 1..4
       *
       * elements.key.levelAction {string} - action name which controls level
       * required to use Helpers.showEls
       *
       * elements.key.selector {string} - selector for elements in cityscape
       * required to use Helpers.showEls
       *
       * element.key.fn: updater method. Sets elements states in cityscape
       * if !fn then Helpers.showEls is used
       *
       * elements.key can have other properties depending on variations.
       * e.g. cars can be electric or not, and also hydrogen / something
       */
      var elements = [
        {
          levels: {
            0: 9,
            1: 10,
            2: 8,
            3: 6,
            4: 4
          },

          levelAction: 'Domestic transport behaviour',
          selector: '.car',

          // % of 0 emissions cars
          optionalExtras: {
            0: 0,
            1: 0.2,
            2: 0.6,
            3: 0.8,
            4: 1
          },

          // % of 0 emmissions cars which use hydrogen(rather than electric)
          powerSource: {
            0: 0,
            1: 0,
            2: 0.25,
            3: 0.833,
            4: 1
          },

          hydrogen: {
            0: 0,
            1: 0,
            2: 0.25,
            3: 0.166, // why does this go down?
            4: 1
          },

          fn: function() {
            // TODO: Busses and bikes

            // domestic transport behaviour
            var carEls = Helpers.showEls.call(this);

            // how many of these cars are zero emissions
            var percentEcoCars = Helpers.findLevel(this.optionalExtras, 'Shift to zero emission transport');
            var numEcoCars = Math.round(carEls.length * percentEcoCars);

            // get how many of these zero emmissions cars are hydrogen powered
            var percentHydrogen = Helpers.findLevel(this.hydrogen, 'Choice of fuel cells or batteries');
            var numHydrogenCars = Math.round(numEcoCars * percentHydrogen);

            // first numEcoCars cars get class eco
            // first numHydrogenCars ecoCars get class hydrogen
            for(var i = 0; i < numEcoCars; i++) {
              var car = carEls[i];

              car.classList.add('eco');

              if(i < numHydrogenCars) {
                car.classList.add('hydrogen');
              }
            }
          }
        },

        // domestic freight
        // TODO: 3 depend on same input. this could be cleaner
        {
          levels: {
            0: 3,
            1: 7,
            2: 5,
            3: 4,
            4: 3
          },

          selector: '.lorry',
          levelAction: 'Domestic freight',
        },

        {
          levels: {
            0: 1,
            1: 2,
            2: 3,
            3: 4,
            4: 5
          },

          selector: '.boat',
          levelAction: 'Domestic freight'
        },

        {
          // carrages of train
          levels: {
            0: 2,
            1: 3,
            2: 4,
            3: 5,
            4: 6
          },

          selector: '.carrage',
          levelAction: 'Domestic freight'
        },

        {
          // planes
          levels: {
            0: 2,
            1: 5,
            2: 5,
            3: 5,
            4: 4
          },

          selector: '.plane',
          levelAction: 'International aviation'
        },


        {
          // boats
          levels: {
            0: 2,
            1: 2,
            2: 3,
            3: 4,
            4: 5
          },

          green: {
            0: 0,
            1: 0,
            2: 1,
            3: 2,
            4: 4
          },

          selector: '.boat',
          levelAction: 'International shipping',

          fn: function() {
            var boats = Helpers.showEls.call(this);

            // make some green
            var greenCount = Helpers.findLevel(this.green, this.levelAction);

            for(var i = 0, boat; boat = boats[i]; i++) {
              if(i < greenCount) {
                boat.classList.add('green')
              } else {
                boat.classList.remove('green');
              }
            }
          }
        },

        {
          // home temp
          elementId: 'thermometer',
          levelAction: 'Average temperature of homes',

          fn: function() {
            Helpers.setDataValue.call(this);

            // TODO: aircon?!
          }
        },

        // crops
        {
          levels: {
            0: 1,
            1: 1,
            2: 4,
            3: 10,
            4: 17
          },

          levelAction: 'Land dedicated to bioenergy',
          selector: '.crop'
        },

        // cows
        {
          levels: {
            0: 4,
            1: 5,
            2: 4,
            3: 3,
            4: 2
          },

          levelAction: 'Livestock and their management',
          selector: '.cow'
        },

        {
          levels: {
            0: 0,
            1: 2,
            2: 6,
            3: 10,
            4: 22
          },

          levelAction: 'Offshore wind',
          selector: '.offshore-wind'
        },

        {
          levels: {
            0: 0,
            1: 1,
            2: 4,
            3: 8,
            4: 11
          },

          levelAction: 'Onshore wind',
          selector: '.onshore-wind'
        },

        // tidal stream
        {
          levels: {
            0: 0,
            1: 0,
            2: 1,
            3: 3,
            4: 5
          },

          levelAction: 'Tidal Stream',
          selector: '.tidal-stream'
        },

        // tidal range
        {
          levels: {
            0: 0,
            1: 0,
            2: 1,
            3: 3,
            4: 5
          },

          levelAction: 'Tidal Range',
          selector: '.tidal-range'
        },

        // biomass power
        {
          levels: {
            0: 1,
            1: 1,
            2: 3,
            3: 7,
            4: 10
          },

          levelAction: 'Biomass power stations',
          selector: '.biomass-power'
        },

        // geothermal wells
        {
          levels: {
            0: 0,
            1: 0,
            2: 1,
            3: 3,
            4: 5
          },

          levelAction: 'Geothermal electricity',
          selector: '.geothermal'
        },

        // dams
        {
          levels: {
            0: 0,
            1: 0,
            2: 1,
            3: 1,
            4: 2
          },

          levelAction: 'Hydroelectric power stations',
          selector: '.dam'
        },

        // small wind
        {
          levels: {
            0: 0,
            1: 0,
            2: 5,
            3: 7,
            4: 9
          },

          levelAction: 'Small-scale wind',
          selector: '.small-wind'
        },

        // arrow in the sea
        {
          elementId: 'electricity-imports',
          levelAction: 'Electricity imports',

          fn: function() {
            Helpers.setDataValue.call(this);
          }
        },

        {
          // house walls
          elementId: 'insulation',
          levelAction: 'Home insulation',

          fn: function() {
            Helpers.setDataValue.call(this);
          }

        },

        {
          // Energy intensity of industry
          elementId: 'commercial-meter',
          levelAction: 'Energy intensity of industry',

          fn: function() {
            Helpers.setDataValue.call(this);
          }
        },

        {
          // Home meter
          elementId: 'home-meter',
          levelAction: 'Home lighting & appliances',

          fn: function() {
            Helpers.setDataValue.call(this);
          }
        }
      ];

      // call all shower functions in elements (elements[i].fn)
      for(var i = 0, l = elements.length; i < l; i++) {
        var value = elements[i];
        if(value.fn) {
          value.fn();
        } else {
          // if value.function not set, call default on value
          Helpers.showEls.call(value);
        }
      }

    }
  }
});

