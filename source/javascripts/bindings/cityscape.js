define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.cityscape = {
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
          var levelEls = [].slice.call(element.querySelectorAll(this.selector));

          // order by data-value if set

          if(levelEls[0] && levelEls[0].getAttribute('data-value')) {
            levelEls.sort(function(a, b) {
              var aValue = a.getAttribute('data-value');
              var bValue = b.getAttribute('data-value');

              return (aValue < bValue) ? 1 : -1;
            });
          }

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

        /** @returns {integer} - level value for levelAction value */
        findLevel: function(levels, levelAction) {
          return levels[Helpers.getValue(levelAction)];
        },

        /** @returns {integer} - pathway action value */
        // OPTIMIZE: cache results
        getValue: function(levelAction) {
          var value = pathway.findAction(levelAction).value();
          var vals = [null, 'A', 'B', 'C', 'D'];

          if(value*1 === value) {
            value = Math.round(value);
          } else {
            value = vals.indexOf(value);
          }

          return value;
        },

        /**
         * Sets data-value attribute based on level and levelAction value
         * to be used within elements[key]
         *
         * @example Helpers.setDataValue.call(elements.key)
         * @returns {integer} level value
         */
        setDataValue: function() {
          var el = document.getElementById(this.elementId);
          var levels = (this.levels) ? this.levels : Helpers.defaultLevels;
          var value = Helpers.findLevel(levels, this.levelAction);

          el.setAttribute('data-value', value);

          return value;
        },

        // used in .setDataValues
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
       * elements.key.levels: element count / value at each level.
       *   0 = 2015 (default)
       *   1..4 = action values 1..4
       *
       * elements.key.levelAction {string} - action name which controls level
       * required to use Helpers.showEls
       *
       * elements.key.selector {string} - selector for elements in cityscape
       * required to use Helpers.showEls
       *
       * elements.key.fn: updater method. Sets elements states in cityscape
       * if !fn then Helpers.showEls is used
       *
       * elements.key can have other properties depending on variations.
       * e.g. cars can be electric or not, and also hydrogen / something
       */
      var elements = [
        {
          //cars

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
          hydrogen: {
            0: 0,
            1: 0,
            2: 0.25,
            3: 0.166, // why does this go down?
            4: 1
          },

          fn: function() {
            // domestic transport behaviour
            var carEls = Helpers.showEls.call(this);

            // how many of these cars are zero emissions
            var percentEcoCars = Helpers.findLevel(this.optionalExtras, 'Shift to zero emission transport');
            var numEcoCars = Math.round(carEls.length * percentEcoCars);

            // get how many of these zero emmissions cars are hydrogen powered
            var percentHydrogen = Helpers.findLevel(this.hydrogen, 'Choice of fuel cells or batteries');
            var numHydrogenCars = Math.round(numEcoCars * percentHydrogen);

            // make some cars eco
            for(var i = 0, l = carEls.length; i < l; i++) {
              var car = carEls[i];

              car.classList.remove('electric');
              car.classList.remove('hydrogen');

              if(i < numEcoCars) {
                // eco of some type
                if(i < numHydrogenCars) {
                  car.classList.add('hydrogen');
                } else {
                  car.classList.add('electric');
                }
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
          levelAction: 'Domestic freight'
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
          // carriages of train
          levels: {
            0: 2,
            1: 3,
            2: 4,
            3: 5,
            4: 6
          },

          selector: '.carriage',
          levelAction: 'Domestic freight'
        },

        {
          // bikes
          levels: {
            0: 0,
            1: 0,
            2: 1,
            3: 3,
            4: 5
          },

          selector: '.bike',
          levelAction: 'Domestic transport behaviour'
        },

        {
          // busses
          levels: {
            0: 0,
            1: 0,
            2: 1,
            3: 3,
            4: 5
          },

          eco: {
            0: 0,
            1: 0,
            2: 1,
            3: 1,
            4: 1
          },

          selector: '.bus',
          levelAction: 'Domestic transport behaviour',

          // % of 0 emmissions cars which use hydrogen(rather than electric)
          hydrogen: {
            0: 0,
            1: 0,
            2: 0.25,
            3: 0.166, // why does this go down?
            4: 1
          },

          // OPTIMIZE: same as cars
          fn: function() {
            // domestic transport behaviour
            var busEls = Helpers.showEls.call(this);

            // how many of these cars are zero emissions
            var percentEcoBusses = Helpers.findLevel(this.eco, 'Shift to zero emission transport');
            var numEcoBusses = Math.round(busEls.length * percentEcoBusses);

            // get how many of these zero emmissions cars are hydrogen powered
            var percentHydrogen = Helpers.findLevel(this.hydrogen, 'Shift to zero emission transport');
            var numHydrogenCars = Math.round(numEcoBusses * percentHydrogen);

            // first numEcoCars cars get class eco
            // first numHydrogenCars ecoCars get class hydrogen
            // make some cars eco
            for(var i = 0, l = busEls.length; i < l; i++) {
              var car = busEls[i];

              car.classList.remove('electric');
              car.classList.remove('hydrogen');

              if(i < numEcoBusses) {
                // eco of some type
                if(i < numHydrogenCars) {
                  car.classList.add('hydrogen');
                } else {
                  car.classList.add('electric');
                }
              }

            }
          }
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

          selector: '.airplane',
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
          // home temp + aircon
          elementId: 'thermometer',
          levelAction: 'Average temperature of homes',

          fn: function() {
            var value = Helpers.setDataValue.call(this);

            var aircon = document.getElementById('home-fan');

            if(value >=3) {
              aircon.classList.add('is-active');
            } else {
              aircon.classList.remove('is-active');
            }
          }
        },

        {
          fn: function() {
            // bulb
            var bulb = document.getElementById('bulb');

            // get value
            // if led add class led
            var value = Helpers.getValue('Home lighting & appliances');

            if(value > 2) {
              bulb.classList.add('led');
            } else {
              bulb.classList.remove('led');
            }
          }
        },

        {
          fn: function() {
            // home boiler
            var bulb = document.getElementById('boiler');

            // get value
            // if led add class led
            var value = Helpers.getValue('Home heating electrification');

            if(value > 2) {
              bulb.classList.add('electric');
            } else {
              bulb.classList.remove('electric');
            }
          }
        },

        {
          // commercial aircon
          levels: {
            0: 2,
            1: 3,
            2: 6,
            3: 2,
            4: 1
          },

          selector: '.commercial-fan',
          levelAction: 'Commercial demand for heating and cooling'
        },

        {
          // landfill
          elementId: 'landfill',
          levelAction: 'Volume of waste and recycling',
          fn: function() {
            Helpers.setDataValue.call(this);
          }
        },

        {
          // factory growth
          elementId: 'factory',
          levelAction: 'Growth in industry',

          fn: function() {
            Helpers.setDataValue.call(this);
          }
        },

        {
          // solar electric commercial
          selector: '.commercial-solar.left .solar',
          levels: {
            0: 0,
            1: 0,
            2: 3,
            3: 6,
            4: 6
          },
          levelAction: 'Solar panels for electricity',
        },

        {
          // solar water commercial
          selector: '.commercial-solar.right .solar',
          levels: {
            0: 0,
            1: 0,
            2: 3,
            3: 0,
            4: 0
          },
          levelAction: 'Solar panels for hot water',
        },

        {
          // solar electric home
          levelAction: 'Solar panels for electricity',
          selector: '.home-solar.left .solar',
          levels: {
            0: 1,
            1: 1,
            2: 2,
            3: 2,
            4: 2
          },

          fn: function() {
            Helpers.showEls.call(this);

            var value = Helpers.getValue(this.levelAction);

            // show first 3 field solars
            var field = document.getElementById('solar-field');
            var pannels = field.querySelectorAll('.solar');

            for(var i = 0, l = 3; i < l; i++) {
              var pannel = pannels[i];
              if(value === 4) {
                pannel.classList.add('is-active');
              } else {
                pannel.classList.remove('is-active');
              }
            }
          }
        },

        {
          // solar water home
          levelAction: 'Solar panels for hot water',
          selector: '.home-solar.right .solar',
          levels: {
            0: 1,
            1: 1,
            2: 2,
            3: 2,
            4: 2
          },

          fn: function() {
            Helpers.showEls.call(this);

            var value = Helpers.getValue(this.levelAction);

            // show first 3 field solars
            var field = document.getElementById('solar-field');
            var pannels = field.querySelectorAll('.solar');

            for(var i = 3, l = 6; i < l; i++) {
              var pannel = pannels[i];
              if(value === 4) {
                pannel.classList.add('is-active');
              } else {
                pannel.classList.remove('is-active');
              }
            }
          }
        },

        {
          // solar water home
          levelAction: 'Solar panels for hot water',
          selector: '.home-solar.right .solar',
          levels: {
            0: 1,
            1: 1,
            2: 2,
            3: 2,
            4: 2
          },

          fn: function() {
            Helpers.showEls.call(this);
          }
        },

        // crops
        {
          levels: {
            0: 1,
            1: 1,
            2: 10,
            3: 20,
            4: 34
          },

          levelAction: 'Land dedicated to bioenergy',
          selector: '.biocrop'
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
          selector: '.windfarm.sea .turbine'
        },

        {
          // recycle bins
          levels: {
            0: 1,
            1: 1,
            2: 2,
            3: 2,
            4: 3
          },

          selector: '.bin',
          levelAction: 'Volume of waste and recycling'
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
          selector: '.windfarm.land .turbine'
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

          // TODO: change fuel type

          levelAction: 'Biomass power stations',
          selector: '.bioenergy'
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
          selector: '.commercial-turbine'
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
        },

        {
          // Home cooker
          elementId: 'home-cooker',
          levelAction: 'Electrification of home cooking',

          fn: function() {
            Helpers.setDataValue.call(this);
          }
        },

        {
          // Commercial cooker
          elementId: 'commercial-cooker',
          levelAction: 'Electrification of commercial cooking',

          fn: function() {
            Helpers.setDataValue.call(this);
          }
        },

        {
          // nuculear power
          levels: {
            0: 0,
            1: 0,
            2: 3,
            3: 7,
            4: 10
          },

          selector: '.nuclear',
          levelAction: 'Nuclear power stations'
        },

        {
          // CCS power stations
          levels: {
            0: 0,
            1: 0,
            2: 6,
            3: 9,
            4: 14
          },

          // % coal
          fuel: {
            0: 0,
            1: 1,
            2: 0.666,
            3: 0.333,
            4: 0
          },

          selector: '.ccs',
          levelAction: 'CCS power stations',

          fn: function() {
            var ccs = Helpers.showEls.call(this);
            var percentCoal = Helpers.findLevel(this.fuel, 'CCS power station fuel mix');
            var numCoal = Math.round(ccs.length * percentCoal);

            for(var i = 0, plant; plant = ccs[i]; i++) {
              if(i < numCoal) {
                plant.classList.add('coal');
              } else {
                plant.classList.remove('coal');
              }
            }
          }
        },

        {
          // blob in sea
          levelAction: 'Marine algae',
          elementId: 'algae',

          fn: function() {
            Helpers.setDataValue.call(this);
          }
        },

        {
          // arrow in sea
          levelAction: 'Bioenergy imports',
          elementId: 'bioenergy-imports',

          fn: function() {
            Helpers.setDataValue.call(this);
          }
        }
      ];

      // Kick it off
      // call all shower functions in elements (elements[i].fn)
      for(var i = 0, l = elements.length; i < l; i++) {
        var value = elements[i];
        if(value.fn) {
          value.fn();
        } else {
          // if value.fn not set, call default function on value
          Helpers.showEls.call(value);
        }
      }

    }
  }
});

