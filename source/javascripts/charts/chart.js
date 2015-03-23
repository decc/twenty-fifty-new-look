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

          "#C23474",
          "#A12B61",
          "#782048",
          "#531632",
          "#D53980",
          "#C96E79",
          "#9E1946",
          "#710627",
          "#A04668",
          "#9A275A",
          "#F75FA4",

          // greens

          "#28A197",
          "#A7CECB",
          "#8BA6A9",
          "#2D7883",
          "#028090",
          "#85BDBF",
          "#C9FBFF",
          "#037171",
          "#00B9AE",
          "#26A197",
          "#40ACA4",
          "#68BDB6",
          "#8ACCC7",
          "#B3DEDB",
          "#D6EDEB",
          "#95CFCA",
          "#29827E",

          // blues

          "#5A6378",
          "#3867AF",
          "#2978A0",
          "#2D3E5B",
          "#8193AD",
          "#253031"         
        ];
        
        var keys = {
          "0.01 gw geothermal stations": 9,
          //"1 gw gas standby power stations": 0,
          //"1.2 gw coal gas or biomass power stations with ccs": 0,
          //"2 gw coal gas or biomass power stations without ccs": 0,
          //"215 kt/y waste to energy conversion facilities": 0,
          "3 gw nuclear power station": 7,
          "agriculture": 19,
          "agriculture and land use": 19,
          //"bikes": 0,
          "biocrops": 4,
          "bioenergy": 27,
          "bioenergy credit": 27,
          "bioenergy imports": 27,
          "biomass/coal power stations": 14,
          //"biomatter to fuel conversion": 0,
          //"buildings": 0,
          "carbon capture": 0,
          "carbon capture storage (ccs)": 0,
          "coal": 5,
          "combustion + ccs": 0,
          //"commercial heating and cooling": 0,
          //"commercial lighting, appliances, and catering": 0,
          //"conventional cars and buses": 0,
          //"conventional thermal plant": 0,
          "distributed solar pv": 20,
          "distributed solar thermal": 24,
          //"district heating effective demand": 0,
          //"domestic aviation": 0,
          //"domestic freight": 0,
          //"domestic heating": 0,
          //"domestic insulation": 0,
          //"domestic lighting, appliances, and cooking": 0,
          //"domestic space heating and hot water": 0,
          "electric cars and buses": 30,
          "electricity": 31,
          "electricity exports": 31,
          "electricity grid distribution": 31,
          "electricity imports": 31,
          "energy crops": 4,
          //"energy from waste": 0,
          //"environmental heat": 0,
          "finance": 21,
          "finance cost": 21,
          "forest": 18,
          "fossil fuel transfers": 33,
          "fossil fuels": 33,
          //"fuel cell cars and buses": 0,
          //"fuel combustion": 0,
          "gas": 25,
          //"geosequestration": 0,
          "geothermal": 9,
          "geothermal electricity": 9,
          //"h2 production": 0,
          //"heating and cooling": 0,
          //"hybrid cars and buses": 0,
          "hydro": 8,
          "hydroelectric": 8,
          "hydroelectric power stations": 8,
          "industrial processes": 13,
          "industry": 13,
          "international aviation": 3,
          "international aviation and shipping": 3,
          "international shipping (maritime bunkers)": 3,
          "land use, land-use change and forestry": 18,
          //"lighting & appliances": 0,
          "marine algae": 22,
          //"micro wind": 0,
          "natural gas": 25,
          //"non-thermal renewable generation": 0,
          "nuclear fission": 7,
          "nuclear power": 7,
          "offshore wind": 15,
          "oil": 33,
          "onshore wind": 28,
          //"other": 0,
          "petroleum refineries": 33,
          //"rail": 0,
          "solar": 20,
          "solar pv": 20,
          "solar thermal": 24,
          //"solvent and other product use": 0,
          //"storage of captured co2": 0,
          //"storage, demand shifting, backup": 0,
          "tidal": 29,
          "tidal and wave": 29,
          "tidal range": 29,
          "tidal stream": 29,
          //"transport": 0,
          //"unabated thermal generation": 0,
          "waste": 32,
          "waste arising": 32,
          "wave": 29,
          "wave and tidal": 29,
          "wind": 17
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

