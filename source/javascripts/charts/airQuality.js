define(['knockout', 'd3', 'charts/chart'], function(ko, d3, Chart) {
  'use strict';

  var AirQualityChart = function() {};

  AirQualityChart.prototype = new Chart({});

  AirQualityChart.prototype.constructor = AirQualityChart

  AirQualityChart.prototype.draw = function(data, width, height){
    var self = this;
    console.log(data)
    if(typeof data === "undefined") {
      return 1;
    }

    self.outerWidth = width || self.outerWidth;
    self.outerHeight = height || self.outerHeight;

    self.width = self.outerWidth - self.margin.left - self.margin.right;
    self.height = self.outerHeight - self.margin.top - self.margin.bottom;

    var yMin = 0;
    var yMax = 100;

    var nTicks = 5;

    var x = d3.scale.ordinal()
        .domain(["2010", "2050 - Doesn't tackle climate change (All at level 1)", "2050 - Your pathway"])
        .rangeRoundBands([0, self.width], 0.1);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var y = d3.scale.linear()
        .domain([yMin, yMax])
        .range([self.height, 0]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .ticks(nTicks);

    self.x = x;
    self.xAxis = xAxis;
    self.y = y;
    self.yAxis = yAxis;

    var lowData = [];
    var highData = [];

    for(var bar in data) {
      lowData.push(data[bar].low)
      highData.push(data[bar].high)
    }

    console.log(lowData)
    var bars = self.svg.selectAll(".bar")
        .data(lowData)

    bars.enter().append("rect")
        .attr("class", "bar")
        .attr('fill', self.colours(1))
        .attr('opacity', '0.6')
        .attr("x", function(d, i) { return x("2010"); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d); })
        .attr("height", function(d) { return y(d); });

    bars.transition()
        .attr("y", function(d) { return y(d); })
        .attr("height", function(d) { return y(d); });


    // self.svg.selectAll("line.horizontalGrid").remove();
    // self.svg.selectAll("line.horizontalGrid").data(self.x.ticks(nTicks)).enter()
    //   .append("line")
    //     .attr({
    //       "class":"horizontalGrid",
    //       "x1" : function(d){ return self.x(d);},
    //       "x2" : function(d){ return self.x(d);},
    //       "y1" : 0,
    //       "y2" : self.height,
    //       "fill" : "none",
    //       "shape-rendering" : "crispEdges",
    //       "stroke" : "rgba(255, 255, 255, 0.2)",
    //       "stroke-width" : "1px"
    //     });

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

  };

  return AirQualityChart;
});

