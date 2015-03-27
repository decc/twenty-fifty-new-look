define(['knockout', 'd3', 'charts/chart', 'raphael', 'sankey'], function(ko, d3, Chart) {
  'use strict';

  var FlowsChart = function() {};

  FlowsChart.prototype = new Chart({});

  FlowsChart.prototype.constructor = FlowsChart

  FlowsChart.prototype.draw = function(data, width, height){
    var self = this;

    if(typeof data === "undefined") {
      return 1;
    }

    self.outerWidth = width || self.outerWidth;
    self.outerHeight = height || self.outerHeight;

    self.width = self.outerWidth - self.margin.left - self.margin.right;
    self.height = self.outerHeight - self.margin.top - self.margin.bottom;

    // Clear
    if(self.sankey) {
      while (self.element.firstChild) {
        self.element.removeChild(self.element.firstChild);
      }
    }
    self.sankey = new Sankey(self.element.id);

    self.sankey.stack(0,[
    "Pumped heat",
    "Solar",
    "Wind",
    "Tidal",
    "Wave",
    "Geothermal",
    "Hydro",
    "Electricity imports",
    "Nuclear",
    "Coal reserves",
    "Coal imports",
    "Biomass imports",
    "Oil reserves",
    "Oil imports",
    "Biofuel imports",
    "Gas reserves",
    "Gas imports",
    "UK land based bioenergy",
    "Agricultural 'waste'",
    "Other waste",
    "Marine algae"
    ]);

    self.sankey.stack(1,["Coal"],"Coal reserves");
    self.sankey.stack(1,["Oil"],"Oil reserves");
    self.sankey.stack(1,["Natural Gas"],"Gas reserves");
    self.sankey.stack(1,["Bio-conversion"],"UK land based bioenergy");

    self.sankey.stack(2,["Solar Thermal", "Solar PV"],"Solar");
    self.sankey.stack(2,[
    "Solid",
    "Liquid",
    "Gas"
    ],"Coal");

    self.sankey.stack(3,[
    "Thermal generation",
    "CHP"
    ],"Nuclear");

    self.sankey.stack(4,["Electricity grid","District heating"],"Wind");

    self.sankey.stack(5,["H2 conversion"],"Electricity grid");

    self.sankey.stack(6,["H2"],"H2 conversion");

    self.sankey.stack(7,[
    "Heating and cooling - homes",
    "Heating and cooling - commercial",
    "Lighting & appliances - homes",
    "Lighting & appliances - commercial",
    "Industry",
    "Road transport",
    "Rail transport",
    "Domestic aviation",
    "International aviation",
    "National navigation",
    "International shipping",
    "Agriculture",
    "Geosequestration",
    "Over generation / exports",
    //"Exports",
    "Losses"
    ]);

    // Nudge
    self.sankey.nudge_boxes_callback = function() {
      self.sankey.boxes["Losses"].y = (self.sankey.boxes["Marine algae"].b() - self.sankey.boxes["Losses"].size());
      // self.sankey.boxes["Exports"].y = (self.sankey.boxes["Losses"].y - self.sankey.boxes["Exports"].size() - y_space);
      // self.sankey.boxes["Over generation / exports"].y = (self.sankey.boxes["Exports"].y - self.sankey.boxes["Over generation / exports"].size() - y_space);
    }

    // Colours
    self.sankey.setColors({
      "Coal reserves": self.colours(0),
      "Coal": self.colours(0),
      "Coal imports": self.colours(0),

      "Oil reserves": self.colours(1),
      "Oil": self.colours(1),
      "Oil imports": self.colours(1),

      "Gas reserves": self.colours(2),
      "Natural Gas": self.colours(2),
      "Gas imports": self.colours(2),

      "Solar": self.colours(3),
      "Solar Thermal": self.colours(3),
      "Solar PV": self.colours(3),

      "UK land based bioenergy": self.colours(4),
      "Bio-conversion": self.colours(4),
      "Marine algae": self.colours(4),
      "Agricultural 'waste'": self.colours(4),
      "Other waste": self.colours(4),
      "Biomass imports": self.colours(4),
      "Biofuel imports": self.colours(4),

      "Solid": self.colours(5),
      "Liquid": self.colours(6),
      "Gas": self.colours(7),

      "Electricity grid": self.colours(8),
      "Thermal generation": self.colours(8),
      "CHP": self.colours(9),
      "Nuclear": self.colours(10),

      "District heating": self.colours(9),
      "Pumped heat": self.colours(9),
      "Useful district heat": self.colours(9),
      "CHP Heat": self.colours(9),

      "Electricity imports": self.colours(8),
      "Wind": self.colours(11),
      "Tidal": self.colours(11),
      "Wave": self.colours(11),
      "Geothermal": self.colours(11),
      "Hydro": self.colours(11),

      "H2 conversion": self.colours(12),
      "Final electricity": self.colours(8),
      "Over generation / exports": self.colours(8),
      "H2": self.colours(12)
    });

    // Add the emissions
    // self.sankey.boxes["Thermal generation"].ghg = 100;
    // self.sankey.boxes["CHP"].ghg = 10;
    // self.sankey.boxes["UK land based bioenergy"].ghg = -100;
    // self.sankey.boxes["Heating and cooling - homes"].ghg = 20;

    // Fix some of the colours
    self.sankey.nudge_colours_callback = function() {
      this.recolour(this.boxes["Losses"].left_lines, self.colours(13));
      this.recolour(this.boxes["District heating"].left_lines, self.colours(9));
      this.recolour(this.boxes["Electricity grid"].left_lines, self.colours(8));
    };

    self.sankey.y_space = 20;
    self.sankey.right_margin = 210;
    self.sankey.left_margin = 120;
    self.sankey.box_width = self.drawParams.boxWidth || 30;
    self.sankey.flow_edge_width = 0;
    self.sankey.flow_curve = 0.2;
    self.sankey.opacity = 1.0;
    self.sankey.opacity_hover = 0.2;

    var pixels_per_TWh = self.element.clientHeight / 6000;
    self.sankey.y_space = Math.round(100 * pixels_per_TWh);

    self.sankey.convert_flow_values_callback = function(flow) {
      return flow * pixels_per_TWh; // Pixels per TWh
    };

    self.sankey.convert_flow_labels_callback = function(flow) {
      return Math.round(flow);
    };

    self.sankey.convert_box_value_labels_callback = function(flow) {
      return (""+Math.round(flow)+" TWh/y");
    };

    self.sankey.setData(data);
    self.sankey.draw();


  };

  return FlowsChart;
});

