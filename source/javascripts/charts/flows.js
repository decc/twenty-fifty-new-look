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
console.log(self.element.id)
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
      "Coal reserves":"#8F6F38",
      "Coal":"#8F6F38",
      "Coal imports":"#8F6F38",

      "Oil reserves":"#A99268",
      "Oil":"#A99268",
      "Oil imports":"#A99268",

      "Gas reserves":"#DDD4C4",
      "Ngas":"#DDD4C4",
      "Gas imports":"#DDD4C4",

      "Solar":"#F6FF00",
      "Solar Thermal":"#F6FF00",
      "Solar PV":"#F6FF00",

      "UK land based bioenergy":"#30FF00",
      "Bio-conversion":"#30FF00",
      "Marine algae":"#30FF00",
      "Agricultural 'waste'":"#30FF00",
      "Other waste":"#30FF00",
      "Biomass imports":"#30FF00",
      "Biofuel imports":"#30FF00",

      "Solid":"#557731",
      "Liquid":"#7D9763",
      "Gas":"#BCC2AD",

      "Electricity grid":"#0000FF",
      "Thermal generation":"#0000FF",
      "CHP":"#FF0000",
      "Nuclear":"#E2ABDB",

      "District heating":"#FF0000",
      "Pumped heat":"#FF0000",
      "Useful district heat":"#FF0000",
      "CHP Heat":"#FF0000",

      "Electricity imports":"#0000FF",
      "Wind":"#C7E7E6",
      "Tidal":"#C7E7E6",
      "Wave":"#C7E7E6",
      "Geothermal":"#C7E7E6",
      "Hydro":"#C7E7E6",

      "H2 conversion":"#FF6FCF",
      "Final electricity":"#0000FF",
      "Over generation / exports":"#0000FF",
      "H2":"#FF6FCF"
    });
    self.sankey.setColors({
      "Coal reserves":"#8F6F38",
      "Coal":"#8F6F38",
      "Coal imports":"#8F6F38",

      "Oil reserves":"#A99268",
      "Oil":"#A99268",
      "Oil imports":"#A99268",

      "Gas reserves":"#DDD4C4",
      "Ngas":"#DDD4C4",
      "Gas imports":"#DDD4C4",

      "Solar":"#F6FF00",
      "Solar Thermal":"#F6FF00",
      "Solar PV":"#F6FF00",

      "UK land based bioenergy":"#30FF00",
      "Bio-conversion":"#30FF00",
      "Marine algae":"#30FF00",
      "Agricultural 'waste'":"#30FF00",
      "Other waste":"#30FF00",
      "Biomass imports":"#30FF00",
      "Biofuel imports":"#30FF00",

      "Solid":"#557731",
      "Liquid":"#7D9763",
      "Gas":"#BCC2AD",

      "Electricity grid":"#0000FF",
      "Thermal generation":"#0000FF",
      "CHP":"#FF0000",
      "Nuclear":"#E2ABDB",

      "District heating":"#FF0000",
      "Pumped heat":"#FF0000",
      "Useful district heat":"#FF0000",
      "CHP Heat":"#FF0000",

      "Electricity imports":"#0000FF",
      "Wind":"#C7E7E6",
      "Tidal":"#C7E7E6",
      "Wave":"#C7E7E6",
      "Geothermal":"#C7E7E6",
      "Hydro":"#C7E7E6",

      "H2 conversion":"#FF6FCF",
      "Final electricity":"#0000FF",
      "Over generation / exports":"#0000FF",
      "H2":"#FF6FCF"
    });

    // Add the emissions
    // self.sankey.boxes["Thermal generation"].ghg = 100;
    // self.sankey.boxes["CHP"].ghg = 10;
    // self.sankey.boxes["UK land based bioenergy"].ghg = -100;
    // self.sankey.boxes["Heating and cooling - homes"].ghg = 20;

    // Fix some of the colours
    self.sankey.nudge_colours_callback = function() {
      this.recolour(this.boxes["Losses"].left_lines,"#AAAAAA");
      this.recolour(this.boxes["District heating"].left_lines,"#FF0000");
      this.recolour(this.boxes["Electricity grid"].left_lines,"#0000FF");
    };

    self.sankey.y_space = 20;
    self.sankey.right_margin = 210;
    self.sankey.left_margin = 120;
    self.sankey.box_width = 30;
    self.sankey.flow_edge_width = 0;
    self.sankey.flow_curve = 0.2;
    self.sankey.opacity = 0.7;
    self.sankey.opacity_hover = 0.2;

    self.sankey.convert_flow_values_callback = function(flow) {
      return flow * 0.05; // Pixels per TWh
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

