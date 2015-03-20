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

      var layers = positiveLayers.concat(negativeLayers);

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
            return (Math.abs(y(0) - y(end.y)) > self.minimumHeightForLabel) ? "active" : "inactive";
          })
          .attr("transform", function(d) {
            var end = d.values[d.values.length - 1];
            return "translate(" + x(end.date) + "," + y(end.y0 + end.y / 2) + ")";
          });

      // Secondary data
      var lineContainer = self.svg.selectAll(".line-container")
          .data([chartLine])

      lineContainer.enter().append("g")
          .attr("class", "line-container")
          .each(function(d, i) {
            d3.select(this).append("path")
              .attr("class", "line")
              .attr("d", line)
              .on('mouseover', function(d) {
                d3.select(this.parentNode).attr("data-state", "active")
                d3.select(this.parentNode.parentNode).attr("data-state", "graph-hover")
              })
              .on('mouseout', function(d) {
                d3.select(this.parentNode).attr("data-state", "inactive")
                d3.select(this.parentNode.parentNode).attr("data-state", "inactive")
              })

            var label =  d3.select(this).append("g")
              .attr("class", "line-label")
              .attr("fill", "#fff")

            label.append("rect")
              .attr("width", self.margin.right)
              .attr("height", 17);

            label.append("text")
              .text(function(d) {
                var start = d[0].value
                var end = d[d.length - 1].value;
                // var percentageReduction = Math.round(end / start * 100)
                return "Total";
              })
              .attr("dx", "6px")
              .attr("dy", "1.05em");
          });

      self.svg.selectAll('.line').data([chartLine])
          .transition()
          .attr("d", line)

      self.svg.selectAll('.line-label').data([chartLine])
          .transition()
            .attr("transform", function(d) {
              var end = d[d.length - 1];
              var textHeight = 12;
              return "translate(" + x(end.date) + "," + (y(end.value) - textHeight)+ ")";
            })

      self.setupLineAxes("Date", "Greenhouse Gas Emissions (MtCO2e/yr)");
  };

  return EnergyEmissionsChart;
});

