/**
 * @fileoverview Range input replacement
 * @author NathanG
 * @license MIT
 * @version 0.0.2
 */

(function(document, window) {
  'use strict';

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
    },

    /**
     * Force repaint of element
     * @param {object} el - DOM node to pe repainted
     */
    paint: function(el) {
      return el.offsetHeight;
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

      if(this.input.getAttribute('list')) {
        this._generateTicks();
      }

      return this;
    },

    _render: function() {
      var input = this.input;
      this.el = this._template();

      input.style.display = 'none';

      input.parentNode.insertBefore(this.el, input.nextSibling);
      this._getDimensions();
    },

    _generateTicks: function() {
      var el = document.createElement('div');

      el.className = 'ticks';

      var steps = (this.max - this.min) / this.step;
      var stepPercent = 100 / steps;

      var offset;

      for(var i = 0; i < steps; i++) {
        offset = stepPercent * i;
        el.appendChild(this._generateTick(offset));
      }

      this.el.appendChild(el);
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
      H.paint(this.pointer);
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
      el.appendChild(this.pointer);

      return el;
    },

    _rangeEl: function() {
      var  el = document.createElement('div');

      el.className = 'range-replacement';
      el.style.position = 'relative';

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
      pointer.style.position = 'absolute';

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

      // TODO: Share resize event across all instances + throtle
      window.addEventListener('resize', function(e) {
        that.update(e);
      });
    },

    /**
     * update element dimensions, and reset value and pointer position
     */
    update: function() {
      this.value = parseFloat(this.input.value);
      this._getDimensions();
      this._setValue(this.value);
    },

    _onMouseDown: function(e) {
      this.oldValue = this.value;

      this._input(e);

      var that = this;

      var mouseUpdate = function(e) {
        that._input(e);
        that._change();

        if(that.mouseDown) {
          mouseUpdate(e);
        }
      };

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
      var value = parseFloat(this._limitToRange(scaled));

      this._setValue(value);

      // TODO: ie8 dosent like doing this...
      H.fireEvent(this.input, 'input');
    },

    _setValue: function(value) {
      // round to nearest step limit between min and max
      var rounded = this._limitToRange(this._round(value));

      this.input.value = this.newValue = rounded;

      // set pointer position
      var hpw = this.pointerWidth / 2;
      var from = [this.min, this.max];
      var to = [0, this.xMax];

      var left = this._scale(rounded, from, to) || 0;

      this.pointer.style.left = [parseInt(left - hpw, 10), 'px'].join('');
    },

    _change: function() {
      var newValue = this.newValue;
      var input = this.input;

      if(this.oldValue !== newValue) {
        this.value = newValue;

        input.value = this.oldValue = this.value;

        H.fireEvent(input, 'change');
      }
    },

    _limitToRange: function(n) {
      return Math.min(Math.max(n, this.min), this.max);
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
    },

    /**
     * @private
     * @param {number} n - to be rounded
     * @returns {integer} - n rounded to nearest this.step
     */
    _round: function(n) {
      return Math.round(n / this.step) * this.step;
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

  var define = window.define || null;

  if(typeof define === 'function' && define.amd) {
    define('range', [], function(){ return Range; });
  } else {
    window.Range = Range;
  }

})(document, window);

