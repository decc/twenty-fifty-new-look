define(['knockout', 'dataRequester', 'config', 'chartParser', 'action'],
  function(ko, DataRequester, config, ChartParser, Action) {

  'use strict';

  var PATHWAY_ACTIONS = [
    { name: "Domestic transport behaviour", categoryId: 1, typeId: 1, pathwayStringIndex: 25, tooltips: {
       "1": "In 2050, individuals travel 9% further than today. No noticeable modal shift.",
       "2": "Individuals travel 7% further than today, cars and vans are 80% of 2050 passenger mileage",
       "3": "Individuals travel 7% further than today; cars and vans 74% of 2050 passenger mileage",
       "4": "In 2050, individuals travel the same distance as today. Signficant shift to public transport."
     }, pdf: "/assets/onepage/23.pdf", info: "demand/domestic-transport-behaviour" },

    { name: "Shift to zero emission transport", categoryId: 1, typeId: 1, pathwayStringIndex: 26, tooltips: {
       "1": "By 2050, 20% plug in hybrid electric cars; 2.5% zero emission cars.",
       "2": "By 2050, 54% plug-in hybrid vehicles; 11%  zero emission vehicles, all buses hybrids.",
       "3": "By 2050, 32% plug-in hybrid vehicles; 48% zero emission vehicles; 22% buses electric.",
       "4": "By 2050 100%  zero emission vehiclesl; all passenger trains electrified; 50% bus electrified "
     }, pdf: "/assets/onepage/24.pdf", info: "demand/shift-to-zero-emission-transport" },

    { name: "Choice of fuel cells or batteries", categoryId: 1, typeId: 1, pathwayStringIndex: 27, tooltips: {
       "1": "100% of zero emission cars use batteries by 2050",
       "2": "Among zero emission cars, 80% use batteries and 20% use fuel cells by 2050",
       "3": "Among zero emission cars, 20% use batteries and 80% use fuel cells by 2050",
       "4": "100% of zero emission cars use fuel cells by 2050"
     }, pdf: "/assets/onepage/FuelCellsOrBatteries.pdf", info: "demand/choice-of-fuel-cells-or-batteries" },

    { name: "Domestic freight", categoryId: 1, typeId: 1, pathwayStringIndex: 28, tooltips: {
       "1": "Road haulage makes up 73% of distance, using conventional engines. Rail all diesel",
       "2": "Some shift from road to rail and water, and more efficient engines",
       "3": "Greater modal shift to rail and water; more efficient HGVs; more efficient logistics",
       "4": "Road modal share falls to half; greater hybridisation. Rail freight is all electric "
     }, pdf: "/assets/onepage/25.pdf", info: "demand/domestic-freight" },

    { name: "International aviation", categoryId: 1, typeId: 1, pathwayStringIndex: 29, tooltips: {
       "1": "By 2050, 130% passengers increase; 50% more fuel use",
       "2": "By 2050, 130% passengers increase; 45% more fuel use",
       "3": "By 2050, 130% passengers increase; 31% more fuel use",
       "4": "By 2050, 85% passengers increase; 5% more fuel use"
     }, pdf: "/assets/onepage/InternationalAviation.pdf", info: "demand/international-aviation" },

    { name: "International shipping", categoryId: 1, typeId: 1, pathwayStringIndex: 30, tooltips: {
       "1": "no improvements from energy efficiency; between 2007 and 2050 emissions increase by 139%",
       "2": "1/3 of technical feasible reductions realised; between 2007 and 2050 emissions increase by 78%",
       "3": "2/3 of technical feasible reductions realised; between 2007 and 2050 emissions increase by 16%",
       "4": "maximum technical feasible reductions realised; between 2007 and 2050 emissions decrease by 46%"
     }, pdf: "/assets/onepage/InternationalShipping.pdf", info: "demand/international-shipping" },

    { name: "Average temperature of homes", categoryId: 1, typeId: 1, pathwayStringIndex: 32, tooltips: {
       "1": "Average room temperature increases to 20°C (a 2.5°C increase on 2007)",
       "2": "Average room temperature increases to 18°C (a 0.5°C increase on 2007)",
       "3": "Average room temperature decreases to 17°C (a 0.5°C decrease on 2007)",
       "4": "Average room temperature decreases to 16°C (a 1.5°C decrease on 2007)"
     }, pdf: "/assets/onepage/29.pdf", info: "demand/average-temperature-of-homes" },

    { name: "Home insulation", categoryId: 1, typeId: 1, pathwayStringIndex: 33, tooltips: {
       "1": "Over 7m homes insulated, average thermal leakiness falls by 25%",
       "2": "Over 8m homes insulated, average thermal leakiness falls by 33%",
       "3": "Over 18m homes insulated, average thermal leakiness falls by 42%",
       "4": "Over 24m homes insulated, average thermal leakiness decreases by 50% "
     }, pdf: "/assets/onepage/30.pdf", info: "demand/home-insulation" },

    { name: "Home heating electrification", categoryId: 1, typeId: 3, value: 'A', pathwayStringIndex: 34, tooltips: {
       "1": "The proportion of domestic heat supplied using electricity is 0-10%, as today",
       "2": "The proportion of new domestic heating systems using electricity is 20%",
       "3": "The proportion of new domestic heating systems supplied using electricity is 30-60%",
       "4": "The proportion of new domestic heating systems supplied using electricity is 80-100%"
     }, pdf: "/assets/onepage/31.pdf", info: "demand/home-heating-electrification" },

    { name: "Home heating that isn't electric", categoryId: 1, typeId: 3, value: 'A', pathwayStringIndex: 35, tooltips: {
       "1": "The dominant non-electric heat source is gas or gas CHP (biogas if available)",
       "2": "The dominant non-electric heat source is coal or coal CHP (biomass if available)",
       "3": "The dominant non-electric heat source is waste heat from power stations",
       "4": "A mixture of gas/biogas; coal/biomass; and heat from power stations"
     }, pdf: "/assets/onepage/31.pdf", info: "demand/home-heating-that-isnt-electric" },

    { name: "Home lighting & appliances", categoryId: 1, typeId: 1, pathwayStringIndex: 37, tooltips: {
       "1": "Energy demand for domestic lights and appliances increases by 20% (relative to 2007)",
       "2": "Energy demand for domestic lights and appliances is stable",
       "3": "Energy demand for domestic lights and appliances decreases by 40%",
       "4": "Energy demand for domestic lights and appliances decreases by 60%"
     }, pdf: "/assets/onepage/34.pdf", info: "demand/lightning-and-appliances"  },

    { name: "Electrification of home cooking", categoryId: 1, typeId: 3, value: 'A', max: 2, pathwayStringIndex: 38, tooltips: {
       "1": "Energy used for domestic cooking remains at 63% electricity and 37% gas",
       "2": "Energy used for domestic cooking is entirely electric"
    }, pdf: "/assets/onepage/35.pdf", info: "demand/electrification-of-cooking" },

    { name: "Growth in industry", categoryId: 1, typeId: 3, value: 'A', max: 3, pathwayStringIndex: 40, tooltips: {
       "1": "UK industry output more than doubles by 2050",
       "2": "UK industry grows in line with current trends",
       "3": "UK industry output falls 30-40% by 2050"
    }, pdf: "/assets/onepage/37.pdf", info: "demand/growth-in-industry" },

    { name: "Energy intensity of industry", categoryId: 1, typeId: 1, max: 3, pathwayStringIndex: 41, tooltips: {
       "1": "No electrification of processes, little improvement in energy intensity",
       "2": "Some processes electrified; moderate improvements in process emissions and energy demand",
       "3": "High electrification; CCS captures 48% of emissions; process emissions reduced"
    }, pdf: "/assets/onepage/38.pdf", info: "demand/energy-intensity-of-industry" },

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

    { name: "Commercial lighting & appliances", categoryId: 1, typeId: 1, pathwayStringIndex: 47, tooltips: {
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
     }, pdf: "/assets/onepage/0.pdf", info: "supply/nuclear-power-stations" },

    { name: "CCS power stations", categoryId: 2, typeId: 2, pathwayStringIndex: 2, tooltips: {
       "1": "Demonstration plants only; no roll-out of CCS",
       "2": "~240 TWh/yr from 25-40 CCS power stations; comparable to current gas & coal generation",
       "3": "~340 TWh/yr from 35-60 CCS power stations; comparable to total current demand",
       "4": "~510 TWh/yr  from 50-90 CCS power stations; build rate of gas plants in the 1990s"
     }, pdf: "/assets/onepage/2.pdf", info: "supply/ccs-power-stations" },

    { name: "CCS power station fuel mix", categoryId: 2, typeId: 3, value: 'A', pathwayStringIndex: 3, tooltips: {
       "1": "100% coal/biomass, 0% gas/biogas CCS after demonstration plants",
       "2": "66% coal/biomass, 33% gas/biogas CCS after demonstration plants",
       "3": "33% coal/biomass, 66% gas/biogas CCS after demonstration plants",
       "4": "0% coal/biomas, 100% gas/biogas CCS after demonstration plants"
     }, pdf: "/assets/onepage/3.pdf", info: "supply/ccs-power-station-fuel-mix" },

    { name: "Offshore wind", categoryId: 2, typeId: 2, pathwayStringIndex: 4, tooltips: {
       "1": "~1,400 turbines in 2025, reducing to zero as decommissioned sites are not replanted",
       "2": "~10,000 turbines in 2050, delivering ~180 TWh/yr",
       "3": "~17,000 turbines in 2050, delivering ~310 TWh/yr",
       "4": "~40,000 turbines in 2050, delivering ~430 TWh/yr"
     }, pdf: "/assets/onepage/4.pdf", info: "supply/offshore-wind" },

    { name: "Onshore wind", categoryId: 2, typeId: 2, pathwayStringIndex: 5, tooltips: {
       "1": "~4,400 turbines in 2025, reducing to zero as decommissioned sites are not replanted",
       "2": "~8,000 turbines in 2050, delivering ~50 TWh/yr. ",
       "3": "~13,000 turbines in 2050, delivering ~80 TWh/yr",
       "4": "~20,000 turbines in 2050, delivering ~130 TWh/yr"
     }, pdf: "/assets/onepage/5.pdf", info: "supply/onshore-wind" },

    { name: "Wave", categoryId: 2, typeId: 2, pathwayStringIndex: 6, tooltips: {
       "1": "None in 2050",
       "2": "~300km of wave farms",
       "3": "~600km of wave farms",
       "4": "~900km of wave farms"
     }, pdf: "/assets/onepage/6.pdf" , info: "supply/wave" },

    { name: "Tidal Stream", categoryId: 2, typeId: 2, pathwayStringIndex: 7, tooltips: {
       "1": "None in 2050",
       "2": "1,000 tidal stream turbines",
       "3": "4,700 tidal stream turbines",
       "4": "10,600 tidal stream turbines"
     }, pdf: "/assets/onepage/TidalStream.pdf" , info: "supply/tidal-stream" },

    { name: "Tidal Range", categoryId: 2, typeId: 2, pathwayStringIndex: 8, tooltips: {
       "1": "None in  2050",
       "2": "3 small tidal range schemes",
       "3": "4 tidal range schemes",
       "4": "8 tidal range schemes"
     }, pdf: "/assets/onepage/TidalRange.pdf" , info: "supply/tidal-range" },

    { name: "Biomass power stations", categoryId: 2, typeId: 2, pathwayStringIndex: 9, tooltips: {
       "1": "Only plants built and under construction (0.6GW)",
       "2": "8GW power stations by 2050 delivering 62TWh/yr",
       "3": "12GW power stations by 2050 delivering 100TWh/yr",
       "4": "Over 20GW installed capacity by 2050 delivering 180TWh/yr"
     }, pdf: "/assets/onepage/7.pdf" , info: "supply/biomass-power-stations" },

    { name: "Solar panels for electricity", categoryId: 2, typeId: 2, pathwayStringIndex: 10, tooltips: {
       "1": "No significant solar PV capacity is installed",
       "2": "4m2 of photovoltaic panels per person in 2050, supplying ~60 TWh/yr of electricity",
       "3": "5.4m2 of photovoltaic panels per person in 2050, supplying ~80 TWh/yr",
       "4": "9.5m2 of photovoltaic panels per person – all suitable roof and facade space used"
       }, pdf: "/assets/onepage/8.pdf" , info: "solar-panels-for-electricity" },

    { name: "Solar panels for hot water", categoryId: 2, typeId: 2, pathwayStringIndex: 11, tooltips: {
       "1": "As today, a negligible proportion of buildings have solar thermal in 2050",
       "2": "~30% of suitable buildings get ~30% of their hot water from solar thermal",
       "3": "All suitable buildings get ~30% of their hot water from solar thermal",
       "4": "All suitable buildings get ~60% of their hot water from solar thermal"
     }, pdf: "/assets/onepage/9.pdf", info: "solar-panels-for-hot-water" },

    { name: "Geothermal electricity", categoryId: 2, typeId: 2, pathwayStringIndex: 12, tooltips: {
       "1": "No deployment of geothermal electricity generation",
       "2": "Supply of geothermal electricity grows slowly to 7 TWh/yr in 2035 and is sustained",
       "3": "Supply grows quickly reaching 21 TWh/yr by 2030 and is sustained",
       "4": "Supply grows rapidly reaching 35 TWh/yr by 2030 and is sustained"
     }, pdf: "/assets/onepage/10.pdf", info: "supply/geothermal-electricity" },

    { name: "Hydroelectric power stations", categoryId: 2, typeId: 2, pathwayStringIndex: 13, tooltips: {
       "1": "Supply of electricity is maintained at current levels of 5 TWh/yr",
       "2": "Supply grows slowly, reaching 7 TWh/yr by 2050",
       "3": "Supply grows more quickly, reaching 8 TWh/yr by 2030 and is sustained",
       "4": "Supply grows rapidly reaching 13 TWh/yr by 2035 and is sustained"
     }, pdf: "/assets/onepage/11.pdf", info: "supply/hydroelectric-power-stations" },

    { name: "Small-scale wind", categoryId: 2, typeId: 2, pathwayStringIndex: 14, tooltips: {
       "1": "As today, no discernable supply of electricity from micro-wind turbines",
       "2": "Supply increases to 1.3 TWh/yr by 2020 and is sustained",
       "3": "Installed in all ~450,000 suitable domestic properties; supplies 3.5 TWh/year from 2020",
       "4": "Installed in all suitable domestic and non-domestic sties; 8.9 TWh/year from 2020"
     }, pdf: "/assets/onepage/12.pdf", info: "supply/small-scale-wind" },

    { name: "Electricity imports", categoryId: 2, typeId: 2, pathwayStringIndex: 15, tooltips: {
       "1": "No electricity imports, other than for balancing",
       "2": "30 TWh/yr of electricity imported from Southern Europe",
       "3": "70 TWh/yr imported from UK 10% share of international desert solar project ",
       "4": "140 TWh/yr imported from UK 20% share of international desert solar project"
     }, pdf: "/assets/onepage/13.pdf", info: "supply/electricity-imports" },

    { name: "Land dedicated to bioenergy", categoryId: 2, typeId: 1, pathwayStringIndex: 17, tooltips: {
       "1": "Energy crops and food production similar to today",
       "2": "5% of land used for energy crops",
       "3": "10% of land used for energy crops",
       "4": "17% of land used for energy crops"
     }, pdf: "/assets/onepage/15.pdf", info: "supply/land-dedicated-to-bioenergy" },

    { name: "Livestock and their management", categoryId: 2, typeId: 1, pathwayStringIndex: 18, tooltips: {
       "1": "Livestock numbers increase by 10%",
       "2": "Livestock numbers same as today",
       "3": "Livestock numbers decrease by 10%",
       "4": "Livestock numbers decrease by 20%"
     }, pdf: "/assets/onepage/16.pdf", info: "supply/livestock-and-their-management" },

    { name: "Volume of waste and recycling", categoryId: 2, typeId: 3, value: 'A', pathwayStringIndex: 19, tooltips: {
       "1": "Quantity of waste increases 50%; Small increase in rates of recycling and EFW.",
       "2": "Quantity of waste increases 20%; Increase in rates of recycling and EFW.",
       "3": "Quantity of waste increases 33%; Significant increase in rates of recycling and EFW through innovation.",
       "4": "Quantity of waste decreases 20%; Significant increase in rate of recycling."
     }, pdf: "/assets/onepage/17.pdf", info: "supply/volume-of-waste-and-recycling"  },

    { name: "Marine algae", categoryId: 2, typeId: 1, pathwayStringIndex: 20, tooltips: {
       "1": "No development of macro-algae cultivation",
       "2": "Area same as half of natural reserve used, delivering ~4 TWh/yr",
       "3": "Area same as all of natural reserve used, delivering ~9 TWh/yr",
       "4": "Area same as four times natural reserve used, delivering ~46 TWh/yr"
       }, pdf: "/assets/onepage/18.pdf", info: "supply/marine-algae" },

    { name: "Type of fuels from biomass", categoryId: 2, typeId: 3, value: 'A', pathwayStringIndex: 21, tooltips: {
       "1": "Biomass converted to a mixture of solid, liquid and gas biofuels",
       "2": "Biomass mainly converted to solid biofuel",
       "3": "Biomass mainly converted to liquid biofuel",
       "4": "Biomass mainly converted to biogas fuel"
     }, pdf: "/assets/onepage/19.pdf", info: "supply/types-of-fuel-from-bioenergy" },

    { name: "Bioenergy imports", categoryId: 2, typeId: 1, pathwayStringIndex: 22, tooltips: {
       "1": "Imported biofuel declines from ~ 4 TWh/yr currently to zero",
       "2": "Up to 70 TWh/yr of imported bioenergy in 2050",
       "3": "Up to 140 TWh/yr of imported bioenergy in 2050",
       "4": "Up to 280 TWh/yr of imported bioenergy in 2050"
     }, pdf: "/assets/onepage/20.pdf", info: "supply/bioenergy-imports" },

    { name: "Geosequestration", categoryId: 3, typeId: 1, pathwayStringIndex: 50, tooltips: {
       "1": "No geosequestration",
       "2": "Carbon dioxide sequestration rate of 1 million tonnes per annum by 2050",
       "3": "Carbon dioxide sequestration rate of ~30 million tonnes per annum by 2050",
       "4": "Carbon dioxide sequestration rate of ~110 million tonnes per annum by 2050"
     }, pdf: "/assets/onepage/47.pdf", info: "emissions/geosequestration"  },

    { name: "Storage, demand shifting &; interconnection", categoryId: 3, typeId: 1, pathwayStringIndex: 51, tooltips: {
       "1": "Today's 3.5 GW storage & 4 GW interconnection with Europe for balancing",
       "2": "4 GW storage & 10 GW interconnection with Europe for balancing",
       "3": "7 GW storage with 2 more pumped storage, 15 GW interconnection & some demand shifting",
       "4": "20 GW storage with large lagoons, 30 GW interconnection & substantial demand shifting"
     }, pdf: "/assets/onepage/48.pdf", info: "emissions/storage-demand-shifting-and-interconnection" }
  ];

  var ACTION_CATEGORIES = [
    { "id": 1, "name": "Demand" },
    { "id": 2, "name": "Supply" },
    { "id": 3, "name": "Other" }
  ];


  var EXAMPLES = [
      { category: 'Extreme Pathways', name: 'Doesn\'t tackle climate change', slug: 'blank-example', values: '10111111111111110111111001111110111101101101110110111' },
      { category: 'Extreme Pathways', name: 'Maximum demand, no supply', slug: 'max-demand-no-supply-example', values: '10111111111111110111111004424440444404203304440420111' },
      { category: 'Extreme Pathways', name: 'Maximum supply, no demand', slug: 'max-supply-no-demand-example', values: '40444444444444440443424001121110111101102101110110111' },
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
    self.chartData = ko.observable({"_id":"10111111111111110111111001111110111101101101110110111","choices":[1.0,0.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,1.0,0.0,1.0,1.0,1.0,1.0,1.0,1.0,0.0,0.0,1.0,1.0,1.0,1.0,1.0,1.0,0.0,1.0,1.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,1.0,0.0,1.0,1.0,0.0,1.0,1.0,1.0],"sankey":[["Coal reserves",63.965,"Coal"],["Coal imports",31.37680448314937,"Coal"],["Oil reserves",107.70336000383915,"Oil"],["Oil imports",772.3784493415866,"Oil"],["Gas reserves",82.2325418852722,"Natural Gas"],["Gas imports",2034.3260236076515,"Natural Gas"],["UK land based bioenergy",17.66729961334454,"Bio-conversion"],["Marine algae",0.0,"Bio-conversion"],["Agricultural 'waste'",37.423218106806175,"Bio-conversion"],["Other waste",40.347786623842815,"Bio-conversion"],["Other waste",14.247989840000002,"Solid"],["Biomass imports",0.0,"Solid"],["Biofuel imports",0.0,"Liquid"],["Coal",95.34180448314937,"Solid"],["Oil",880.0818093454258,"Liquid"],["Natural Gas",2116.5585654929237,"Gas"],["Solar",0.0,"Solar PV"],["Solar PV",0.0,"Electricity grid"],["Solar",0.0,"Solar Thermal"],["Bio-conversion",30.19183129961111,"Solid"],["Bio-conversion",7.744845969984376,"Liquid"],["Bio-conversion",39.59732328273581,"Gas"],["Bio-conversion",17.904303791662215,"Losses"],["Solid",0.0,"Over generation / exports"],["Liquid",0.0,"Over generation / exports"],["Gas",0.0,"Over generation / exports"],["Solid",32.82867,"Thermal generation"],["Liquid",0.0,"Thermal generation"],["Gas",1152.794637318209,"Thermal generation"],["Nuclear",1.4273915383000717e-14,"Thermal generation"],["Thermal generation",16.14504631825665,"District heating"],["Thermal generation",576.0327660656262,"Electricity grid"],["Thermal generation",593.4454949343261,"Losses"],["Solid",-0.0,"CHP"],["Liquid",-0.0,"CHP"],["Gas",-0.0,"CHP"],["CHP",0.0,"Electricity grid"],["CHP",0.0,"Losses"],["Electricity imports",0.0,"Electricity grid"],["Wind",0.08783531999999616,"Electricity grid"],["Tidal",0.0,"Electricity grid"],["Wave",0.0,"Electricity grid"],["Geothermal",0.0,"Electricity grid"],["Hydro",5.329728000000001,"Electricity grid"],["Electricity grid",-0.0,"H2 conversion"],["Electricity grid",0.0,"Over generation / exports"],["Electricity grid",40.55615154332804,"Losses"],["Gas",-0.0,"H2 conversion"],["H2 conversion",-0.0,"H2"],["H2 conversion",0.0,"Losses"],["Solar Thermal",0.0,"Heating and cooling - homes"],["H2",0.0,"Road transport"],["Pumped heat",-0.0,"Heating and cooling - homes"],["Pumped heat",-0.0,"Heating and cooling - commercial"],["CHP",0.0,"Heating and cooling - homes"],["CHP",0.0,"Heating and cooling - commercial"],["District heating",-0.0,"Heating and cooling - homes"],["District heating",-0.0,"Heating and cooling - commercial"],["District heating",16.14504631825665,"Industry"],["Electricity grid",60.658172984497085,"Heating and cooling - homes"],["Solid",-0.0,"Heating and cooling - homes"],["Liquid",-0.0,"Heating and cooling - homes"],["Gas",517.9434690774436,"Heating and cooling - homes"],["Electricity grid",31.41118473825011,"Heating and cooling - commercial"],["Solid",-0.0,"Heating and cooling - commercial"],["Liquid",-0.0,"Heating and cooling - commercial"],["Gas",141.48912264058296,"Heating and cooling - commercial"],["Electricity grid",103.40155946528083,"Lighting & appliances - homes"],["Gas",8.034648284576644,"Lighting & appliances - homes"],["Electricity grid",92.33773101406193,"Lighting & appliances - commercial"],["Gas",9.052934021349623,"Lighting & appliances - commercial"],["Electricity grid",227.8261992401981,"Industry"],["Solid",106.05754246808083,"Industry"],["Liquid",199.26024117013674,"Industry"],["Gas",300.5983185000332,"Industry"],["Electricity grid",4.477065773398354,"Agriculture"],["Solid",0.8954131546796709,"Agriculture"],["Liquid",3.693579263053642,"Agriculture"],["Gas",2.1266062423642182,"Agriculture"],["Electricity grid",13.84226019889534,"Road transport"],["Liquid",322.0183306963002,"Road transport"],["Electricity grid",6.940004427716452,"Rail transport"],["Liquid",7.482590653758216,"Rail transport"],["Liquid",14.785449092646573,"Domestic aviation"],["Liquid",22.49614487028552,"National navigation"],["Liquid",188.58168305622323,"International aviation"],["Liquid",129.50863651300597,"International shipping"],["Electricity grid",0.0,"Geosequestration"],["Gas",24.116152691100137,"Losses"]],"ghg":{"Fuel Combustion":[529.8539357626967,519.0912216809867,512.0113471704789,499.0220751561767,491.5554591671308,515.1875490713112,540.8940427149373,569.0830132910539,594.0239139746058],"Industrial Processes":[28.221387041966942,28.849107848156848,29.577156358435555,30.76521840566169,32.041869436587156,33.41323844684092,34.88588725885888,36.46684109733335,38.16362132741505],"Solvent and Other Product Use":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"Agriculture":[42.546514044392154,41.434328453521594,39.35507327896009,39.54933612174254,39.74705925720606,39.94833472074909,40.15325740991062,40.36192517715779,40.574438925710965],"Land Use, Land-Use Change and Forestry":[2.549557736117353,5.933544988096667,9.216509860464468,12.250768713675887,13.957206773343671,14.259955560261957,13.273591570430609,12.03013906507904,11.556420470689867],"Waste":[15.21267066552306,13.403677907027117,11.596569237935283,11.407642135495301,11.10152741287662,11.133762036208225,11.101878462443766,11.007749688815606,10.851430772830827],"Other":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"International Aviation and Shipping":[46.453918754749346,52.19269100274443,58.554128553904185,63.00928576171873,67.24417545140071,72.66360699371727,76.43181920884129,79.76691774229698,81.05235935157397],"Bioenergy credit":[-9.727927159777284,-10.517123416542793,-12.79496419621321,-14.625774889952798,-15.56931392209922,-16.23297596761511,-16.945394606192757,-17.707880367178213,-18.521203016799703],"Carbon capture":[0.0,-2.8350150827586207,-6.678458816949153,-6.538048685217391,-6.403460266271363,-6.274336960887095,-6.260121498214285,-6.136579599107142,-6.017852256923077],"Total":[655.1100568456683,647.552433381232,640.8373614470161,634.8405027193006,633.6745233101744,664.0991339005865,693.5349605210155,724.8721260954514,751.6831295491036],"percent_reduction_from_1990":3},"final_energy_demand":{"Transport":[706.444106487651,702.6582914708018,706.8346190574152,692.2706378601315,672.6432254953352,688.6111431847137,695.4521838470998,704.6716263596342,705.6550995088315],"Industry":[487.7606604183711,502.2347486552872,519.1330102384849,552.3781274633884,591.1091456382231,636.5814837378313,688.4685409970629,747.1495474540088,813.1263857252409],"Heating and cooling":[529.979130446357,557.2327171072865,592.1540031837183,626.0737077944508,658.8484009719804,679.2981555455385,701.254046991792,725.2019420085342,751.5019494407738],"Lighting & appliances":[177.42796936210306,181.64752039357137,185.83085939782245,189.81046011329818,193.5794282147545,198.16407689154263,202.85659977404066,207.74130210103976,212.82687278526902],"Food consumption [UNUSED]":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"Total Use":[1901.6118667144822,1943.773277626947,2003.952491877441,2060.532933231269,2116.1802003202934,2202.6548593596262,2288.0313716099954,2384.7644179232166,2483.1103074601156]},"primary_energy_supply":{"Nuclear fission":[160.70999999999998,134.9964,77.14080000000003,25.713600000000014,25.713600000000014,1.4273915383000717e-14,1.4273915383000717e-14,1.4273915383000717e-14,1.4273915383000717e-14],"Solar":[0.028059966000000006,0.013604831999999999,-0.0,-0.0,-0.0,-0.0,-0.0,-0.0,-0.0],"Wind":[14.440670099999998,29.3428701,45.35726511600001,57.69377964,48.16934531999999,32.302885319999994,15.209185319999996,0.08783531999999616,0.08783531999999616],"Tidal":[0.0050034246575342495,0.020013698630136998,0.050034246575342486,0.12508561643835608,0.12508561643835608,-0.0,-0.0,-0.0,-0.0],"Wave":[-0.0,0.0030020547945205484,0.1584417808219177,0.39610445205479383,0.39610445205479383,-0.0,-0.0,-0.0,-0.0],"Geothermal":[-0.0,-0.0,-0.0,-0.0,-0.0,-0.0,-0.0,-0.0,-0.0],"Hydro":[5.329728000000001,5.329728000000001,5.329728000000001,5.329728000000001,5.329728000000001,5.329728000000001,5.329728000000001,5.329728000000001,5.329728000000001],"Electricity oversupply (imports)":[0.0,-0.0,5.684341886080802e-14,0.0,0.0,5.684341886080802e-14,-0.0,-0.0,-0.0],"Environmental heat":[-0.0,-0.0,-0.0,-0.0,-0.0,-0.0,-0.0,-0.0,-0.0],"Bioenergy":[51.86701468515299,58.789808403805374,76.59273739822126,82.3234955867832,88.62506819270084,93.44163245057703,98.55180843129874,103.96477952879702,109.68629418399354],"Coal":[477.71797078633944,424.29321857088854,339.1461187019778,205.75581145406315,99.17138476620721,83.07342822723695,86.83099313468409,90.7620390292379,95.34180448314937],"Oil":[868.1911081134084,855.1870235798388,859.5939643444532,845.7983560433511,828.4897394075546,847.4223190112918,858.3068752198818,872.8766716322103,880.0818093454258],"Natural gas":[1001.4318635490304,1080.1732409505273,1202.7184729043995,1389.160504918114,1575.1707290298789,1728.4313689906198,1861.115383171855,1998.8032246902233,2116.5585654929237],"Total Primary Supply":[2579.7214186245888,2588.1489101904845,2606.0875624924493,2612.2964657108046,2671.1907847848342,2790.0013619997258,2925.3439732777197,3071.8242782004686,3207.0860368254926]},"electricity":{"demand":{"Transport":[8.184036113841765,8.24983643454528,8.437425412562373,10.575653624640855,12.560014336163983,14.718334265020829,16.834310192237837,18.69805211754176,20.782264626611795],"Industry":[130.50824089768997,137.03322960724057,144.06772446626283,155.17870330612678,167.07422315693603,180.88658764675807,196.2510898436492,213.32895089017282,232.30326501359642],"Heating and cooling":[61.477547173328105,60.46804120052823,66.35760349523126,71.97593685048713,77.31785832061637,81.59999487699466,85.78600146523934,89.98941639003723,94.37579291106958],"Lighting & appliances":[160.42544870690443,164.63670739026009,168.81214477803974,172.7839092495832,176.5449480156904,181.10445293713374,185.7876640441699,190.6630469229624,195.73929047934274],"Total":[360.59527289176424,370.3878146325742,387.6748981520962,410.51420303083796,433.4970438294068,458.30936972590723,484.65906554529624,512.6794663207143,543.2006130306206]},"supply":{"Biomass/Coal power stations":[315.1363283423534,314.0881604766082,329.6597217689738,358.3426712377946,392.51256338377704,443.95605106784535,489.3416961771879,534.5403588249603,567.3003966039486],"Domestic space heating and hot water":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"Commercial heating and cooling":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"Unabated thermal generation":[315.1363283423534,314.0881604766082,329.6597217689738,358.3426712377946,392.51256338377704,443.95605106784535,489.3416961771879,534.5403588249603,567.3003966039486],"Carbon Capture Storage (CCS)":[0.0,5.079787425,10.834644510000002,10.876743225,10.928155815,10.95013656,10.972117305000001,11.003411924999998,11.03880465],"Nuclear power":[52.596,44.18064,25.246080000000006,8.415360000000005,8.415360000000005,4.671463216254779e-15,4.671463216254779e-15,4.671463216254779e-15,4.671463216254779e-15],"Onshore wind":[10.317757319999997,17.549707319999996,24.78165732,28.963039319999996,21.783685319999993,14.551735319999997,7.319785319999996,0.08783531999999616,0.08783531999999616],"Offshore wind":[4.122912780000003,11.793162780000001,20.575607796000003,28.73074032000001,26.385659999999998,17.75115,7.8894,0.0,0.0],"Hydroelectric power stations":[5.329728000000001,5.329728000000001,5.329728000000001,5.329728000000001,5.329728000000001,5.329728000000001,5.329728000000001,5.329728000000001,5.329728000000001],"Tidal and Wave":[0.0050034246575342495,0.023015753424657545,0.20847602739726018,0.5211900684931499,0.5211900684931499,0.0,0.0,0.0,0.0],"Geothermal electricity":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"Tidal [UNUSED - See III.c]":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"Solar PV":[0.028059966000000006,0.013604831999999999,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"Non-thermal renewable generation":[19.803461490657536,34.70921868542466,50.89546914339727,63.54469770849315,54.02026338849314,37.63261332,20.53891332,5.4175633199999975,5.4175633199999975],"Electricity imports":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"Total generation supplied to grid":[387.53578983301094,398.05780658703287,416.63591542237106,441.1794721712878,465.87634258727024,492.53880094784535,520.8527268021878,550.9613340699603,583.7567645739485]},"emissions":{"Fuel Combustion":[200.90003323156023,191.1836078506969,182.68837621368507,168.56386361332787,161.3006016780701,177.02403852228605,194.11501011726418,211.01259346336113,223.22719880935213],"Bioenergy credit":[-6.455584141443369,-6.731038405177016,-7.559540910977905,-7.921098844317447,-6.355969314248273,-5.768367240727793,-5.93469939813758,-6.072347520027181,-6.165598322428703],"Carbon capture":[-0.0,-2.8350150827586207,-6.678458816949153,-6.538048685217391,-6.403460266271363,-6.274336960887095,-6.260121498214285,-6.136579599107142,-6.017852256923077],"Total":[194.44444909011685,181.61755436276127,168.450376485758,154.104716083793,148.5411720975505,164.98133432067118,181.9201892209123,198.8036663442268,211.04374823000035]},"capacity":{"Oil / Biofuel":[4.0568,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"Coal / Biomass":[28.137999999999998,23.422,17.055000000000003,8.612,1.7999999999999998,0.6,0.6,0.6,0.6],"Gas / Biogas":[27.42537218491016,30.85295936843783,38.84804337684133,50.75928360186999,62.166716108304335,71.57889427786667,78.97527071757568,86.3411751287377,91.67999032038534],"Carbon Capture Storage (CCS)":[0.0,0.8500000000000001,1.7000000000000002,1.7,1.7,1.7,1.7,1.7,1.7],"Nuclear power":[10.0,7.2,3.6000000000000005,1.2000000000000006,1.2000000000000006,6.661338147750939e-16,6.661338147750939e-16,6.661338147750939e-16,6.661338147750939e-16],"Onshore wind":[3.923399999999999,6.673399999999999,9.423399999999999,11.013399999999999,8.283399999999999,5.5333999999999985,2.7833999999999985,0.03339999999999854,0.03339999999999854],"Offshore wind":[1.343800000000001,3.8438000000000008,6.343800000000001,8.193800000000001,7.0,4.5,2.0,0.0,0.0],"Hydroelectric power stations":[1.6,1.6,1.6,1.6,1.6,1.6,1.6,1.6,1.6],"Wave":[0.0,0.0015220700152207,0.0803314730255369,0.200828682563842,0.200828682563842,0.0,0.0,0.0,0.0],"Tidal Stream":[0.00158548959918823,0.00634195839675292,0.0158548959918823,0.0396372399797057,0.0396372399797057,0.0,0.0,0.0,0.0],"Tidal Range":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"Geothermal electricity":[0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"Solar PV":[0.033,0.016,0.0,0.0,0.0,0.0,0.0,0.0,0.0],"Standby / peaking gas":[-0.0,-0.0,-0.0,-0.0,-0.0,-0.0,-0.0,-0.0,-0.0],"Total generation":[76.52195767450935,74.4660233968498,78.66642974585875,83.31894952441354,83.99058203084788,85.51229427786666,87.65867071757567,90.2745751287377,95.61339032038534]},"automatically_built":91.67999032038534,"peaking":-0.0},"heating":{"residential":{"Gas boiler (old)":0.0,"Gas boiler (new)":0.9,"Resistive heating":0.1,"Oil-fired boiler":0.0,"Solid-fuel boiler":0.0,"Stirling engine micro-CHP":0.0,"Fuel-cell micro-CHP":0.0,"Air-source heat pump":0.0,"Ground-source heat pump":0.0,"Geothermal electricity":0.0,"Community scale gas CHP with local district heating":0.0,"Community scale solid-fuel CHP with local district heating":0.0,"Long distance district heating from large power stations":0.0},"commercial":{"Gas boiler (old)":0.0,"Gas boiler (new)":0.9,"Resistive heating":0.1,"Oil-fired boiler":0.0,"Solid-fuel boiler":0.0,"Stirling engine micro-CHP":0.0,"Fuel-cell micro-CHP":0.0,"Air-source heat pump":0.0,"Ground-source heat pump":0.0,"Geothermal electricity":0.0,"Community scale gas CHP with local district heating":0.0,"Community scale solid-fuel CHP with local district heating":0.0,"Long distance district heating from large power stations":0.0}},"cost_components":{"Conventional thermal plant":{"low":46.28847490608155,"point":85.88612870253374,"high":154.85662156292364,"range":108.56814665684209,"finance_low":0,"finance_point":13.604459610346312,"finance_high":43.39685043689216,"finance_range":43.39685043689216},"Combustion + CCS":{"low":0.8067007151569467,"point":2.141539455248759,"high":5.067166015582137,"range":4.2604653004251904,"finance_low":0,"finance_point":1.0266025742449374,"finance_high":3.9353041800866584,"finance_range":3.9353041800866584},"Nuclear power":{"low":1.0603220663865833,"point":3.9106837439061213,"high":6.8716031656694145,"range":5.811281099282831,"finance_low":0,"finance_point":0.0,"finance_high":0.0,"finance_range":0.0},"Onshore wind":{"low":3.8783002320159827,"point":6.968634199052536,"high":13.005094690052978,"range":9.126794458036995,"finance_low":0,"finance_point":3.516143893086919,"finance_high":7.1089059388705245,"finance_range":7.1089059388705245},"Offshore wind":{"low":7.661063381895302,"point":10.470691870652741,"high":23.97174056453223,"range":16.31067718263693,"finance_low":0,"finance_point":4.324120973333438,"finance_high":13.370146828580548,"finance_range":13.370146828580548},"Hydroelectric":{"low":0.41873916343628526,"point":2.5665402883905393,"high":6.050439303842557,"range":5.631700140406272,"finance_low":0,"finance_point":0.06477143857307455,"finance_high":1.3318665385655224,"finance_range":1.3318665385655224},"Wave and Tidal":{"low":0.27818041908682045,"point":0.985134887274277,"high":2.0962143177992982,"range":1.8180338987124778,"finance_low":0,"finance_point":0.32618588553926425,"finance_high":1.058330187932496,"finance_range":1.058330187932496},"Geothermal":{"low":0.0,"point":0.0,"high":0.0,"range":0.0,"finance_low":0,"finance_point":0.0,"finance_high":0.0,"finance_range":0.0},"Distributed solar PV":{"low":0.018541861127292735,"point":0.025754240650923445,"high":0.04545499946317862,"range":0.026913138335885888,"finance_low":0,"finance_point":0.0053431376577957245,"finance_high":0.021628391476947572,"finance_range":0.021628391476947572},"Distributed solar thermal":{"low":0.0,"point":0.0,"high":0.0,"range":0.0,"finance_low":0,"finance_point":0.0,"finance_high":0.0,"finance_range":0.0},"Micro wind":{"low":0.0,"point":0.0,"high":0.0,"range":0.0,"finance_low":0,"finance_point":0.0,"finance_high":0.0,"finance_range":0.0},"Biomatter to fuel conversion":{"low":2.937993641689398,"point":25.010633882403486,"high":66.30462060590999,"range":63.36662696422059,"finance_low":0,"finance_point":7.339499294448337,"finance_high":34.710608487522194,"finance_range":34.710608487522194},"Bioenergy imports":{"low":0.6121956419661735,"point":1.5690962488637503,"high":2.7242706067494717,"range":2.1120749647832984,"finance_low":0,"finance_point":0.0,"finance_high":0.0,"finance_range":0.0},"Agriculture and land use":{"low":1.5373012337217598,"point":13.288596927523542,"high":14.93437620899554,"range":13.397074975273782,"finance_low":0,"finance_point":0.0,"finance_high":0.0,"finance_range":0.0},"Energy from waste":{"low":13.778971111041683,"point":9.427145367957431,"high":9.088353897604325,"range":-4.690617213437358,"finance_low":0,"finance_point":1.5105530596550139,"finance_high":2.529272084508893,"finance_range":2.529272084508893},"Waste arising":{"low":99.66871454400926,"point":131.86797871623136,"high":191.66661217892957,"range":91.9978976349203,"finance_low":0,"finance_point":15.609953499788718,"finance_high":34.32192755891191,"finance_range":34.32192755891191},"Marine algae":{"low":0.0,"point":0.0,"high":0.0,"range":0.0,"finance_low":0,"finance_point":0.0,"finance_high":0.0,"finance_range":0.0},"Electricity imports":{"low":0.0,"point":0.0,"high":0.0,"range":0.0,"finance_low":0,"finance_point":0.0,"finance_high":0.0,"finance_range":0.0},"Electricity Exports":{"low":-5.660055663713776e-15,"point":-2.0715803729192417e-14,"high":-4.867647870793848e-14,"range":-4.30164230442247e-14,"finance_low":0,"finance_point":0.0,"finance_high":0.0,"finance_range":0.0},"Electricity grid distribution":{"low":18.039345119622684,"point":37.232486994000176,"high":156.9642127061766,"range":138.92486758655392,"finance_low":0,"finance_point":9.073870117765402,"finance_high":115.46736184752505,"finance_range":115.46736184752505},"Storage, demand shifting, backup":{"low":0.633007851936372,"point":1.3725048153978467,"high":2.745856318969156,"range":2.1128484670327836,"finance_low":0,"finance_point":0.13665799354044642,"finance_high":0.36887152514719956,"finance_range":0.36887152514719956},"H2 Production":{"low":0.0,"point":0.0,"high":0.0,"range":0.0,"finance_low":0,"finance_point":0.0,"finance_high":0.0,"finance_range":0.0},"Domestic heating":{"low":225.89047977256203,"point":266.3164493190898,"high":341.3932499054986,"range":115.50277013293655,"finance_low":0,"finance_point":52.357378747515064,"finance_high":135.85746352111968,"finance_range":135.85746352111968},"Domestic insulation":{"low":1.6165212602831227,"point":6.139289851640341,"high":13.4205921204588,"range":11.804070860175678,"finance_low":0,"finance_point":3.9751175295641925,"finance_high":15.668581619898797,"finance_range":15.668581619898797},"Commercial heating and cooling":{"low":172.1250800178779,"point":204.80157815844092,"high":265.486504240694,"range":93.36142422281608,"finance_low":0,"finance_point":65.97742044849241,"finance_high":143.885818521637,"finance_range":143.885818521637},"Domestic lighting, appliances, and cooking":{"low":41.64321700701359,"point":48.61730694767805,"high":62.46482551052039,"range":20.821608503506802,"finance_low":0,"finance_point":16.923019334572487,"finance_high":38.45559062762307,"finance_range":38.45559062762307},"Commercial lighting, appliances, and catering":{"low":0.0,"point":0.0,"high":0.0,"range":0.0,"finance_low":0,"finance_point":0.0,"finance_high":0.0,"finance_range":0.0},"Industrial processes":{"low":0.0,"point":0.0,"high":0.0,"range":0.0,"finance_low":0,"finance_point":0.0,"finance_high":0.0,"finance_range":0.0},"Conventional cars and buses":{"low":1149.7759050622653,"point":1545.6204343076506,"high":1758.3171759480508,"range":608.5412708857855,"finance_low":0,"finance_point":264.11340055971624,"finance_high":585.8299744133058,"finance_range":585.8299744133058},"Hybrid cars and buses":{"low":141.05052389044985,"point":216.9019279687953,"high":394.8363770868995,"range":253.78585319644966,"finance_low":0,"finance_point":36.808538669730346,"finance_high":121.91665902827665,"finance_range":121.91665902827665},"Electric cars and buses":{"low":18.086393072107597,"point":29.3893925483542,"high":58.96655314618764,"range":40.880160074080045,"finance_low":0,"finance_point":6.500704477174481,"finance_high":23.974167447560205,"finance_range":23.974167447560205},"Fuel cell cars and buses":{"low":0.0,"point":0.0,"high":0.0,"range":0.0,"finance_low":0,"finance_point":0.0,"finance_high":0.0,"finance_range":0.0},"Bikes":{"low":77.41710607537891,"point":89.36106635431592,"high":111.54270687234174,"range":34.12560079696283,"finance_low":0,"finance_point":8.588201062754422,"finance_high":20.631574986895615,"finance_range":20.631574986895615},"Rail":{"low":98.18218284633225,"point":107.87258815256132,"high":125.62413332694172,"range":27.441950480609464,"finance_low":0,"finance_point":0.7481820541224874,"finance_high":1.4254732568787765,"finance_range":1.4254732568787765},"Domestic aviation":{"low":13.193954569047953,"point":14.395687714122175,"high":16.627477840688574,"range":3.4335232716406203,"finance_low":0,"finance_point":5.673618178411933,"finance_high":11.714649834214647,"finance_range":11.714649834214647},"Domestic freight":{"low":176.89147575137204,"point":187.23543309815653,"high":191.43300771921187,"range":14.54153196783983,"finance_low":0,"finance_point":19.92058442769432,"finance_high":35.09066160842508,"finance_range":35.09066160842508},"International aviation":{"low":0.0,"point":0.0,"high":0.0,"range":0.0,"finance_low":0,"finance_point":0.0,"finance_high":0.0,"finance_range":0.0},"International shipping (maritime bunkers)":{"low":0.0,"point":0.0,"high":0.0,"range":0.0,"finance_low":0,"finance_point":0.0,"finance_high":0.0,"finance_range":0.0},"Geosequestration":{"low":0.0,"point":0.0,"high":0.0,"range":0.0,"finance_low":0,"finance_point":0.0,"finance_high":0.0,"finance_range":0.0},"Petroleum refineries":{"low":12.730760740700434,"point":14.621273785724501,"high":18.132226583626345,"range":5.40146584292591,"finance_low":0,"finance_point":1.7390789496572263,"finance_high":4.555717430158785,"finance_range":4.555717430158785},"Fossil fuel transfers":{"low":22.807501365170573,"point":30.896784950403497,"high":45.91438210379296,"range":23.106880738622387,"finance_low":0,"finance_point":9.735608139059764,"finance_high":24.07322626662832,"finance_range":24.07322626662832},"District heating effective demand":{"low":0.5576624493784013,"point":0.7528443066608419,"high":1.1153248987568025,"range":0.5576624493784013,"finance_low":0,"finance_point":0.19321576018669515,"finance_high":0.5242455107154504,"finance_range":0.5242455107154504},"Storage of captured CO2":{"low":2.5543608290919395,"point":2.3108755661075193,"high":4.489692295105629,"range":1.935331466013689,"finance_low":0,"finance_point":1.020503990391572,"finance_high":2.9221506895053952,"finance_range":2.9221506895053952},"Coal":{"low":23.96917640696169,"point":27.6135189215732,"high":33.08003269349047,"range":9.110856286528781,"finance_low":0,"finance_point":0.0,"finance_high":0.0,"finance_range":0.0},"Oil":{"low":375.54928494876197,"point":547.428171958114,"high":679.6858261954567,"range":304.1365412466947,"finance_low":0,"finance_point":0.0,"finance_high":0.0,"finance_range":0.0},"Gas":{"low":324.2638273073946,"point":465.91518431539544,"high":635.8968127249965,"range":311.6329854176019,"finance_low":0,"finance_point":0.0,"finance_high":0.0,"finance_range":0.0},"Finance cost":{"low":0,"point":550.8127338070236,"high":1424.1470287688635,"range":1424.1470287688635,"finance_low":0,"finance_point":0,"finance_high":0,"finance_range":0}},"map":{"wave":0.0,"III.a.1":4.007999999999824,"III.b":52.36363636363635,"IV.a":0.0,"IV.b":0.0,"IV.c":0.0,"VI.a.Biocrop":3520.0,"VI.a.Forestry":27307.440000000002,"III.a.2":0.0,"III.c.TidalStream":0.0,"III.c.TidalRange":0.0,"VI.c":0.0,"V.b":0.0,"VII.a":0.0,"I.a":46.13999516019267,"I.b":1.4166666666666667,"II.a":2.220446049250313e-16,"III.d":0.0,"VII.c":-0.0,"VI.b":97.28908055813953},"imports":{"Coal":{"2050":{"quantity":31,"proportion":"33%"},"2007":{"quantity":330,"proportion":"69%"}},"Oil":{"2050":{"quantity":772,"proportion":"88%"},"2007":{"quantity":80,"proportion":"9%"}},"Gas":{"2050":{"quantity":2034,"proportion":"96%"},"2007":{"quantity":215,"proportion":"20%"}},"Bioenergy":{"2050":{"quantity":0,"proportion":"0%"},"2007":{"quantity":26,"proportion":"26%"}},"Uranium":{"2050":{"quantity":0,"proportion":"0%"},"2007":{"quantity":163,"proportion":"100%"}},"Electricity":{"2050":{"quantity":0,"proportion":"0%"},"2007":{"quantity":5,"proportion":"1%"}},"Primary energy":{"2050":{"quantity":2838,"proportion":"88%"},"2007":{"quantity":819,"proportion":"30%"}}},"diversity":{"Nuclear fission":{"2007":"6%","2050":"0%"},"Solar":{"2007":"0%","2050":"0%"},"Wind":{"2007":"0%","2050":"0%"},"Tidal":{"2007":"0%","2050":"0%"},"Wave":{"2007":"0%","2050":"0%"},"Geothermal":{"2007":"0%","2050":"0%"},"Hydro":{"2007":"0%","2050":"0%"},"Electricity oversupply (imports)":{"2007":"0%","2050":"0%"},"Environmental heat":{"2007":"0%","2050":"0%"},"Bioenergy":{"2007":"4%","2050":"3%"},"Coal":{"2007":"18%","2050":"3%"},"Oil":{"2007":"33%","2050":"27%"},"Natural gas":{"2007":"39%","2050":"66%"}},"air_quality":{"low":23.027647092933996,"high":60.550259470292204}});

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

    self.setActionsFromPathwayString();
  }

  Pathway.prototype = {
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

    setActionsFromPathwayString: function() {
      var magicStringLength = 53;
      var actions = this.actions();

      this.lock();

      var self = this;

      for(var i = 0; i < magicStringLength; i++) {
        // search for correct action at this point in pathway string
        for(var j = 0, l = actions.length; j < l; j++) {
          if(actions[j].pathwayStringIndex === i) {
            actions[j].value(this.getActionFromMagicChar(self.values[i], actions[j].getTypeName()));
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

