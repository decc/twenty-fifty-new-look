define(['knockout', 'd3', 'charts/chart'], function(ko, d3, Chart) {
  'use strict';

  var EnergyDemandChart = function() {

  };

  EnergyDemandChart.prototype = new Chart();

  EnergyDemandChart.prototype.draw = function(data){
      var self = this;

      var chartLayers = data.chartLayers;
      var chartLine = data.chartLine;

      var width = self.width;
      var height = self.height;
      var margin = self.margin;

      var yMin = 0;
      var yMax = 4000;

      var x = d3.scale.linear()
          .domain(d3.extent(chartLayers, function(d) { return d.date; }))
          .range([0, width]);

      var y = d3.scale.linear()
          // .domain([0, d3.max(chartLayers, function(d) { return d.value; })])
          .domain([yMin, yMax])
          .range([height, 0]);

      var xAxis = d3.svg.axis()
          .scale(x)
          .orient("bottom")
          .tickValues([2010, 2020, 2030, 2040, 2050])
          .tickFormat(d3.format("d"));

      var yAxis = d3.svg.axis()
          .scale(y)
          .orient("left")
          .tickValues([0, 1000, 2000, 3000, 4000]);

      self.x = x;
      self.y = y;
      self.xAxis = xAxis;
      self.yAxis = yAxis;

      var stack = self.stack();
      var nest = self.nest();
      var area = self.area();
      var line = self.line();
      var layers = stack(nest.entries(chartLayers));

      // Primary data
      var demand = self.svg.selectAll(".layer-container")
          .data(layers)


      demand.enter().append("g")
            .attr("class", "layer-container")
            .each(function(d, i) {
              d3.select(this).append('path')
                .attr("class", function(d) { return "layer layer-" + d.key.replace(/ +/g, '-').replace(/[^\w|-]/g, '').toLowerCase(); })
                .attr('fill', self.colours(i))
                .attr('opacity', '0.6')
                .on('mouseover', function(d) {
                  d3.select(this.parentNode).attr("data-state", "active")
                  d3.select(this.parentNode.parentNode).attr("data-state", "graph-hover")
                })
                .on('mouseout', function(d) {
                  d3.select(this.parentNode).attr("data-state", "inactive")
                  d3.select(this.parentNode.parentNode).attr("data-state", "inactive")
                })
              d3.select(this).append("text")
                .attr("class", "layer-label")
                .text(function(d) { return d.key; })
            })

      self.svg.selectAll('.layer').data(layers)
        .transition()
          .attr("d", function(d) { return area(d.values); });

      self.svg.selectAll('.layer-label').data(layers)
        .transition()
          .attr("x", 6)
          .attr("dy", "0.35em")
          .attr("data-state", function(d){
            // Hide label if layer too small at x1
            var end = d.values[d.values.length - 1];
            return (y(0) - y(end.y) > self.minimumHeightForLabel) ? "active" : "inactive";
          })
          .attr("transform", function(d) {
            var end = d.values[d.values.length - 1];
            return "translate(" + x(end.date) + "," + y(end.y0 + end.y / 2) + ")";
          });

      // Secondary data
      var lineSVG = self.svg.selectAll(".line").data([chartLine])

      lineSVG.enter().append("path")
          .attr("class", "line")
          .attr("d", line);
      lineSVG.transition()
        .duration(300)
        .attr("d", line)


      self.setupLineAxes();
  };

  return EnergyDemandChart;
});

