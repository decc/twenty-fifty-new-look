/**
 * @fileoverview Range input replacement
 * @author NathanG
 * @license MIT
 * @version 0.0.4
 */

(function() {
  'use strict';

  (function(Range) {
    var define = window.define || null;

    if(typeof define === 'function' && define.amd) {
      define('range', [], function(){ return Range; });
    } else {
      window.Range = Range;
    }
  })((function(document, window) {

    /**
     * Helper methods
     *
     * @class H
     * @private
     */
    var H = {
      /** custom event cache */
      _events: {},

      /**
       * @param eventName {string} - name of event to be created
       */
      createEvent: function(eventName) {
        var event;

        if (document.createEvent) {
          event = document.createEvent('HTMLEvents');
          event.initEvent(eventName, true, true);
        } else {
          event = document.createEventObject();
          event.eventType = eventName;
        }

        event.eventName = eventName;

        this._events[eventName] = event;

        return event;
      },

      /**
       * @param el {object} - dom node to recieve event
       * @param eventName {string} - name of event to fire
       */
      fireEvent: function(el, eventName) {
        var event = this._events[eventName] || this.createEvent(eventName);

        if (document.createEvent) {
          el.dispatchEvent(event);
        } else {
          el.fireEvent('on' + event.eventType, event);
        }
      }
    };

    /**
     * Represents a range input
     *
     * @class Range
     * @param {object} el - range input to recieve facade
     */
    var Range = function(el) {
      this.input = el;

      this.value = parseFloat(el.value);
      this.max = parseFloat(el.getAttribute('max')) || 100;
      this.min = parseFloat(el.getAttribute('min')) || 0;
      this.step = parseFloat(el.getAttribute('step')) || 1;
    };

    /** @memberof Range */
    Range.prototype = {
      init: function() {
        this._render();
        this._bindEvents();
        this._setValue(this.value);
        this._list();

        return this;
      },

      _list: function() {
        if(this.input.getAttribute('list')) {
          this._generateTicks();

          var pointerWidth = this.pointerWidth;
          var hpw = pointerWidth / 2;

          this.ticks.style.padding = ['0', hpw, 'px'].join('');
          this.ticks.style.width = '100%';
          this.ticks.style.position = 'absolute';
        }
      },

      _render: function() {
        var input = this.input;
        this.el = this._template();

        input.style.display = 'none';

        input.parentNode.insertBefore(this.el, input.nextSibling);
        this._getDimensions();


        this.track.style.paddingRight = [this.pointerWidth, 'px'].join('');
      },

      // TODO: Tick positioning is wrong
      _generateTicks: function() {
        var el = document.createElement('div');
        var inner = this._generateTicksInner();

        el.appendChild(inner);

        el.className = 'ticks';

        this._generateTickEls(inner);
        this.ticks = el;

        this.el.appendChild(this.ticks);
      },

      _generateTicksInner: function() {
        var inner = document.createElement('div');

        inner.className = 'ticks-inner';
        inner.style.width = '100%';
        inner.style.position = 'relative';

        return inner;
      },

      _generateTickEls: function(inner) {
        var steps = (this.max - this.min) / this.step;
        var stepPercent = 100 / steps;

        var offset;

        for(var i = 0; i <= steps; i++) {
          offset = stepPercent * i;
          inner.appendChild(this._generateTick(offset));
        }
      },

      /**
       * @private
       * @param {integer} offset - tick offset in %
       */
      _generateTick: function(offset) {
        var tick = document.createElement('div');

        tick.className = 'tick';
        tick.style.position = 'absolute';
        tick.style.left = [offset, '%'].join('');

        return tick;
      },

      _getDimensions: function() {
        this.pointerWidth = this.pointer.offsetWidth;
        var rect = this.el.getBoundingClientRect();

        this.xMin = rect.left;
        this.xMax = rect.right - this.xMin;
      },

      _template: function() {

        var el = this._rangeEl();
        this.track = this._trackEl();
        this.pointer = this._pointerEl();

        el.appendChild(this.track);
        this.track.appendChild(this.pointer);

        return el;
      },

      _rangeEl: function() {
        var  el = document.createElement('div');
        var width = this.pointerWidth || 0;

        el.className = 'range-replacement';
        el.style.position = 'relative';
        el.style.paddingRight = [width, 'px'].join('');

        return el;
      },

      _trackEl: function() {
        var track = document.createElement('div');
        track.className = 'track';

        return track;
      },

      _pointerEl: function() {
        var pointer = document.createElement('div');

        pointer.className = 'point';
        pointer.style.position = 'relative';

        return pointer;
      },

      _bindEvents: function() {
        var that = this;

        this.el.addEventListener('mousedown', function(e) {
          that._onMouseDown(e);
        });

        this.el.addEventListener('mouseup', function(e) {
          that._onMouseUp(e);
        });
      },

      /**
       * update element dimensions, and reset value and pointer position
       */
      update: function() {
        // TODO: check round and limit this for old browsers
        this.value = this._roundAndLimit(parseFloat(this.input.value));

        this._getDimensions();
        this._setValue(this.value);
      },

      _onMouseDown: function(e) {
        this.oldValue = this.value;

        this._input(e);

        var that = this;

        var onMove = function(e) {
          that._input(e);
        };

        var onUp = function() {
          that._change();

          window.removeEventListener('mousemove',  onMove);
          window.removeEventListener('mouseup', onUp);
        };

        window.addEventListener('mousemove',  onMove);
        window.addEventListener('mouseup', onUp);

        H.fireEvent(this.input, 'mousedown');
      },

      _onMouseUp: function() {
        this._change();

        H.fireEvent(this.input, 'mouseup');
        H.fireEvent(this.input, 'click');
      },

      _getMouseX: (function() {
        var out;

        if(typeof window.event === 'undefined') {
          out = function(e) {
            return e.pageX;
          };
        } else {
          out = function() {
            return window.event.clientX;
          };
        }

        return out;
      })(),

      _input: function(e) {
        // OPTIMIZE: How not ot call this each time?
        this.update();

        var x = this._getMouseX(e);

        var offsetX = x - this.xMin;
        var from = [0, this.xMax];
        var to = [this.min, this.max];

        var scaled = this._scale(offsetX, from, to);

        this._setValue(scaled);

        // TODO: ie8 dosent like doing this...
        H.fireEvent(this.input, 'input');
      },

      _setValue: function(value) {
        var rounded = this._roundAndLimit(value);

        // set pointer position only when value changes
        if(rounded !== this.oldInputValue) {
          this.oldInputValue = this.value;
          this.input.value = this.newValue = rounded;

          var min = this.min;

          var percent = ((rounded - min) / (this.max - min) * 100) || 0;
          this.pointer.style.left = [percent, '%'].join('');
        }
      },

      _change: function() {
        var newValue = this.newValue;
        var input = this.input;

        if(this.oldValue !== newValue) {
          input.value = this.oldValue = this.value = newValue;
          H.fireEvent(input, 'change');
        }
      },

      /**
       * round to nearest step limit between min and max
       * @private
       */
      _roundAndLimit: function(n) {
        var rounded = Math.round(n / this.step) * this.step;
        return Math.min(Math.max(rounded, this.min), this.max);
      },

      /**
       * @private
       * @param {number} value - number to be rounded
       * @param {array} rangeFrom - Source range: [srcLow, srcHigh]
       * @param {array} rangeTo - Destination range: [destLow, destHigh]
       * @returns {number} - value scaled between destLow, and destHigh
       */
      _scale: function(value, rangeFrom, rangeTo) {
        var srcLow = rangeFrom[0];
        var destLow = rangeTo[0];
        var destHigh = rangeTo[1];

        var preMapped = (value - srcLow) / (rangeFrom[1] - srcLow);
        return preMapped * (destHigh - destLow) + destLow;
      }
    };

    /**
     * @param {object} el - input to replace
     * @returns {object} Range instance
     */
    Range['new'] = function(el) { // ie8 dont like .new
      return new Range(el).init();
    };

    /**
     * @param {string} [selector] - css selector for ranges to replace
     * @returns {array} Range instances
     */
    Range.init = function(selector) {
      selector = selector || 'input[type=range]';
      var els = document.querySelectorAll(selector);
      var ranges = [];

      for(var i = 0, l = els.length; i < l; i++) {
        ranges.push(this['new'](els[i]));
      }

      return ranges;
    };

    return Range;

  })(document, window));
}).call(window);

