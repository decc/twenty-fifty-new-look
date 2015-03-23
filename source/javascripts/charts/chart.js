define(['d3'], function(d3) {
  'use strict';

  var Chart = function(args) {
    var self = this;
    var args = args || {};

    self.element = null;
    self.data = {};

    self.title;

    self.transitionBars = function() {};

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

      self.colours = function(index, key) {

        var colors = [
          // pinks

          '#C23474',
          '#A12B61',
          '#782048',
          '#531632',

          "#D53980",
          "#28A197",
          '#5A6378',

          '#3867AF',
          "#C96E79",
          "#9E1946",
          "#710627",
          "#A04668",
          "#9A275A",

          "#A7CECB",
          "#8BA6A9",
          "#2D3E5B",
          "#028090",
          "#85BDBF",
          "#C9FBFF",
          "#253031",
          "#2978A0",
          "#2D7883",
          "#29827E",
          "#037171",
          "#00B9AE",
          "#26A197",
          '#40ACA4',
          '#68BDB6',
          '#8ACCC7',
          '#B3DEDB',

          '#D6EDEB',
          "#95CFCA",
          "#8193AD",
          "#F75FA4"
        ];

        var keys = {
          "0.01 gw geothermal stations": 0,
          "1 gw gas standby power stations": 0,
          "1.2 gw coal gas or biomass power stations with ccs": 0,
          "2 gw coal gas or biomass power stations without ccs": 0,
          "215 kt/y waste to energy conversion facilities": 0,
          "3 gw nuclear power station": 0,
          "agriculture": 0,
          "agriculture and land use": 0,
          "bikes": 0,
          "biocrops": 0,
          "bioenergy": 0,
          "bioenergy credit": 0,
          "bioenergy imports": 0,
          "biomass/coal power stations": 0,
          "biomatter to fuel conversion": 0,
          "buildings": 0,
          "carbon capture": 0,
          "carbon capture storage (ccs)": 0,
          "coal": 0,
          "combustion + ccs": 0,
          "commercial heating and cooling": 0,
          "commercial lighting, appliances, and catering": 0,
          "conventional cars and buses": 0,
          "conventional thermal plant": 0,
          "distributed solar pv": 0,
          "distributed solar thermal": 0,
          "district heating effective demand": 0,
          "domestic aviation": 0,
          "domestic freight": 0,
          "domestic heating": 0,
          "domestic insulation": 0,
          "domestic lighting, appliances, and cooking": 0,
          "domestic space heating and hot water": 0,
          "electric cars and buses": 0,
          "electricity": 0,
          "electricity exports": 0,
          "electricity grid distribution": 0,
          "electricity imports": 0,
          "energy crops": 0,
          "energy from waste": 0,
          "environmental heat": 0,
          "finance": 0,
          "finance cost": 0,
          "forest": 0,
          "fossil fuel transfers": 0,
          "fossil fuels": 0,
          "fuel cell cars and buses": 0,
          "fuel combustion": 0,
          "gas": 0,
          "geosequestration": 0,
          "geothermal": 0,
          "geothermal electricity": 0,
          "h2 production": 0,
          "heating and cooling": 0,
          "hybrid cars and buses": 0,
          "hydro": 0,
          "hydroelectric": 0,
          "hydroelectric power stations": 0,
          "industrial processes": 0,
          "industry": 0,
          "international aviation": 0,
          "international aviation and shipping": 0,
          "international shipping (maritime bunkers)": 0,
          "land use, land-use change and forestry": 0,
          "lighting & appliances": 0,
          "marine algae": 0,
          "micro wind": 0,
          "natural gas": 0,
          "non-thermal renewable generation": 0,
          "nuclear fission": 0,
          "nuclear power": 0,
          "offshore wind": 0,
          "oil": 0,
          "onshore wind": 0,
          "other": 0,
          "petroleum refineries": 0,
          "rail": 0,
          "solar": 0,
          "solar pv": 0,
          "solar thermal": 0,
          "solvent and other product use": 0,
          "storage of captured co2": 0,
          "storage, demand shifting, backup": 0,
          "tidal": 0,
          "tidal and wave": 0,
          "tidal range": 0,
          "tidal stream": 0,
          "transport": 0,
          "unabated thermal generation": 0,
          "waste": 0,
          "waste arising": 0,
          "wave": 0,
          "wave and tidal": 0,
          "wind": 0
        };

        if (typeof key != 'undefined') {

          var lowerCaseKey = key.toLowerCase();

          if (typeof keys[lowerCaseKey] != 'undefined')
            return colors[keys[lowerCaseKey]];

        }

        var randomOffset = Math.floor(Math.random() * colors.length) + 1;

        return colors[(index + randomOffset) % colors.length];

      };

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
      sortable.sort(function(a, b) { return a[1] > b[1] ? -1 : 1 });
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

    setupLineAxes: function(xLabel, yLabel) {
      var self = this;

      self.svg.selectAll('.axis').remove();
      // X Axis, can handle negative Y values
      var xAxis = self.svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + self.y(0) + ")")
          .call(self.xAxis)
      xAxis.selectAll('.tick text')
          .attr("transform", "translate(0," + (self.height - self.y(0)) + ")")
          .attr("dy", "1em")
          .attr("stroke", "none")
          .attr("fill", "#fff")
      xAxis.append("text")
          .attr("class", "label")
          .attr("transform", "translate(0," + (self.height - self.y(0)) + ")")
          .attr("x", self.width / 2)
          .attr("y", self.margin.bottom / 2)
          .attr("dy", "1em")
          .text(xLabel);

      // Y Axis
      var yAxis = self.svg.append("g")
          .attr("class", "y axis")
          .attr("transform", "translate(0, 0)")
          .call(self.yAxis)
      yAxis.selectAll('.tick text')
          .attr("stroke", "none")
          .attr("fill", "#fff")
      yAxis.append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("x", -self.height / 2)
          .attr("y", -self.margin.left / 2)
          .attr("dy", "-1em")
          .text(yLabel);

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

