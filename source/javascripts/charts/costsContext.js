define(['knockout', 'd3', 'charts/chart'], function(ko, d3, Chart) {
  'use strict';

  var CostsContextChart = function() {};

  CostsContextChart.prototype = new Chart({});

  CostsContextChart.prototype.constructor = CostsContextChart

  CostsContextChart.prototype.draw = function(data, width, height){
    var self = this;

    if(typeof data === "undefined") {
      return 1;
    }

    self.data = data;

    var readSelects = function() {
      var selects = document.querySelectorAll(".select");
      var sensitivitySelection = [];

      for(var i = 0; i < selects.length; i++) {
        sensitivitySelection.push(selects[i].value);
      }

      return sensitivitySelection;
    };

    var selects = readSelects();
    var totalSelection = 0;
    var totalRange = 0;

    for(var i = 0; i < data.length; i++) {
      var key = Object.keys(data);
      if(typeof selects[i] === "undefined") {
        totalSelection += data[key[i]].value.point;
      } else if(selects[i] === "range") {
        totalSelection += data[key[i]].value.low;
        totalRange += data[key[i]].value.range;
      } else {
        totalSelection += data[key[i]].value[selects[i]];
      }
    }

    self.outerWidth = width || self.outerWidth;
    self.outerHeight = height || self.outerHeight;

    self.width = self.outerWidth - self.margin.left - self.margin.right;
    self.height = self.outerHeight - self.margin.top - self.margin.bottom;

    var xMin = 0;
    var xMax = 10000;

    self.nTicks = 5;

    var x = d3.scale.linear()
        .domain([xMin, xMax])
        .range([0, self.width]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top")
        .ticks(self.nTicks);

    self.x = x;
    self.xAxis = xAxis;

    // Gridlines
    self.drawVerticalGridlines();

    // Selection and range bar options
    // var bars = [
    //   {
    //     "name": "selection",
    //     "data": [totalSelection]
    //   },
    //   {
    //     "name": "range",
    //     "data": [totalRange],
    //     "offset": totalSelection
    //   }
    // ];

    // // Draw bars
    // self.drawStackedBars(bars);

    var selectionBar = self.svg.selectAll(".selection-bar")
        .data([totalSelection])

    selectionBar.enter().append("rect")
        .attr("class", "bar selection-bar")
        .attr('fill', function(d, i) { return self.colours(i); })
        .attr('opacity', '0.6')
        .attr("y", 0)
        .attr("height", self.height)
        .attr("x", function(d) { return x(0); })
        .attr("width", function(d) { return self.width - x(d); });

    var rangeBar = self.svg.selectAll(".range-bar")
        .data([totalRange])

    rangeBar.enter().append("rect")
        .attr("class", "bar range-bar")
        .attr('fill', function(d, i) { return self.colours(i); })
        .attr('opacity', '0.3')
        .attr("y", 0)
        .attr("height", self.height)
        .attr("x", function(d) { return x(totalSelection); })
        .attr("width", function(d) { return x(d); });

    self.transitionBars = function() {
      var selectionBar = self.svg.selectAll(".selection-bar")
        .data([totalSelection])

      var rangeBar = self.svg.selectAll(".range-bar")
        .data([totalRange])

      var selects = readSelects();

      selectionBar.transition()
          .attr("x", function(d) { return x(0); })
          .attr("width", function(d) { return x(d); });

      rangeBar.transition()
          .attr("x", function(d) { return x(totalSelection); })
          .attr("width", function(d) { return x(d); });
    };
    self.transitionBars();

    self.drawBorders();
  };

  return CostsContextChart;
});

