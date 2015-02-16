define(['knockout', 'd3', 'pathway'], function(ko, d3, pathway) {
  'use strict';

  var Chart = function() {
    var self = this;

    self.element = null;
    self.data = {};
  };

  Chart.prototype = {
    /**
     * initialize chart
     * @returns {object} - current Chart instance
     */
    init: function(element){
      var self = this;
      self.element = element;

      self.colours = d3.scale.category10();

      self.margin = { top: 20, right: 50, bottom: 70, left: 100 };
      // self.width = element.clientWidth - self.margin.left - self.margin.right;
      // self.height = element.clientHeight - self.margin.top - self.margin.bottom;
      self.width = 450 - self.margin.left - self.margin.right;
      self.height = 400 - self.margin.top - self.margin.bottom;

      self.svg = d3.select(self.element).append('svg')
          .attr('width', self.width + self.margin.left + self.margin.right)
          .attr('height', self.height + self.margin.top + self.margin.bottom)
        .append("g")
          .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")");

      return self;
    },

    /** draw / redraw chart */
    draw: function(data){
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

      var stack = d3.layout.stack()
        .offset("zero")
        .values(function(d) { return d.values; })
        .x(function(d) { return d.date; })
        .y(function(d) { return d.value; });

      var nest = d3.nest()
        .key(function(d) { return d.key; });

      var area = d3.svg.area()
          .x(function(d) { return x(d.date); })
          .y0(function(d) { return y(d.y0); })
          .y1(function(d) { return y(d.y0 + d.y); })
          .interpolate("basis");

      var line = d3.svg.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.value); })
        .interpolate("basis");

      var layers = stack(nest.entries(chartLayers));



      var colourGradients = [];
      // Colour gradient data for each layer
      for (var i = 0; i < layers.length; i++) {
        var layerCoefficient = (i+1)/layers.length // color opacity
        colourGradients.push([
          {offset: "0%", color: self.colours(i), opacity: 1 - layerCoefficient},
          {offset: "100%", color: self.colours(i), opacity: 1 - layerCoefficient/3}
        ]);

        self.svg.append("linearGradient")
            .attr("id", "area-gradient-" + (i+1))
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0).attr("y1", y(yMin))
            .attr("x2", 0).attr("y2", y(yMax))
          .selectAll("stop")
            .data(colourGradients[i])
          .enter().append("stop")
            .attr("offset", function(d) { return d.offset; })
            .attr("stop-color", function(d) { return d.color; })
            .attr("stop-opacity", function(d) { return d.opacity; });
      };

      // Primary data


      var layersSVG = self.svg.selectAll(".layer").data(layers);

      layersSVG
        .enter().append("path")
          .attr("class", function(d) { return "layer layer-" + d.key.replace(/ +/g, '-').replace(/[^\w|-]/g, '').toLowerCase(); })
          .attr("d", function(d) { return area(d.values); });

      layersSVG
        .transition()
          .attr("d", function(d) { return area(d.values); });

      // Secondary data

      var lineSVG = self.svg.selectAll(".line").data([chartLine])

      lineSVG.enter().append("path")
          .attr("class", "line")
          .attr("d", line);
      lineSVG.transition()
        .duration(300)
        .attr("d", line)

      self.svg.selectAll('.axis').remove();

      self.svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .attr("shape-rendering", "crispEdges")
          .call(xAxis)
        .append("text")
          .attr("class", "label")
          .attr("x", width / 2)
          .attr("y", margin.bottom / 2)
          .attr("dy", "1em")
          .text("Date");

      self.svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(0, 0)")
          .attr("shape-rendering", "crispEdges")
          .call(yAxis)
        .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          // X and Y are swapped because it's rotated! ! ! ! ! ! !!!!!!!!!!!! !!
          // !!!!!!!!! ! ! !!!!!
          .attr("x", -height / 2)
          .attr("y", -margin.left / 2)
          .attr("dy", "-1em")
          .text("Energy (J)");

      self.svg.selectAll("line.horizontalGrid").data(x.ticks(4)).enter()
        .append("line")
          .attr({
            "class":"horizontalGrid",
            "x1" : function(d){ return x(d);},
            "x2" : function(d){ return x(d);},
            "y1" : 0,
            "y2" : height,
            "fill" : "none",
            "shape-rendering" : "crispEdges",
            "stroke" : "rgba(255, 255, 255, 0.2)",
            "stroke-width" : "1px"
          });
    }
  };

  return Chart;
});

