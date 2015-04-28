define(['knockout', 'd3', 'charts/chart'], function(ko, d3, Chart) {
  'use strict';

  var MapChart = function() {};

  MapChart.prototype = new Chart({});

  MapChart.prototype.constructor = MapChart

  MapChart.prototype.draw = function(data, width, height){
    var self = this;

    if(typeof data === "undefined") {
      return 1;
    }

    self.outerWidth = width || self.outerWidth;
    self.outerHeight = height || self.outerHeight;

    self.width = self.outerWidth - self.margin.left - self.margin.right;
    self.height = self.outerHeight - self.margin.top - self.margin.bottom;

    var yMin = 0;
    var yMax = 1000;

    var spacing = 8;
    var minLabelSize = 8;
    var importsFencePaddingX = 80;
    var importsFencePaddingY = 40;

    var y = d3.scale.linear()
        .domain([yMin, yMax])
        .range([0, self.height]);

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("top")

    var stackSquares = function(data, order) {
      var previousY = 0;

      data.sort(function(a, b) { return order === "ASC" ? a.value - b.value : b.value - a.value });

      return data.map(function(d, i) {
        var edge = Math.sqrt(d.value);
        return { key: d.key, colour: self.colours(i, d.key), value: edge, y0: previousY, y1: previousY += (edge + spacing) };
      });
    };

    self.y = y;
    self.yAxis = yAxis;

    var landData = stackSquares(data.land, "ASC");
    var landX = Math.round(self.width / 2);
    var landY = y(280);

    var offshoreData = stackSquares(data.offshore, "DESC");
    var offshoreX = self.width;
    var offshoreY = y(0);

    var importsData = stackSquares(data.imports, "DESC");
    var importsTotal = data.imports.reduce(function(a, b) { return Math.sqrt(a.value) + Math.sqrt(b.value) + spacing; });
    var importsMax = importsData[0].y1;
    var importsX = y(5);
    var importsY = Math.round(self.height);

    var waveData = data.wave;
    var waveX = y(150);
    var waveY = y(20);

    var land = self.svg.selectAll(".land-square-container")
        .data(landData)

    land.enter().append("g")
      .attr("class", function(d) { return "square-container land-square-container " + d.key.replace(/ +/g, '-').replace(/[^\w|-]/g, '').toLowerCase(); })
      .attr("transform", function(d) { return "translate(" + landX + ", " + parseInt(landY + y(d.y0)) +")"; })
      .each(function(d, i) {
        d3.select(this).append("rect")
          .attr("class", "square")
          .attr('fill', d.colour)
          .attr('fill-opacity', '0.5')
          .attr('stroke', d.colour)
          .attr('stroke-width', '2px')
          .attr("height", y(d.value))
          .attr("x", 0)
          .attr("width", y(d.value))
        d3.select(this).append("text")
          .attr("class", "square-label")
          .attr("x", y(d.value))
          .attr("dx", "0.5em")
          .attr("y", y(d.value) / 2)
          .attr("dy", "0.35em")
          .text(d.key)
          .attr("data-state", (y(d.value) > minLabelSize ? "active" : "inactive"))
      });

    self.svg.selectAll(".land-square-container").data(landData).transition()
      .attr("transform", function(d) { return "translate(" + landX + ", " + parseInt(landY + y(d.y0)) +")"; })
      .each(function(d, i) {
        d3.select(this).select("rect").transition()
          .attr("height", y(d.value))
          .attr("width", y(d.value))
        d3.select(this).select("text").transition()
          .attr("x", y(d.value))
          .attr("y", y(d.value) / 2)
          .attr("data-state", (y(d.value) > minLabelSize ? "active" : "inactive"))
      });

    var offshore = self.svg.selectAll(".offshore-square-container")
      .data(offshoreData)

    offshore.enter().append("g")
      .attr("class", function(d) { return "square-container offshore-square-container " + d.key.replace(/ +/g, '-').replace(/[^\w|-]/g, '').toLowerCase(); })
      .attr("transform", function(d) { return "translate(" + offshoreX + ", " + parseInt(offshoreY + y(d.y0)) +")"; })
      .each(function(d, i) {
        d3.select(this).append("rect")
          .attr("class", "square")
          .attr('fill', d.colour)
          .attr('fill-opacity', '0.5')
          .attr('stroke', d.colour)
          .attr('stroke-width', '2px')
          .attr("y", 0)
          .attr("height", y(d.value))
          .attr("x", -y(d.value))
          .attr("width", y(d.value))
        d3.select(this).append("text")
          .attr("class", "square-label")
          .attr("x", -y(d.value))
          .attr("dx", "-0.5em")
          .attr("y", y(d.value) / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "end")
          .text(d.key)
          .attr("data-state", (y(d.value) > minLabelSize ? "active" : "inactive"))
      });

    self.svg.selectAll(".offshore-square-container").data(offshoreData).transition()
      .attr("transform", function(d) { return "translate(" + offshoreX + ", " + parseInt(offshoreY + y(d.y0)) +")"; })
      .each(function(d, i) {
        d3.select(this).select("rect").transition()
          .attr("height", y(d.value))
          .attr("x", -y(d.value))
          .attr("width", y(d.value))
        d3.select(this).select("text").transition()
          .attr("x", -y(d.value))
          .attr("y", y(d.value) / 2)
          .attr("data-state", (y(d.value) > minLabelSize ? "active" : "inactive"))
      });

    var imports = self.svg.selectAll(".imports-square-container")
      .data(importsData)

    imports.enter().append("g")
      .attr("class", function(d) { return "square-container imports-square-container " + d.key.replace(/ +/g, '-').replace(/[^\w|-]/g, '').toLowerCase(); })
      .attr("transform", function(d) { return "translate(" + importsX + ", " + parseInt(importsY - y(d.y0) - y(d.value)) +")"; })
      .each(function(d, i) {
        d3.select(this).append("rect")
          .attr("class", "square")
          .attr('fill', d.colour)
          .attr('fill-opacity', '0.5')
          .attr('stroke', d.colour)
          .attr('stroke-width', '2px')
          .attr("height", y(d.value))
          .attr("x", 0)
          .attr("width", y(d.value))
        d3.select(this).append("text")
          .attr("class", "square-label")
          .attr("x", y(d.value))
          .attr("dx", "0.5em")
          .attr("y", y(d.value) / 2)
          .attr("dy", "0.35em")
          .text(d.key)
          .attr("data-state", (y(d.value) > minLabelSize ? "active" : "inactive"))
      });

    self.svg.selectAll(".imports-square-container").data(importsData).transition()
      .attr("transform", function(d) { return "translate(" + importsX + ", " + parseInt(importsY - y(d.y0) - y(d.value)) +")"; })
      .each(function(d, i) {
        d3.select(this).select("rect").transition()
          .attr("height", y(d.value))
          .attr("width", y(d.value))
        d3.select(this).select("text").transition()
          .attr("x", y(d.value))
          .attr("y", y(d.value) / 2)
          .attr("data-state", (y(d.value) > minLabelSize ? "active" : "inactive"))
      });

    self.svg.select(".import-fence").remove();
    self.svg.append("path")
      .attr('d', "M" + importsX + " " + Math.round(importsY - y(importsTotal) - importsFencePaddingY) + " Q " + Math.round(importsX + y(importsMax) + importsFencePaddingX) + " " + Math.round(importsY - y(importsTotal) - importsFencePaddingY) + ", " + Math.round(y(importsMax) + importsFencePaddingX) + ", " + importsY)
      .attr("class", "import-fence")
      .attr("fill", "none")
      .attr('stroke', "#777d8a")
      .attr('stroke-width', '2px')
      .attr('stroke-dasharray', '8, 4')

    self.svg.select(".import-fence-title").remove();
    self.svg.append("text")
      .attr("class", "import-fence-title")
      .attr("x", 0)
      .attr("y", importsY - y(importsTotal) - importsFencePaddingY)
      .attr("dy", "1.8em")
      .text("Imports")
      .attr("fill", "#777d8a")
      .attr("font-size", "0.8em")

    var wave = self.svg.selectAll(".wave-container")
      .data(waveData)

    var waveEnter = wave.enter().append("g")
      .attr("class", "wave-container")
      .attr("transform", function(d) { return "translate(" + waveX + ", " + waveY +")"; })

    waveEnter.append("line")
      .attr("class", "wave")
      .attr('stroke', '#00a2ff')
      .attr('stroke-width', '4px')
      .attr("x1", 0)
      .attr("x2", 0)
      .attr("y1", 0)
      .attr("y2", function(d) { return y(d.value); })
    waveEnter.append("text")
      .attr("class", "wave-label")
      .attr("x", 0)
      .attr("dx", "-1em")
      .attr("y", 0)
      .attr("dy", "0.65em")
      .attr("text-anchor", "end")
      .attr("fill", "#fff")
      .attr("data-state", function(d) { return (y(d.value) > 0 ? "active" : "inactive"); })
      .text("Wave")

    wave.select("line").transition()
      .attr("y2", function(d) { return y(d.value); })

    self.svg.selectAll(".wave-container").data(waveData)
      .select(".wave-label")
        .attr("data-state", function(d) { return (y(d.value) > 0 ? "active" : "inactive"); })


  };

  return MapChart;
});

