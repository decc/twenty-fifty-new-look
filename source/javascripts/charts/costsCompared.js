define(['knockout', 'd3', 'charts/chart'], function(ko, d3, Chart) {
  'use strict';

  var CostsComparedChart = function() {};

  CostsComparedChart.prototype = new Chart({
    height: 150,
    margin: { top: 40, right: 50, bottom: 50, left: 100 }
  });

  CostsComparedChart.prototype.constructor = CostsComparedChart

  CostsComparedChart.prototype.draw = function(data){
      var self = this;

      var width = self.width;
      var height = self.height;
      var margin = self.margin;

      var xMin = 0;
      var xMax = 10000;

      var nTicks = 5;

      var x = d3.scale.linear()
          .domain([xMin, xMax])
          .range([0, width]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("top")
          .ticks(nTicks);

      var stack = function(data) {
        var previousX = 0;

        data.sort(function(a, b) { return a.value - b.value });

        return data.map(function(d, i) { return { key: d.key, colour: self.colours(i), value: d.value, x0: previousX, x1: previousX += d.value }; });
      };

      self.x = x;
      self.xAxis = xAxis;

      var bars = self.svg.selectAll(".bar")
          .data(stack(data))

      bars.enter().append("rect")
          .attr("class", "bar")
          .attr('fill', function(d) { return d.colour; })
          .attr('opacity', '0.6')
          .attr("y", margin.top)
          .attr("height", height)
          .attr("x", function(d) { return x(d.x0); })
          .attr("width", function(d) { return x(d.value); });

      bars.transition()
          .attr("x", function(d) { return x(d.x0); })
          .attr("width", function(d) { return x(d.value); });

      self.svg.selectAll("line.horizontalGrid").data(self.x.ticks(nTicks)).enter()
        .append("line")
          .attr({
            "class":"horizontalGrid",
            "x1" : function(d){ return self.x(d);},
            "x2" : function(d){ return self.x(d);},
            "y1" : margin.top,
            "y2" : self.height + margin.top,
            "fill" : "none",
            "shape-rendering" : "crispEdges",
            "stroke" : "rgba(255, 255, 255, 0.2)",
            "stroke-width" : "1px"
          });

      if(self.hasAxis) {
        self.svg.selectAll('.axis').remove();

        self.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + self.margin.top + ")")
            .attr("shape-rendering", "crispEdges")
            .call(self.xAxis)
          .append("text")
            .attr("class", "label")
            .attr("x", self.width / 2)
            .attr("y", -self.margin.top / 2)
            .attr("dy", "-1.5em")
            .text("Cost (£)");
      }
  };

  return CostsComparedChart;
});

