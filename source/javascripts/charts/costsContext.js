define(['knockout', 'd3', 'charts/chart'], function(ko, d3, Chart) {
  'use strict';

  var CostsContextChart = function() {};

  CostsContextChart.prototype = new Chart({
    height: 150,
    margin: { top: 40, right: 50, bottom: 70, left: 100 }
  });

  CostsContextChart.prototype.constructor = CostsContextChart

  CostsContextChart.prototype.draw = function(bar){
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

      self.x = x;
      self.xAxis = xAxis;


      var bars = self.svg.selectAll(".bar")
          .data([bar])

      bars.enter().append("rect")
          .attr("class", "bar")
          .attr('fill', self.colours(1))
          .attr('opacity', '0.6')
          .attr("y", margin.top)
          .attr("height", height)
          .attr("x", function(d) { return x(0); })
          .attr("width", function(d) { return width - x(d); });

      bars.transition()
          .attr("x", function(d) { return x(0); })
          .attr("width", function(d) { return x(d); });

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
            .call(self.xAxis)
          .append("text")
            .attr("class", "label")
            .attr("x", self.width / 2)
            .attr("y", -self.margin.top / 2)
            .attr("dy", "-1.5em")
            .text("Cost (£)");
      }
  };

  return CostsContextChart;
});

