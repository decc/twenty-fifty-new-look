define(['knockout', 'd3', 'charts/chart'], function(ko, d3, Chart) {
  'use strict';

  var CostsSensitivityComponentsChart = function() {};

  CostsSensitivityComponentsChart.prototype = new Chart({});

  CostsSensitivityComponentsChart.prototype.constructor = CostsSensitivityComponentsChart

  CostsSensitivityComponentsChart.prototype.draw = function(dataObjects, width, height){
    var self = this;
    var dataNested = [];
    var data = [];

    if(typeof dataObjects === "undefined") {
      return 1;
    }

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
      { color: "#e9d", opacity: 0.7 },
      { color: "lightgoldenrodyellow", opacity: 0.7 },
      { color: "lightgoldenrodyellow", opacity: 0.7 }
    ]

    var cost_component_key = ["low", "point", "high", "range"];

    var cost_component_options = {
      "Oil": ["$75/bbl", "$130/bbl", "$170/bbl", "Uncertain"],
      "Coal": ["$80/tCoal", "$110/tCoal", "$155/tCoal", "Uncertain"],
      "Gas": ["45p/therm", "70p/therm", "100p/therm", "Uncertain"],
      "Finance cost": ["None", "7% real", "10% real", "Uncertain"],
      "Default" : ["Cheap", "Default", "Today's cost", "Uncertain"]
    };

    var readSelects = function() {
      var selects = document.querySelectorAll(".select");
      var sensitivitySelection = [];

      for(var i = 0; i < selects.length; i++) {
        sensitivitySelection.push(selects[i].value);
      }

      return sensitivitySelection;
    };

    var selectChange = function(e) {
      self.transitionBars();

      self.drawParams.updateCharts.forEach(function(updateChart) {
        updateChart.draw(updateChart.data);
      });
    };

    var optionValues = [];

    if(document.querySelector('.ie-select')) {
      data.forEach(function(d) {
        var select = document.querySelector('.ie-select[data-component="'+d.current.key+'"]')
        select.style.top = (componentOrder[d.id] * (componentHeight + spacing)) + "px";
      });
    } else {
      data.forEach(function(d) {
        var select = document.createElement('select');
        select.className = 'ie-select select'
        select.setAttribute('data-component', d.current.key);
        select.style.top = (componentOrder[d.id] * (componentHeight + spacing)) + "px";
        select.style.left = self.margin.left + "px";
        select.id = d.id;

        // Get options for this cost component
        if(typeof cost_component_options[d.current.key] === "undefined") {
          var optionValues = cost_component_options["Default"];
        } else {
          var optionValues = cost_component_options[d.current.key];
        }

        optionValues.forEach(function(cost_component, i) {
          var option = document.createElement('option');
          option.innerHTML = optionValues[i];
          option.setAttribute("value", cost_component_key[i]);

          if(cost_component_key[i] === "point") {
            option.setAttribute("selected", "selected");
          }

          select.appendChild(option);
        });

        self.element.appendChild(select);
      });
    }

    var selects = document.querySelectorAll(".select");
    for(var i = 0; i < selects.length; i++) {
      selects[i].addEventListener('change', selectChange);
    };


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
      .attr("id", function(d) { return d.id; })
      .attr("transform", function(d, i) { return "translate(0, "+(componentOrder[d.id] * (componentHeight + spacing))+")"; });

    components.transition()
      .attr("transform", function(d, i) { return "translate(0, "+(componentOrder[d.id] * (componentHeight + spacing))+")"; });


    bars.forEach(function(bar, n) {
      // Key
      var key = document.getElementById('costs-sensitivity-colour-' + (n+1));
      key.style.background = self.colours(n);
      key.style.opacity = bar.opacity;

      componentsEnter.append("rect")
        .attr("class", "bar bar-"+n)
        .attr('fill', self.colours(n))
        .attr('opacity', bar.opacity)
        .attr("y", (n * barHeight))
        .attr("height", barHeight)
        .attr("x", x(0))
    });

    componentsEnter.append("rect")
      .attr("class", "bar bar-"+0+"-range")
      .attr('fill', self.colours(0))
      .attr('opacity', 0.4)
      .attr("y", 0)
      .attr("height", barHeight)
      .attr("x", x(0))

    componentsEnter.append("rect")
      .attr("class", "bar bar-"+2+"-range")
      .attr('fill', self.colours(2))
      .attr('opacity', 0.4)
      .attr("y", (2 * barHeight))
      .attr("height", barHeight)
      .attr("x", x(0))

    components.select(".bar-1").transition()
      .attr("width", function(d) { return Math.abs(x(d.current.value.range)); })
      .attr("x", function(d) { return Math.abs(x(d.current.value.low)); })
      .attr('fill', 'none')
      .attr('stroke', self.colours(1))
      .attr('stroke-width', '2px')
      .attr("stroke-dasharray", function(d) { return "0 " + Math.abs(x(d.current.value.range)) + " " + barHeight + " " + Math.abs(x(d.current.value.range)) + " " + barHeight; });

    components.select(".bar-3").transition()
      .attr("width", function(d) { return Math.abs(x(d.comparison.value.range)); })
      .attr("x", function(d) { return Math.abs(x(d.comparison.value.low)); })
      .attr('fill', 'none')
      .attr('stroke', self.colours(3))
      .attr('stroke-width', '2px')
      .attr("stroke-dasharray", function(d) { return "0 " + Math.abs(x(d.comparison.value.range)) + " " + barHeight + " " + Math.abs(x(d.comparison.value.range)) + " " + barHeight; });

    self.transitionBars = function() {
      var components = self.svg.selectAll(".component")
        .data(data);

      var sensitivitySelection = readSelects();

      components.each(function(d, i) {
        if(sensitivitySelection[i] !== "range") {
          d3.select(this).select(".bar-0").transition()
            .attr("width", Math.abs(x(d.current.value[sensitivitySelection[i]])))

          d3.select(this).select(".bar-2").transition()
            .attr("width", Math.abs(x(d.comparison.value[sensitivitySelection[i]])));

          d3.select(this).select(".bar-0-range").transition()
            .attr("x", Math.abs(x(d.current.value["low"])))
            .attr("width", 0);

          d3.select(this).select(".bar-2-range").transition()
            .attr("x", Math.abs(x(d.comparison.value["low"])))
            .attr("width", 0);
        } else {
          d3.select(this).select(".bar-0").transition()
            .attr("width", Math.abs(x(d.current.value["low"])));

          d3.select(this).select(".bar-2").transition()
            .attr("width", Math.abs(x(d.comparison.value["low"])));

          d3.select(this).select(".bar-0-range").transition()
            .attr("x", Math.abs(x(d.current.value["low"])))
            .attr("width", Math.abs(x(d.current.value["range"])));

          d3.select(this).select(".bar-2-range").transition()
            .attr("x", Math.abs(x(d.comparison.value["low"])))
            .attr("width", Math.abs(x(d.comparison.value["range"])));

        }
      });
    }
    self.transitionBars();

    componentsEnter.append("text")
          .attr("class", "bar-label")
          .attr("x", -94)
          .attr("dx", "-0.7em")
          .attr("dy", "1.85em")
          .text(function(d) { return d.current.key });

    // componentsEnter.append("foreignObject")
    //       .attr("x", 0)
    //       .attr("dx", "-0.7em")
    //       .attr("dy", "1.8em")
    //       .attr("width", "200")
    //       .attr("height", "150")
    //       .append("xhtml:div")
    //       .append("select")
    //         .attr("class", "select")
    //       .append("option")
    //         .attr("value", "john")
    //         .html("Joja")

    components.selectAll("line.horizontalGrid").remove();
    components.each(function(d, i) {
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

    components.selectAll('.border').remove();
    components.append("rect")
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

