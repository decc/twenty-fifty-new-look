define(['knockout', 'd3', 'charts/chart'], function(ko, d3, Chart) {
  'use strict';

  var EnergyEmissionsChart = function() {

  };

  EnergyEmissionsChart.prototype = new Chart();

  EnergyEmissionsChart.prototype.draw = function(data, width, height){
      var self = this;

      if(typeof data === "undefined") {
        return 1;
      }

      var chartLayers = data.chartLayers;
      var chartLine = data.chartLine;

      self.outerWidth = width || self.outerWidth;
      self.outerHeight = height ||self.outerHeight;

      self.width = self.outerWidth - self.margin.left - self.margin.right;
      self.height = self.outerHeight - self.margin.top - self.margin.bottom;

      var yMin = -500;
      var yMax = 1000;

      var x = d3.scale.linear()
          .domain(d3.extent(chartLayers, function(d) { return d.date; }))
          .range([0, self.width]);

      var y = d3.scale.linear()
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
          .ticks(4);

      self.x = x;
      self.y = y;
      self.yMin = yMin;
      self.yMax = yMax;
      self.xAxis = xAxis;
      self.yAxis = yAxis;

      var stack = self.stack();
      var nest = self.nest();
      var area = self.area();
      var line = self.line();

      var layers = nest.entries(chartLayers);

      var positiveLayers = layers.filter(function(d) { return d.values[d.values.length-1].value > 0; })
      var negativeLayers = layers.filter(function(d) { return d.values[d.values.length-1].value < 0; })

      var positiveLayers = stack(positiveLayers);
      var negativeLayers = stack(negativeLayers);

      self.stackedAreaData = positiveLayers.concat(negativeLayers);
      self.lineData = data.chartLine;

      self.forbiddenLabelZone = y(data.chartLine[data.chartLine.length-1].value);

      // Primary data
      self.drawStackedArea();

      // Secondary data
      self.lineData = chartLine;
      self.drawLine("Total");

      // Target
      var targetEmissions = y(153);
      var halfLabelLineHeight = 8;
      self.svg.selectAll('.target-line').remove();
      self.svg.append("line")
        .attr("x1", x(self.xMin))
        .attr("x2", x(self.xMax))
        .attr("y1", targetEmissions)
        .attr("y2", targetEmissions)
        .attr("class", "target-line")
      self.svg.selectAll('.target-line-label').remove();
      self.highlightedLabel((self.x(self.xMax)), targetEmissions, "Target", "line-label target-line-label");

      self.setupLineAxes("Date", "Greenhouse Gas Emissions (MtCO2e/yr)");
  };

  return EnergyEmissionsChart;
});

