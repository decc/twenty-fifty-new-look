define(['knockout', 'd3', 'charts/chart'], function(ko, d3, Chart) {
  'use strict';

  var AirQualityChart = function() {};

  AirQualityChart.prototype = new Chart({});

  AirQualityChart.prototype.constructor = AirQualityChart

  AirQualityChart.prototype.draw = function(data, width, height){
    var self = this;

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

    var comparison1 = self.drawParams.comparison1();
    var comparison2 = self.drawParams.comparison2();

    [comparison1, comparison2, data].forEach(function(d) {
      lowData.push({ key: d.key, value: d.low })
      highData.push({ key: d.key, value: d.high, y1: d.low })
    });

    var bars = self.svg.selectAll(".bar")
        .data(lowData)

    bars.enter().append("rect")
        .attr("class", "bar")
        .attr('fill', function(d, i) { return self.colours(i); })
        .attr('opacity', '0.6')
        .attr("x", function(d, i) { return x(d.key); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return y(0) - y(d.value); });

    bars.transition()
        .attr("x", function(d, i) { return x(d.key); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return y(0) - y(d.value); });

    var rangeBars = self.svg.selectAll(".rangeBar")
        .data(highData)

    rangeBars.enter().append("rect")
        .attr("class", "rangeBar")
        .attr('fill', function(d, i) { return self.colours(i); })
        .attr('opacity', '0.4')
        .attr("x", function(d, i) { return x(d.key); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return y(d.value - d.y1); });

    rangeBars.transition()
        .attr("x", function(d, i) { return x(d.key); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return y(d.y1) - y(d.value); });

    self.svg.selectAll('.axis').remove();

    self.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + self.height + ")")
        .call(self.xAxis)

    var insertLinebreaks = function (d) {
        var el = d3.select(this);
        var words = d.split(' ');
        el.text('');

        for (var i = 0; i < words.length; i+=2) {
            if(typeof words[i+1] !== "undefined") {
                var tspan = el.append('tspan').text(words[i] + ' ' + words[i+1]);
            } else {
                var tspan = el.append('tspan').text(words[i]);
            }
            if (i > 0)
                tspan.attr('x', 0).attr('dy', '15');
        }
    };

    self.svg.selectAll('g.x.axis g text').each(insertLinebreaks)
        .attr('font-size', '0.7em');

    self.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0, 0)")
        .call(self.yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("x", -self.height / 2)
        .attr("y", -self.margin.left / 2)
        .attr("dy", "-1em")
        .text("Air pollution impact index");

  };

  return AirQualityChart;
});

