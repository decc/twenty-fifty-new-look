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

    var nTicks = 5;

    var x = d3.scale.linear()
        .domain([xMin, xMax])
        .range([0, self.width]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top")
        .ticks(nTicks);

    var y = d3.scale.linear()
        .domain([0, 1])
        .range([0, self.height]);

    var stack = function(data) {
      var previousX = 0;

      data.sort(function(a, b) { return a.value - b.value });

      return data.map(function(d, i) { return { key: d.key, colour: self.colours(i, d.key), value: d.value, x0: previousX, x1: previousX += d.value }; });
    };

    self.x = x;
    self.xAxis = xAxis;

    var selectionBars = self.svg.selectAll(".bar-selection-container")
        .data(stack(dataSelection))

    selectionBars.enter().append("g")
      .attr("class", "bar-container bar-selection-container")
      .each(function(d, i) {
        d3.select(this).append("rect")
          .attr("class", "bar bar-selection")
          .attr('fill', d.colour)
          .attr('opacity', '0.6')
          .attr("y", 0)
          .attr("height", self.height)
          .attr("x", x(d.x0))
          .attr("width", x(d.value))
          .on('mouseover', function() {
            d3.select(this.parentNode).attr("data-state", "active")
            d3.select(this.parentNode.parentNode).attr("data-state", "graph-hover")
            self.svg.selectAll("#bar-label-selection-" + i).attr("data-state", "active")
          })
          .on('mouseout', function() {
            d3.select(this.parentNode).attr("data-state", "inactive")
            d3.select(this.parentNode.parentNode).attr("data-state", "inactive")
            self.svg.selectAll("#bar-label-selection-" + i).attr("data-state", "inactive")
          });
      });

    selectionBars.enter().append("text")
      .attr("class", "bar-label bar-selection-label")
      .attr("id", function(d, i) { return "bar-label-selection-" + i; })
      .attr("y", y(0.5));

    var rangeBars = self.svg.selectAll(".bar-range-container")
        .data(stack(dataRange))

    rangeBars.enter().append("g")
      .attr("class", "bar-container bar-range-container")
      .each(function(d, i) {
        // Pattern
        d3.select(this).append("pattern")
          .attr({
            "id": "bar-pattern-" + i,
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
              stroke: d.colour
            });
        d3.select(this).append("rect")
          .attr("class", "bar bar-range")
          .attr('fill', "url(#bar-pattern-" + i + ")")
          .attr('opacity', '0.6')
          .attr("y", 0)
          .attr("height", self.height)
          .attr("x", x(totalSelection + d.x0))
          .attr("width", x(d.value))
          .on('mouseover', function() {
            d3.select(this.parentNode).attr("data-state", "active")
            d3.select(this.parentNode.parentNode).attr("data-state", "graph-hover")
            self.svg.selectAll("#bar-label-range-" + i).attr("data-state", "active")
          })
          .on('mouseout', function() {
            d3.select(this.parentNode).attr("data-state", "inactive")
            d3.select(this.parentNode.parentNode).attr("data-state", "inactive")
            self.svg.selectAll("#bar-label-range-" + i).attr("data-state", "inactive")
          });
      });

    rangeBars.enter().append("text")
      .attr("class", "bar-label bar-range-label")
      .attr("id", function(d, i) { return "bar-label-range-" + i; })
      .attr("y", y(0.5));

    self.transitionBars = function() {
      self.svg.selectAll(".bar-selection")
        .data(stack(dataSelection))
        .transition()
        .attr("x", function(d) { return x(d.x0); })
        .attr("width", function(d) { return x(d.value); })
        .attr("height", self.height);

      self.svg.selectAll(".bar-selection-label")
        .data(stack(dataSelection))
        .attr("x", function(d) { return x(d.x0 + d.value/2); })
        .attr("y", y(0.5))
        .text(function(d) { return d.key + " (" + parseInt(d.value, 10) + ")"; });

      self.svg.selectAll(".bar-range")
        .data(stack(dataRange))
        .transition()
        .attr("x", function(d) { return x(totalSelection + d.x0); })
        .attr("width", function(d) { return x(d.value); })
        .attr("height", self.height);

      self.svg.selectAll(".bar-range-label")
        .data(stack(dataRange))
        .attr("x", function(d) { return x(totalSelection + d.x0 + d.value/2); })
        .attr("y", y(0.5))
        .text(function(d) { return d.key + " (" + parseInt(d.value, 10) + ")"; });

    }
    self.transitionBars();


    self.svg.selectAll("line.horizontalGrid").remove();
    self.svg.selectAll("line.horizontalGrid").data(self.x.ticks(nTicks)).enter()
      .append("line")
        .attr({
          "class":"horizontalGrid",
          "x1" : function(d){ return self.x(d);},
          "x2" : function(d){ return self.x(d);},
          "y1" : 0,
          "y2" : self.height,
          "fill" : "none",
          "shape-rendering" : "crispEdges",
          "stroke" : "rgba(255, 255, 255, 0.2)",
          "stroke-width" : "1px"
        });

    // Borders
    self.svg.selectAll('.border').remove();
    self.svg.append("line")
      .attr({
        "class":"border",
        "x1" : 0,
        "x2" : 0,
        "y1" : 0,
        "y2" : self.height,
      });
    self.svg.append("line")
      .attr({
        "class":"border",
        "x1" : self.width,
        "x2" : self.width,
        "y1" : 0,
        "y2" : self.height,
      });
    self.svg.append("line")
      .attr({
        "class":"border",
        "x1" : 0,
        "x2" : self.width,
        "y1" : self.height,
        "y2" : self.height,
      });

    if(self.hasAxis) {
      self.svg.selectAll('.axis').remove();

      self.svg.append("g")
          .attr("class", "x axis")
          .attr("shape-rendering", "crispEdges")
          .call(self.xAxis)
    } else {
      self.svg.append("line")
      .attr({
        "class":"border",
        "x1" : 0,
        "x2" : self.width,
        "y1" : 0,
        "y2" : 0,
      });
    }
  };

  return CostsComparedChart;
});

