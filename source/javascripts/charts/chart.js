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
    self.nTicks;

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
      self.xMin = typeof args.xMin === "number" ? args.xMin : 2010;
      self.xMax = typeof args.xMax === "number" ? args.xMax : 2050;
      self.yMin = typeof args.yMin === "number" ? args.yMin : 0;
      self.yMax = typeof args.yMax === "number" ? args.yMax : 1;

      self.minimumHeightForLabel = 12;

      // Add classes based on args
      if(self.hasAxis) {
        self.element.classList.add("has-axis")
      }

      self.colours = function(index, key) {

        var colors = [

          "#28A197", // green

          "#C23474", // pink

          "#5A6378", // blue

          "#A7CECB", // green

          "#A12B61", // pink

          "#3867AF", // blue

          "#2D7883", // green

          "#782048", // pink

          // more greens

          "#26A197",
          "#028090",
          "#8BA6A9",
          "#85BDBF",
          "#C9FBFF",
          "#037171",
          "#00B9AE",
          "#40ACA4",
          "#68BDB6",
          "#8ACCC7",
          "#B3DEDB",
          "#D6EDEB",
          "#95CFCA",
          "#29827E",

          // more pinks

          "#531632",
          "#D53980",
          "#C96E79",
          "#9E1946",
          "#710627",
          "#A04668",
          "#9A275A",
          "#F75FA4",

          // more blues

          "#2978A0",
          "#2D3E5B",
          "#8193AD",
          "#253031"
        ];

        var keys = {
          "0.01 gw geothermal stations": 18,
          "1 gw gas standby power stations": 25,
          "1.2 gw coal gas or biomass power stations with ccs": 0,
          "2 gw coal gas or biomass power stations without ccs": 14,
          "215 kt/y waste to energy conversion facilities": 32,
          "3 gw nuclear power station": 7,
          "agriculture": 19,
          "agriculture and land use": 19,
          "agricultural 'waste'": 19,
          "bikes": 6,
          "biocrops": 4,
          "bioenergy": 27,
          "bioenergy credit": 27,
          "bioenergy imports": 27,
          "biomass/coal power stations": 14,
          "biomatter to fuel conversion": 12,
          "buildings": 23,
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
          "energy from waste": 32,
          "environmental heat": 1,
          "finance": 21,
          "finance cost": 21,
          "forest": 9,
          "fossil fuel transfers": 33,
          "fossil fuels": 33,
          "fuel cell cars and buses": 2,
          "fuel combustion": 33,
          "gas": 25,
          "geosequestration": 10,
          "geothermal": 18,
          "geothermal electricity": 18,
          "h2 production": 16,
          "heating and cooling": 33,
          "hybrid cars and buses": 11,
          "hydro": 8,
          "hydroelectric": 8,
          "hydroelectric power stations": 8,
          "industrial processes": 13,
          "industry": 13,
          "international aviation": 3,
          "international aviation and shipping": 3,
          "international shipping (maritime bunkers)": 3,
          "land use, land-use change and forestry": 18,
          "lighting & appliances": 28,
          "marine algae": 22,
          "micro wind": 17,
          "natural gas": 25,
          //"non-thermal renewable generation": 0,
          "nuclear fission": 7,
          "nuclear power": 7,
          "offshore wind": 15,
          "oil": 33,
          "onshore wind": 28,
          //"other": 0,
          "petroleum refineries": 33,
          "rail": 16,
          "solar": 20,
          "solar pv": 20,
          "solar thermal": 24,
          //"solvent and other product use": 0,
          "storage of captured co2": 0,
          "storage, demand shifting, backup": 0,
          "tidal": 29,
          "tidal and wave": 29,
          "tidal range": 29,
          "tidal stream": 29,
          "transport": 26,
          "unabated thermal generation": 29,
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

        return colors[index];
      };

      self.width = self.outerWidth - self.margin.left - self.margin.right;
      self.height = self.outerHeight - self.margin.top - self.margin.bottom;

      self.hasAxis = args.hasAxis || false;

      self.drawParams = args.drawParams || false;

      if(args.initElement !== false) {
        self.svg = d3.select(self.element).append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
          .append("g")
            .attr("class", "d3-chart")
            .attr("transform", "translate(" + self.margin.left + "," + self.margin.top + ")")
            .attr('width', '100%')
            .attr('height', '100%');
      }

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
      // Layer values at final x position
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
    },

    drawVerticalGridlines: function() {
      var self = this;

      self.svg.selectAll("line.horizontalGrid").remove();
      self.svg.selectAll("line.horizontalGrid").data(self.x.ticks(self.nTicks)).enter()
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
    },

    /**************************************************************************************************
      Stacked area charts
    **************************************************************************************************/

    drawStackedArea: function() {
      var self = this;

      var demand = self.svg.selectAll(".layer-container")
        .data(this.stackedAreaData)

      demand.enter().append("g")
            .attr("class", "layer-container")
            .each(function(d, i) {
              d3.select(this).append('path')
                .attr("class", function(d) { return "layer layer-" + d.key.replace(/ +/g, '-').replace(/[^\w|-]/g, '').toLowerCase(); })
                .attr('fill', function(d, i) { return self.colours(i, d.key); })
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
                .attr("transform", function(d) {
                  var end = d.values[d.values.length - 1];
                  return "translate(" + self.x(end.date) + "," + self.y(end.y0 + end.y / 2) + ")";
                });
            })

      self.svg.selectAll('.layer').data(self.stackedAreaData)
        .transition()
          .attr("d", function(d) { return self.area()(d.values); });

      self.svg.selectAll('.layer-label').data(self.stackedAreaData)
        .transition()
          .attr("x", 6)
          .attr("dy", "0.35em")
          .each(function(d, i) {
            var end = d.values[d.values.length - 1];
            var labelYValue = end.y0 + end.y / 2;
            var labelYPosition = self.y(self.yMax);

            // Labels above yMax
            if(labelYValue > (self.yMax)) {
              d3.select(this)
                .attr("transform", function(d) {
                  return "translate(" + (self.x(end.date) + 5) + "," + labelYPosition + ")";
                })
                .attr("data-state", "inactive")
                .attr("dx", "1.4em");

              d3.select(this.parentNode).select(".layer-label-arrow").remove()
              d3.select(this.parentNode).append("polygon")
                .attr("points", "8,0 16,7 14,10 8,5 2,10 0,7")
                .attr("class", "layer-label-arrow")
                .attr("fill", "#fff")
                .attr("transform", function(d) {
                  return "translate(" + (self.x(end.date) + 5) + "," + (labelYPosition - 5) + ")";
                });
            }

            // Labels below yMin
            // else if(labelYValue < self.y(self.yMin)) {}

            // Normal labels
            else {
              d3.select(this.parentNode).select("polygon").remove();

              d3.select(this)
                .attr("dx", "0")
                .attr("transform", function(d) { return "translate(" + self.x(end.date) + "," + self.y(end.y0 + end.y / 2) + ")" })
                .attr("data-state", function(d){
                  // Hide label if layer too small at x1
                  var end = d.values[d.values.length - 1];
                  return (Math.abs(self.y(0) - self.y(end.y)) > self.minimumHeightForLabel) ? "active" : "inactive";
                });
            }
          });
    },

    drawLine: function(labelText) {
      var self = this;

      var labelLineHeight = 17;

      var lineContainer = self.svg.selectAll(".line-container")
        .data([self.lineData])

      lineContainer.enter().append("g")
          .attr("class", "line-container")
          .each(function(d, i) {
            d3.select(this).append("path")
              .attr("class", "line")
              .attr("d", self.line())
              .on('mouseover', function(d) {
                d3.select(this.parentNode).attr("data-state", "active")
                d3.select(this.parentNode.parentNode).attr("data-state", "graph-hover")
              })
              .on('mouseout', function(d) {
                d3.select(this.parentNode).attr("data-state", "inactive")
                d3.select(this.parentNode.parentNode).attr("data-state", "inactive")
              })
          });

      lineContainer.transition()
        .each(function(d, i) {
            var end = d[d.length - 1];

            // Remove and recreate labels
            // Needed to get their BBox on IE/FF
            d3.select(this).select(".line-label").remove();

            self.highlightedLabel(self.x(end.date), (self.y(end.value) - labelLineHeight / 2), labelText, "line-label", labelLineHeight, this);

            d3.select(this).select(".line-label").attr("transform", function(d) { return "translate(" + self.x(end.date) + "," + (self.y(end.value) - labelLineHeight / 2) + ")"; })
        });

      self.svg.selectAll('.line').data([self.lineData])
          .transition()
          .attr("d", self.line())
    },

    /**************************************************************************************************
      Single bar charts
    **************************************************************************************************/

    // Draw borders around entire chart
    // Top border is axis if hasAxis true
    drawBorders: function() {
      var self = this;

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

      // Use x Axis as top border or not
      if(self.hasAxis) {
        self.svg.selectAll('.axis').remove();

        self.svg.append("g")
            .attr("class", "x axis")
            .attr("shape-rendering", "crispEdges")
            .call(self.xAxis)
      } else {
        self.svg.append("line")
        .attr({
          "class":"border",
          "x1" : 0,
          "x2" : self.width,
          "y1" : 0,
          "y2" : 0,
        });
      }

      // Add x=0 line if scale goes negative
      if(self.xMin < 0) {
        self.svg.append("line")
          .attr({
            "class":"border",
            "x1" : self.x(0),
            "x2" : self.x(0),
            "y1" : 0,
            "y2" : self.height,
          });
      }
    },

    stackBars: function(data) {
      var self = this;

      var previousX = 0;

      data.sort(function(a, b) { return a.value - b.value });

      return data.map(function(d, i) { return { key: d.key, colour: self.colours(i, d.key), value: d.value, x0: previousX, x1: previousX += d.value }; });
    },

    // Draw and update stacked or single bars for single bar charts
    drawStackedBars: function(bars) {
      var self = this;

      // Each bar options object arg
      bars.forEach(function(bar) {
        var offset = bar.offset || 0;
        var negative = bar.negative || false;
        var labelPaddingX = bar.labelPadding || 4;
        var labelPaddingY = bar.labelPadding || 2;
        var containerName = bar.name ? "bar-container-" + bar.name : "bar-container";
        var barName = bar.name ? "bar-" + bar.name : "bar";
        var labelName = bar.name ? "bar-label-" + bar.name : "bar-label";

        self.barContainers = self.svg.selectAll("." + containerName)
          .data(bar.data);

        // Enter bar rects
        self.barContainers.enter().append("g")
          .attr("class", "bar-container " + containerName)
          .each(function(d, i) {
            d3.select(this).append("rect")
              .attr("class", "bar " + barName)
              .attr('fill', d.colour)
              .attr('opacity', '0.6')
              .attr("y", 0)
              .attr("height", self.height)
              .attr("x", function(d) { return negative ? self.x(offset + d.x1) : self.x(offset + d.x0); })
              .attr("width", function(d) { return negative ? self.x(0) - self.x(d.value) : self.x(d.value) - self.x(0); })
              .on('mouseover', function() {
                d3.select(this.parentNode).attr("data-state", "active")
                d3.select(this.parentNode.parentNode).attr("data-state", "graph-hover")
                self.svg.selectAll("#" + labelName + "-" + i).attr("data-state", "active")
              })
              .on('mouseout', function() {
                d3.select(this.parentNode).attr("data-state", "inactive")
                d3.select(this.parentNode.parentNode).attr("data-state", "inactive")
                self.svg.selectAll("#" + labelName + "-" + i).attr("data-state", "inactive")
              });
          });

        // Enter labels
        var labelContainers = self.barContainers.enter().append("g")
          .attr("class", "bar-label " + labelName)
          .attr("id", function(d, i) { return labelName + "-" + i; })
          .attr("transform", function(d) { return "translate(" + self.x(offset + d.x0 + d.value/2) + " " + self.y(0.5) + ")"; })

        // Enter label backgrounds
        labelContainers.append("rect")
          .attr("x", 0)
          .attr("y", 0)

        // Enter label text
        labelContainers.append("text")
          .attr("x", 0)
          .attr("y", 0)
          .attr("dy", "0.35em")

        // Update everything
        self.transitionBars = function() {
          // Transition bar rects
          self.barContainers.select("." + barName)
            .transition()
              .attr("x", function(d) { return negative ? self.x(offset + d.x1) : self.x(offset + d.x0); })
              .attr("width", function(d) { return negative ? self.x(0) - self.x(d.value) : self.x(d.value) - self.x(0); })
              .attr("height", self.height);

          // Transition labels.
          // Data must be reapplied because they are not inside container elements (z-indexing)
          var labelContainers = self.svg.selectAll("." + labelName)
            .data(self.barContainers.data())
              .attr("transform", function(d) { return "translate(" + self.x(offset + d.x0 + d.value/2) + " " + self.y(0.5) + ")"; })

          labelContainers.select("text")
            .text(function(d) { return d.key + " (" + parseInt(d.value, 10) + ")"; });

          labelContainers.select("rect").each(function(d) {
            try {
              var textWidth = this.parentNode.querySelector("text").getBBox().width;
              var textHeight = this.parentNode.querySelector("text").getBBox().height;
              if(textWidth > 0) {
                d3.select(this).attr({
                  "x": -(textWidth + labelPaddingX*2) / 2,
                  "width": textWidth + labelPaddingX*2,
                  "y": -(textHeight + labelPaddingY*2) / 2,
                  "height": textHeight + labelPaddingY*2
                });
              }
            } catch(e) {

            }
          });
        }
        self.transitionBars();
      });
    },

    /**************************************************************************************************
      General Helpers
    **************************************************************************************************/

    highlightedLabel: function(x, y, text, cssClass, height, container) {
      var self = this;

      var cssClass = cssClass || "label";
      var height = height || 17;
      var container = container ? d3.select(container) : self.svg;

      var label = container.append("g")
        .attr("class", cssClass)
        .attr("fill", "#fff")
        .attr("transform", function(d) { return "translate(" + x + "," + y + ")"; });

      label.append("rect")
        .attr("height", height);

      label.append("text")
        .text(text)
        .attr("dx", "6px")
        .attr("dy", "1.05em");

      var labelWidth = label.select("text")[0][0].getBBox().width + 12;
      label.select("rect")
        .attr("width", labelWidth);
    }

  };

  return Chart;
});

