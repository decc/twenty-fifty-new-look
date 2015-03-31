/**
 * range.js - Range input facade
 *
 * @author NathanG
 * @version 0.0.7
 * @license Range.js v0.0.7 | https://github.com/nathamanath/range/license
 */


(function() {
  'use strict';

  /**
   * Manages custom events
   *
   * @class Event
   * @private
   */
  var Event = {
    /** custom event cache */
    _cache: {},

    /**
     * Lazily evaluates which create method needed
     * @param eventName
     */
    create: function(eventName) {
      var method;
      var self = this;

      if (document.createEvent) {
        method = function(eventName) {
          var event = document.createEvent('HTMLEvents');
          event.initEvent(eventName, true, true);
          return self.cache(eventName, event);
        };
      } else {
        // ie < 9
        method = function(eventName) {
          var event = document.createEventObject();
          event.eventType = eventName;
          return self.cache(eventName, event);
        };
      }

      return (self.create = method)(eventName);
    },

    /**
     * @param eventName
     * @param event
     */
    cache: function(eventName, event) {
      event.eventName = eventName;
      this._cache[eventName] = event;
      return event;
    },

    /**
     * Get or create custom event of name
     * @param {string} name
     * @returns {object} custom event
     */
    get: function(eventName) {
      return this._cache[eventName] || this.create(eventName);
    },

    /**
     * Lazily evaluates which fire event method is needed
     * @param el
     * @param eventName
     */
    fire: function(el, eventName) {
      var method;
      var self = this;

      if(document.createEvent) {
        method = function(el, eventName) {
          el.dispatchEvent(self.get(eventName));
        };
      } else {
        // ie < 9
        method = function(el, eventName) {
          var onEventName = ['on', eventName].join('');

          if(eventName !== 'input') {
            // Existing ie < 9 event name
            el.fireEvent(onEventName, self.get(eventName));
          } else if(el[onEventName]) {
            // TODO: nicer input event handling for ie8
            el[onEventName]();
          }
        };
      }

      (self.fire = method)(el, eventName);
    }
  };

  (function(Range) {
    // Expose range
    var define = window.define || null;

    if(typeof define === 'function' && define.amd) {
      define('range', [], function(){ return Range; });
    } else {
      window.Range = Range;
    }
  })((function(document, window, Event) {

    /**
     * Represents a range input
     *
     * @class Range
     * @param {object} el - range input to recieve facade
     * @param {object} args
     * @param {string} args.pointerWidth - Set value for pointer width.
     * Currently needed if range is initialy rendered with display: none
     */
    var Range = function(el, args) {
      this.input = el;

      this.args = args || {};
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

      /**
       * Handle list attribute if set
       * @todo Propper list attr support
       * @private
       */
      _list: function() {
        if(this.input.getAttribute('list')) {
          this._generateTicks();
        }
      },

      /**
       * Render range replacement in place of old input el
       * @private
       */
      _render: function() {
        var input = this.input;
        this.el = this._template();

        input.style.display = 'none';

        input.parentNode.insertBefore(this.el, input.nextSibling);
        this._getDimensions();
        this._getPointerWidth();

        this._getPointerWidth()

        this.track.style.paddingRight = [this.pointerWidth, 'px'].join('');
      },

      /**
       * generate all html required for tick marks
       * @private
       */
      _generateTicks: function() {
        var el = document.createElement('div');
        var inner = this._generateTicksInner();

        el.appendChild(inner);

        el.className = 'ticks';

        this._generateTickEls(inner);
        this.ticks = el;

        this.el.appendChild(this.ticks);
        this._styleTicks(el);
      },

      /**
       * @private
       * @param ticks - ticks element
       */
      _styleTicks: function(ticks) {
        var hpw = this.pointerWidth / 2;
        var style = ticks.style;

        style.padding = ['0', hpw, 'px'].join('');
        style.width = '100%';
        style.position = 'absolute';
      },

      /**
       * @private
       * @returns inner wrapper element for tick els
       */
      _generateTicksInner: function() {
        var inner = document.createElement('div');
        var style = inner.style;

        inner.className = 'ticks-inner';

        style.width = '100%';
        style.position = 'relative';

        return inner;
      },

      /**
       * @private
       * @param {object} inner - element which contains ticks
       * @returns el containing all tick marks
       */
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
       * @returns individual tick mark element
       */
      _generateTick: function(offset) {
        var tick = document.createElement('div');

        tick.className = 'tick';

        tick.style.position = 'absolute';
        tick.style.left = [offset, '%'].join('');

        return tick;
      },

      /**
       * Get input facade offset and dimensions
       * @private
       */
      _getDimensions: function() {
        var rect = this.el.getBoundingClientRect();

        this.xMin = rect.left;
        this.xMax = rect.right - this.xMin;
      },

      _getPointerWidth: function() {
        this.pointerWidth = this.args['pointerWidth'] || this.pointer.offsetWidth;
      },

      /**
       * @private
       * @returns {object} All input facade html
       */
      _template: function() {
        var el = this._rangeEl();
        this.track = this._trackEl();
        this.pointer = this._pointerEl();

        el.appendChild(this.track);
        this.track.appendChild(this.pointer);

        el.addEventListener('selectstart', function(e) {
          e.preventDefault();
        });

        return el;
      },

      /**
       * @private
       * @returns Range replacement wrapper element
       */
      _rangeEl: function() {
        var  el = document.createElement('div');
        var width = this.pointerWidth || 0;
        var style = el.style;

        el.className = 'range-replacement';

        style.position = 'relative';
        style.paddingRight = [width, 'px'].join('');

        return el;
      },

      /**
       * @private
       * @returns Generated track el
       */
      _trackEl: function() {
        var track = document.createElement('div');
        track.className = 'track';

        return track;
      },

      /**
       * @private
       * @returns Generated pointer el
       */
      _pointerEl: function() {
        var pointer = document.createElement('div');
        var style = pointer.style;

        pointer.className = 'point';
        style.position = 'relative';

        var pointerWidth = this.args['pointerWidth'];

        if(!!pointerWidth) {
          style.width = pointerWidth + 'px';
        }

        return pointer;
      },

      _bindEvents: function() {
        var self = this;
        var el = this.el;

        el.addEventListener('mousedown', function(e) {
          var events = ['mousedown', 'mousemove', 'mouseup'];
          self._dragStart(e, events, self._getMouseX);
        });

        el.addEventListener('touchstart', function(e) {
          var events = ['touchstart', 'touchmove', 'touchend'];
          self._dragStart(e, events, self._getTouchX);
        });

        el.addEventListener('mouseup', function() {
          self._dragEnd('mouseup');
        });

        el.addEventListener('touchend', function() {
          self._dragEnd('touchend');
        });
      },

      /**
       * update element dimensions, reset value and pointer position
       * to that of this.input
       */
      'update': function() {
        this.value = this._roundAndLimit(parseFloat(this.input.value));

        this._getDimensions();
        this._setValue(this.value);
      },

      /**
       * Handle pointer drag for either touch or mouse
       * @private
       * @param {object} e - move event
       * @param {array} eventNames - names of required events
       * @param {function} getX - method which returns x position of event
       */
      _dragStart: function(e, events, getX) {
        var self = this;
        var onMove, onUp;
        var moveEvent = events[1];
        var endEvent = events[2];

        self.oldValue = self.value;
        self._input(getX.call(self, e));

        window.addEventListener(moveEvent, onMove = function(e) {
          self._input(getX.call(self, e));
        });

        window.addEventListener(endEvent, onUp = function() {
          self._change();

          window.removeEventListener(moveEvent, onMove);
          window.removeEventListener(endEvent, onUp);
        });

        Event.fire(self.input, events[0]);
      },

      /**
       * Handle end of pointer drag (touch or mouse)
       * @private
       * @param {string} endEventName
       */
      _dragEnd: function(endEventName) {
        this._change();
        Event.fire(this.input, endEventName);
        Event.fire(this.input, 'click');
      },

      /**
       * Get x position of mouse during event
       * Lazily evaluate which method needed
       *
       * @private
       * @param {object} e - event instance
       */
      _getMouseX: function(e) {
        var method;

        if(typeof window.event === 'undefined') {
          method = function(e) {
            return e.pageX;
          };
        } else {
          method = function() {
            return window.event.clientX;
          };
        }

        return (this._getMouseX = method)(e);
      },

      _getTouchX: function(e) {
        return e.changedTouches[0].clientX;
      },

      /**
       * Handle input event for range replacement
       * @private
       * @param x - input event x position
       */
      _input: function(x) {
        // OPTIMIZE: How not to call this each time?
        // or cache results.
        this._getDimensions();

        var offsetX = x - this.xMin;
        var from = [0, this.xMax];
        var to = [this.min, this.max];

        var scaled = this._scale(offsetX, from, to);

        this._setValue(this._roundAndLimit(scaled));
      },

      /**
       * @private
       * @param {number} value
       */
      _setValue: function(value) {
        // set pointer position only when value changes
        if(value !== this.oldInputValue) {
          this.oldInputValue = this.input.value = this.newValue = value;

          var min = this.min;

          var percent = ((value - min) / (this.max - min) * 100) || 0;
          this.pointer.style.left = [percent, '%'].join('');

          // Do not fire event on first call (initialisation)
          if(this.oldValue) {
            Event.fire(this.input, 'input');
          }
        }
      },

      /**
       * Handle change of value if changed
       * @private
       */
      _change: function() {
        var newValue = this.newValue;
        var input = this.input;

        if(this.oldValue !== newValue) {
          input.value = this.oldValue = this.value = newValue;
          Event.fire(input, 'change');
        }
      },

      /**
       * Round to nearest step limit between min and max
       * Also ensure same decimal places as step for ie <= 9's sake. >:0
       *
       * @private
       */
      _roundAndLimit: function(n) {
        // count # of decimals in this.step
        var decimals = (this.step + '').split('.')[1];
        var places = (decimals) ? decimals.length : 0;

        var rounded = (Math.round(n / this.step) * this.step).toFixed(places);

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
     * @param {object} el - input to be replaced
     * @returns {object} Range instance
     */
    Range.create = function(el, args) {
      return new Range(el, args).init();
    };

    /**
     * @todo take dom node / nodelist / selector /
     * default to all input[type=range]
     * @param {string} [selector] - css selector for ranges to replace
     * @returns {array} Range instances
     */
    Range.init = function(selector, args) {
      selector = selector || 'input[type=range]';
      var els = document.querySelectorAll(selector);
      var ranges = [];

      for(var i = 0, l = els.length; i < l; i++) {
        ranges.push(Range.create(els[i], args));
      }

      return ranges;
    };

    return {
      'init': Range.init,
      'create': Range.create
    };

  })(document, window, Event));
}).call(window);

