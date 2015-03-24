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

    data = data[self.title][self.drawParams.date()]

    self.outerWidth = width || self.outerWidth;
    self.outerHeight = height || self.outerHeight;

    self.width = self.outerWidth - self.margin.left - self.margin.right;
    self.height = self.outerHeight - self.margin.top - self.margin.bottom;

    var xMin = 0;
    var xMax = 5000;

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

    self.x = x;
    self.y = y;
    self.xAxis = xAxis;

    // Grid
    self.drawVerticalGridlines();

    // Selection and range bar options
    var bars = [
      {
        "data": self.stackBars(data)
      }
    ];

    // Draw bars
    self.drawStackedBars(bars);

    // Borders
    self.drawBorders();
  };

  return OverviewChart;
});

