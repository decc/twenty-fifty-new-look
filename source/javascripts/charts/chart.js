define(['d3'], function(d3) {
  'use strict';

  var Chart = function(args) {
    var self = this;
    var args = args || {};

    self.element = null;
    self.data = {};

    self.title;

    self.margin;
    self.outerWidth;
    self.outerHeight;

    self.hasAxis;

    self.drawParams = {};
  };

  Chart.colourGradients = function() {
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

    return colourGradients;
  }

  Chart.prototype = {
    /**
     * initialize chart
     * @returns {object} - current Chart instance
     */
    init: function(element, args){
      var self = this;
      var args = args || {};
      self.element = element;

      self.margin = args.margin || { top: 0, right: 0, bottom: 0, left: 0 };
      self.outerWidth = args.width || 640;
      self.outerHeight = args.height || 480;

      self.title = args.title || 'Chart';

      self.minimumHeightForLabel = 12;

      self.colours = d3.scale.category20();

      self.width = self.outerWidth - self.margin.left - self.margin.right;
      self.height = self.outerHeight - self.margin.top - self.margin.bottom;

      self.hasAxis = args.hasAxis || false;

      self.drawParams = args.drawParams || false;

      self.svg = d3.select(self.element).append('svg')
          // .attr("preserveAspectRatio", "xMinYMin meet")
          // .attr("viewBox", "0 0 "+self.outerWidth+" "+self.outerHeight)
          .attr('width', '100%')
          .attr('height', '100%')
        .append("g")
          .attr("class", "d3-chart")
          .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")")
          .attr('width', '100%')
          .attr('height', '100%');

      return self;
    },

    line: function() {
      var self = this;
      return d3.svg.line()
          .x(function(d) { return self.x(d.date); })
          .y(function(d) { return self.y(d.value); })
          .interpolate("monotone");
    },

    stackOrderByEndValue: function(d) {
      // Layer values at final x
      var endValues = d.map(function(layer){ return layer[layer.length - 1][1]; });

      // Create array mapping order of sizes
      var sortable = endValues.map(function(value, i){ return [i, value] });
      sortable.sort(function(a, b) { return a[1] - b[1] });
      var positions = sortable.map(function(valueArr) { return valueArr[0] });

      return positions;
    },

    stack: function() {
      var self = this;
      return d3.layout.stack()
          .offset("zero")
          .values(function(d) { return d.values; })
          .order(self.stackOrderByEndValue)
          .x(function(d) { return d.date; })
          .y(function(d) { return d.value; });
    },

    nest: function() {
      var self = this;
      return d3.nest()
        .key(function(d) { return d.key; });
    },

    area: function() {
      var self = this;
      return d3.svg.area()
          .x(function(d) { return self.x(d.date); })
          .y0(function(d) { return self.y(d.y0); })
          .y1(function(d) { return self.y(d.y0 + d.y); })
          .interpolate("monotone");
    },

    setupLineAxes: function() {
      var self = this;

      self.svg.selectAll('.axis').remove();

      self.svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + self.height + ")")
          // .attr("shape-rendering", "crispEdges")
          .call(self.xAxis)
        .append("text")
          .attr("class", "label")
          .attr("x", self.width / 2)
          .attr("y", self.margin.bottom / 2)
          .attr("dy", "1em")
          .text("Date");

      self.svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(0, 0)")
          // .attr("shape-rendering", "crispEdges")
          .call(self.yAxis)
        .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          // X and Y are swapped because it's rotated! ! ! ! ! ! !!!!!!!!!!!! !!
          // !!!!!!!!! ! ! !!!!!
          .attr("x", -self.height / 2)
          .attr("y", -self.margin.left / 2)
          .attr("dy", "-1em")
          .text("Energy (J)");

      self.svg.selectAll("line.horizontalGrid").remove();
      self.svg.selectAll("line.horizontalGrid").data(self.x.ticks(4)).enter()
        .append("line")
          .attr({
            "class":"horizontalGrid",
            "x1" : function(d){ return self.x(d);},
            "x2" : function(d){ return self.x(d);},
            "y1" : 0,
            "y2" : self.height,
            "fill" : "none",
            "stroke" : "rgba(255, 255, 255, 0.2)",
            "stroke-width" : "1px"
          });
    }

  };

  return Chart;
});

