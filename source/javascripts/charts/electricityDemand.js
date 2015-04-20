define(['knockout', 'd3', 'charts/chart'], function(ko, d3, Chart) {
  'use strict';

  var ElectricityDemandChart = function() {

  };

  ElectricityDemandChart.prototype = new Chart();

  ElectricityDemandChart.prototype.draw = function(data, width, height){
      var self = this;

      if(typeof data === "undefined") {
        return 1;
      }

      var chartLayers = data.chartLayers;

      self.outerWidth = width || self.outerWidth;
      self.outerHeight = height ||self.outerHeight;

      self.width = self.outerWidth - self.margin.left - self.margin.right;
      self.height = self.outerHeight - self.margin.top - self.margin.bottom;

      var yMin = 0;
      var yMax = 4000;

      var x = d3.scale.linear()
          .domain(d3.extent(chartLayers, function(d) { return d.date; }))
          .range([0, self.width]);

      var y = d3.scale.linear()
          // .domain([0, d3.max(chartLayers, function(d) { return d.value; })])
          .domain([yMin, yMax])
          .range([self.height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .tickValues([2010, 2020, 2030, 2040, 2050])
          .tickFormat(d3.format("d"));

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .ticks(6);

      self.x = x;
      self.y = y;
      self.xAxis = xAxis;
      self.yAxis = yAxis;

      var stack = self.stack();
      var nest = self.nest();
      self.stackedAreaData = stack(nest.entries(chartLayers));
      self.lineData = data.chartLine;

      // Primary data
      self.drawStackedArea();

      // Secondary data
      self.drawLine("Supply");

      self.setupLineAxes("Date", "Energy (TWh/yr)");
  };

  return ElectricityDemandChart;
});

