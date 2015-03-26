define(['knockout', 'd3', 'charts/chart', 'bindings/range'], function(ko, d3, Chart) {
  'use strict';

  var OverviewChart = function() {};

  OverviewChart.prototype = new Chart({});

  OverviewChart.prototype.constructor = OverviewChart

  OverviewChart.prototype.draw = function(data, width, height){
    var self = this;

    if(typeof data === "undefined") {
      return 1;
    }

    var percentageReduction = data[self.title].percentageReduction
    data = data[self.title][self.drawParams.date()]

    self.outerWidth = width || self.outerWidth;
    self.outerHeight = height || self.outerHeight;

    self.width = self.outerWidth - self.margin.left - self.margin.right;
    self.height = self.outerHeight - self.margin.top - self.margin.bottom;

    self.nTicks = 5;

    var x = d3.scale.linear()
        .domain([self.xMin, self.xMax])
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

    // Get total
    var total = data.filter(function(d) { return d.key === "Total"; })[0];

    // Separate data positive/negative
    var positiveData = data.filter(function(d) { return d.key !== "Total" && d.value >= 0; });
    var negativeData = data.filter(function(d) { return d.key !== "Total" && d.value < 0; });

    // Selection and range bar options
    var bars = [
      {
        "data": self.stackBars(positiveData)
      },
      {
        "data": self.stackBars(negativeData),
        "negative": true
      }
    ];

    // Borders
    self.drawBorders();

    // Draw bars
    self.drawStackedBars(bars);

    // Total indicator
    if(total) {
      self.svg.selectAll('.extras').remove();
      self.svg.append("line")
        .attr({
          "class": "extras",
          "x1" : self.x(total.value),
          "x2" : self.x(total.value),
          "y1" : y(0),
          "y2" : y(1) + 15,
          "stroke": "#fff",
          "stroke-width": "2px",
          "stroke-dasharray": "7 4",
        });
      self.svg.append("text")
        .attr({
          "class": "extras",
          "x": self.x(total.value),
          "y": self.height + 15,
          "dy": "1.2em",
          "text-anchor": "middle",
          "fill": "#fff",
          "font-size": "0.7em"
        })
        .text("Total (" + Math.round(total.value) + ")");
      self.svg.append("text")
        .attr({
          "class": "extras",
          "x": self.width,
          "y": self.height,
          "dy": "1.2em",
          "text-anchor": "end",
          "fill": "#fff",
          "font-size": "0.7em"
        })
        .text(percentageReduction + "% reduction 1990-2050; Target is 80%");
    }
  };

  return OverviewChart;
});

