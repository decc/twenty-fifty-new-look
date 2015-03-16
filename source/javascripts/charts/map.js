define(['knockout', 'd3', 'charts/chart'], function(ko, d3, Chart) {
  'use strict';

  var MapChart = function() {};

  MapChart.prototype = new Chart({});

  MapChart.prototype.constructor = MapChart

  MapChart.prototype.draw = function(data, width, height){
    var self = this;

    if(typeof data === "undefined") {
      return 1;
    }

    self.outerWidth = width || self.outerWidth;
    self.outerHeight = height || self.outerHeight;

    self.width = self.outerWidth - self.margin.left - self.margin.right;
    self.height = self.outerHeight - self.margin.top - self.margin.bottom;

    var yMin = 0;
    var yMax = 1000;

    var y = d3.scale.linear()
        .domain([yMin, yMax])
        .range([0, self.height]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("top")

    var stackSquares = function(data) {
      var previousY = 0;

      data.sort(function(a, b) { return a.value - b.value });

      var spacing = 4;

      return data.map(function(d, i) {
        var edge = Math.sqrt(d.value);
        return { key: d.key, colour: self.colours(i), value: edge, y0: previousY, y1: previousY += (edge + spacing) };
      });
    };

    self.y = y;
    self.yAxis = yAxis;

    var squares = self.svg.selectAll(".square-container")
        .data(stackSquares(data.land))

    squares.enter().append("g")
      .attr("class", function(d) { return "square-container " + d.key.replace(/ +/g, '-').replace(/[^\w|-]/g, '').toLowerCase(); })
      .each(function(d, i) {
        d3.select(this).append("rect")
          .attr("class", "square")
          .attr('fill', function(d) { return d.colour; })
          .attr('fill-opacity', '0.5')
          .attr('stroke', function(d) { return d.colour; })
          .attr('stroke-width', '2px')
          .attr("y", function(d) { return y(d.y0); })
          .attr("height", function(d) { return y(d.value); })
          .attr("x", 0)
          .attr("width", function(d) { return y(d.value); })
        d3.select(this).append("text")
          .attr("class", "square-label")
          .attr("y", y(0.5))
      })

    // self.svg.selectAll(".bar")
    //   .data(data)
    //   .transition()
    //   .attr("x", function(d) { return x(d.x0); })
    //   .attr("width", function(d) { return x(d.value); });

    // self.svg.selectAll(".bar-label")
    //   .data(data)
    //   .attr("x", function(d) { return x(d.x0 + d.value/2); })
    //   .text(function(d) { return d.key + " (" + parseInt(d.value, 10) + ")"; })

  };

  return MapChart;
});

