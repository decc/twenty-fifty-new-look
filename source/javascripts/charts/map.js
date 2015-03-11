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
    var importsFencePadding = 50;

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
        return { key: d.key, colour: self.colours(i), value: edge, y0: previousY, y1: previousY += (edge + spacing) };
      });
    };

    self.y = y;
    self.yAxis = yAxis;

    var landData = stackSquares(data.land, "ASC");
    var landX = Math.round(self.width / 2);
    var landY = Math.round(y(200));

    var offshoreData = stackSquares(data.offshore, "DESC");
    var offshoreX = self.width;
    var offshoreY = Math.round(y(50));

    var importsData = stackSquares(data.imports, "DESC");
    var importsTotal = data.imports.reduce(function(a, b) { return Math.sqrt(a.value) + Math.sqrt(b.value) + spacing; });
    var importsMax = importsData[0].y1;
    var importsX = Math.round(y(0));
    var importsY = Math.round(self.height);

    var waveData = data.wave;
    var waveX = Math.round(y(50));
    var waveY = Math.round(y(20));

    var land = self.svg.selectAll(".land-square-container")
        .data(landData)

    land.enter().append("g")
      .attr("class", function(d) { return "land-square-container " + d.key.replace(/ +/g, '-').replace(/[^\w|-]/g, '').toLowerCase(); })
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

    self.svg.selectAll(".land-square-container").data(landData)
      .attr("transform", function(d) { return "translate(" + landX + ", " + parseInt(landY + y(d.y0)) +")"; })

    var offshore = self.svg.selectAll(".offshore-square-container")
      .data(offshoreData)

    offshore.enter().append("g")
      .attr("class", function(d) { return "offshore-square-container " + d.key.replace(/ +/g, '-').replace(/[^\w|-]/g, '').toLowerCase(); })
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

    self.svg.selectAll(".offshore-square-container").data(offshoreData)
      .attr("transform", function(d) { return "translate(" + offshoreX + ", " + parseInt(offshoreY + y(d.y0)) +")"; })

    var imports = self.svg.selectAll(".imports-square-container")
      .data(importsData)

    imports.enter().append("g")
      .attr("class", function(d) { return "imports-square-container " + d.key.replace(/ +/g, '-').replace(/[^\w|-]/g, '').toLowerCase(); })
      .attr("transform", function(d) { return "translate(" + importsX + ", " + parseInt(importsY - y(d.y0)) +")"; })
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

    self.svg.selectAll(".imports-square-container").data(importsData)
      .attr("transform", function(d) { return "translate(" + importsX + ", " + parseInt(importsY - y(d.y1)) +")"; })

    self.svg.append("path").data(importsData)
      .attr('d', function(d) { return "M" + importsX + " " + Math.round(importsY - y(importsTotal) - importsFencePadding) + " Q " + Math.round(importsX + y(importsMax) + importsFencePadding) + " " + Math.round(importsY - y(importsTotal) - importsFencePadding) + ", " + Math.round(y(importsMax) + importsFencePadding) + ", " + importsY; })
      .attr("class", "import-fence")
      .attr("fill", "none")
      .attr('stroke', "white")
      .attr('stroke-width', '2px')
      .attr('stroke-dasharray', '8, 4')

    var wave = self.svg.selectAll(".wave-square-container")
      .data(waveData)

    wave.enter().append("g")
      .attr("class", "wave-container")
      .attr("transform", function(d) { return "translate(" + waveX + ", " + waveY +")"; })

    wave.append("line")
      .attr("class", "wave")
      .attr('stroke', '#00a2ff')
      .attr('stroke-width', '4px')
      .attr("x1", waveX)
      .attr("x2", waveX)
      .attr("y1", function(d) { return waveY; })
      .attr("y2", function(d) { return y(d.value); })
    wave.append("text")
      .attr("class", "square-label")
      .attr("dx", "-0.5em")
      .attr("y", function(d) { return y(d.value) / 2; })
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text(function(d) { return d.key; })

    self.svg.selectAll(".wave-container").data(waveData)
      .attr("transform", function(d) { return "translate(" + waveX + ", " + waveY +")"; })


  };

  return MapChart;
});

