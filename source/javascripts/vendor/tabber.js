(function(){
  'use strict';
  (function(window){
    /**
     * Represents a bunch of tabs, and some buttons
     *
     * @class Tabber
     * @param {object} el - The element containing some tabs
     * @param {function} [onChange] - on change callback function
     */
    var Tabber = function(el, onChange){
      this.el = el;
      this.onChange = onChange || function(){};

      this._bindEvents();
    };

    /** @memberof Tabber */
    Tabber.prototype = {


      navAccessor: function() {
        return this.el.querySelector('.tab-nav');
      },

      tabsAccessor: function() {

        return this.el.querySelectorAll('.tab');
      },

      /**
       * bind events
       * @private
       */
      _bindEvents: function(){
        var that = this;

        this.el.addEventListener('click', function(e){
          var target = e.target;

          if(target.classList.contains('tab-button')){
            that._tabButtonClicked(target);
          }
        });
      },

      /**
       * show selected tab only
       * @private
       * @param {object} el - tab nav button
       */
      _tabButtonClicked: function(el){
        // work out which tab?
        var tabId = (el.getAttribute('data-tab') * 1),
            tab = this.tabsAccessor()[tabId],
            oldTabId = this.getCurrentTab().id;

        // hide all the tabs
        this._itterateTabs(function(tab){
          tab.classList.remove('active');
        });

        // show selected tab
        tab.classList.add('active');

        // onChange callback
        if(tabId !== oldTabId){
          this.onChange(this);
        }
      },

      /**
       * itterate tabs
       * @private
       * @param {function} fn - callback
       */
      _itterateTabs: function(fn){
        for(var i = 0, tabs = this.tabsAccessor(); i < tabs.length; i++){
          var tab = tabs[i];
          fn.call(this, tab, i);
        }
      },

      /**
       * get active tab el
       * @returns {object} active tab and id
       */
      getCurrentTab: function(){
        var active = null;

        this._itterateTabs(function(tab, i){
          if(tab.classList.contains('active')){
            active = {id: i, tab: tab};
          }
        });

        return active;
      }
    };

    /**
     * create one or more tabber instances
     *
     * @memberof Tabber
     * @param {nodelist | object} el - either a dom object or NodeList
     * @param {function} fn - on change callback
     * @returns {object | array} tabber instance, or array of tabber instances
     */
    Tabber.init = function(el, fn){
      if(el instanceof NodeList){
        var tabbers = []

        for(var i = 0; i < el.length; i++){
          tabbers.push(new Tabber(el[i], fn));
        }

        return tabbers;
      }else{
        return new Tabber(el, fn);
      }
    };

    // expose Tabber
    var define = window.define || null;

    if(typeof define === 'function' && define.amd){
      define('tabber', [], function(){return Tabber;}); // amd
    }else{
      window.Tabber = Tabber;
    }
  })(window);
}).call(this);

