define(['knockout', 'd3', 'charts/chart'], function(ko, d3, Chart) {
  'use strict';

  var CostsSensitivityComponentsChart = function() {};

  CostsSensitivityComponentsChart.prototype = new Chart({});

  CostsSensitivityComponentsChart.prototype.constructor = CostsSensitivityComponentsChart

  CostsSensitivityComponentsChart.prototype.draw = function(dataObjects, width, height){
    var self = this;
    var dataNested = [];
    var data = [];

    if(typeof dataObjects.comparison()["CostsSensitivityComponentsChart"] === "undefined") {
      return 1;
    }

    // Combine arrays into nested
    var current = dataObjects.current()["CostsSensitivityComponentsChart"];
    var comparison = dataObjects.comparison()["CostsSensitivityComponentsChart"];
    for (var i = 0; i < dataObjects.current()["CostsSensitivityComponentsChart"].length; i++) {
      var component = {
        id: i,
        current: current[i],
        comparison: comparison[i]
      }
      dataNested.push(component)
      data.push(component)
    }


    // Sort nested arrays
    dataNested.sort(function(a, b) {
      return ((a.current.value.point > b.current.value.point) ? -1 : 1);
    });
    var componentOrder = [];

    // Order mapping array
    for (var i = 0; i < dataNested.length; i++) {
      componentOrder[dataNested[i].id] = i;
    }

    self.outerWidth = width || self.outerWidth;
    self.outerHeight = height || self.outerHeight;

    self.width = self.outerWidth - self.margin.left - self.margin.right;
    self.height = self.outerHeight - self.margin.top - self.margin.bottom;

    var xMin = 0;
    var xMax = 10000;

    var nTicks = 5;

    var x = d3.scale.linear()
        .domain([xMin, xMax])
        .range([0, self.width]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("top")
        .ticks(nTicks);

    self.x = x;
    self.xAxis = xAxis;

    var spacing = 8;
    var barHeight = 8;
    var componentHeight = barHeight * 4;
    var bars = [
      { color: "#e9d", opacity: 0.7 },
      { color: "#e9d", opacity: 0.4 },
      { color: "lightgoldenrodyellow", opacity: 0.7 },
      { color: "lightgoldenrodyellow", opacity: 0.4 }
    ]

    var cost_component_key = ["low", "point", "high", "range"];

    var cost_component_options = {
      "Oil": ["$75/bbl", "$130/bbl", "$170/bbl", "Uncertain"],
      "Coal": ["$80/tCoal", "$110/tCoal", "$155/tCoal", "Uncertain"],
      "Gas": ["45p/therm", "70p/therm", "100p/therm", "Uncertain"],
      "Finance cost": ["None", "7% real", "10% real", "Uncertain"],
      "Default" : ["Cheap", "Default", "Today's cost", "Uncertain"]
    };

    var selects = [];
    data.forEach(function(d) {
      var select = document.createElement('select');
      select.className = 'ie-select select'
      select.style.top = (componentOrder[d.id] * (componentHeight + spacing)) + "px";

      // Get options for this cost component
      if(typeof cost_component_options[d.current.key] === "undefined") {
        var optionValues = cost_component_options["Default"];
      } else {
        var optionValues = cost_component_options[d.current.key];
      }

      cost_component_options["Default"].forEach(function(cost_component, i) {
        var option = document.createElement('option');
        option.innerHTML = optionValues[i];
        option.setAttribute("value", optionValues[i]);
        select.appendChild(option);
      });

      self.element.appendChild(select);

    })

    // self.element.append("xhtml:div")
    //       .attr("class", "select")
    //       .attr("x", 0)
    //       .attr("dx", "-0.7em")
    //       .attr("dy", "1.8em")
    //       .append("select")
    //       .append("option")
    //         .attr("value", "john")
    //         .html("Joja")

    var components = self.svg.selectAll(".component")
        .data(data)

    var componentsEnter = components.enter().append("g")
      .attr("class", "component")
      .attr("transform", function(d, i) { return "translate(0, "+(componentOrder[d.id] * (componentHeight + spacing))+")"; });

    components.transition()
      .attr("transform", function(d, i) { return "translate(0, "+(componentOrder[d.id] * (componentHeight + spacing))+")"; });


    bars.forEach(function(bar, n) {
      componentsEnter.append("rect")
        .attr("class", "bar bar-"+n)
        .attr('fill', self.colours(n))
        .attr('opacity', bar.opacity)
        .attr("y", (n * barHeight))
        .attr("height", barHeight)
        .attr("x", x(0))
    });

    components.select(".bar-0").transition()
      .attr("width", function(d) { return Math.abs(x(d.current.value.point)); });

    components.select(".bar-1").transition()
      .attr("width", function(d) { return Math.abs(x(d.current.value.range)); })
      .attr("x", function(d) { return Math.abs(x(d.current.value.point)); });

    components.select(".bar-2").transition()
      .attr("width", function(d) { return Math.abs(x(d.comparison.value.point)); });

    components.select(".bar-3").transition()
      .attr("width", function(d) { return Math.abs(x(d.comparison.value.range)); })
      .attr("x", function(d) { return Math.abs(x(d.comparison.value.point)); });

    componentsEnter.append("text")
          .attr("class", "bar-label")
          .attr("x", 0)
          .attr("dx", "-0.7em")
          .attr("dy", "1.8em")
          .text(function(d) { return d.current.key });

    // componentsEnter.append("foreignObject")
    //       .attr("class", "select")
    //       .attr("x", 0)
    //       .attr("dx", "-0.7em")
    //       .attr("dy", "1.8em")
    //       .attr("width", "200")
    //       .attr("height", "150")
    //       .append("xhtml:div")
    //       .append("select")
    //       .append("option")
    //         .attr("value", "john")
    //         .html("Joja")

    componentsEnter.selectAll("line.horizontalGrid").remove();
    componentsEnter.each(function(d, i) {
      d3.select(this).selectAll("line.horizontalGrid").data(self.x.ticks(nTicks)).enter()
      .append("line")
        .attr({
          "class":"horizontalGrid",
          "x1" : function(d, xi){ return self.x(d);},
          "x2" : function(d, xi){ return self.x(d);},
          "y1" : 0,
          "y2" : componentHeight,
          "fill" : "none",
          "shape-rendering" : "crispEdges",
          "stroke" : "rgba(255, 255, 255, 0.2)",
          "stroke-width" : "1px"
        });
    });

    // componentsEnter.selectAll('.border').remove();
    componentsEnter.append("rect")
      .attr({
        "class": "border",
        "x": 0,
        "width": self.width,
        "y": 0,
        "height": componentHeight,
      });
  };

  return CostsSensitivityComponentsChart;
});

