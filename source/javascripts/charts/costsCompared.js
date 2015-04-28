define(['knockout', 'd3', 'charts/chart'], function(ko, d3, Chart) {
  'use strict';

  var CostsComparedChart = function() {};

  CostsComparedChart.prototype = new Chart({});

  CostsComparedChart.prototype.constructor = CostsComparedChart

  CostsComparedChart.prototype.draw = function(data, width, height){
    var self = this;

    if(typeof data === "undefined") {
      return 1;
    }

    self.data = data;

    var readSelects = function() {
      var selects = document.querySelectorAll(".select");
      var sensitivitySelection = [];

      for(var i = 0; i < selects.length; i++) {
        sensitivitySelection.push(selects[i].value);
      }

      return sensitivitySelection;
    };

    var selects = readSelects();
    var dataSelectionObject = {};
    var dataRangeObject = {};
    var totalSelection = 0;

    // Map of cost to category
    var cost_categories = {
      "Conventional thermal plant": "Electricity",
      "Combustion + CCS": "Electricity",
      "Nuclear power": "Electricity",
      "Onshore wind": "Electricity",
      "Offshore wind": "Electricity",
      "Hydroelectric": "Electricity",
      "Wave and Tidal": "Electricity",
      "Geothermal": "Electricity",
      "Distributed solar PV": "Electricity",
      "Distributed solar thermal": "Buildings",
      "Micro wind": "Electricity",
      "Biomatter to fuel conversion": "Bioenergy",
      "Bioenergy imports": "Bioenergy",
      "Agriculture and land use": "Bioenergy",
      "Energy from waste": "Bioenergy",
      "Waste arising": "Bioenergy",
      "Marine algae": "Bioenergy",
      "Electricity imports": "Electricity",
      "Electricity Exports": "Electricity",
      "Electricity grid distribution": "Electricity",
      "Storage, demand shifting, backup": "Electricity",
      "H2 Production": "Transport",
      "Domestic heating": "Buildings",
      "Domestic insulation": "Buildings",
      "Commercial heating and cooling": "Buildings",
      "Domestic lighting, appliances, and cooking": "Buildings",
      "Commercial lighting, appliances, and catering": "Buildings",
      "Industrial processes": "Industry",
      "Conventional cars and buses": "Transport",
      "Hybrid cars and buses": "Transport",
      "Electric cars and buses": "Transport",
      "Fuel cell cars and buses": "Transport",
      "Bikes": "Transport",
      "Rail": "Transport",
      "Domestic aviation": "Transport",
      "Domestic freight": "Transport",
      "International aviation": "Transport",
      "International shipping (maritime bunkers)": "Transport",
      "Geosequestration": "Other",
      "Petroleum refineries": "Industry",
      "Coal": "Fossil fuels",
      "Oil": "Fossil fuels",
      "Gas": "Fossil fuels",
      "Fossil fuel transfers": "Fossil fuels",
      "District heating effective demand": "Buildings",
      "Power Carbon Capture": "Electricity",
      "Industry Carbon Capture": "Industry",
      "Storage of captured CO2": "Other",
      "Finance cost": "Finance"
    };

    // Populate categories object
    var keys = Object.keys(data);
    for (var i = 0; i < keys.length; i++) {
      // Lookup cost's category
      var categoryName = cost_categories[keys[i]];

      // Initialise object if first encounter with category
      if(!dataSelectionObject[categoryName]) {
        dataSelectionObject[categoryName] = { key: categoryName, value: 0 };
        dataRangeObject[categoryName] = { key: categoryName, value: 0 };
      }

      // Populate object using current selects state
      if(typeof selects[i] === "undefined") {
        dataSelectionObject[categoryName].value += data[keys[i]].point;
        totalSelection += data[keys[i]].point;
      } else if(selects[i] === "range") {
        dataSelectionObject[categoryName].value += data[keys[i]].low;
        totalSelection += data[keys[i]].low;
        dataRangeObject[categoryName].value += data[keys[i]].range;
      } else {
        dataSelectionObject[categoryName].value += data[keys[i]][selects[i]];
        totalSelection += data[keys[i]][selects[i]];
      }
    }

    // Flatten
    var dataSelection = Object.keys(dataSelectionObject).map(function(key) { return { key: key, value: dataSelectionObject[key].value }; });
    var dataRange = Object.keys(dataRangeObject).map(function(key) { return { key: key, value: dataRangeObject[key].value }; });

    self.outerWidth = width || self.outerWidth;
    self.outerHeight = height || self.outerHeight;

    self.width = self.outerWidth - self.margin.left - self.margin.right;
    self.height = self.outerHeight - self.margin.top - self.margin.bottom;

    var xMin = 0;
    var xMax = 10000;

    self.nTicks = 5;

    var x = d3.scale.linear()
        .domain([xMin, xMax])
        .range([0, self.width]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top")
        .ticks(self.nTicks);

    var y = d3.scale.linear()
        .domain([0, 1])
        .range([0, self.height]);

    self.x = x;
    self.y = y;
    self.xAxis = xAxis;

    // Grid
    self.drawVerticalGridlines();

    // Selection and range bar options
    var selectionBars = [
      {
        "name": "selection",
        "data": self.stackBars(dataSelection)
      },
      {
        "name": "range",
        "data": self.stackBars(dataRange),
        "offset": totalSelection
      }
    ];

    // Draw bars
    self.drawStackedBars(selectionBars);

    // Add pattern to range bars
    self.svg.selectAll(".bar-container-range")
      .append("pattern")
        .attr({
          "id": function(d, i) { return "bar-pattern-" + i; },
          "x": "0" ,
          "y": "0" ,
          "width": "5" ,
          "height": "5" ,
          "patternUnits": "userSpaceOnUse"
        }).append("line")
          .attr({
            x1: "0",
            y1: "0",
            x2: "5",
            y2: "5",
            stroke: function(d, i) { return d.colour; }
          });
    self.svg.selectAll(".bar-range")
      .attr('fill', function(d, i) { return "url(#bar-pattern-" + i + ")"; });


    // Borders
    self.drawBorders();
  };

  return CostsComparedChart;
});

