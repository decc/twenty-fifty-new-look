define(['knockout', 'd3', 'charts/chart'], function(ko, d3, Chart) {
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

    var stack = function(data) {
      var previousX = 0;

      data.sort(function(a, b) { return a.value - b.value });

      return data.map(function(d, i) { return { key: d.key, colour: self.colours(i), value: d.value, x0: previousX, x1: previousX += d.value }; });
    };

    self.x = x;
    self.xAxis = xAxis;

    var bars = self.svg.selectAll(".bar-container")
        .data(stack(data))

    bars.enter().append("g")
      .attr("class", "bar-container")
      .each(function(d, i) {
        d3.select(this).append("rect")
          .attr("class", "bar")
          .attr('fill', function(d) { return d.colour; })
          .attr('opacity', '0.6')
          .attr("y", 0)
          .attr("height", self.height)
          .attr("x", function(d) { return x(d.x0); })
          .attr("width", function(d) { return x(d.value); })
          .on('mouseover', function(d) {
            d3.select(this.parentNode).attr("data-state", "active")
            d3.select(this.parentNode.parentNode).attr("data-state", "graph-hover")
          })
          .on('mouseout', function(d) {
            d3.select(this.parentNode).attr("data-state", "inactive")
            d3.select(this.parentNode.parentNode).attr("data-state", "inactive")
          });
        d3.select(this).append("text")
          .attr("class", "bar-label")
          .attr("y", y(0.5))
      })

    self.svg.selectAll(".bar")
      .data(stack(data))
      .transition()
      .attr("x", function(d) { return x(d.x0); })
      .attr("width", function(d) { return x(d.value); });

    self.svg.selectAll(".bar-label")
      .data(stack(data))
      .attr("x", function(d) { return x(d.x0 + d.value/2); })
      .text(function(d) { return d.key + " (" + parseInt(d.value, 10) + ")"; })

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
    self.svg.append("line")
      .attr({
        "class":"border",
        "x1" : 0,
        "x2" : self.width,
        "y1" : 0,
        "y2" : 0,
      });
  };

  return OverviewChart;
});

