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
      { category: 'Extreme Pathways', name: 'Maximum demand, no supply', slug: 'max-demand-no-supply-example', values: '10111111111111110111111004424440444404204304440420111' },
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
    self.chartData = ko.observable({"SummaryChart":51,"OverviewChart":{"Demand":{"2010":[{"key":"Transport","value":706.444106487651},{"key":"Industry","value":476.2091343450528},{"key":"Heating and cooling","value":528.7776924146242},{"key":"Lighting & appliances","value":177.81600648688047}],"2015":[{"key":"Transport","value":702.6641886293228},{"key":"Industry","value":470.63248533677313},{"key":"Heating and cooling","value":554.2876440684616},{"key":"Lighting & appliances","value":182.74193306892022}],"2020":[{"key":"Transport","value":706.848668503111},{"key":"Industry","value":466.30266149030814},{"key":"Heating and cooling","value":587.496968208366},{"key":"Lighting & appliances","value":187.70521938033409}],"2025":[{"key":"Transport","value":692.283945589304},{"key":"Industry","value":464.6065122615868},{"key":"Heating and cooling","value":619.8794037807877},{"key":"Lighting & appliances","value":192.52941575016197}],"2030":[{"key":"Transport","value":672.6689885488088},{"key":"Industry","value":464.7828061308417},{"key":"Heating and cooling","value":651.3506034342169},{"key":"Lighting & appliances","value":197.19843246477444}],"2035":[{"key":"Transport","value":688.6605052562142},{"key":"Industry","value":467.3746566912975},{"key":"Heating and cooling","value":670.660561933137},{"key":"Lighting & appliances","value":202.79455843360853}],"2040":[{"key":"Transport","value":695.5321590938564},{"key":"Industry","value":471.5421885671836},{"key":"Heating and cooling","value":691.7386420828233},{"key":"Lighting & appliances","value":208.59233288253907}],"2045":[{"key":"Transport","value":704.7754803425539},{"key":"Industry","value":477.0611369703174},{"key":"Heating and cooling","value":715.1187043069574},{"key":"Lighting & appliances","value":214.68299602181187}],"2050":[{"key":"Transport","value":705.7805626830981},{"key":"Industry","value":483.7604177647055},{"key":"Heating and cooling","value":741.2139993060407},{"key":"Lighting & appliances","value":221.0826352390672}]},"Supply":{"2010":[{"key":"Nuclear fission","value":160.70999999999998},{"key":"Solar","value":5.51458627519308},{"key":"Wind","value":15.729272100000001},{"key":"Tidal","value":0.0050034246575342495},{"key":"Wave","value":0},{"key":"Geothermal","value":0},{"key":"Hydro","value":5.329728000000001},{"key":"Environmental heat","value":0},{"key":"Bioenergy","value":77.55276166111199},{"key":"Coal","value":452.35749855182064},{"key":"Oil","value":856.6153728771828},{"key":"Natural gas","value":985.5154828668134}],"2015":[{"key":"Nuclear fission","value":134.9964},{"key":"Solar","value":16.66874243661752},{"key":"Wind","value":55.714285350000004},{"key":"Tidal","value":0.34023287671233005},{"key":"Wave","value":0.35524315068493184},{"key":"Geothermal","value":0.0911664},{"key":"Hydro","value":6.0792209999999995},{"key":"Environmental heat","value":0},{"key":"Bioenergy","value":165.03237167385106},{"key":"Coal","value":363.00336198155617},{"key":"Oil","value":823.6978861668536},{"key":"Natural gas","value":954.6770524441315}],"2020":[{"key":"Nuclear fission","value":209.99440000000004},{"key":"Solar","value":48.348891755162796},{"key":"Wind","value":181.84213191599997},{"key":"Tidal","value":10.068528865753425},{"key":"Wave","value":1.5393869863013698},{"key":"Geothermal","value":1.0939968000000002},{"key":"Hydro","value":7.203460500000001},{"key":"Environmental heat","value":0},{"key":"Bioenergy","value":279.2716232761628},{"key":"Coal","value":39.63085274325297},{"key":"Oil","value":807.999530796468},{"key":"Natural gas","value":746.9135648145536}],"2025":[{"key":"Nuclear fission","value":479.9872000000001},{"key":"Solar","value":127.66470247929115},{"key":"Wind","value":332.59553963999997},{"key":"Tidal","value":29.3847527671233},{"key":"Wave","value":3.5524315068493184},{"key":"Geothermal","value":13.127961600000003},{"key":"Hydro","value":8.889819750000001},{"key":"Environmental heat","value":0},{"key":"Bioenergy","value":374.5954759005276},{"key":"Coal","value":48.98884967177088},{"key":"Oil","value":772.0069526884903},{"key":"Natural gas","value":782.3941574840378}],"2030":[{"key":"Nuclear fission","value":1015.6872000000004},{"key":"Solar","value":177.40740529868015},{"key":"Wind","value":509.70099852000004},{"key":"Tidal","value":32.78708153424657},{"key":"Wave","value":7.104863013698637},{"key":"Geothermal","value":35.064},{"key":"Hydro","value":11.419358625},{"key":"Environmental heat","value":0},{"key":"Bioenergy","value":468.56749342984256},{"key":"Coal","value":27.713087217058018},{"key":"Oil","value":731.4726767566965},{"key":"Natural gas","value":967.1445694345496}],"2035":[{"key":"Nuclear fission","value":1525.6736000000003},{"key":"Solar","value":201.89851136036813},{"key":"Wind","value":736.51072932},{"key":"Tidal","value":41.59038706849314},{"key":"Wave","value":14.209726027397252},{"key":"Geothermal","value":35.064},{"key":"Hydro","value":13.32432},{"key":"Environmental heat","value":0},{"key":"Bioenergy","value":556.3621638251102},{"key":"Coal","value":5.458456954049737},{"key":"Oil","value":726.4104329284779},{"key":"Natural gas","value":1148.5516660291814}],"2040":[{"key":"Nuclear fission","value":2061.3736000000004},{"key":"Solar","value":219.76083912556402},{"key":"Wind","value":868.0007293200001},{"key":"Tidal","value":60.33110772602738},{"key":"Wave","value":29.60359589041095},{"key":"Geothermal","value":35.064},{"key":"Hydro","value":13.32432},{"key":"Environmental heat","value":0},{"key":"Bioenergy","value":656.5347924583783},{"key":"Coal","value":0},{"key":"Oil","value":712.4524492614698},{"key":"Natural gas","value":1325.0398544034629}],"2045":[{"key":"Nuclear fission","value":2597.0736000000006},{"key":"Solar","value":237.1736136859539},{"key":"Wind","value":978.45232932},{"key":"Tidal","value":91.4122482739725},{"key":"Wave","value":56.83890410958893},{"key":"Geothermal","value":35.064},{"key":"Hydro","value":13.32432},{"key":"Environmental heat","value":0},{"key":"Bioenergy","value":758.5643039766933},{"key":"Coal","value":0},{"key":"Oil","value":701.2266385767889},{"key":"Natural gas","value":1491.893807352507}],"2050":[{"key":"Nuclear fission","value":3132.7736},{"key":"Solar","value":255.68675984280537},{"key":"Wind","value":1069.18042932},{"key":"Tidal","value":106.68710334246569},{"key":"Wave","value":71.04863013698636},{"key":"Geothermal","value":35.064},{"key":"Hydro","value":13.32432},{"key":"Environmental heat","value":0},{"key":"Bioenergy","value":868.1135144242454},{"key":"Coal","value":0},{"key":"Oil","value":681.5653810425827},{"key":"Natural gas","value":1643.7251484606993}]},"Emissions":{"2010":[{"key":"Fuel Combustion","value":523.5964481812903},{"key":"Industrial Processes","value":27.365812292626387},{"key":"Solvent and Other Product Use","value":0},{"key":"Agriculture","value":42.13457713706225},{"key":"Land Use, Land-Use Change and Forestry","value":2.685792057600377},{"key":"Waste","value":15.21267066552306},{"key":"Other","value":0},{"key":"International Aviation and Shipping","value":46.453918754749346},{"key":"Bioenergy credit","value":17.106112016869805},{"key":"Carbon capture","value":0}],"2015":[{"key":"Fuel Combustion","value":496.9592302882817},{"key":"Industrial Processes","value":26.551789727620744},{"key":"Solvent and Other Product Use","value":0},{"key":"Agriculture","value":39.07990853657002},{"key":"Land Use, Land-Use Change and Forestry","value":5.464901095502293},{"key":"Waste","value":13.113978787248499},{"key":"Other","value":0},{"key":"International Aviation and Shipping","value":52.19269100274443},{"key":"Bioenergy credit","value":37.76470435362482},{"key":"Carbon capture","value":2.8350150827586207}],"2020":[{"key":"Fuel Combustion","value":375.6630628100611},{"key":"Industrial Processes","value":25.80984051401508},{"key":"Solvent and Other Product Use","value":0},{"key":"Agriculture","value":36.163086708211765},{"key":"Land Use, Land-Use Change and Forestry","value":7.475576965471847},{"key":"Waste","value":11.017170998378047},{"key":"Other","value":0},{"key":"International Aviation and Shipping","value":58.554128553904185},{"key":"Bioenergy credit","value":65.82024674123574},{"key":"Carbon capture","value":6.678458816949153}],"2025":[{"key":"Fuel Combustion","value":401.4487203303639},{"key":"Industrial Processes","value":25.134410214991846},{"key":"Solvent and Other Product Use","value":0},{"key":"Agriculture","value":35.629495668699576},{"key":"Land Use, Land-Use Change and Forestry","value":8.594077319309696},{"key":"Waste","value":9.201296513402735},{"key":"Other","value":0},{"key":"International Aviation and Shipping","value":63.00928576171873},{"key":"Bioenergy credit","value":95.71246044701472},{"key":"Carbon capture","value":27.103084685217386}],"2030":[{"key":"Fuel Combustion","value":440.1235346657798},{"key":"Industrial Processes","value":24.520390394118913},{"key":"Solvent and Other Product Use","value":0},{"key":"Agriculture","value":35.110601895707376},{"key":"Land Use, Land-Use Change and Forestry","value":7.5283379343751875},{"key":"Waste","value":7.4840871138355265},{"key":"Other","value":0},{"key":"International Aviation and Shipping","value":67.24417545140071},{"key":"Bioenergy credit","value":122.28321746531128},{"key":"Carbon capture","value":54.95043049577955}],"2035":[{"key":"Fuel Combustion","value":485.40440916447557},{"key":"Industrial Processes","value":23.96308267721259},{"key":"Solvent and Other Product Use","value":0},{"key":"Agriculture","value":34.60595174978886},{"key":"Land Use, Land-Use Change and Forestry","value":5.812680464276858},{"key":"Waste","value":6.527258339295222},{"key":"Other","value":0},{"key":"International Aviation and Shipping","value":72.66360699371727},{"key":"Bioenergy credit","value":147.3442273931713},{"key":"Carbon capture","value":83.89076315443548}],"2040":[{"key":"Fuel Combustion","value":535.5546077275876},{"key":"Industrial Processes","value":23.458165722911836},{"key":"Solvent and Other Product Use","value":0},{"key":"Agriculture","value":34.115105783606744},{"key":"Land Use, Land-Use Change and Forestry","value":2.7719875464120802},{"key":"Waste","value":5.663074805005346},{"key":"Other","value":0},{"key":"International Aviation and Shipping","value":76.43181920884129},{"key":"Bioenergy credit","value":175.78628508310894},{"key":"Carbon capture","value":112.02316378392857}],"2045":[{"key":"Fuel Combustion","value":586.2011394060826},{"key":"Industrial Processes","value":23.001664866127772},{"key":"Solvent and Other Product Use","value":0},{"key":"Agriculture","value":33.63763829718192},{"key":"Land Use, Land-Use Change and Forestry","value":0.5470886426277637},{"key":"Waste","value":4.8139496029796955},{"key":"Other","value":0},{"key":"International Aviation and Shipping","value":79.76691774229698},{"key":"Bioenergy credit","value":203.50643511207582},{"key":"Carbon capture","value":139.16665622410713}],"2050":[{"key":"Fuel Combustion","value":636.2585916948569},{"key":"Industrial Processes","value":22.58992421767131},{"key":"Solvent and Other Product Use","value":0},{"key":"Agriculture","value":33.17313690708554},{"key":"Land Use, Land-Use Change and Forestry","value":3.161689517582234},{"key":"Waste","value":4.019360914305832},{"key":"Other","value":0},{"key":"International Aviation and Shipping","value":81.05235935157397},{"key":"Bioenergy credit","value":231.28355754449413},{"key":"Carbon capture","value":165.4759775492307}]}},"EnergyDemandChart":{"chartLayers":[{"key":"Transport","date":2010,"value":706.444106487651,"y0":654.0251408319333,"y":706.444106487651},{"key":"Transport","date":2015,"value":702.6641886293228,"y0":653.3744184056934,"y":702.6641886293228},{"key":"Transport","date":2020,"value":706.848668503111,"y0":654.0078808706422,"y":706.848668503111},{"key":"Transport","date":2025,"value":692.283945589304,"y0":657.1359280117488,"y":692.283945589304},{"key":"Transport","date":2030,"value":672.6689885488088,"y0":661.9812385956161,"y":672.6689885488088},{"key":"Transport","date":2035,"value":688.6605052562142,"y0":670.169215124906,"y":688.6605052562142},{"key":"Transport","date":2040,"value":695.5321590938564,"y0":680.1345214497227,"y":695.5321590938564},{"key":"Transport","date":2045,"value":704.7754803425539,"y0":691.7441329921293,"y":704.7754803425539},{"key":"Transport","date":2050,"value":705.7805626830981,"y0":704.8430530037726,"y":705.7805626830981},{"key":"Industry","date":2010,"value":476.2091343450528,"y0":177.81600648688047,"y":476.2091343450528},{"key":"Industry","date":2015,"value":470.63248533677313,"y0":182.74193306892022,"y":470.63248533677313},{"key":"Industry","date":2020,"value":466.30266149030814,"y0":187.70521938033409,"y":466.30266149030814},{"key":"Industry","date":2025,"value":464.6065122615868,"y0":192.52941575016197,"y":464.6065122615868},{"key":"Industry","date":2030,"value":464.7828061308417,"y0":197.19843246477444,"y":464.7828061308417},{"key":"Industry","date":2035,"value":467.3746566912975,"y0":202.79455843360853,"y":467.3746566912975},{"key":"Industry","date":2040,"value":471.5421885671836,"y0":208.59233288253907,"y":471.5421885671836},{"key":"Industry","date":2045,"value":477.0611369703174,"y0":214.68299602181187,"y":477.0611369703174},{"key":"Industry","date":2050,"value":483.7604177647055,"y0":221.0826352390672,"y":483.7604177647055},{"key":"Heating and cooling","date":2010,"value":528.7776924146242,"y0":1360.4692473195842,"y":528.7776924146242},{"key":"Heating and cooling","date":2015,"value":554.2876440684616,"y0":1356.0386070350162,"y":554.2876440684616},{"key":"Heating and cooling","date":2020,"value":587.496968208366,"y0":1360.8565493737533,"y":587.496968208366},{"key":"Heating and cooling","date":2025,"value":619.8794037807877,"y0":1349.4198736010528,"y":619.8794037807877},{"key":"Heating and cooling","date":2030,"value":651.3506034342169,"y0":1334.650227144425,"y":651.3506034342169},{"key":"Heating and cooling","date":2035,"value":670.660561933137,"y0":1358.8297203811203,"y":670.660561933137},{"key":"Heating and cooling","date":2040,"value":691.7386420828233,"y0":1375.666680543579,"y":691.7386420828233},{"key":"Heating and cooling","date":2045,"value":715.1187043069574,"y0":1396.519613334683,"y":715.1187043069574},{"key":"Heating and cooling","date":2050,"value":741.2139993060407,"y0":1410.6236156868708,"y":741.2139993060407},{"key":"Lighting & appliances","date":2010,"value":177.81600648688047,"y0":0,"y":177.81600648688047},{"key":"Lighting & appliances","date":2015,"value":182.74193306892022,"y0":0,"y":182.74193306892022},{"key":"Lighting & appliances","date":2020,"value":187.70521938033409,"y0":0,"y":187.70521938033409},{"key":"Lighting & appliances","date":2025,"value":192.52941575016197,"y0":0,"y":192.52941575016197},{"key":"Lighting & appliances","date":2030,"value":197.19843246477444,"y0":0,"y":197.19843246477444},{"key":"Lighting & appliances","date":2035,"value":202.79455843360853,"y0":0,"y":202.79455843360853},{"key":"Lighting & appliances","date":2040,"value":208.59233288253907,"y0":0,"y":208.59233288253907},{"key":"Lighting & appliances","date":2045,"value":214.68299602181187,"y0":0,"y":214.68299602181187},{"key":"Lighting & appliances","date":2050,"value":221.0826352390672,"y0":0,"y":221.0826352390672}],"chartLine":[{"date":2010,"value":2559.3297057567793},{"date":2015,"value":2520.655963480407},{"date":2020,"value":2345.906368453655},{"date":2025,"value":2606.2892255132974},{"date":2030,"value":3097.843514686775},{"date":2035,"value":3594.7152576313965},{"date":2040,"value":4111.621602176521},{"date":2045,"value":4630.5852078794705},{"date":2050,"value":5140.222550468103}]},"EnergySupplyChart":{"chartLayers":[{"key":"Nuclear fission","date":2010,"value":160.70999999999998,"y0":2398.6197057567792,"y":160.70999999999998},{"key":"Nuclear fission","date":2015,"value":134.9964,"y0":2385.659563480407,"y":134.9964},{"key":"Nuclear fission","date":2020,"value":209.99440000000004,"y0":2123.911968453655,"y":209.99440000000004},{"key":"Nuclear fission","date":2025,"value":479.9872000000001,"y0":2493.2006434880905,"y":479.9872000000001},{"key":"Nuclear fission","date":2030,"value":1015.6872000000004,"y0":2968.381533829772,"y":1015.6872000000004},{"key":"Nuclear fission","date":2035,"value":1525.6736000000003,"y0":3479.3803935130777,"y":1525.6736000000003},{"key":"Nuclear fission","date":2040,"value":2061.3736000000004,"y0":3920.1116881853136,"y":2061.3736000000004},{"key":"Nuclear fission","date":2045,"value":2597.0736000000006,"y0":4363.950165295504,"y":2597.0736000000006},{"key":"Nuclear fission","date":2050,"value":3132.7736,"y0":4744.395286569785,"y":3132.7736},{"key":"Solar","date":2010,"value":5.51458627519308,"y0":457.6922299764782,"y":5.51458627519308},{"key":"Solar","date":2015,"value":16.66874243661752,"y0":369.86922540895347,"y":16.66874243661752},{"key":"Solar","date":2020,"value":48.348891755162796,"y0":59.536225895307766,"y":48.348891755162796},{"key":"Solar","date":2025,"value":127.66470247929115,"y0":103.9438152957435,"y":127.66470247929115},{"key":"Solar","date":2030,"value":177.40740529868015,"y0":114.08839039000321,"y":177.40740529868015},{"key":"Solar","date":2035,"value":201.89851136036813,"y0":109.64689004994013,"y":201.89851136036813},{"key":"Solar","date":2040,"value":219.76083912556402,"y0":138.32302361643832,"y":219.76083912556402},{"key":"Solar","date":2045,"value":237.1736136859539,"y0":196.63947238356144,"y":237.1736136859539},{"key":"Solar","date":2050,"value":255.68675984280537,"y0":226.12405347945204,"y":255.68675984280537},{"key":"Wind","date":2010,"value":15.729272100000001,"y0":1397.374950789966,"y":15.729272100000001},{"key":"Wind","date":2015,"value":55.714285350000004,"y0":1375.2682256862756,"y":55.714285350000004},{"key":"Wind","date":2020,"value":181.84213191599997,"y0":1195.1562717231013,"y":181.84213191599997},{"key":"Wind","date":2025,"value":332.59553963999997,"y0":1378.2109463640527,"y":332.59553963999997},{"key":"Wind","date":2030,"value":509.70099852000004,"y0":1491.5359658752222,"y":509.70099852000004},{"key":"Wind","date":2035,"value":736.51072932,"y0":1594.3179981638964,"y":736.51072932},{"key":"Wind","date":2040,"value":868.0007293200001,"y0":1727.0711044618506,"y":868.0007293200001},{"key":"Wind","date":2045,"value":978.45232932,"y0":1893.6040286229975,"y":978.45232932},{"key":"Wind","date":2050,"value":1069.18042932,"y0":2031.4897087890854,"y":1069.18042932},{"key":"Tidal","date":2010,"value":0.0050034246575342495,"y0":457.68722655182063,"y":0.0050034246575342495},{"key":"Tidal","date":2015,"value":0.34023287671233005,"y0":369.52899253224115,"y":0.34023287671233005},{"key":"Tidal","date":2020,"value":10.068528865753425,"y0":49.467697029554344,"y":10.068528865753425},{"key":"Tidal","date":2025,"value":29.3847527671233,"y0":74.5590625286202,"y":29.3847527671233},{"key":"Tidal","date":2030,"value":32.78708153424657,"y0":81.30130885575664,"y":32.78708153424657},{"key":"Tidal","date":2035,"value":41.59038706849314,"y0":68.05650298144698,"y":41.59038706849314},{"key":"Tidal","date":2040,"value":60.33110772602738,"y0":77.99191589041095,"y":60.33110772602738},{"key":"Tidal","date":2045,"value":91.4122482739725,"y0":105.22722410958893,"y":91.4122482739725},{"key":"Tidal","date":2050,"value":106.68710334246569,"y0":119.43695013698635,"y":106.68710334246569},{"key":"Wave","date":2010,"value":0,"y0":457.68722655182063,"y":0},{"key":"Wave","date":2015,"value":0.35524315068493184,"y0":369.1737493815562,"y":0.35524315068493184},{"key":"Wave","date":2020,"value":1.5393869863013698,"y0":47.92831004325297,"y":1.5393869863013698},{"key":"Wave","date":2025,"value":3.5524315068493184,"y0":71.00663102177089,"y":3.5524315068493184},{"key":"Wave","date":2030,"value":7.104863013698637,"y0":74.19644584205801,"y":7.104863013698637},{"key":"Wave","date":2035,"value":14.209726027397252,"y0":53.84677695404974,"y":14.209726027397252},{"key":"Wave","date":2040,"value":29.60359589041095,"y0":48.38832,"y":29.60359589041095},{"key":"Wave","date":2045,"value":56.83890410958893,"y0":48.38832,"y":56.83890410958893},{"key":"Wave","date":2050,"value":71.04863013698636,"y0":48.38832,"y":71.04863013698636},{"key":"Geothermal","date":2010,"value":0,"y0":457.68722655182063,"y":0},{"key":"Geothermal","date":2015,"value":0.0911664,"y0":369.0825829815562,"y":0.0911664},{"key":"Geothermal","date":2020,"value":1.0939968000000002,"y0":46.83431324325297,"y":1.0939968000000002},{"key":"Geothermal","date":2025,"value":13.127961600000003,"y0":57.87866942177088,"y":13.127961600000003},{"key":"Geothermal","date":2030,"value":35.064,"y0":39.13244584205802,"y":35.064},{"key":"Geothermal","date":2035,"value":35.064,"y0":18.782776954049737,"y":35.064},{"key":"Geothermal","date":2040,"value":35.064,"y0":13.32432,"y":35.064},{"key":"Geothermal","date":2045,"value":35.064,"y0":13.32432,"y":35.064},{"key":"Geothermal","date":2050,"value":35.064,"y0":13.32432,"y":35.064},{"key":"Hydro","date":2010,"value":5.329728000000001,"y0":452.35749855182064,"y":5.329728000000001},{"key":"Hydro","date":2015,"value":6.0792209999999995,"y0":363.00336198155617,"y":6.0792209999999995},{"key":"Hydro","date":2020,"value":7.203460500000001,"y0":39.63085274325297,"y":7.203460500000001},{"key":"Hydro","date":2025,"value":8.889819750000001,"y0":48.98884967177088,"y":8.889819750000001},{"key":"Hydro","date":2030,"value":11.419358625,"y0":27.713087217058018,"y":11.419358625},{"key":"Hydro","date":2035,"value":13.32432,"y0":5.458456954049737,"y":13.32432},{"key":"Hydro","date":2040,"value":13.32432,"y0":0,"y":13.32432},{"key":"Hydro","date":2045,"value":13.32432,"y0":0,"y":13.32432},{"key":"Hydro","date":2050,"value":13.32432,"y0":0,"y":13.32432},{"key":"Environmental heat","date":2010,"value":0,"y0":0,"y":0},{"key":"Environmental heat","date":2015,"value":0,"y0":0,"y":0},{"key":"Environmental heat","date":2020,"value":0,"y0":0,"y":0},{"key":"Environmental heat","date":2025,"value":0,"y0":0,"y":0},{"key":"Environmental heat","date":2030,"value":0,"y0":0,"y":0},{"key":"Environmental heat","date":2035,"value":0,"y0":0,"y":0},{"key":"Environmental heat","date":2040,"value":0,"y0":0,"y":0},{"key":"Environmental heat","date":2045,"value":0,"y0":0,"y":0},{"key":"Environmental heat","date":2050,"value":0,"y0":0,"y":0},{"key":"Bioenergy","date":2010,"value":77.55276166111199,"y0":1319.822189128854,"y":77.55276166111199},{"key":"Bioenergy","date":2015,"value":165.03237167385106,"y0":1210.2358540124246,"y":165.03237167385106},{"key":"Bioenergy","date":2020,"value":279.2716232761628,"y0":915.8846484469385,"y":279.2716232761628},{"key":"Bioenergy","date":2025,"value":374.5954759005276,"y0":1003.615470463525,"y":374.5954759005276},{"key":"Bioenergy","date":2030,"value":468.56749342984256,"y0":1022.9684724453798,"y":468.56749342984256},{"key":"Bioenergy","date":2035,"value":556.3621638251102,"y0":1037.9558343387862,"y":556.3621638251102},{"key":"Bioenergy","date":2040,"value":656.5347924583783,"y0":1070.5363120034722,"y":656.5347924583783},{"key":"Bioenergy","date":2045,"value":758.5643039766933,"y0":1135.0397246463042,"y":758.5643039766933},{"key":"Bioenergy","date":2050,"value":868.1135144242454,"y0":1163.37619436484,"y":868.1135144242454},{"key":"Coal","date":2010,"value":452.35749855182064,"y0":0,"y":452.35749855182064},{"key":"Coal","date":2015,"value":363.00336198155617,"y0":0,"y":363.00336198155617},{"key":"Coal","date":2020,"value":39.63085274325297,"y0":0,"y":39.63085274325297},{"key":"Coal","date":2025,"value":48.98884967177088,"y0":0,"y":48.98884967177088},{"key":"Coal","date":2030,"value":27.713087217058018,"y0":0,"y":27.713087217058018},{"key":"Coal","date":2035,"value":5.458456954049737,"y0":0,"y":5.458456954049737},{"key":"Coal","date":2040,"value":0,"y0":0,"y":0},{"key":"Coal","date":2045,"value":0,"y0":0,"y":0},{"key":"Coal","date":2050,"value":0,"y0":0,"y":0},{"key":"Oil","date":2010,"value":856.6153728771828,"y0":463.2068162516713,"y":856.6153728771828},{"key":"Oil","date":2015,"value":823.6978861668536,"y0":386.53796784557096,"y":823.6978861668536},{"key":"Oil","date":2020,"value":807.999530796468,"y0":107.88511765047056,"y":807.999530796468},{"key":"Oil","date":2025,"value":772.0069526884903,"y0":231.60851777503467,"y":772.0069526884903},{"key":"Oil","date":2030,"value":731.4726767566965,"y0":291.49579568868336,"y":731.4726767566965},{"key":"Oil","date":2035,"value":726.4104329284779,"y0":311.5454014103083,"y":726.4104329284779},{"key":"Oil","date":2040,"value":712.4524492614698,"y0":358.08386274200234,"y":712.4524492614698},{"key":"Oil","date":2045,"value":701.2266385767889,"y0":433.81308606951535,"y":701.2266385767889},{"key":"Oil","date":2050,"value":681.5653810425827,"y0":481.81081332225745,"y":681.5653810425827},{"key":"Natural gas","date":2010,"value":985.5154828668134,"y0":1413.104222889966,"y":985.5154828668134},{"key":"Natural gas","date":2015,"value":954.6770524441315,"y0":1430.9825110362756,"y":954.6770524441315},{"key":"Natural gas","date":2020,"value":746.9135648145536,"y0":1376.9984036391013,"y":746.9135648145536},{"key":"Natural gas","date":2025,"value":782.3941574840378,"y0":1710.8064860040527,"y":782.3941574840378},{"key":"Natural gas","date":2030,"value":967.1445694345496,"y0":2001.2369643952222,"y":967.1445694345496},{"key":"Natural gas","date":2035,"value":1148.5516660291814,"y0":2330.8287274838963,"y":1148.5516660291814},{"key":"Natural gas","date":2040,"value":1325.0398544034629,"y0":2595.0718337818507,"y":1325.0398544034629},{"key":"Natural gas","date":2045,"value":1491.893807352507,"y0":2872.0563579429972,"y":1491.893807352507},{"key":"Natural gas","date":2050,"value":1643.7251484606993,"y0":3100.670138109085,"y":1643.7251484606993}],"chartLine":[{"date":2010,"value":1889.2469397342086},{"date":2015,"value":1910.326251103478},{"date":2020,"value":1948.3535175821191},{"date":2025,"value":1969.2992773818405},{"date":2030,"value":1986.0008305786416},{"date":2035,"value":2029.490282314257},{"date":2040,"value":2067.4053226264027},{"date":2045,"value":2111.6383176416407},{"date":2050,"value":2151.8376149929113}]},"ElectricityDemandChart":{"chartLayers":[{"key":"Transport","date":2010,"value":8.184036113841765,"y0":0,"y":8.184036113841765},{"key":"Transport","date":2015,"value":8.24184974404536,"y0":0,"y":8.24184974404536},{"key":"Transport","date":2020,"value":8.432226424844915,"y0":0,"y":8.432226424844915},{"key":"Transport","date":2025,"value":10.540127413629769,"y0":0,"y":10.540127413629769},{"key":"Transport","date":2030,"value":12.520966156590639,"y0":0,"y":12.520966156590639},{"key":"Transport","date":2035,"value":14.704919491999274,"y0":0,"y":14.704919491999274},{"key":"Transport","date":2040,"value":16.88397515316366,"y0":0,"y":16.88397515316366},{"key":"Transport","date":2045,"value":18.840516035363592,"y0":0,"y":18.840516035363592},{"key":"Transport","date":2050,"value":21.051674472385923,"y0":0,"y":21.051674472385923},{"key":"Industry","date":2010,"value":127.2709002423955,"y0":69.55283448187394,"y":127.2709002423955},{"key":"Industry","date":2015,"value":128.1849546804562,"y0":68.7150414768503,"y":128.1849546804562},{"key":"Industry","date":2020,"value":129.27919596533982,"y0":74.67219480563406,"y":129.27919596533982},{"key":"Industry","date":2025,"value":130.61172946085105,"y0":82.12562175658698,"y":130.61172946085105},{"key":"Industry","date":2030,"value":131.74140960648833,"y0":89.04094700674028,"y":131.74140960648833},{"key":"Industry","date":2035,"value":133.57395507414628,"y0":94.94133298691631,"y":133.57395507414628},{"key":"Industry","date":2040,"value":135.6043567746535,"y0":100.562335432792,"y":135.6043567746535},{"key":"Industry","date":2045,"value":137.8249063783574,"y0":105.77638204538499,"y":137.8249063783574},{"key":"Industry","date":2050,"value":140.23032313753478,"y0":111.20036112591379,"y":140.23032313753478},{"key":"Heating and cooling","date":2010,"value":61.368798368032174,"y0":8.184036113841765,"y":61.368798368032174},{"key":"Heating and cooling","date":2015,"value":60.47319173280495,"y0":8.24184974404536,"y":60.47319173280495},{"key":"Heating and cooling","date":2020,"value":66.23996838078915,"y0":8.432226424844915,"y":66.23996838078915},{"key":"Heating and cooling","date":2025,"value":71.58549434295722,"y0":10.540127413629769,"y":71.58549434295722},{"key":"Heating and cooling","date":2030,"value":76.51998085014964,"y0":12.520966156590639,"y":76.51998085014964},{"key":"Heating and cooling","date":2035,"value":80.23641349491703,"y0":14.704919491999274,"y":80.23641349491703},{"key":"Heating and cooling","date":2040,"value":83.67836027962834,"y0":16.88397515316366,"y":83.67836027962834},{"key":"Heating and cooling","date":2045,"value":86.9358660100214,"y0":18.840516035363592,"y":86.9358660100214},{"key":"Heating and cooling","date":2050,"value":90.14868665352786,"y0":21.051674472385923,"y":90.14868665352786},{"key":"Lighting & appliances","date":2010,"value":160.42544870690443,"y0":196.82373472426946,"y":160.42544870690443},{"key":"Lighting & appliances","date":2015,"value":164.63670739026009,"y0":196.8999961573065,"y":164.63670739026009},{"key":"Lighting & appliances","date":2020,"value":168.81214477803974,"y0":203.9513907709739,"y":168.81214477803974},{"key":"Lighting & appliances","date":2025,"value":172.7839092495832,"y0":212.73735121743803,"y":172.7839092495832},{"key":"Lighting & appliances","date":2030,"value":176.5449480156904,"y0":220.78235661322861,"y":176.5449480156904},{"key":"Lighting & appliances","date":2035,"value":181.10445293713374,"y0":228.5152880610626,"y":181.10445293713374},{"key":"Lighting & appliances","date":2040,"value":185.7876640441699,"y0":236.1666922074455,"y":185.7876640441699},{"key":"Lighting & appliances","date":2045,"value":190.6630469229624,"y0":243.6012884237424,"y":190.6630469229624},{"key":"Lighting & appliances","date":2050,"value":195.73929047934274,"y0":251.43068426344857,"y":195.73929047934274}],"chartLine":[{"date":2010,"value":383.80694189496177},{"date":2015,"value":386.28158938494965},{"date":2020,"value":391.85130564810345},{"date":2025,"value":801.3999950521707},{"date":2030,"value":1350.3492881063464},{"date":2035,"value":1911.599834447336},{"date":2040,"value":2400.860905448025},{"date":2045,"value":2890.638798923706},{"date":2050,"value":3334.179388939083}]},"ElectricitySupplyChart":{"chartLayers":[{"key":"Biomass/Coal power stations","date":2010,"value":310.1700638419949,"y0":327.0830256903042,"y":310.1700638419949},{"key":"Biomass/Coal power stations","date":2015,"value":275.2800694508186,"y0":314.2850691525524,"y":275.2800694508186},{"key":"Biomass/Coal power stations","date":2020,"value":85.06160807004863,"y0":186.56746469004864,"y":85.06160807004863},{"key":"Biomass/Coal power stations","date":2025,"value":69.82119,"y0":299.36077423319813,"y":69.82119},{"key":"Biomass/Coal power stations","date":2030,"value":87.30936,"y0":419.96627974340106,"y":87.30936},{"key":"Biomass/Coal power stations","date":2035,"value":102.69368999999999,"y0":484.4720150914455,"y":102.69368999999999},{"key":"Biomass/Coal power stations","date":2040,"value":124.38954000000004,"y0":537.8162709265862,"y":124.38954000000004},{"key":"Biomass/Coal power stations","date":2045,"value":146.08539000000002,"y0":583.0414441151443,"y":146.08539000000002},{"key":"Biomass/Coal power stations","date":2050,"value":167.78124000000003,"y0":627.8534808096306,"y":167.78124000000003},{"key":"Domestic space heating and hot water","date":2010,"value":0,"y0":0,"y":0},{"key":"Domestic space heating and hot water","date":2015,"value":0,"y0":0,"y":0},{"key":"Domestic space heating and hot water","date":2020,"value":0,"y0":0,"y":0},{"key":"Domestic space heating and hot water","date":2025,"value":0,"y0":0,"y":0},{"key":"Domestic space heating and hot water","date":2030,"value":0,"y0":0,"y":0},{"key":"Domestic space heating and hot water","date":2035,"value":0,"y0":0,"y":0},{"key":"Domestic space heating and hot water","date":2040,"value":0,"y0":0,"y":0},{"key":"Domestic space heating and hot water","date":2045,"value":0,"y0":0,"y":0},{"key":"Domestic space heating and hot water","date":2050,"value":0,"y0":0,"y":0},{"key":"Commercial heating and cooling","date":2010,"value":0,"y0":0,"y":0},{"key":"Commercial heating and cooling","date":2015,"value":0,"y0":0,"y":0},{"key":"Commercial heating and cooling","date":2020,"value":0,"y0":0,"y":0},{"key":"Commercial heating and cooling","date":2025,"value":0,"y0":0,"y":0},{"key":"Commercial heating and cooling","date":2030,"value":0,"y0":0,"y":0},{"key":"Commercial heating and cooling","date":2035,"value":0,"y0":0,"y":0},{"key":"Commercial heating and cooling","date":2040,"value":0,"y0":0,"y":0},{"key":"Commercial heating and cooling","date":2045,"value":0,"y0":0,"y":0},{"key":"Commercial heating and cooling","date":2050,"value":0,"y0":0,"y":0},{"key":"Unabated thermal generation","date":2010,"value":310.1700638419949,"y0":16.912961848309354,"y":310.1700638419949},{"key":"Unabated thermal generation","date":2015,"value":275.2800694508186,"y0":39.004999701733794,"y":275.2800694508186},{"key":"Unabated thermal generation","date":2020,"value":85.06160807004863,"y0":101.50585662,"y":85.06160807004863},{"key":"Unabated thermal generation","date":2025,"value":69.82119,"y0":229.53958423319813,"y":69.82119},{"key":"Unabated thermal generation","date":2030,"value":87.30936,"y0":332.6569197434011,"y":87.30936},{"key":"Unabated thermal generation","date":2035,"value":102.69368999999999,"y0":381.7783250914455,"y":102.69368999999999},{"key":"Unabated thermal generation","date":2040,"value":124.38954000000004,"y0":413.4267309265861,"y":124.38954000000004},{"key":"Unabated thermal generation","date":2045,"value":146.08539000000002,"y0":436.95605411514424,"y":146.08539000000002},{"key":"Unabated thermal generation","date":2050,"value":167.78124000000003,"y0":460.07224080963056,"y":167.78124000000003},{"key":"Carbon Capture Storage (CCS)","date":2010,"value":0,"y0":637.2580929569566,"y":0},{"key":"Carbon Capture Storage (CCS)","date":2015,"value":5.079787425,"y0":590.2606146307683,"y":5.079787425},{"key":"Carbon Capture Storage (CCS)","date":2020,"value":10.834644510000002,"y0":283.2369886121521,"y":10.834644510000002},{"key":"Carbon Capture Storage (CCS)","date":2025,"value":76.968000225,"y0":402.11914850717073,"y":76.968000225},{"key":"Carbon Capture Storage (CCS)","date":2030,"value":170.441304615,"y0":547.1675842913462,"y":170.441304615},{"key":"Carbon Capture Storage (CCS)","date":2035,"value":270.44959625999996,"y0":642.9658181873359,"y":270.44959625999996},{"key":"Carbon Capture Storage (CCS)","date":2040,"value":370.681420905,"y0":752.1405145430246,"y":370.681420905},{"key":"Carbon Capture Storage (CCS)","date":2045,"value":471.14609242500006,"y0":877.3779864987057,"y":471.14609242500006},{"key":"Carbon Capture Storage (CCS)","date":2050,"value":574.3419646499999,"y0":973.3704542890827,"y":574.3419646499999},{"key":"Nuclear power","date":2010,"value":52.596,"y0":641.3810057369566,"y":52.596},{"key":"Nuclear power","date":2015,"value":44.18064,"y0":617.3810188357683,"y":44.18064},{"key":"Nuclear power","date":2020,"value":68.72544,"y0":408.1874737181521,"y":68.72544},{"key":"Nuclear power","date":2025,"value":157.08672,"y0":714.1344650521708,"y":157.08672},{"key":"Nuclear power","date":2030,"value":332.4067200000001,"y0":1105.2519281063462,"y":332.4067200000001},{"key":"Nuclear power","date":2035,"value":499.3113600000001,"y0":1514.982164447336,"y":499.3113600000001},{"key":"Nuclear power","date":2040,"value":674.6313600000001,"y0":1850.6190854480246,"y":674.6313600000001},{"key":"Nuclear power","date":2045,"value":849.9513600000001,"y0":2186.7728289237057,"y":849.9513600000001},{"key":"Nuclear power","date":2050,"value":1025.27136,"y0":2476.6892689390825,"y":1025.27136},{"key":"Onshore wind","date":2010,"value":11.501167319999997,"y0":5.329728000000001,"y":11.501167319999997},{"key":"Onshore wind","date":2015,"value":31.487647319999997,"y0":6.170387399999999,"y":31.487647319999997},{"key":"Onshore wind","date":2020,"value":59.10054731999999,"y0":8.297457300000001,"y":59.10054731999999},{"key":"Onshore wind","date":2025,"value":88.92247932,"y0":22.017781350000003,"y":88.92247932},{"key":"Onshore wind","date":2030,"value":113.43221532,"y0":46.483358625,"y":113.43221532},{"key":"Onshore wind","date":2035,"value":126.31823532,"y0":48.38832,"y":126.31823532},{"key":"Onshore wind","date":2040,"value":131.57783532,"y0":48.38832,"y":131.57783532},{"key":"Onshore wind","date":2045,"value":131.57783532,"y0":48.38832,"y":131.57783532},{"key":"Onshore wind","date":2050,"value":131.57783532,"y0":48.38832,"y":131.57783532},{"key":"Offshore wind","date":2010,"value":4.122912780000003,"y0":637.2580929569566,"y":4.122912780000003},{"key":"Offshore wind","date":2015,"value":22.040616780000004,"y0":595.3404020557682,"y":22.040616780000004},{"key":"Offshore wind","date":2020,"value":114.115840596,"y0":294.0716331221521,"y":114.115840596},{"key":"Offshore wind","date":2025,"value":235.04731632,"y0":479.0871487321707,"y":235.04731632},{"key":"Offshore wind","date":2030,"value":387.64303920000003,"y0":717.6088889063462,"y":387.64303920000003},{"key":"Offshore wind","date":2035,"value":601.56675,"y0":913.4154144473359,"y":601.56675},{"key":"Offshore wind","date":2040,"value":727.7971500000001,"y0":1122.8219354480245,"y":727.7971500000001},{"key":"Offshore wind","date":2045,"value":838.24875,"y0":1348.5240789237057,"y":838.24875},{"key":"Offshore wind","date":2050,"value":928.9768500000001,"y0":1547.7124189390825,"y":928.9768500000001},{"key":"Hydroelectric power stations","date":2010,"value":5.329728000000001,"y0":0,"y":5.329728000000001},{"key":"Hydroelectric power stations","date":2015,"value":6.0792209999999995,"y0":0,"y":6.0792209999999995},{"key":"Hydroelectric power stations","date":2020,"value":7.203460500000001,"y0":0,"y":7.203460500000001},{"key":"Hydroelectric power stations","date":2025,"value":8.889819750000001,"y0":0,"y":8.889819750000001},{"key":"Hydroelectric power stations","date":2030,"value":11.419358625,"y0":0,"y":11.419358625},{"key":"Hydroelectric power stations","date":2035,"value":13.32432,"y0":0,"y":13.32432},{"key":"Hydroelectric power stations","date":2040,"value":13.32432,"y0":0,"y":13.32432},{"key":"Hydroelectric power stations","date":2045,"value":13.32432,"y0":0,"y":13.32432},{"key":"Hydroelectric power stations","date":2050,"value":13.32432,"y0":0,"y":13.32432},{"key":"Tidal and Wave","date":2010,"value":0.0050034246575342495,"y0":637.2530895322991,"y":0.0050034246575342495},{"key":"Tidal and Wave","date":2015,"value":0.6954760273972619,"y0":589.565138603371,"y":0.6954760273972619},{"key":"Tidal and Wave","date":2020,"value":11.607915852054795,"y0":271.6290727600973,"y":11.607915852054795},{"key":"Tidal and Wave","date":2025,"value":32.93718427397262,"y0":369.18196423319813,"y":32.93718427397262},{"key":"Tidal and Wave","date":2030,"value":39.89194454794521,"y0":507.27563974340103,"y":39.89194454794521},{"key":"Tidal and Wave","date":2035,"value":55.800113095890396,"y0":587.1657050914455,"y":55.800113095890396},{"key":"Tidal and Wave","date":2040,"value":89.93470361643834,"y0":662.2058109265862,"y":89.93470361643834},{"key":"Tidal and Wave","date":2045,"value":148.25115238356142,"y0":729.1268341151442,"y":148.25115238356142},{"key":"Tidal and Wave","date":2050,"value":177.73573347945205,"y0":795.6347208096306,"y":177.73573347945205},{"key":"Geothermal electricity","date":2010,"value":0,"y0":5.329728000000001,"y":0},{"key":"Geothermal electricity","date":2015,"value":0.0911664,"y0":6.0792209999999995,"y":0.0911664},{"key":"Geothermal electricity","date":2020,"value":1.0939968000000002,"y0":7.203460500000001,"y":1.0939968000000002},{"key":"Geothermal electricity","date":2025,"value":13.127961600000003,"y0":8.889819750000001,"y":13.127961600000003},{"key":"Geothermal electricity","date":2030,"value":35.064,"y0":11.419358625,"y":35.064},{"key":"Geothermal electricity","date":2035,"value":35.064,"y0":13.32432,"y":35.064},{"key":"Geothermal electricity","date":2040,"value":35.064,"y0":13.32432,"y":35.064},{"key":"Geothermal electricity","date":2045,"value":35.064,"y0":13.32432,"y":35.064},{"key":"Geothermal electricity","date":2050,"value":35.064,"y0":13.32432,"y":35.064},{"key":"Solar PV","date":2010,"value":0.08206652830935998,"y0":16.830895319999996,"y":0.08206652830935998},{"key":"Solar PV","date":2015,"value":1.3469649817337999,"y0":37.658034719999996,"y":1.3469649817337999},{"key":"Solar PV","date":2020,"value":22.107852000000005,"y0":79.39800462,"y":22.107852000000005},{"key":"Solar PV","date":2025,"value":89.59932356319813,"y0":139.94026067,"y":89.59932356319813},{"key":"Solar PV","date":2030,"value":126.74134579840107,"y0":205.915573945,"y":126.74134579840107},{"key":"Solar PV","date":2035,"value":137.07176977144547,"y0":244.70655532,"y":137.07176977144547},{"key":"Solar PV","date":2040,"value":139.46057560658613,"y0":273.96615532,"y":139.46057560658613},{"key":"Solar PV","date":2045,"value":139.98989879514426,"y0":296.96615532,"y":139.98989879514426},{"key":"Solar PV","date":2050,"value":140.10608548963057,"y0":319.96615532,"y":140.10608548963057},{"key":"Non-thermal renewable generation","date":2010,"value":21.040878052966896,"y0":693.9770057369566,"y":21.040878052966896},{"key":"Non-thermal renewable generation","date":2015,"value":61.74109250913106,"y0":661.5616588357683,"y":61.74109250913106},{"key":"Non-thermal renewable generation","date":2020,"value":215.2296130680548,"y0":476.9129137181521,"y":215.2296130680548},{"key":"Non-thermal renewable generation","date":2025,"value":468.5240848271707,"y0":871.2211850521708,"y":468.5240848271707},{"key":"Non-thermal renewable generation","date":2030,"value":714.1919034913462,"y0":1437.6586481063464,"y":714.1919034913462},{"key":"Non-thermal renewable generation","date":2035,"value":969.1451881873357,"y0":2014.293524447336,"y":969.1451881873357},{"key":"Non-thermal renewable generation","date":2040,"value":1137.1585845430245,"y0":2525.250445448025,"y":1137.1585845430245},{"key":"Non-thermal renewable generation","date":2045,"value":1306.4559564987057,"y0":3036.7241889237057,"y":1306.4559564987057},{"key":"Non-thermal renewable generation","date":2050,"value":1426.7848242890827,"y0":3501.960628939082,"y":1426.7848242890827},{"key":"Electricity imports","date":2010,"value":0,"y0":16.830895319999996,"y":0},{"key":"Electricity imports","date":2015,"value":0,"y0":37.658034719999996,"y":0},{"key":"Electricity imports","date":2020,"value":12,"y0":67.39800462,"y":12},{"key":"Electricity imports","date":2025,"value":29,"y0":110.94026067,"y":29},{"key":"Electricity imports","date":2030,"value":46,"y0":159.915573945,"y":46},{"key":"Electricity imports","date":2035,"value":70,"y0":174.70655532,"y":70},{"key":"Electricity imports","date":2040,"value":94,"y0":179.96615531999998,"y":94},{"key":"Electricity imports","date":2045,"value":117,"y0":179.96615531999998,"y":117},{"key":"Electricity imports","date":2050,"value":140,"y0":179.96615531999998,"y":140}],"chartLine":[{"date":2010,"value":357.24918343117383},{"date":2015,"value":361.5367035475666},{"date":2020,"value":372.7635355490136},{"date":2025,"value":385.5212604670212},{"date":2030,"value":397.327304628919},{"date":2035,"value":409.61974099819633},{"date":2040,"value":421.9543562516154},{"date":2045,"value":434.2643353467048},{"date":2050,"value":447.1699747427913}]},"EnergyEmissionsChart":{"chartLayers":[{"key":"Fuel Combustion","date":2010,"value":523.5964481812903,"y0":150.95888292443124,"y":523.5964481812903},{"key":"Fuel Combustion","date":2015,"value":496.9592302882817,"y0":177.00298858606942,"y":496.9592302882817},{"key":"Fuel Combustion","date":2020,"value":375.6630628100611,"y0":211.5185092981658,"y":375.6630628100611},{"key":"Fuel Combustion","date":2025,"value":401.4487203303639,"y0":264.3841106103547,"y":401.4487203303639},{"key":"Fuel Combustion","date":2030,"value":440.1235346657798,"y0":319.12124075052856,"y":440.1235346657798},{"key":"Fuel Combustion","date":2035,"value":485.40440916447557,"y0":374.8075707718976,"y":485.40440916447557},{"key":"Fuel Combustion","date":2040,"value":535.5546077275876,"y0":430.2496019338148,"y":535.5546077275876},{"key":"Fuel Combustion","date":2045,"value":586.2011394060826,"y0":484.44035048739704,"y":586.2011394060826},{"key":"Fuel Combustion","date":2050,"value":636.2585916948569,"y0":540.7560060019437,"y":636.2585916948569},{"key":"Industrial Processes","date":2010,"value":27.365812292626387,"y0":17.898462723123437,"y":27.365812292626387},{"key":"Industrial Processes","date":2015,"value":26.551789727620744,"y0":18.57887988275079,"y":26.551789727620744},{"key":"Industrial Processes","date":2020,"value":25.80984051401508,"y0":18.492747963849894,"y":25.80984051401508},{"key":"Industrial Processes","date":2025,"value":25.134410214991846,"y0":17.79537383271243,"y":25.134410214991846},{"key":"Industrial Processes","date":2030,"value":24.520390394118913,"y0":15.012425048210714,"y":24.520390394118913},{"key":"Industrial Processes","date":2035,"value":23.96308267721259,"y0":12.33993880357208,"y":23.96308267721259},{"key":"Industrial Processes","date":2040,"value":23.458165722911836,"y0":8.435062351417425,"y":23.458165722911836},{"key":"Industrial Processes","date":2045,"value":23.001664866127772,"y0":5.3610382456074595,"y":23.001664866127772},{"key":"Industrial Processes","date":2050,"value":22.58992421767131,"y0":7.181050431888066,"y":22.58992421767131},{"key":"Solvent and Other Product Use","date":2010,"value":0,"y0":0,"y":0},{"key":"Solvent and Other Product Use","date":2015,"value":0,"y0":0,"y":0},{"key":"Solvent and Other Product Use","date":2020,"value":0,"y0":0,"y":0},{"key":"Solvent and Other Product Use","date":2025,"value":0,"y0":0,"y":0},{"key":"Solvent and Other Product Use","date":2030,"value":0,"y0":0,"y":0},{"key":"Solvent and Other Product Use","date":2035,"value":0,"y0":0,"y":0},{"key":"Solvent and Other Product Use","date":2040,"value":0,"y0":0,"y":0},{"key":"Solvent and Other Product Use","date":2045,"value":0,"y0":0,"y":0},{"key":"Solvent and Other Product Use","date":2050,"value":0,"y0":0,"y":0},{"key":"Agriculture","date":2010,"value":42.13457713706225,"y0":45.264275015749824,"y":42.13457713706225},{"key":"Agriculture","date":2015,"value":39.07990853657002,"y0":45.130669610371534,"y":39.07990853657002},{"key":"Agriculture","date":2020,"value":36.163086708211765,"y0":44.30258847786497,"y":36.163086708211765},{"key":"Agriculture","date":2025,"value":35.629495668699576,"y0":42.929784047704274,"y":35.629495668699576},{"key":"Agriculture","date":2030,"value":35.110601895707376,"y0":39.53281544232963,"y":35.110601895707376},{"key":"Agriculture","date":2035,"value":34.60595174978886,"y0":36.30302148078467,"y":34.60595174978886},{"key":"Agriculture","date":2040,"value":34.115105783606744,"y0":31.89322807432926,"y":34.115105783606744},{"key":"Agriculture","date":2045,"value":33.63763829718192,"y0":28.362703111735232,"y":33.63763829718192},{"key":"Agriculture","date":2050,"value":33.17313690708554,"y0":29.770974649559378,"y":33.17313690708554},{"key":"Land Use, Land-Use Change and Forestry","date":2010,"value":2.685792057600377,"y0":0,"y":2.685792057600377},{"key":"Land Use, Land-Use Change and Forestry","date":2015,"value":5.464901095502293,"y0":0,"y":5.464901095502293},{"key":"Land Use, Land-Use Change and Forestry","date":2020,"value":7.475576965471847,"y0":0,"y":7.475576965471847},{"key":"Land Use, Land-Use Change and Forestry","date":2025,"value":8.594077319309696,"y0":0,"y":8.594077319309696},{"key":"Land Use, Land-Use Change and Forestry","date":2030,"value":7.5283379343751875,"y0":0,"y":7.5283379343751875},{"key":"Land Use, Land-Use Change and Forestry","date":2035,"value":5.812680464276858,"y0":0,"y":5.812680464276858},{"key":"Land Use, Land-Use Change and Forestry","date":2040,"value":2.7719875464120802,"y0":0,"y":2.7719875464120802},{"key":"Land Use, Land-Use Change and Forestry","date":2045,"value":0.5470886426277637,"y0":0,"y":0.5470886426277637},{"key":"Land Use, Land-Use Change and Forestry","date":2050,"value":3.161689517582234,"y0":0,"y":3.161689517582234},{"key":"Waste","date":2010,"value":15.21267066552306,"y0":2.685792057600377,"y":15.21267066552306},{"key":"Waste","date":2015,"value":13.113978787248499,"y0":5.464901095502293,"y":13.113978787248499},{"key":"Waste","date":2020,"value":11.017170998378047,"y0":7.475576965471847,"y":11.017170998378047},{"key":"Waste","date":2025,"value":9.201296513402735,"y0":8.594077319309696,"y":9.201296513402735},{"key":"Waste","date":2030,"value":7.4840871138355265,"y0":7.5283379343751875,"y":7.4840871138355265},{"key":"Waste","date":2035,"value":6.527258339295222,"y0":5.812680464276858,"y":6.527258339295222},{"key":"Waste","date":2040,"value":5.663074805005346,"y0":2.7719875464120802,"y":5.663074805005346},{"key":"Waste","date":2045,"value":4.8139496029796955,"y0":0.5470886426277637,"y":4.8139496029796955},{"key":"Waste","date":2050,"value":4.019360914305832,"y0":3.161689517582234,"y":4.019360914305832},{"key":"Other","date":2010,"value":0,"y0":0,"y":0},{"key":"Other","date":2015,"value":0,"y0":0,"y":0},{"key":"Other","date":2020,"value":0,"y0":0,"y":0},{"key":"Other","date":2025,"value":0,"y0":0,"y":0},{"key":"Other","date":2030,"value":0,"y0":0,"y":0},{"key":"Other","date":2035,"value":0,"y0":0,"y":0},{"key":"Other","date":2040,"value":0,"y0":0,"y":0},{"key":"Other","date":2045,"value":0,"y0":0,"y":0},{"key":"Other","date":2050,"value":0,"y0":0,"y":0},{"key":"International Aviation and Shipping","date":2010,"value":46.453918754749346,"y0":87.39885215281208,"y":46.453918754749346},{"key":"International Aviation and Shipping","date":2015,"value":52.19269100274443,"y0":84.21057814694154,"y":52.19269100274443},{"key":"International Aviation and Shipping","date":2020,"value":58.554128553904185,"y0":80.46567518607674,"y":58.554128553904185},{"key":"International Aviation and Shipping","date":2025,"value":63.00928576171873,"y0":78.55927971640385,"y":63.00928576171873},{"key":"International Aviation and Shipping","date":2030,"value":67.24417545140071,"y0":74.64341733803701,"y":67.24417545140071},{"key":"International Aviation and Shipping","date":2035,"value":72.66360699371727,"y0":70.90897323057354,"y":72.66360699371727},{"key":"International Aviation and Shipping","date":2040,"value":76.43181920884129,"y0":66.00833385793601,"y":76.43181920884129},{"key":"International Aviation and Shipping","date":2045,"value":79.76691774229698,"y0":62.00034140891715,"y":79.76691774229698},{"key":"International Aviation and Shipping","date":2050,"value":81.05235935157397,"y0":62.94411155664492,"y":81.05235935157397},{"key":"Bioenergy credit","date":2010,"value":17.106112016869805,"y0":133.85277090756142,"y":17.106112016869805},{"key":"Bioenergy credit","date":2015,"value":37.76470435362482,"y0":139.23828423244458,"y":37.76470435362482},{"key":"Bioenergy credit","date":2020,"value":65.82024674123574,"y0":145.69826255693008,"y":65.82024674123574},{"key":"Bioenergy credit","date":2025,"value":95.71246044701472,"y0":168.67165016334,"y":95.71246044701472},{"key":"Bioenergy credit","date":2030,"value":122.28321746531128,"y0":196.83802328521728,"y":122.28321746531128},{"key":"Bioenergy credit","date":2035,"value":147.3442273931713,"y0":227.46334337872628,"y":147.3442273931713},{"key":"Bioenergy credit","date":2040,"value":175.78628508310894,"y0":254.46331685070587,"y":175.78628508310894},{"key":"Bioenergy credit","date":2045,"value":203.50643511207582,"y0":280.93391537532125,"y":203.50643511207582},{"key":"Bioenergy credit","date":2050,"value":231.28355754449413,"y0":309.47244845744956,"y":231.28355754449413},{"key":"Carbon capture","date":2010,"value":0,"y0":133.85277090756142,"y":0},{"key":"Carbon capture","date":2015,"value":2.8350150827586207,"y0":136.40326914968597,"y":2.8350150827586207},{"key":"Carbon capture","date":2020,"value":6.678458816949153,"y0":139.01980373998092,"y":6.678458816949153},{"key":"Carbon capture","date":2025,"value":27.103084685217386,"y0":141.5685654781226,"y":27.103084685217386},{"key":"Carbon capture","date":2030,"value":54.95043049577955,"y0":141.88759278943772,"y":54.95043049577955},{"key":"Carbon capture","date":2035,"value":83.89076315443548,"y0":143.5725802242908,"y":83.89076315443548},{"key":"Carbon capture","date":2040,"value":112.02316378392857,"y0":142.4401530667773,"y":112.02316378392857},{"key":"Carbon capture","date":2045,"value":139.16665622410713,"y0":141.76725915121415,"y":139.16665622410713},{"key":"Carbon capture","date":2050,"value":165.4759775492307,"y0":143.9964709082189,"y":165.4759775492307}],"chartLine":[]},"MapChart":{"thermal":[{"key":"0.01 GW geothermal stations","icon":"geothermal-stations-facilities","value":500},{"key":"3 GW nuclear power station","icon":"nuclear-power-stations","value":49},{"key":"1 GW gas standby power stations","icon":"gas-power-stations","value":0},{"key":"1.2 GW coal gas or biomass power stations with CCS","icon":"power-stations-with-ccs","value":72},{"key":"2 GW coal gas or biomass power stations without CCS","icon":"power-stations-without-ccs","value":11},{"key":"215 kt/y waste to energy conversion facilities","icon":"energy-conversion-facilities","value":95}],"land":[{"key":"Hydro","value":130.90909090909088},{"key":"Solar thermal","value":239.72927292052924},{"key":"Solar PV","value":726.4953720450426},{"key":"Micro wind","value":1967.9999999999995},{"key":"Onshore wind","value":6004.007999999999},{"key":"Forest","value":38220.3},{"key":"Energy crops","value":41679.5728797235}],"offshore":[{"key":"Offshore wind","value":42390},{"key":"Marine algae","value":5860.09},{"key":"Tidal stream","value":1437.5105699306596},{"key":"Tidal range","value":1428.5714285714284}],"imports":[{"key":"Biocrops","value":45671.98593170511},{"key":"Solar PV","value":1252.611471236909}],"wave":[{"key":"wave","value":900.558092338915}]},"AirQualityChart":{"low":21.19157473716774,"high":56.161505765298045,"key":"2050 - Your pathway"},"EnergySecurity":{"imports":[{"name":"Coal","t2007":{"quantity":330,"proportion":"69%"},"t2050":{"quantity":0,"proportion":"0%"}},{"name":"Oil","t2007":{"quantity":80,"proportion":"9%"},"t2050":{"quantity":574,"proportion":"84%"}},{"name":"Gas","t2007":{"quantity":215,"proportion":"20%"},"t2050":{"quantity":1561,"proportion":"95%"}},{"name":"Bioenergy","t2007":{"quantity":26,"proportion":"26%"},"t2050":{"quantity":240,"proportion":"28%"}},{"name":"Uranium","t2007":{"quantity":163,"proportion":"100%"},"t2050":{"quantity":3133,"proportion":"100%"}},{"name":"Electricity","t2007":{"quantity":5,"proportion":"1%"},"t2050":{"quantity":140,"proportion":"4%"}},{"name":"Primary energy","t2007":{"quantity":819,"proportion":"30%"},"t2050":{"quantity":5508,"proportion":"107%"}}],"diversity":[{"name":"Nuclear fission","t2007":"6%","t2050":"61%"},{"name":"Solar","t2007":"0%","t2050":"5%"},{"name":"Wind","t2007":"0%","t2050":"21%"},{"name":"Tidal","t2007":"0%","t2050":"2%"},{"name":"Wave","t2007":"0%","t2050":"1%"},{"name":"Geothermal","t2007":"0%","t2050":"1%"},{"name":"Hydro","t2007":"0%","t2050":"0%"},{"name":"Electricity oversupply (imports)","t2007":"0%","t2050":"0%"},{"name":"Environmental heat","t2007":"0%","t2050":"0%"},{"name":"Bioenergy","t2007":"4%","t2050":"17%"},{"name":"Coal","t2007":"18%","t2050":"0%"},{"name":"Oil","t2007":"33%","t2050":"13%"},{"name":"Natural gas","t2007":"39%","t2050":"32%"}]},"CostsContextChart":6069.239126218741});

    ko.computed(function() {
      var pathwayString = self.getPathwayString();
      if(!self.locked()) {
        self.updating(true);
        DataRequester.pathway(pathwayString, function(data){
          var data = JSON.parse(data.responseText);
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

