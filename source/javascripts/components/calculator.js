define(['knockout', 'text!../../components/calculator.html', 'pathway', 'helpers', 'hasher', 'utils'],
  function(ko, html, Pathway, Helpers, hasher, Utils) {

  'use strict';

  /**
   * Tracks calculator
   * @class CalculatorViewModel
   */
  var ViewModel = function(params) {
    var params = params || {};

    var self = this;

    var Prelaoder = Utils.Preloader;

    var touch = function() {
      self.preloadables.notifySubscribers();
    }

    /** Image assets to preload before showing calculator */
    var preloadables = [
      // backgrounds
      '/layers/layer1.svg',
      '/layers/layer2.svg',
      '/layers/layer3.svg',
      '/layers/layer4.svg',
      // icons
      '/svgs/airplane.svg',
      '/svgs/algae.svg',
      '/svgs/bike.svg',
      '/svgs/biocrop_layer3.svg',
      '/svgs/biocrop_layer4.svg',
      '/svgs/bioenergy.svg',
      '/svgs/bioenergy_powerstation.svg',
      '/svgs/boat.svg',
      '/svgs/bulb.svg',
      '/svgs/bulb_led.svg',
      '/svgs/bus.svg',
      '/svgs/car.svg',
      '/svgs/carriage.svg',
      '/svgs/ccs_powerstation.svg',
      '/svgs/coal_powerstation.svg',
      '/svgs/commercial_fan.svg',
      '/svgs/commercial_solar.svg',
      '/svgs/cow.svg',
      '/svgs/dial.svg',
      '/svgs/electric.svg',
      '/svgs/electric_white.svg',
      '/svgs/factory.svg',
      '/svgs/field_solar.svg',
      '/svgs/gas.svg',
      '/svgs/gas_white.svg',
      '/svgs/geothermal.svg',
      '/svgs/heating_pipe.svg'
    ];

    self.componentsLoaded = ko.observable(false);
    self.assetsLoaded = ko.observable(false);

    // preload the assets
    Prelaoder.batch(preloadables, function() {
      self.assetsLoaded(true);
    });

    self.hasLoaded = ko.computed(function() {
      return (self.assetsLoaded() && self.componentsLoaded());
    });


    // check screen is big enough
    var timer;

    self.handleResize = function() {
      var remove = false;

      timer = setTimeout(function() {
        if(Utils.tooSmall()) {
          hasher.replaceHash('too-small');
          remove = true;
        } else if(Utils.shouldRotate()) {
          hasher.replaceHash('rotate');
          remove = true;
        }

        if(remove) {
          window.removeEventListener('resize', self.handleResize);
        }
      }, 500);
    };

    window.addEventListener('resize', self.handleResize);

    self.handleResize();

    self.pathway = params.pathway

    // Main navigation state.
    // 0: closed, 1: primary, 2: secondary
    self.navState = ko.observable(0);

    self.overviewVisible = ko.observable(false);
    self.subNavVisible = ko.observable(false);
    self.shareVisible = ko.observable(false);
    self.fullscreenVisible = ko.observable(false);
    self.faqVisible = ko.observable(false);
    self.mainViewVisible = ko.observable(true);

    self.buttonColor = ko.observable('question');

    self.fullscreenVisible = ko.observable(false);
    self.overlayVisible = ko.observable(false);
    self.overlayContent = ko.observable();

    self.faqCloseMode = ko.observable(false);

    self.overlayAction = ko.observable({});

    self.showOverlay = function(action) {
      if(self.overlayVisible()) {
        self.faqCloseMode(false);
        self.overlayVisible(false);
      } else {
        self.faqCloseMode(true);
        self.overlayVisible(true);
        self.overlayAction(action);
      }

      self.buttonColor('white');
    };

    self.hideOverlay = function() {
      self.overlayVisible(false);
      self.buttonColor('question');
    };

    self.currentPathway = params.pathway;

    self.pathwayUpdating = ko.computed(function() {
      return self.currentPathway().updating();
    });

    self.pathwayCategories = Pathway.categories();

    var toggleObservableBool = function(context, boolName) {
      var toggleable = context[boolName];
      context[boolName](!toggleable());
    };

    /** toggle main nav visibility */
    self.toggleMainNav = function() {
      toggleObservableBool(self, 'mainNavVisible');
    }

    /** toggle share page visibility */
    self.toggleShare = function() {
      if(self.shareVisible()) {
        self.faqCloseMode(false);
        self.mainViewVisible(true);
        self.shareVisible(false);

        self.buttonColor('question');

        // Redraw any newly visible charts by touching data
        self.pathway().chartData.notifySubscribers();

      } else {
        // TODO: Tidy this up...
        self.faqCloseMode(true);
        self.faqVisible(false);
        self.overlayVisible(false);
        self.mainViewVisible(false);
        self.fullscreenVisible(false);
        self.shareVisible(true);

        self.buttonColor('share-closer');

        // Explicitly draw charts now they are visible
        var shareCharts = document.querySelectorAll('.share .OverviewChart');
        ko.bindingHandlers.chart.redrawElements(shareCharts);
      }
    }

    /** toggle faq page visibility */
    self.toggleFaq = function() {
      if(self.faqCloseMode()){
        self.faqCloseMode(false);
        self.mainViewVisible(true);
        self.overlayVisible(false);
        self.shareVisible(false);
        self.fullscreenVisible(false);
        self.faqVisible(false);

        self.buttonColor('question');

      } else {
        self.faqCloseMode(true);
        self.faqVisible(true);

        self.buttonColor('blue');
      }
    }

    /** toggle faq page visibility */
    self.toggleFullscreen = function() {
      self.faqCloseMode(true);
      self.fullscreenVisible(true);

      self.buttonColor('blue');

      // Explicitly draw chart now it's visible
      var flowsFullscreen = document.querySelectorAll('#sankey-fullscreen');
      ko.bindingHandlers.chart.redrawElements(flowsFullscreen);
    }

    /** set active tab */
    self.setActiveTab = function(tab) {
      self.activeTab(id)
    }

    self.cityscapeVisible = ko.observable(window.innerWidth > 1200);

    self.openCity = function() {
      self.cityscapeVisible(true);
      self.drawCharts();
    };

    self.closeCity = function() {
      self.cityscapeVisible(false);
      self.drawCharts();
    };

    self.drawCharts = function(){
      // TODO: this could be handled by transitionEnd binding
      // cause ie9 dont do transitions
      if(!Modernizr.csstransitions) {
        setTimeout(self.redrawCharts, 10);
      }
    }

    self.redrawCharts = function() {
      // Redraw charts by touching data
      self.pathway().chartData.notifySubscribers();
    };

    self.swipeLandscape = function(swipe) {
      if(swipe.down) {
        self.cityscapeVisible(true);
      } else if(swipe.up) {
        self.cityscapeVisible(false);
      }
    };

  };

  return {
    viewModel: ViewModel,
    template: html,
  };
});

