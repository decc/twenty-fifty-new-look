define(['knockout', 'dataRequester', 'config', 'chartParser'], function(ko, DataRequester, config, ChartParser) {
  'use strict';

  var PATHWAY_ACTIONS = [
    { name: "Domestic transport behaviour", categoryId: 1, typeId: 1, pathwayStringIndex: 25, tooltips: {
       "1": "In 2050, individuals travel 9% further than today. No noticeable modal shift.",
       "2": "Individuals travel 7% further than today, cars and vans are 80% of 2050 passenger mileage",
       "3": "Individuals travel 7% further than today; cars and vans 74% of 2050 passenger mileage",
       "4": "In 2050, individuals travel the same distance as today. Signficant shift to public transport."
       }, pdf: "/assets/onepage/23.pdf", info: "Hi am info yeah" },

    { name: "Shift to zero emission transport", categoryId: 1, typeId: 1, pathwayStringIndex: 26, tooltips: {
       "1": "By 2050, 20% plug in hybrid electric cars; 2.5% zero emission cars.",
       "2": "By 2050, 54% plug-in hybrid vehicles; 11%  zero emission vehicles, all buses hybrids.",
       "3": "By 2050, 32% plug-in hybrid vehicles; 48% zero emission vehicles; 22% buses electric.",
       "4": "By 2050 100%  zero emission vehiclesl; all passenger trains electrified; 50% bus electrified "
       }, pdf: "/assets/onepage/24.pdf" },

    { name: "Choice of fuel cells or batteries", categoryId: 1, typeId: 1, pathwayStringIndex: 27, tooltips: {
       "1": "100% of zero emission cars use batteries by 2050",
       "2": "Among zero emission cars, 80% use batteries and 20% use fuel cells by 2050",
       "3": "Among zero emission cars, 20% use batteries and 80% use fuel cells by 2050",
       "4": "100% of zero emission cars use fuel cells by 2050"
       }, pdf: "/assets/onepage/FuelCellsOrBatteries.pdf" },

    { name: "Domestic freight", categoryId: 1, typeId: 1, pathwayStringIndex: 28, tooltips: {
       "1": "Road haulage makes up 73% of distance, using conventional engines. Rail all diesel",
       "2": "Some shift from road to rail and water, and more efficient engines",
       "3": "Greater modal shift to rail and water; more efficient HGVs; more efficient logistics",
       "4": "Road modal share falls to half; greater hybridisation. Rail freight is all electric "
       }, pdf: "/assets/onepage/25.pdf" },

    { name: "International aviation", categoryId: 1, typeId: 1, pathwayStringIndex: 29, tooltips: {
       "1": "By 2050, 130% passengers increase; 50% more fuel use",
       "2": "By 2050, 130% passengers increase; 45% more fuel use",
       "3": "By 2050, 130% passengers increase; 31% more fuel use",
       "4": "By 2050, 85% passengers increase; 5% more fuel use"
       }, pdf: "/assets/onepage/InternationalAviation.pdf" },

    { name: "International shipping", categoryId: 1, typeId: 1, pathwayStringIndex: 30, tooltips: {
       "1": "no improvements from energy efficiency; between 2007 and 2050 emissions increase by 139%",
       "2": "1/3 of technical feasible reductions realised; between 2007 and 2050 emissions increase by 78%",
       "3": "2/3 of technical feasible reductions realised; between 2007 and 2050 emissions increase by 16%",
       "4": "maximum technical feasible reductions realised; between 2007 and 2050 emissions decrease by 46%"
       }, pdf: "/assets/onepage/InternationalShipping.pdf" },

    { name: "Average temperature of homes", categoryId: 1, typeId: 1, pathwayStringIndex: 32, tooltips: {
       "1": "Average room temperature increases to 20°C (a 2.5°C increase on 2007)",
       "2": "Average room temperature increases to 18°C (a 0.5°C increase on 2007)",
       "3": "Average room temperature decreases to 17°C (a 0.5°C decrease on 2007)",
       "4": "Average room temperature decreases to 16°C (a 1.5°C decrease on 2007)"
       }, pdf: "/assets/onepage/29.pdf" },

    { name: "Home insulation", categoryId: 1, typeId: 1, pathwayStringIndex: 33, tooltips: {
       "1": "Over 7m homes insulated, average thermal leakiness falls by 25%",
       "2": "Over 8m homes insulated, average thermal leakiness falls by 33%",
       "3": "Over 18m homes insulated, average thermal leakiness falls by 42%",
       "4": "Over 24m homes insulated, average thermal leakiness decreases by 50% "
       }, pdf: "/assets/onepage/30.pdf" },

    { name: "Home heating electrification", categoryId: 1, typeId: 3, value: 'A', pathwayStringIndex: 34, tooltips: {
       "1": "The proportion of domestic heat supplied using electricity is 0-10%, as today",
       "2": "The proportion of new domestic heating systems using electricity is 20%",
       "3": "The proportion of new domestic heating systems supplied using electricity is 30-60%",
       "4": "The proportion of new domestic heating systems supplied using electricity is 80-100%"
       }, pdf: "/assets/onepage/31.pdf" },

    { name: "Home heating that isn't electric", categoryId: 1, typeId: 3, value: 'A', pathwayStringIndex: 35, tooltips: {
       "1": "The dominant non-electric heat source is gas or gas CHP (biogas if available)",
       "2": "The dominant non-electric heat source is coal or coal CHP (biomass if available)",
       "3": "The dominant non-electric heat source is waste heat from power stations",
       "4": "A mixture of gas/biogas; coal/biomass; and heat from power stations"
       }, pdf: "/assets/onepage/31.pdf" },

    { name: "Home lighting &amp; appliances", categoryId: 1, typeId: 1, pathwayStringIndex: 37, tooltips: {
       "1": "Energy demand for domestic lights and appliances increases by 20% (relative to 2007)",
       "2": "Energy demand for domestic lights and appliances is stable",
       "3": "Energy demand for domestic lights and appliances decreases by 40%",
       "4": "Energy demand for domestic lights and appliances decreases by 60%"
       }, pdf: "/assets/onepage/34.pdf" },

    { name: "Electrification of home cooking", categoryId: 1, typeId: 3, value: 'A', max: 2, pathwayStringIndex: 38, tooltips: {
       "1": "Energy used for domestic cooking remains at 63% electricity and 37% gas",
       "2": "Energy used for domestic cooking is entirely electric"


    }, pdf: "/assets/onepage/35.pdf" },

    { name: "Growth in industry", categoryId: 1, typeId: 3, value: 'A', max: 3, pathwayStringIndex: 40, tooltips: {
       "1": "UK industry output more than doubles by 2050",
       "2": "UK industry grows in line with current trends",
       "3": "UK industry output falls 30-40% by 2050"

    }, pdf: "/assets/onepage/37.pdf" },

    { name: "Energy intensity of industry", categoryId: 1, typeId: 1, max: 3, pathwayStringIndex: 41, tooltips: {
       "1": "No electrification of processes, little improvement in energy intensity",
       "2": "Some processes electrified; moderate improvements in process emissions and energy demand",
       "3": "High electrification; CCS captures 48% of emissions; process emissions reduced"

    }, pdf: "/assets/onepage/38.pdf" },

    { name: "Commercial demand for heating and cooling", categoryId: 1, typeId: 1, pathwayStringIndex: 43, tooltips: {
       "1": "Space heating demand increases by 50%, hot water demand by 60%, cooling demand by 250%",
       "2": "Space heating demand increases by 30%, hot water demand by 50%, cooling demand by 60%",
       "3": "Space heating demand stable, hot water demand increases by 25%, cooling demand stable",
       "4": "Space heating demand drops by 25%, hot water demand by 10%, cooling demand by 60%"
       }, pdf: "/assets/onepage/40.pdf" },

    { name: "Commercial heating electrification", categoryId: 1, typeId: 3, value: 'A', pathwayStringIndex: 44, tooltips: {
       "1": "The proportion of non-domestic heat supplied using electricity is 0-10%, as today",
       "2": "The proportion of non-domestic heat supplied using electricity is 20%",
       "3": "The proportion of non-domestic heat supplied using electricity is 30-60%",
       "4": "The proportion of non-domestic heat supplied using electricity is 80-100%"
       }, pdf: "/assets/onepage/31.pdf" },

    { name: "Commercial heating that isn't electric", categoryId: 1, typeId: 3, value: 'A', pathwayStringIndex: 45, tooltips: {
       "1": "The dominant non-electric heat source is gas or gas CHP (biogas if available)",
       "2": "The dominant non-electric heat source is coal or coal CHP (biomass if available)",
       "3": "The dominant non-electric heat source is heat from power stations",
       "4": "A mixture of gas/biogas, coal/biomass, and heat from power stations"
       }, pdf: "/assets/onepage/31.pdf" },

    { name: "Commercial lighting &amp; appliances", categoryId: 1, typeId: 1, pathwayStringIndex: 47, tooltips: {
       "1": "Energy demand for lights & appliances increases by 33%. Energy for cooking is stable",
       "2": "Energy demand for lights & appliances increases by 15%; decreases by 5% for cooking",
       "3": "Energy demand for lights & appliances decreases by 5%; decreases by 20% for cooking",
       "4": "Energy demand for lights & appliances decreases by 30%; decreases by 25% for cooking"
       }, pdf: "/assets/onepage/44.pdf" },

    { name: "Electrification of commercial cooking", categoryId: 1, typeId: 3, value: 'A', max: 2, pathwayStringIndex: 48, tooltips: {
       "1": "60% electricity and 40% gas (no change from 2007)",
       "2": "100% electric"


    }, pdf: "/assets/onepage/35.pdf" },

    { name: "Nuclear power stations", categoryId: 2, typeId: 2, pathwayStringIndex: 0, tooltips: {
       "1": "No new nuclear power installed; estimated closure of final plant in 2035",
       "2": "~13 3GW power stations delivering ~280 TWh/yr",
       "3": "~30 3GW power stations delivering ~630 TWh/yr",
       "4": "~50 3GW power stations delivering ~1030 TWh/yr"
       }, pdf: "/assets/onepage/0.pdf" },

    { name: "CCS power stations", categoryId: 2, typeId: 2, pathwayStringIndex: 2, tooltips: {
       "1": "Demonstration plants only; no roll-out of CCS",
       "2": "~240 TWh/yr from 25-40 CCS power stations; comparable to current gas & coal generation",
       "3": "~340 TWh/yr from 35-60 CCS power stations; comparable to total current demand",
       "4": "~510 TWh/yr  from 50-90 CCS power stations; build rate of gas plants in the 1990s"
       }, pdf: "/assets/onepage/2.pdf" },

    { name: "CCS power station fuel mix", categoryId: 2, typeId: 3, value: 'A', pathwayStringIndex: 3, tooltips: {
       "1": "100% coal/biomass, 0% gas/biogas CCS after demonstration plants",
       "2": "66% coal/biomass, 33% gas/biogas CCS after demonstration plants",
       "3": "33% coal/biomass, 66% gas/biogas CCS after demonstration plants",
       "4": "0% coal/biomas, 100% gas/biogas CCS after demonstration plants"
       }, pdf: "/assets/onepage/3.pdf" },

    { name: "Offshore wind", categoryId: 2, typeId: 2, pathwayStringIndex: 4, tooltips: {
       "1": "~1,400 turbines in 2025, reducing to zero as decommissioned sites are not replanted",
       "2": "~10,000 turbines in 2050, delivering ~180 TWh/yr",
       "3": "~17,000 turbines in 2050, delivering ~310 TWh/yr",
       "4": "~40,000 turbines in 2050, delivering ~430 TWh/yr"
       }, pdf: "/assets/onepage/4.pdf" },

    { name: "Onshore wind", categoryId: 2, typeId: 2, pathwayStringIndex: 5, tooltips: {
       "1": "~4,400 turbines in 2025, reducing to zero as decommissioned sites are not replanted",
       "2": "~8,000 turbines in 2050, delivering ~50 TWh/yr. ",
       "3": "~13,000 turbines in 2050, delivering ~80 TWh/yr",
       "4": "~20,000 turbines in 2050, delivering ~130 TWh/yr"
       }, pdf: "/assets/onepage/5.pdf" },

    { name: "Wave", categoryId: 2, typeId: 2, pathwayStringIndex: 6, tooltips: {
       "1": "None in 2050",
       "2": "~300km of wave farms",
       "3": "~600km of wave farms",
       "4": "~900km of wave farms"
       }, pdf: "/assets/onepage/6.pdf" },

    { name: "Tidal Stream", categoryId: 2, typeId: 2, pathwayStringIndex: 7, tooltips: {
       "1": "None in 2050",
       "2": "1,000 tidal stream turbines",
       "3": "4,700 tidal stream turbines",
       "4": "10,600 tidal stream turbines"
       }, pdf: "/assets/onepage/TidalStream.pdf" },

    { name: "Tidal Range", categoryId: 2, typeId: 2, pathwayStringIndex: 8, tooltips: {
       "1": "None in  2050",
       "2": "3 small tidal range schemes",
       "3": "4 tidal range schemes",
       "4": "8 tidal range schemes"
       }, pdf: "/assets/onepage/TidalRange.pdf" },

    { name: "Biomass power stations", categoryId: 2, typeId: 2, pathwayStringIndex: 9, tooltips: {
       "1": "Only plants built and under construction (0.6GW)",
       "2": "8GW power stations by 2050 delivering 62TWh/yr",
       "3": "12GW power stations by 2050 delivering 100TWh/yr",
       "4": "Over 20GW installed capacity by 2050 delivering 180TWh/yr"
       }, pdf: "/assets/onepage/7.pdf" },

    { name: "Solar panels for electricity", categoryId: 2, typeId: 2, pathwayStringIndex: 10, tooltips: {
       "1": "No significant solar PV capacity is installed",
       "2": "4m2 of photovoltaic panels per person in 2050, supplying ~60 TWh/yr of electricity",
       "3": "5.4m2 of photovoltaic panels per person in 2050, supplying ~80 TWh/yr",
       "4": "9.5m2 of photovoltaic panels per person – all suitable roof and facade space used"
       }, pdf: "/assets/onepage/8.pdf" },

    { name: "Solar panels for hot water", categoryId: 2, typeId: 2, pathwayStringIndex: 11, tooltips: {
       "1": "As today, a negligible proportion of buildings have solar thermal in 2050",
       "2": "~30% of suitable buildings get ~30% of their hot water from solar thermal",
       "3": "All suitable buildings get ~30% of their hot water from solar thermal",
       "4": "All suitable buildings get ~60% of their hot water from solar thermal"
       }, pdf: "/assets/onepage/9.pdf" },

    { name: "Geothermal electricity", categoryId: 2, typeId: 2, pathwayStringIndex: 12, tooltips: {
       "1": "No deployment of geothermal electricity generation",
       "2": "Supply of geothermal electricity grows slowly to 7 TWh/yr in 2035 and is sustained",
       "3": "Supply grows quickly reaching 21 TWh/yr by 2030 and is sustained",
       "4": "Supply grows rapidly reaching 35 TWh/yr by 2030 and is sustained"
       }, pdf: "/assets/onepage/10.pdf" },

    { name: "Hydroelectric power stations", categoryId: 2, typeId: 2, pathwayStringIndex: 13, tooltips: {
       "1": "Supply of electricity is maintained at current levels of 5 TWh/yr",
       "2": "Supply grows slowly, reaching 7 TWh/yr by 2050",
       "3": "Supply grows more quickly, reaching 8 TWh/yr by 2030 and is sustained",
       "4": "Supply grows rapidly reaching 13 TWh/yr by 2035 and is sustained"
       }, pdf: "/assets/onepage/11.pdf" },

    { name: "Small-scale wind", categoryId: 2, typeId: 2, pathwayStringIndex: 14, tooltips: {
       "1": "As today, no discernable supply of electricity from micro-wind turbines",
       "2": "Supply increases to 1.3 TWh/yr by 2020 and is sustained",
       "3": "Installed in all ~450,000 suitable domestic properties; supplies 3.5 TWh/year from 2020",
       "4": "Installed in all suitable domestic and non-domestic sties; 8.9 TWh/year from 2020"
       }, pdf: "/assets/onepage/12.pdf" },

    { name: "Electricity imports", categoryId: 2, typeId: 2, pathwayStringIndex: 15, tooltips: {
       "1": "No electricity imports, other than for balancing",
       "2": "30 TWh/yr of electricity imported from Southern Europe",
       "3": "70 TWh/yr imported from UK 10% share of international desert solar project ",
       "4": "140 TWh/yr imported from UK 20% share of international desert solar project"
       }, pdf: "/assets/onepage/13.pdf" },

    { name: "Land dedicated to bioenergy", categoryId: 2, typeId: 1, pathwayStringIndex: 17, tooltips: {
       "1": "Energy crops and food production similar to today",
       "2": "5% of land used for energy crops",
       "3": "10% of land used for energy crops",
       "4": "17% of land used for energy crops"
       }, pdf: "/assets/onepage/15.pdf" },

    { name: "Livestock and their management", categoryId: 2, typeId: 1, pathwayStringIndex: 18, tooltips: {
       "1": "Livestock numbers increase by 10%",
       "2": "Livestock numbers same as today",
       "3": "Livestock numbers decrease by 10%",
       "4": "Livestock numbers decrease by 20%"
       }, pdf: "/assets/onepage/16.pdf" },

    { name: "Volume of waste and recycling", categoryId: 2, typeId: 3, value: 'A', pathwayStringIndex: 19, tooltips: {
       "1": "Quantity of waste increases 50%; Small increase in rates of recycling and EFW.",
       "2": "Quantity of waste increases 20%; Increase in rates of recycling and EFW.",
       "3": "Quantity of waste increases 33%; Significant increase in rates of recycling and EFW through innovation.",
       "4": "Quantity of waste decreases 20%; Significant increase in rate of recycling."
       }, pdf: "/assets/onepage/17.pdf" },

    { name: "Marine algae", categoryId: 2, typeId: 1, pathwayStringIndex: 20, tooltips: {
       "1": "No development of macro-algae cultivation",
       "2": "Area same as half of natural reserve used, delivering ~4 TWh/yr",
       "3": "Area same as all of natural reserve used, delivering ~9 TWh/yr",
       "4": "Area same as four times natural reserve used, delivering ~46 TWh/yr"
       }, pdf: "/assets/onepage/18.pdf" },

    { name: "Type of fuels from biomass", categoryId: 2, typeId: 3, value: 'A', pathwayStringIndex: 21, tooltips: {
       "1": "Biomass converted to a mixture of solid, liquid and gas biofuels",
       "2": "Biomass mainly converted to solid biofuel",
       "3": "Biomass mainly converted to liquid biofuel",
       "4": "Biomass mainly converted to biogas fuel"
       }, pdf: "/assets/onepage/19.pdf" },

    { name: "Bioenergy imports", categoryId: 2, typeId: 1, pathwayStringIndex: 22, tooltips: {
       "1": "Imported biofuel declines from ~ 4 TWh/yr currently to zero",
       "2": "Up to 70 TWh/yr of imported bioenergy in 2050",
       "3": "Up to 140 TWh/yr of imported bioenergy in 2050",
       "4": "Up to 280 TWh/yr of imported bioenergy in 2050"
       }, pdf: "/assets/onepage/20.pdf" },

    { name: "Geosequestration", categoryId: 3, typeId: 1, pathwayStringIndex: 50, tooltips: {
       "1": "No geosequestration",
       "2": "Carbon dioxide sequestration rate of 1 million tonnes per annum by 2050",
       "3": "Carbon dioxide sequestration rate of ~30 million tonnes per annum by 2050",
       "4": "Carbon dioxide sequestration rate of ~110 million tonnes per annum by 2050"
       }, pdf: "/assets/onepage/47.pdf" },

    { name: "Storage, demand shifting &amp; interconnection", categoryId: 3, typeId: 1, pathwayStringIndex: 51, tooltips: {
       "1": "Today's 3.5 GW storage & 4 GW interconnection with Europe for balancing",
       "2": "4 GW storage & 10 GW interconnection with Europe for balancing",
       "3": "7 GW storage with 2 more pumped storage, 15 GW interconnection & some demand shifting",
       "4": "20 GW storage with large lagoons, 30 GW interconnection & substantial demand shifting"
       }, pdf: "/assets/onepage/48.pdf" }
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

      { category: 'Government Pathways', name: 'Analagous to MARKAL 3.26', slug: 'markal-326-example', values: 'i0g2dd2pp1121f1i0322112004314110433304202304320420121' },
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
    }
  };

  /** Represents a dataset for a 2050 calculation */
  var Pathway = function(args) {
    var args = args || {},
        self = this;


    self.name = args.name;
    self.values = args.values; // TODO: Map values to pathway action values

    // Do not make requests until after all binding updates
    self.locked = ko.observable(true);

    // True between data request and response
    self.updating = ko.observable(false);

    self.actions = ko.observableArray(self.getActions());
    self.chartData = ko.observable({"SummaryChart":3,"OverviewChart":{"Demand":{"2010":[{"key":"Transport","value":706.444106487651},{"key":"Industry","value":487.7606604183711},{"key":"Heating and cooling","value":529.979130446357},{"key":"Lighting & appliances","value":177.42796936210306}],"2015":[{"key":"Transport","value":702.6582914708018},{"key":"Industry","value":502.2347486552872},{"key":"Heating and cooling","value":557.2327171072865},{"key":"Lighting & appliances","value":181.64752039357137}],"2020":[{"key":"Transport","value":706.8346190574152},{"key":"Industry","value":519.1330102384849},{"key":"Heating and cooling","value":592.1540031837183},{"key":"Lighting & appliances","value":185.83085939782245}],"2025":[{"key":"Transport","value":692.2706378601315},{"key":"Industry","value":552.3781274633884},{"key":"Heating and cooling","value":626.0737077944508},{"key":"Lighting & appliances","value":189.81046011329818}],"2030":[{"key":"Transport","value":672.6432254953352},{"key":"Industry","value":591.1091456382231},{"key":"Heating and cooling","value":658.8484009719804},{"key":"Lighting & appliances","value":193.5794282147545}],"2035":[{"key":"Transport","value":688.6111431847137},{"key":"Industry","value":636.5814837378313},{"key":"Heating and cooling","value":679.2981555455385},{"key":"Lighting & appliances","value":198.16407689154263}],"2040":[{"key":"Transport","value":695.4521838470998},{"key":"Industry","value":688.4685409970629},{"key":"Heating and cooling","value":701.254046991792},{"key":"Lighting & appliances","value":202.85659977404066}],"2045":[{"key":"Transport","value":704.6716263596342},{"key":"Industry","value":747.1495474540088},{"key":"Heating and cooling","value":725.2019420085342},{"key":"Lighting & appliances","value":207.74130210103976}],"2050":[{"key":"Transport","value":705.6550995088315},{"key":"Industry","value":813.1263857252409},{"key":"Heating and cooling","value":751.5019494407738},{"key":"Lighting & appliances","value":212.82687278526902}]},"Supply":{"2010":[{"key":"Nuclear fission","value":160.70999999999998},{"key":"Solar","value":0.028059966000000006},{"key":"Wind","value":14.440670099999998},{"key":"Tidal","value":0.0050034246575342495},{"key":"Wave","value":0},{"key":"Geothermal","value":0},{"key":"Hydro","value":5.329728000000001},{"key":"Environmental heat","value":0},{"key":"Bioenergy","value":51.86701468515299},{"key":"Coal","value":477.71797078633944},{"key":"Oil","value":868.1911081134084},{"key":"Natural gas","value":1001.4318635490304}],"2015":[{"key":"Nuclear fission","value":134.9964},{"key":"Solar","value":0.013604831999999999},{"key":"Wind","value":29.3428701},{"key":"Tidal","value":0.020013698630136998},{"key":"Wave","value":0.0030020547945205484},{"key":"Geothermal","value":0},{"key":"Hydro","value":5.329728000000001},{"key":"Environmental heat","value":0},{"key":"Bioenergy","value":58.789808403805374},{"key":"Coal","value":424.29321857088854},{"key":"Oil","value":855.1870235798388},{"key":"Natural gas","value":1080.1732409505273}],"2020":[{"key":"Nuclear fission","value":77.14080000000003},{"key":"Solar","value":0},{"key":"Wind","value":45.35726511600001},{"key":"Tidal","value":0.050034246575342486},{"key":"Wave","value":0.1584417808219177},{"key":"Geothermal","value":0},{"key":"Hydro","value":5.329728000000001},{"key":"Environmental heat","value":0},{"key":"Bioenergy","value":76.59273739822126},{"key":"Coal","value":339.1461187019778},{"key":"Oil","value":859.5939643444532},{"key":"Natural gas","value":1202.7184729043995}],"2025":[{"key":"Nuclear fission","value":25.713600000000014},{"key":"Solar","value":0},{"key":"Wind","value":57.69377964},{"key":"Tidal","value":0.12508561643835608},{"key":"Wave","value":0.39610445205479383},{"key":"Geothermal","value":0},{"key":"Hydro","value":5.329728000000001},{"key":"Environmental heat","value":0},{"key":"Bioenergy","value":82.3234955867832},{"key":"Coal","value":205.75581145406315},{"key":"Oil","value":845.7983560433511},{"key":"Natural gas","value":1389.160504918114}],"2030":[{"key":"Nuclear fission","value":25.713600000000014},{"key":"Solar","value":0},{"key":"Wind","value":48.16934531999999},{"key":"Tidal","value":0.12508561643835608},{"key":"Wave","value":0.39610445205479383},{"key":"Geothermal","value":0},{"key":"Hydro","value":5.329728000000001},{"key":"Environmental heat","value":0},{"key":"Bioenergy","value":88.62506819270084},{"key":"Coal","value":99.17138476620721},{"key":"Oil","value":828.4897394075546},{"key":"Natural gas","value":1575.1707290298789}],"2035":[{"key":"Nuclear fission","value":1.4273915383000717e-14},{"key":"Solar","value":0},{"key":"Wind","value":32.302885319999994},{"key":"Tidal","value":0},{"key":"Wave","value":0},{"key":"Geothermal","value":0},{"key":"Hydro","value":5.329728000000001},{"key":"Environmental heat","value":0},{"key":"Bioenergy","value":93.44163245057703},{"key":"Coal","value":83.07342822723695},{"key":"Oil","value":847.4223190112918},{"key":"Natural gas","value":1728.4313689906198}],"2040":[{"key":"Nuclear fission","value":1.4273915383000717e-14},{"key":"Solar","value":0},{"key":"Wind","value":15.209185319999996},{"key":"Tidal","value":0},{"key":"Wave","value":0},{"key":"Geothermal","value":0},{"key":"Hydro","value":5.329728000000001},{"key":"Environmental heat","value":0},{"key":"Bioenergy","value":98.55180843129874},{"key":"Coal","value":86.83099313468409},{"key":"Oil","value":858.3068752198818},{"key":"Natural gas","value":1861.115383171855}],"2045":[{"key":"Nuclear fission","value":1.4273915383000717e-14},{"key":"Solar","value":0},{"key":"Wind","value":0.08783531999999616},{"key":"Tidal","value":0},{"key":"Wave","value":0},{"key":"Geothermal","value":0},{"key":"Hydro","value":5.329728000000001},{"key":"Environmental heat","value":0},{"key":"Bioenergy","value":103.96477952879702},{"key":"Coal","value":90.7620390292379},{"key":"Oil","value":872.8766716322103},{"key":"Natural gas","value":1998.8032246902233}],"2050":[{"key":"Nuclear fission","value":1.4273915383000717e-14},{"key":"Solar","value":0},{"key":"Wind","value":0.08783531999999616},{"key":"Tidal","value":0},{"key":"Wave","value":0},{"key":"Geothermal","value":0},{"key":"Hydro","value":5.329728000000001},{"key":"Environmental heat","value":0},{"key":"Bioenergy","value":109.68629418399354},{"key":"Coal","value":95.34180448314937},{"key":"Oil","value":880.0818093454258},{"key":"Natural gas","value":2116.5585654929237}]},"Emissions":{"2010":[{"key":"Fuel Combustion","value":529.8539357626967},{"key":"Industrial Processes","value":28.221387041966942},{"key":"Solvent and Other Product Use","value":0},{"key":"Agriculture","value":42.546514044392154},{"key":"Land Use, Land-Use Change and Forestry","value":2.549557736117353},{"key":"Waste","value":15.21267066552306},{"key":"Other","value":0},{"key":"International Aviation and Shipping","value":46.453918754749346},{"key":"Bioenergy credit","value":9.727927159777284},{"key":"Carbon capture","value":0}],"2015":[{"key":"Fuel Combustion","value":519.0912216809867},{"key":"Industrial Processes","value":28.849107848156848},{"key":"Solvent and Other Product Use","value":0},{"key":"Agriculture","value":41.434328453521594},{"key":"Land Use, Land-Use Change and Forestry","value":5.933544988096667},{"key":"Waste","value":13.403677907027117},{"key":"Other","value":0},{"key":"International Aviation and Shipping","value":52.19269100274443},{"key":"Bioenergy credit","value":10.517123416542793},{"key":"Carbon capture","value":2.8350150827586207}],"2020":[{"key":"Fuel Combustion","value":512.0113471704789},{"key":"Industrial Processes","value":29.577156358435555},{"key":"Solvent and Other Product Use","value":0},{"key":"Agriculture","value":39.35507327896009},{"key":"Land Use, Land-Use Change and Forestry","value":9.216509860464468},{"key":"Waste","value":11.596569237935283},{"key":"Other","value":0},{"key":"International Aviation and Shipping","value":58.554128553904185},{"key":"Bioenergy credit","value":12.79496419621321},{"key":"Carbon capture","value":6.678458816949153}],"2025":[{"key":"Fuel Combustion","value":499.0220751561767},{"key":"Industrial Processes","value":30.76521840566169},{"key":"Solvent and Other Product Use","value":0},{"key":"Agriculture","value":39.54933612174254},{"key":"Land Use, Land-Use Change and Forestry","value":12.250768713675887},{"key":"Waste","value":11.407642135495301},{"key":"Other","value":0},{"key":"International Aviation and Shipping","value":63.00928576171873},{"key":"Bioenergy credit","value":14.625774889952798},{"key":"Carbon capture","value":6.538048685217391}],"2030":[{"key":"Fuel Combustion","value":491.5554591671308},{"key":"Industrial Processes","value":32.041869436587156},{"key":"Solvent and Other Product Use","value":0},{"key":"Agriculture","value":39.74705925720606},{"key":"Land Use, Land-Use Change and Forestry","value":13.957206773343671},{"key":"Waste","value":11.10152741287662},{"key":"Other","value":0},{"key":"International Aviation and Shipping","value":67.24417545140071},{"key":"Bioenergy credit","value":15.56931392209922},{"key":"Carbon capture","value":6.403460266271363}],"2035":[{"key":"Fuel Combustion","value":515.1875490713112},{"key":"Industrial Processes","value":33.41323844684092},{"key":"Solvent and Other Product Use","value":0},{"key":"Agriculture","value":39.94833472074909},{"key":"Land Use, Land-Use Change and Forestry","value":14.259955560261957},{"key":"Waste","value":11.133762036208225},{"key":"Other","value":0},{"key":"International Aviation and Shipping","value":72.66360699371727},{"key":"Bioenergy credit","value":16.23297596761511},{"key":"Carbon capture","value":6.274336960887095}],"2040":[{"key":"Fuel Combustion","value":540.8940427149373},{"key":"Industrial Processes","value":34.88588725885888},{"key":"Solvent and Other Product Use","value":0},{"key":"Agriculture","value":40.15325740991062},{"key":"Land Use, Land-Use Change and Forestry","value":13.273591570430609},{"key":"Waste","value":11.101878462443766},{"key":"Other","value":0},{"key":"International Aviation and Shipping","value":76.43181920884129},{"key":"Bioenergy credit","value":16.945394606192757},{"key":"Carbon capture","value":6.260121498214285}],"2045":[{"key":"Fuel Combustion","value":569.0830132910539},{"key":"Industrial Processes","value":36.46684109733335},{"key":"Solvent and Other Product Use","value":0},{"key":"Agriculture","value":40.36192517715779},{"key":"Land Use, Land-Use Change and Forestry","value":12.03013906507904},{"key":"Waste","value":11.007749688815606},{"key":"Other","value":0},{"key":"International Aviation and Shipping","value":79.76691774229698},{"key":"Bioenergy credit","value":17.707880367178213},{"key":"Carbon capture","value":6.136579599107142}],"2050":[{"key":"Fuel Combustion","value":594.0239139746058},{"key":"Industrial Processes","value":38.16362132741505},{"key":"Solvent and Other Product Use","value":0},{"key":"Agriculture","value":40.574438925710965},{"key":"Land Use, Land-Use Change and Forestry","value":11.556420470689867},{"key":"Waste","value":10.851430772830827},{"key":"Other","value":0},{"key":"International Aviation and Shipping","value":81.05235935157397},{"key":"Bioenergy credit","value":18.521203016799703},{"key":"Carbon capture","value":6.017852256923077}]}},"EnergyDemandChart":{"chartLayers":[{"key":"Transport","date":2010,"value":706.444106487651},{"key":"Transport","date":2015,"value":702.6582914708018},{"key":"Transport","date":2020,"value":706.8346190574152},{"key":"Transport","date":2025,"value":692.2706378601315},{"key":"Transport","date":2030,"value":672.6432254953352},{"key":"Transport","date":2035,"value":688.6111431847137},{"key":"Transport","date":2040,"value":695.4521838470998},{"key":"Transport","date":2045,"value":704.6716263596342},{"key":"Transport","date":2050,"value":705.6550995088315},{"key":"Industry","date":2010,"value":487.7606604183711},{"key":"Industry","date":2015,"value":502.2347486552872},{"key":"Industry","date":2020,"value":519.1330102384849},{"key":"Industry","date":2025,"value":552.3781274633884},{"key":"Industry","date":2030,"value":591.1091456382231},{"key":"Industry","date":2035,"value":636.5814837378313},{"key":"Industry","date":2040,"value":688.4685409970629},{"key":"Industry","date":2045,"value":747.1495474540088},{"key":"Industry","date":2050,"value":813.1263857252409},{"key":"Heating and cooling","date":2010,"value":529.979130446357},{"key":"Heating and cooling","date":2015,"value":557.2327171072865},{"key":"Heating and cooling","date":2020,"value":592.1540031837183},{"key":"Heating and cooling","date":2025,"value":626.0737077944508},{"key":"Heating and cooling","date":2030,"value":658.8484009719804},{"key":"Heating and cooling","date":2035,"value":679.2981555455385},{"key":"Heating and cooling","date":2040,"value":701.254046991792},{"key":"Heating and cooling","date":2045,"value":725.2019420085342},{"key":"Heating and cooling","date":2050,"value":751.5019494407738},{"key":"Lighting & appliances","date":2010,"value":177.42796936210306},{"key":"Lighting & appliances","date":2015,"value":181.64752039357137},{"key":"Lighting & appliances","date":2020,"value":185.83085939782245},{"key":"Lighting & appliances","date":2025,"value":189.81046011329818},{"key":"Lighting & appliances","date":2030,"value":193.5794282147545},{"key":"Lighting & appliances","date":2035,"value":198.16407689154263},{"key":"Lighting & appliances","date":2040,"value":202.85659977404066},{"key":"Lighting & appliances","date":2045,"value":207.74130210103976},{"key":"Lighting & appliances","date":2050,"value":212.82687278526902}],"chartLine":[{"date":2010,"value":2579.7214186245888},{"date":2015,"value":2588.1489101904845},{"date":2020,"value":2606.0875624924493},{"date":2025,"value":2612.2964657108046},{"date":2030,"value":2671.1907847848342},{"date":2035,"value":2790.0013619997258},{"date":2040,"value":2925.3439732777197},{"date":2045,"value":3071.8242782004686},{"date":2050,"value":3207.0860368254926}]},"EnergySupplyChart":{"chartLayers":[{"key":"Nuclear fission","date":2010,"value":160.70999999999998},{"key":"Nuclear fission","date":2015,"value":134.9964},{"key":"Nuclear fission","date":2020,"value":77.14080000000003},{"key":"Nuclear fission","date":2025,"value":25.713600000000014},{"key":"Nuclear fission","date":2030,"value":25.713600000000014},{"key":"Nuclear fission","date":2035,"value":1.4273915383000717e-14},{"key":"Nuclear fission","date":2040,"value":1.4273915383000717e-14},{"key":"Nuclear fission","date":2045,"value":1.4273915383000717e-14},{"key":"Nuclear fission","date":2050,"value":1.4273915383000717e-14},{"key":"Solar","date":2010,"value":0.028059966000000006},{"key":"Solar","date":2015,"value":0.013604831999999999},{"key":"Solar","date":2020,"value":0},{"key":"Solar","date":2025,"value":0},{"key":"Solar","date":2030,"value":0},{"key":"Solar","date":2035,"value":0},{"key":"Solar","date":2040,"value":0},{"key":"Solar","date":2045,"value":0},{"key":"Solar","date":2050,"value":0},{"key":"Wind","date":2010,"value":14.440670099999998},{"key":"Wind","date":2015,"value":29.3428701},{"key":"Wind","date":2020,"value":45.35726511600001},{"key":"Wind","date":2025,"value":57.69377964},{"key":"Wind","date":2030,"value":48.16934531999999},{"key":"Wind","date":2035,"value":32.302885319999994},{"key":"Wind","date":2040,"value":15.209185319999996},{"key":"Wind","date":2045,"value":0.08783531999999616},{"key":"Wind","date":2050,"value":0.08783531999999616},{"key":"Tidal","date":2010,"value":0.0050034246575342495},{"key":"Tidal","date":2015,"value":0.020013698630136998},{"key":"Tidal","date":2020,"value":0.050034246575342486},{"key":"Tidal","date":2025,"value":0.12508561643835608},{"key":"Tidal","date":2030,"value":0.12508561643835608},{"key":"Tidal","date":2035,"value":0},{"key":"Tidal","date":2040,"value":0},{"key":"Tidal","date":2045,"value":0},{"key":"Tidal","date":2050,"value":0},{"key":"Wave","date":2010,"value":0},{"key":"Wave","date":2015,"value":0.0030020547945205484},{"key":"Wave","date":2020,"value":0.1584417808219177},{"key":"Wave","date":2025,"value":0.39610445205479383},{"key":"Wave","date":2030,"value":0.39610445205479383},{"key":"Wave","date":2035,"value":0},{"key":"Wave","date":2040,"value":0},{"key":"Wave","date":2045,"value":0},{"key":"Wave","date":2050,"value":0},{"key":"Geothermal","date":2010,"value":0},{"key":"Geothermal","date":2015,"value":0},{"key":"Geothermal","date":2020,"value":0},{"key":"Geothermal","date":2025,"value":0},{"key":"Geothermal","date":2030,"value":0},{"key":"Geothermal","date":2035,"value":0},{"key":"Geothermal","date":2040,"value":0},{"key":"Geothermal","date":2045,"value":0},{"key":"Geothermal","date":2050,"value":0},{"key":"Hydro","date":2010,"value":5.329728000000001},{"key":"Hydro","date":2015,"value":5.329728000000001},{"key":"Hydro","date":2020,"value":5.329728000000001},{"key":"Hydro","date":2025,"value":5.329728000000001},{"key":"Hydro","date":2030,"value":5.329728000000001},{"key":"Hydro","date":2035,"value":5.329728000000001},{"key":"Hydro","date":2040,"value":5.329728000000001},{"key":"Hydro","date":2045,"value":5.329728000000001},{"key":"Hydro","date":2050,"value":5.329728000000001},{"key":"Environmental heat","date":2010,"value":0},{"key":"Environmental heat","date":2015,"value":0},{"key":"Environmental heat","date":2020,"value":0},{"key":"Environmental heat","date":2025,"value":0},{"key":"Environmental heat","date":2030,"value":0},{"key":"Environmental heat","date":2035,"value":0},{"key":"Environmental heat","date":2040,"value":0},{"key":"Environmental heat","date":2045,"value":0},{"key":"Environmental heat","date":2050,"value":0},{"key":"Bioenergy","date":2010,"value":51.86701468515299},{"key":"Bioenergy","date":2015,"value":58.789808403805374},{"key":"Bioenergy","date":2020,"value":76.59273739822126},{"key":"Bioenergy","date":2025,"value":82.3234955867832},{"key":"Bioenergy","date":2030,"value":88.62506819270084},{"key":"Bioenergy","date":2035,"value":93.44163245057703},{"key":"Bioenergy","date":2040,"value":98.55180843129874},{"key":"Bioenergy","date":2045,"value":103.96477952879702},{"key":"Bioenergy","date":2050,"value":109.68629418399354},{"key":"Coal","date":2010,"value":477.71797078633944},{"key":"Coal","date":2015,"value":424.29321857088854},{"key":"Coal","date":2020,"value":339.1461187019778},{"key":"Coal","date":2025,"value":205.75581145406315},{"key":"Coal","date":2030,"value":99.17138476620721},{"key":"Coal","date":2035,"value":83.07342822723695},{"key":"Coal","date":2040,"value":86.83099313468409},{"key":"Coal","date":2045,"value":90.7620390292379},{"key":"Coal","date":2050,"value":95.34180448314937},{"key":"Oil","date":2010,"value":868.1911081134084},{"key":"Oil","date":2015,"value":855.1870235798388},{"key":"Oil","date":2020,"value":859.5939643444532},{"key":"Oil","date":2025,"value":845.7983560433511},{"key":"Oil","date":2030,"value":828.4897394075546},{"key":"Oil","date":2035,"value":847.4223190112918},{"key":"Oil","date":2040,"value":858.3068752198818},{"key":"Oil","date":2045,"value":872.8766716322103},{"key":"Oil","date":2050,"value":880.0818093454258},{"key":"Natural gas","date":2010,"value":1001.4318635490304},{"key":"Natural gas","date":2015,"value":1080.1732409505273},{"key":"Natural gas","date":2020,"value":1202.7184729043995},{"key":"Natural gas","date":2025,"value":1389.160504918114},{"key":"Natural gas","date":2030,"value":1575.1707290298789},{"key":"Natural gas","date":2035,"value":1728.4313689906198},{"key":"Natural gas","date":2040,"value":1861.115383171855},{"key":"Natural gas","date":2045,"value":1998.8032246902233},{"key":"Natural gas","date":2050,"value":2116.5585654929237}],"chartLine":[{"date":2010,"value":1901.6118667144822},{"date":2015,"value":1943.773277626947},{"date":2020,"value":2003.952491877441},{"date":2025,"value":2060.532933231269},{"date":2030,"value":2116.1802003202934},{"date":2035,"value":2202.6548593596262},{"date":2040,"value":2288.0313716099954},{"date":2045,"value":2384.7644179232166},{"date":2050,"value":2483.1103074601156}]},"ElectricityDemandChart":{"chartLayers":[{"key":"Transport","date":2010,"value":8.184036113841765},{"key":"Transport","date":2015,"value":8.24983643454528},{"key":"Transport","date":2020,"value":8.437425412562373},{"key":"Transport","date":2025,"value":10.575653624640855},{"key":"Transport","date":2030,"value":12.560014336163983},{"key":"Transport","date":2035,"value":14.718334265020829},{"key":"Transport","date":2040,"value":16.834310192237837},{"key":"Transport","date":2045,"value":18.69805211754176},{"key":"Transport","date":2050,"value":20.782264626611795},{"key":"Industry","date":2010,"value":130.50824089768997},{"key":"Industry","date":2015,"value":137.03322960724057},{"key":"Industry","date":2020,"value":144.06772446626283},{"key":"Industry","date":2025,"value":155.17870330612678},{"key":"Industry","date":2030,"value":167.07422315693603},{"key":"Industry","date":2035,"value":180.88658764675807},{"key":"Industry","date":2040,"value":196.2510898436492},{"key":"Industry","date":2045,"value":213.32895089017282},{"key":"Industry","date":2050,"value":232.30326501359642},{"key":"Heating and cooling","date":2010,"value":61.477547173328105},{"key":"Heating and cooling","date":2015,"value":60.46804120052823},{"key":"Heating and cooling","date":2020,"value":66.35760349523126},{"key":"Heating and cooling","date":2025,"value":71.97593685048713},{"key":"Heating and cooling","date":2030,"value":77.31785832061637},{"key":"Heating and cooling","date":2035,"value":81.59999487699466},{"key":"Heating and cooling","date":2040,"value":85.78600146523934},{"key":"Heating and cooling","date":2045,"value":89.98941639003723},{"key":"Heating and cooling","date":2050,"value":94.37579291106958},{"key":"Lighting & appliances","date":2010,"value":160.42544870690443},{"key":"Lighting & appliances","date":2015,"value":164.63670739026009},{"key":"Lighting & appliances","date":2020,"value":168.81214477803974},{"key":"Lighting & appliances","date":2025,"value":172.7839092495832},{"key":"Lighting & appliances","date":2030,"value":176.5449480156904},{"key":"Lighting & appliances","date":2035,"value":181.10445293713374},{"key":"Lighting & appliances","date":2040,"value":185.7876640441699},{"key":"Lighting & appliances","date":2045,"value":190.6630469229624},{"key":"Lighting & appliances","date":2050,"value":195.73929047934274}],"chartLine":[{"date":2010,"value":387.53578983301094},{"date":2015,"value":398.05780658703287},{"date":2020,"value":416.63591542237106},{"date":2025,"value":441.1794721712878},{"date":2030,"value":465.87634258727024},{"date":2035,"value":492.53880094784535},{"date":2040,"value":520.8527268021878},{"date":2045,"value":550.9613340699603},{"date":2050,"value":583.7567645739485}]},"ElectricitySupplyChart":{"chartLayers":[{"key":"Biomass/Coal power stations","date":2010,"value":315.1363283423534},{"key":"Biomass/Coal power stations","date":2015,"value":314.0881604766082},{"key":"Biomass/Coal power stations","date":2020,"value":329.6597217689738},{"key":"Biomass/Coal power stations","date":2025,"value":358.3426712377946},{"key":"Biomass/Coal power stations","date":2030,"value":392.51256338377704},{"key":"Biomass/Coal power stations","date":2035,"value":443.95605106784535},{"key":"Biomass/Coal power stations","date":2040,"value":489.3416961771879},{"key":"Biomass/Coal power stations","date":2045,"value":534.5403588249603},{"key":"Biomass/Coal power stations","date":2050,"value":567.3003966039486},{"key":"Domestic space heating and hot water","date":2010,"value":0},{"key":"Domestic space heating and hot water","date":2015,"value":0},{"key":"Domestic space heating and hot water","date":2020,"value":0},{"key":"Domestic space heating and hot water","date":2025,"value":0},{"key":"Domestic space heating and hot water","date":2030,"value":0},{"key":"Domestic space heating and hot water","date":2035,"value":0},{"key":"Domestic space heating and hot water","date":2040,"value":0},{"key":"Domestic space heating and hot water","date":2045,"value":0},{"key":"Domestic space heating and hot water","date":2050,"value":0},{"key":"Commercial heating and cooling","date":2010,"value":0},{"key":"Commercial heating and cooling","date":2015,"value":0},{"key":"Commercial heating and cooling","date":2020,"value":0},{"key":"Commercial heating and cooling","date":2025,"value":0},{"key":"Commercial heating and cooling","date":2030,"value":0},{"key":"Commercial heating and cooling","date":2035,"value":0},{"key":"Commercial heating and cooling","date":2040,"value":0},{"key":"Commercial heating and cooling","date":2045,"value":0},{"key":"Commercial heating and cooling","date":2050,"value":0},{"key":"Unabated thermal generation","date":2010,"value":315.1363283423534},{"key":"Unabated thermal generation","date":2015,"value":314.0881604766082},{"key":"Unabated thermal generation","date":2020,"value":329.6597217689738},{"key":"Unabated thermal generation","date":2025,"value":358.3426712377946},{"key":"Unabated thermal generation","date":2030,"value":392.51256338377704},{"key":"Unabated thermal generation","date":2035,"value":443.95605106784535},{"key":"Unabated thermal generation","date":2040,"value":489.3416961771879},{"key":"Unabated thermal generation","date":2045,"value":534.5403588249603},{"key":"Unabated thermal generation","date":2050,"value":567.3003966039486},{"key":"Carbon Capture Storage (CCS)","date":2010,"value":0},{"key":"Carbon Capture Storage (CCS)","date":2015,"value":5.079787425},{"key":"Carbon Capture Storage (CCS)","date":2020,"value":10.834644510000002},{"key":"Carbon Capture Storage (CCS)","date":2025,"value":10.876743225},{"key":"Carbon Capture Storage (CCS)","date":2030,"value":10.928155815},{"key":"Carbon Capture Storage (CCS)","date":2035,"value":10.95013656},{"key":"Carbon Capture Storage (CCS)","date":2040,"value":10.972117305000001},{"key":"Carbon Capture Storage (CCS)","date":2045,"value":11.003411924999998},{"key":"Carbon Capture Storage (CCS)","date":2050,"value":11.03880465},{"key":"Nuclear power","date":2010,"value":52.596},{"key":"Nuclear power","date":2015,"value":44.18064},{"key":"Nuclear power","date":2020,"value":25.246080000000006},{"key":"Nuclear power","date":2025,"value":8.415360000000005},{"key":"Nuclear power","date":2030,"value":8.415360000000005},{"key":"Nuclear power","date":2035,"value":4.671463216254779e-15},{"key":"Nuclear power","date":2040,"value":4.671463216254779e-15},{"key":"Nuclear power","date":2045,"value":4.671463216254779e-15},{"key":"Nuclear power","date":2050,"value":4.671463216254779e-15},{"key":"Onshore wind","date":2010,"value":10.317757319999997},{"key":"Onshore wind","date":2015,"value":17.549707319999996},{"key":"Onshore wind","date":2020,"value":24.78165732},{"key":"Onshore wind","date":2025,"value":28.963039319999996},{"key":"Onshore wind","date":2030,"value":21.783685319999993},{"key":"Onshore wind","date":2035,"value":14.551735319999997},{"key":"Onshore wind","date":2040,"value":7.319785319999996},{"key":"Onshore wind","date":2045,"value":0.08783531999999616},{"key":"Onshore wind","date":2050,"value":0.08783531999999616},{"key":"Offshore wind","date":2010,"value":4.122912780000003},{"key":"Offshore wind","date":2015,"value":11.793162780000001},{"key":"Offshore wind","date":2020,"value":20.575607796000003},{"key":"Offshore wind","date":2025,"value":28.73074032000001},{"key":"Offshore wind","date":2030,"value":26.385659999999998},{"key":"Offshore wind","date":2035,"value":17.75115},{"key":"Offshore wind","date":2040,"value":7.8894},{"key":"Offshore wind","date":2045,"value":0},{"key":"Offshore wind","date":2050,"value":0},{"key":"Hydroelectric power stations","date":2010,"value":5.329728000000001},{"key":"Hydroelectric power stations","date":2015,"value":5.329728000000001},{"key":"Hydroelectric power stations","date":2020,"value":5.329728000000001},{"key":"Hydroelectric power stations","date":2025,"value":5.329728000000001},{"key":"Hydroelectric power stations","date":2030,"value":5.329728000000001},{"key":"Hydroelectric power stations","date":2035,"value":5.329728000000001},{"key":"Hydroelectric power stations","date":2040,"value":5.329728000000001},{"key":"Hydroelectric power stations","date":2045,"value":5.329728000000001},{"key":"Hydroelectric power stations","date":2050,"value":5.329728000000001},{"key":"Tidal and Wave","date":2010,"value":0.0050034246575342495},{"key":"Tidal and Wave","date":2015,"value":0.023015753424657545},{"key":"Tidal and Wave","date":2020,"value":0.20847602739726018},{"key":"Tidal and Wave","date":2025,"value":0.5211900684931499},{"key":"Tidal and Wave","date":2030,"value":0.5211900684931499},{"key":"Tidal and Wave","date":2035,"value":0},{"key":"Tidal and Wave","date":2040,"value":0},{"key":"Tidal and Wave","date":2045,"value":0},{"key":"Tidal and Wave","date":2050,"value":0},{"key":"Geothermal electricity","date":2010,"value":0},{"key":"Geothermal electricity","date":2015,"value":0},{"key":"Geothermal electricity","date":2020,"value":0},{"key":"Geothermal electricity","date":2025,"value":0},{"key":"Geothermal electricity","date":2030,"value":0},{"key":"Geothermal electricity","date":2035,"value":0},{"key":"Geothermal electricity","date":2040,"value":0},{"key":"Geothermal electricity","date":2045,"value":0},{"key":"Geothermal electricity","date":2050,"value":0},{"key":"Solar PV","date":2010,"value":0.028059966000000006},{"key":"Solar PV","date":2015,"value":0.013604831999999999},{"key":"Solar PV","date":2020,"value":0},{"key":"Solar PV","date":2025,"value":0},{"key":"Solar PV","date":2030,"value":0},{"key":"Solar PV","date":2035,"value":0},{"key":"Solar PV","date":2040,"value":0},{"key":"Solar PV","date":2045,"value":0},{"key":"Solar PV","date":2050,"value":0},{"key":"Non-thermal renewable generation","date":2010,"value":19.803461490657536},{"key":"Non-thermal renewable generation","date":2015,"value":34.70921868542466},{"key":"Non-thermal renewable generation","date":2020,"value":50.89546914339727},{"key":"Non-thermal renewable generation","date":2025,"value":63.54469770849315},{"key":"Non-thermal renewable generation","date":2030,"value":54.02026338849314},{"key":"Non-thermal renewable generation","date":2035,"value":37.63261332},{"key":"Non-thermal renewable generation","date":2040,"value":20.53891332},{"key":"Non-thermal renewable generation","date":2045,"value":5.4175633199999975},{"key":"Non-thermal renewable generation","date":2050,"value":5.4175633199999975},{"key":"Electricity imports","date":2010,"value":0},{"key":"Electricity imports","date":2015,"value":0},{"key":"Electricity imports","date":2020,"value":0},{"key":"Electricity imports","date":2025,"value":0},{"key":"Electricity imports","date":2030,"value":0},{"key":"Electricity imports","date":2035,"value":0},{"key":"Electricity imports","date":2040,"value":0},{"key":"Electricity imports","date":2045,"value":0},{"key":"Electricity imports","date":2050,"value":0}],"chartLine":[{"date":2010,"value":360.59527289176424},{"date":2015,"value":370.3878146325742},{"date":2020,"value":387.6748981520962},{"date":2025,"value":410.51420303083796},{"date":2030,"value":433.4970438294068},{"date":2035,"value":458.30936972590723},{"date":2040,"value":484.65906554529624},{"date":2045,"value":512.6794663207143},{"date":2050,"value":543.2006130306206}]},"EnergyEmissionsChart":{"chartLayers":[{"key":"Fuel Combustion","date":2010,"value":529.8539357626967},{"key":"Fuel Combustion","date":2015,"value":519.0912216809867},{"key":"Fuel Combustion","date":2020,"value":512.0113471704789},{"key":"Fuel Combustion","date":2025,"value":499.0220751561767},{"key":"Fuel Combustion","date":2030,"value":491.5554591671308},{"key":"Fuel Combustion","date":2035,"value":515.1875490713112},{"key":"Fuel Combustion","date":2040,"value":540.8940427149373},{"key":"Fuel Combustion","date":2045,"value":569.0830132910539},{"key":"Fuel Combustion","date":2050,"value":594.0239139746058},{"key":"Industrial Processes","date":2010,"value":28.221387041966942},{"key":"Industrial Processes","date":2015,"value":28.849107848156848},{"key":"Industrial Processes","date":2020,"value":29.577156358435555},{"key":"Industrial Processes","date":2025,"value":30.76521840566169},{"key":"Industrial Processes","date":2030,"value":32.041869436587156},{"key":"Industrial Processes","date":2035,"value":33.41323844684092},{"key":"Industrial Processes","date":2040,"value":34.88588725885888},{"key":"Industrial Processes","date":2045,"value":36.46684109733335},{"key":"Industrial Processes","date":2050,"value":38.16362132741505},{"key":"Solvent and Other Product Use","date":2010,"value":0},{"key":"Solvent and Other Product Use","date":2015,"value":0},{"key":"Solvent and Other Product Use","date":2020,"value":0},{"key":"Solvent and Other Product Use","date":2025,"value":0},{"key":"Solvent and Other Product Use","date":2030,"value":0},{"key":"Solvent and Other Product Use","date":2035,"value":0},{"key":"Solvent and Other Product Use","date":2040,"value":0},{"key":"Solvent and Other Product Use","date":2045,"value":0},{"key":"Solvent and Other Product Use","date":2050,"value":0},{"key":"Agriculture","date":2010,"value":42.546514044392154},{"key":"Agriculture","date":2015,"value":41.434328453521594},{"key":"Agriculture","date":2020,"value":39.35507327896009},{"key":"Agriculture","date":2025,"value":39.54933612174254},{"key":"Agriculture","date":2030,"value":39.74705925720606},{"key":"Agriculture","date":2035,"value":39.94833472074909},{"key":"Agriculture","date":2040,"value":40.15325740991062},{"key":"Agriculture","date":2045,"value":40.36192517715779},{"key":"Agriculture","date":2050,"value":40.574438925710965},{"key":"Land Use, Land-Use Change and Forestry","date":2010,"value":2.549557736117353},{"key":"Land Use, Land-Use Change and Forestry","date":2015,"value":5.933544988096667},{"key":"Land Use, Land-Use Change and Forestry","date":2020,"value":9.216509860464468},{"key":"Land Use, Land-Use Change and Forestry","date":2025,"value":12.250768713675887},{"key":"Land Use, Land-Use Change and Forestry","date":2030,"value":13.957206773343671},{"key":"Land Use, Land-Use Change and Forestry","date":2035,"value":14.259955560261957},{"key":"Land Use, Land-Use Change and Forestry","date":2040,"value":13.273591570430609},{"key":"Land Use, Land-Use Change and Forestry","date":2045,"value":12.03013906507904},{"key":"Land Use, Land-Use Change and Forestry","date":2050,"value":11.556420470689867},{"key":"Waste","date":2010,"value":15.21267066552306},{"key":"Waste","date":2015,"value":13.403677907027117},{"key":"Waste","date":2020,"value":11.596569237935283},{"key":"Waste","date":2025,"value":11.407642135495301},{"key":"Waste","date":2030,"value":11.10152741287662},{"key":"Waste","date":2035,"value":11.133762036208225},{"key":"Waste","date":2040,"value":11.101878462443766},{"key":"Waste","date":2045,"value":11.007749688815606},{"key":"Waste","date":2050,"value":10.851430772830827},{"key":"Other","date":2010,"value":0},{"key":"Other","date":2015,"value":0},{"key":"Other","date":2020,"value":0},{"key":"Other","date":2025,"value":0},{"key":"Other","date":2030,"value":0},{"key":"Other","date":2035,"value":0},{"key":"Other","date":2040,"value":0},{"key":"Other","date":2045,"value":0},{"key":"Other","date":2050,"value":0},{"key":"International Aviation and Shipping","date":2010,"value":46.453918754749346},{"key":"International Aviation and Shipping","date":2015,"value":52.19269100274443},{"key":"International Aviation and Shipping","date":2020,"value":58.554128553904185},{"key":"International Aviation and Shipping","date":2025,"value":63.00928576171873},{"key":"International Aviation and Shipping","date":2030,"value":67.24417545140071},{"key":"International Aviation and Shipping","date":2035,"value":72.66360699371727},{"key":"International Aviation and Shipping","date":2040,"value":76.43181920884129},{"key":"International Aviation and Shipping","date":2045,"value":79.76691774229698},{"key":"International Aviation and Shipping","date":2050,"value":81.05235935157397},{"key":"Bioenergy credit","date":2010,"value":9.727927159777284},{"key":"Bioenergy credit","date":2015,"value":10.517123416542793},{"key":"Bioenergy credit","date":2020,"value":12.79496419621321},{"key":"Bioenergy credit","date":2025,"value":14.625774889952798},{"key":"Bioenergy credit","date":2030,"value":15.56931392209922},{"key":"Bioenergy credit","date":2035,"value":16.23297596761511},{"key":"Bioenergy credit","date":2040,"value":16.945394606192757},{"key":"Bioenergy credit","date":2045,"value":17.707880367178213},{"key":"Bioenergy credit","date":2050,"value":18.521203016799703},{"key":"Carbon capture","date":2010,"value":0},{"key":"Carbon capture","date":2015,"value":2.8350150827586207},{"key":"Carbon capture","date":2020,"value":6.678458816949153},{"key":"Carbon capture","date":2025,"value":6.538048685217391},{"key":"Carbon capture","date":2030,"value":6.403460266271363},{"key":"Carbon capture","date":2035,"value":6.274336960887095},{"key":"Carbon capture","date":2040,"value":6.260121498214285},{"key":"Carbon capture","date":2045,"value":6.136579599107142},{"key":"Carbon capture","date":2050,"value":6.017852256923077}],"chartLine":[]},"FlowsChart":{"nodes":[{"name":"Coal reserves"},{"name":"Coal"},{"name":"Coal imports"},{"name":"Oil reserves"},{"name":"Oil"},{"name":"Oil imports"},{"name":"Gas reserves"},{"name":"Natural Gas"},{"name":"Gas imports"},{"name":"UK land based bioenergy"},{"name":"Bio-conversion"},{"name":"Marine algae"},{"name":"Agricultural 'waste'"},{"name":"Other waste"},{"name":"Solid"},{"name":"Biomass imports"},{"name":"Biofuel imports"},{"name":"Liquid"},{"name":"Gas"},{"name":"Solar"},{"name":"Solar PV"},{"name":"Electricity grid"},{"name":"Solar Thermal"},{"name":"Losses"},{"name":"Over generation / exports"},{"name":"Thermal generation"},{"name":"Nuclear"},{"name":"District heating"},{"name":"CHP"},{"name":"Electricity imports"},{"name":"Wind"},{"name":"Tidal"},{"name":"Wave"},{"name":"Geothermal"},{"name":"Hydro"},{"name":"H2 conversion"},{"name":"H2"},{"name":"Heating and cooling - homes"},{"name":"Road transport"},{"name":"Pumped heat"},{"name":"Heating and cooling - commercial"},{"name":"Industry"},{"name":"Lighting & appliances - homes"},{"name":"Lighting & appliances - commercial"},{"name":"Agriculture"},{"name":"Rail transport"},{"name":"Domestic aviation"},{"name":"National navigation"},{"name":"International aviation"},{"name":"International shipping"},{"name":"Geosequestration"}],"links":[{"source":0,"target":1,"value":63.965},{"source":2,"target":1,"value":31.37680448314937},{"source":3,"target":4,"value":107.70336000383915},{"source":5,"target":4,"value":772.3784493415866},{"source":6,"target":7,"value":82.2325418852722},{"source":8,"target":7,"value":2034.3260236076515},{"source":9,"target":10,"value":17.66729961334454},{"source":12,"target":10,"value":37.423218106806175},{"source":13,"target":10,"value":40.347786623842815},{"source":13,"target":14,"value":14.247989840000002},{"source":1,"target":14,"value":95.34180448314937},{"source":4,"target":17,"value":880.0818093454258},{"source":7,"target":18,"value":2116.5585654929237},{"source":10,"target":14,"value":30.19183129961111},{"source":10,"target":17,"value":7.744845969984376},{"source":10,"target":18,"value":39.59732328273581},{"source":10,"target":23,"value":17.904303791662215},{"source":14,"target":25,"value":32.82867},{"source":18,"target":25,"value":1152.794637318209},{"source":26,"target":25,"value":1.4273915383000717e-14},{"source":25,"target":27,"value":16.14504631825665},{"source":25,"target":21,"value":576.0327660656262},{"source":25,"target":23,"value":593.4454949343261},{"source":30,"target":21,"value":0.08783531999999616},{"source":34,"target":21,"value":5.329728000000001},{"source":21,"target":23,"value":40.55615154332804},{"source":27,"target":41,"value":16.14504631825665},{"source":21,"target":37,"value":60.658172984497085},{"source":18,"target":37,"value":517.9434690774436},{"source":21,"target":40,"value":31.41118473825011},{"source":18,"target":40,"value":141.48912264058296},{"source":21,"target":42,"value":103.40155946528083},{"source":18,"target":42,"value":8.034648284576644},{"source":21,"target":43,"value":92.33773101406193},{"source":18,"target":43,"value":9.052934021349623},{"source":21,"target":41,"value":227.8261992401981},{"source":14,"target":41,"value":106.05754246808083},{"source":17,"target":41,"value":199.26024117013674},{"source":18,"target":41,"value":300.5983185000332},{"source":21,"target":44,"value":4.477065773398354},{"source":14,"target":44,"value":0.8954131546796709},{"source":17,"target":44,"value":3.693579263053642},{"source":18,"target":44,"value":2.1266062423642182},{"source":21,"target":38,"value":13.84226019889534},{"source":17,"target":38,"value":322.0183306963002},{"source":21,"target":45,"value":6.940004427716452},{"source":17,"target":45,"value":7.482590653758216},{"source":17,"target":46,"value":14.785449092646573},{"source":17,"target":47,"value":22.49614487028552},{"source":17,"target":48,"value":188.58168305622323},{"source":17,"target":49,"value":129.50863651300597},{"source":18,"target":23,"value":24.116152691100137}]},"MapChart":{"thermal":[{"key":"0.01 GW geothermal stations","icon":"geothermal","value":0},{"key":"3 GW nuclear power station","icon":"nuclear","value":1},{"key":"1 GW gas standby power stations","icon":"gas-standby","value":0},{"key":"1.2 GW coal gas or biomass power stations with CCS","icon":"coal-gas-biomass-css","value":2},{"key":"2 GW coal gas or biomass power stations without CCS","icon":"without-css","value":47},{"key":"215 kt/y waste to energy conversion facilities","icon":"waste-conversion","value":98}],"land":[{"key":"Hydro","value":52.36363636363635},{"key":"Solar thermal","value":0},{"key":"Solar PV","value":0},{"key":"Micro wind","value":0},{"key":"Onshore wind","value":4.007999999999824},{"key":"Forest","value":27307.440000000002},{"key":"Energy crops","value":3520}],"offshore":[{"key":"Offshore wind","value":0},{"key":"Marine algae","value":0},{"key":"Tidal stream","value":0},{"key":"Tidal range","value":0}],"imports":[{"key":"Solar PV","value":0},{"key":"Biocrops","value":0}],"wave":[{"key":"wave","value":0}]},"AirQualityChart":{"low":23.027647092933996,"high":60.550259470292204},"CostsContextChart":4689.726092371896,"CostsComparedChart":[{"key":"Electricity","value":151.56009919710766},{"key":"Buildings","value":526.6274685835099},{"key":"Bioenergy","value":181.16345114297957},{"key":"Transport","value":2190.776530143956},{"key":"Industry","value":14.621273785724501},{"key":"Other","value":2.3108755661075193},{"key":"Fossil fuels","value":1071.8536601454862},{"key":"Finance","value":550.8127338070236}],"CostsSensitivityChart":4689.726092371896,"CostsSensitivityComponentsChart":[{"key":"Conventional thermal plant","value":{"low":46.28847490608155,"point":85.88612870253374,"high":154.85662156292364,"range":108.56814665684209,"finance_low":0,"finance_point":13.604459610346312,"finance_high":43.39685043689216,"finance_range":43.39685043689216}},{"key":"Combustion + CCS","value":{"low":0.8067007151569467,"point":2.141539455248759,"high":5.067166015582137,"range":4.2604653004251904,"finance_low":0,"finance_point":1.0266025742449374,"finance_high":3.9353041800866584,"finance_range":3.9353041800866584}},{"key":"Nuclear power","value":{"low":1.0603220663865833,"point":3.9106837439061213,"high":6.8716031656694145,"range":5.811281099282831,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},{"key":"Onshore wind","value":{"low":3.8783002320159827,"point":6.968634199052536,"high":13.005094690052978,"range":9.126794458036995,"finance_low":0,"finance_point":3.516143893086919,"finance_high":7.1089059388705245,"finance_range":7.1089059388705245}},{"key":"Offshore wind","value":{"low":7.661063381895302,"point":10.470691870652741,"high":23.97174056453223,"range":16.31067718263693,"finance_low":0,"finance_point":4.324120973333438,"finance_high":13.370146828580548,"finance_range":13.370146828580548}},{"key":"Hydroelectric","value":{"low":0.41873916343628526,"point":2.5665402883905393,"high":6.050439303842557,"range":5.631700140406272,"finance_low":0,"finance_point":0.06477143857307455,"finance_high":1.3318665385655224,"finance_range":1.3318665385655224}},{"key":"Wave and Tidal","value":{"low":0.27818041908682045,"point":0.985134887274277,"high":2.0962143177992982,"range":1.8180338987124778,"finance_low":0,"finance_point":0.32618588553926425,"finance_high":1.058330187932496,"finance_range":1.058330187932496}},{"key":"Geothermal","value":{"low":0,"point":0,"high":0,"range":0,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},{"key":"Distributed solar PV","value":{"low":0.018541861127292735,"point":0.025754240650923445,"high":0.04545499946317862,"range":0.026913138335885888,"finance_low":0,"finance_point":0.0053431376577957245,"finance_high":0.021628391476947572,"finance_range":0.021628391476947572}},{"key":"Distributed solar thermal","value":{"low":0,"point":0,"high":0,"range":0,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},{"key":"Micro wind","value":{"low":0,"point":0,"high":0,"range":0,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},{"key":"Biomatter to fuel conversion","value":{"low":2.937993641689398,"point":25.010633882403486,"high":66.30462060590999,"range":63.36662696422059,"finance_low":0,"finance_point":7.339499294448337,"finance_high":34.710608487522194,"finance_range":34.710608487522194}},{"key":"Bioenergy imports","value":{"low":0.6121956419661735,"point":1.5690962488637503,"high":2.7242706067494717,"range":2.1120749647832984,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},{"key":"Agriculture and land use","value":{"low":1.5373012337217598,"point":13.288596927523542,"high":14.93437620899554,"range":13.397074975273782,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},{"key":"Energy from waste","value":{"low":13.778971111041683,"point":9.427145367957431,"high":9.088353897604325,"range":-4.690617213437358,"finance_low":0,"finance_point":1.5105530596550139,"finance_high":2.529272084508893,"finance_range":2.529272084508893}},{"key":"Waste arising","value":{"low":99.66871454400926,"point":131.86797871623136,"high":191.66661217892957,"range":91.9978976349203,"finance_low":0,"finance_point":15.609953499788718,"finance_high":34.32192755891191,"finance_range":34.32192755891191}},{"key":"Marine algae","value":{"low":0,"point":0,"high":0,"range":0,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},{"key":"Electricity imports","value":{"low":0,"point":0,"high":0,"range":0,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},{"key":"Electricity Exports","value":{"low":-5.660055663713776e-15,"point":-2.0715803729192417e-14,"high":-4.867647870793848e-14,"range":-4.30164230442247e-14,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},{"key":"Electricity grid distribution","value":{"low":18.039345119622684,"point":37.232486994000176,"high":156.9642127061766,"range":138.92486758655392,"finance_low":0,"finance_point":9.073870117765402,"finance_high":115.46736184752505,"finance_range":115.46736184752505}},{"key":"Storage, demand shifting, backup","value":{"low":0.633007851936372,"point":1.3725048153978467,"high":2.745856318969156,"range":2.1128484670327836,"finance_low":0,"finance_point":0.13665799354044642,"finance_high":0.36887152514719956,"finance_range":0.36887152514719956}},{"key":"H2 Production","value":{"low":0,"point":0,"high":0,"range":0,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},{"key":"Domestic heating","value":{"low":225.89047977256203,"point":266.3164493190898,"high":341.3932499054986,"range":115.50277013293655,"finance_low":0,"finance_point":52.357378747515064,"finance_high":135.85746352111968,"finance_range":135.85746352111968}},{"key":"Domestic insulation","value":{"low":1.6165212602831227,"point":6.139289851640341,"high":13.4205921204588,"range":11.804070860175678,"finance_low":0,"finance_point":3.9751175295641925,"finance_high":15.668581619898797,"finance_range":15.668581619898797}},{"key":"Commercial heating and cooling","value":{"low":172.1250800178779,"point":204.80157815844092,"high":265.486504240694,"range":93.36142422281608,"finance_low":0,"finance_point":65.97742044849241,"finance_high":143.885818521637,"finance_range":143.885818521637}},{"key":"Domestic lighting, appliances, and cooking","value":{"low":41.64321700701359,"point":48.61730694767805,"high":62.46482551052039,"range":20.821608503506802,"finance_low":0,"finance_point":16.923019334572487,"finance_high":38.45559062762307,"finance_range":38.45559062762307}},{"key":"Commercial lighting, appliances, and catering","value":{"low":0,"point":0,"high":0,"range":0,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},{"key":"Industrial processes","value":{"low":0,"point":0,"high":0,"range":0,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},{"key":"Conventional cars and buses","value":{"low":1149.7759050622653,"point":1545.6204343076506,"high":1758.3171759480508,"range":608.5412708857855,"finance_low":0,"finance_point":264.11340055971624,"finance_high":585.8299744133058,"finance_range":585.8299744133058}},{"key":"Hybrid cars and buses","value":{"low":141.05052389044985,"point":216.9019279687953,"high":394.8363770868995,"range":253.78585319644966,"finance_low":0,"finance_point":36.808538669730346,"finance_high":121.91665902827665,"finance_range":121.91665902827665}},{"key":"Electric cars and buses","value":{"low":18.086393072107597,"point":29.3893925483542,"high":58.96655314618764,"range":40.880160074080045,"finance_low":0,"finance_point":6.500704477174481,"finance_high":23.974167447560205,"finance_range":23.974167447560205}},{"key":"Fuel cell cars and buses","value":{"low":0,"point":0,"high":0,"range":0,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},{"key":"Bikes","value":{"low":77.41710607537891,"point":89.36106635431592,"high":111.54270687234174,"range":34.12560079696283,"finance_low":0,"finance_point":8.588201062754422,"finance_high":20.631574986895615,"finance_range":20.631574986895615}},{"key":"Rail","value":{"low":98.18218284633225,"point":107.87258815256132,"high":125.62413332694172,"range":27.441950480609464,"finance_low":0,"finance_point":0.7481820541224874,"finance_high":1.4254732568787765,"finance_range":1.4254732568787765}},{"key":"Domestic aviation","value":{"low":13.193954569047953,"point":14.395687714122175,"high":16.627477840688574,"range":3.4335232716406203,"finance_low":0,"finance_point":5.673618178411933,"finance_high":11.714649834214647,"finance_range":11.714649834214647}},{"key":"Domestic freight","value":{"low":176.89147575137204,"point":187.23543309815653,"high":191.43300771921187,"range":14.54153196783983,"finance_low":0,"finance_point":19.92058442769432,"finance_high":35.09066160842508,"finance_range":35.09066160842508}},{"key":"International aviation","value":{"low":0,"point":0,"high":0,"range":0,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},{"key":"International shipping (maritime bunkers)","value":{"low":0,"point":0,"high":0,"range":0,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},{"key":"Geosequestration","value":{"low":0,"point":0,"high":0,"range":0,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},{"key":"Petroleum refineries","value":{"low":12.730760740700434,"point":14.621273785724501,"high":18.132226583626345,"range":5.40146584292591,"finance_low":0,"finance_point":1.7390789496572263,"finance_high":4.555717430158785,"finance_range":4.555717430158785}},{"key":"Fossil fuel transfers","value":{"low":22.807501365170573,"point":30.896784950403497,"high":45.91438210379296,"range":23.106880738622387,"finance_low":0,"finance_point":9.735608139059764,"finance_high":24.07322626662832,"finance_range":24.07322626662832}},{"key":"District heating effective demand","value":{"low":0.5576624493784013,"point":0.7528443066608419,"high":1.1153248987568025,"range":0.5576624493784013,"finance_low":0,"finance_point":0.19321576018669515,"finance_high":0.5242455107154504,"finance_range":0.5242455107154504}},{"key":"Storage of captured CO2","value":{"low":2.5543608290919395,"point":2.3108755661075193,"high":4.489692295105629,"range":1.935331466013689,"finance_low":0,"finance_point":1.020503990391572,"finance_high":2.9221506895053952,"finance_range":2.9221506895053952}},{"key":"Coal","value":{"low":23.96917640696169,"point":27.6135189215732,"high":33.08003269349047,"range":9.110856286528781,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},{"key":"Oil","value":{"low":375.54928494876197,"point":547.428171958114,"high":679.6858261954567,"range":304.1365412466947,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},{"key":"Gas","value":{"low":324.2638273073946,"point":465.91518431539544,"high":635.8968127249965,"range":311.6329854176019,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},{"key":"Finance cost","value":{"low":0,"point":550.8127338070236,"high":1424.1470287688635,"range":1424.1470287688635,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}}]});
    ko.computed(function() {
      var pathwayString = self.getPathwayString();
      if(!self.locked()) {
        self.updating(true);
        DataRequester.pathway(pathwayString, function(data){
          var data = JSON.parse(data.response);
          self.chartParser = new ChartParser(data);

          self.chartData(self.chartParser.all());

          self.updating(false);
        });
      }
    });

  }

  Pathway.prototype = {
    lock: function() {
      this.locked(true);
    },

    toggle: function(data, event){
      console.log(event.target);
    },

    unlock: function() {
      this.locked(false);
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

    setActionsFromPathwayString: function(magicString) {
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
    return example ? new Pathway(example) : null;
  };

  /** @returns {string} Default pathway values as bitwise string */
  Pathway.defaultValues = function() {
    return '10111111111111110111111001111110111101101101110110111';
  };

  return Pathway;
});
