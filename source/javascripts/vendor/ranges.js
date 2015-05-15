/**
 * range.js - Range input facade
 *
 * @author NathanG
 * @license Range.js 0.0.13 | https://github.com/nathamanath/range/LICENSE
 */

(function(window, document) {
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

      self.create = method;
      return method(eventName);
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

      self.fire = method;
      method(el, eventName);
    }
  };

  var throttle = function() {};

  (function(Range) {
    // Expose range
    var define = window.define || null;

    if(typeof define === 'function' && define.amd) {
      define('range', [], function(){ return Range; });
    } else {
      window.Range = Range;
    }

  })((function(Event) {

    /**
     * Represents a range input
     *
     * @class Range
     * @param {object} el - range input to recieve facade
     * @param {object} [args]
     * @param {string} [args.pointerWidth] - See `.init`
     * @param {boolean|array} [args.ticks] - set ticks via js instaead of list
     * if you like. true will put a tick on each step, array of numbers will put
     * a tick on each value in array (similar to datalist).
     * @param {number} [args.max=100] - alternate max setter
     * @param {number} [args.min=0] - alternate min setter
     * @param {number} [args.step=1] - alternate step setter
     */
    var Range = function(el, args) {
      var self = this;

      self.input = el;
      self.args = args || {};

      self.value = parseFloat(el.value);
      self.max = parseFloat(el.getAttribute('max')) || self.args['max'] || 100;
      self.min = parseFloat(el.getAttribute('min')) || self.args['min'] || 0;
      self.step = parseFloat(el.getAttribute('step')) || self.args['step'] || 1;
    };

    /** @memberof Range */
    Range.prototype = {
      /**
       * Initialize range replacements
       * @example new Range(args).init();
       *
       * @param {boolean} [silent=false] - do not fire change / input events
       * on init. handy when asynchronously setting value
       */
      'init': function(silent) {
        this._render();
        this._bindEvents();
        this._setValue(this.value, silent);
        this._handleTicks();

        return this;
      },

      _handleTicks: function() {
        var ticks = this.args.ticks;

        if(ticks) {
          if(Object.prototype.toString.call(ticks) === '[object Array]') {
            this._generateTicks(ticks);
          } else if(!!ticks) {
            // make array of possible values
            ticks = [];

            for(var i = this.min, l = this.max; i <= l; i += this.step) {
              ticks.push(i);
            }

            this._generateTicks(ticks);
          }
        } else {
          this._list();
        }
      },

      /**
       * Handle list attribute if set
       * @private
       */
      _list: function() {
        var options;
        var ticks = [];

        var listId = this.input.getAttribute('list');
        var list = document.getElementById(listId);

        if(listId) {
          // get point values

          if(list) {
            options = list.querySelectorAll('option');

            for(var i = 0, l = options.length; i < l; i++) {
              ticks.push(parseInt(options[i].innerHTML, 10));
            }

            this._generateTicks(ticks);
          }
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
        var pointerWidth = this._getPointerWidth();

        this.pointer.style.width = pointerWidth;
        this.track.style.paddingRight = pointerWidth;
      },

      /**
       * generate all html required for tick marks. If ticks array is not
       * provided, generate tick at each step.
       * @private
       * @param {array} ticks - values to put ticks on
       */
      _generateTicks: function(ticks) {
        var el = document.createElement('div');
        var inner = this._generateTicksInner();

        el.appendChild(inner);

        el.className = 'ticks';

        this._generateTickEls(ticks, inner);
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
      _generateTickEls: function(values, inner) {
        var offset;

        for(var i = 0; i < values.length; i++) {
          var value = values[i];
          // scale value between min and max
          offset = this._scale(value, [this.min, this.max], [0, 100]);
          inner.appendChild(this._generateTick(offset, value));
        }
      },

      /**
       * @private
       * @param {integer} offset - tick offset in %
       * @returns individual tick mark element
       */
      _generateTick: function(offset, value) {
        var tick = document.createElement('div');

        tick.className = 'tick';
        tick.innerHTML = value;

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

      /**
       * @private
       * @returns {string} pointer width in px
       */
      _getPointerWidth: function() {
        this.pointerWidth = this.args['pointerWidth'] ||
          this.pointer.offsetWidth;

        return [this.pointerWidth, 'px'].join('');
      },

      /**
       * HTML for entire range facade
       * @private
       * @returns {object} All input facade html
       */
      _template: function() {
        var el = this._rangeEl();
        this.track = this._trackEl();
        this.pointer = this._pointerEl();

        el.appendChild(this.track);
        this.track.appendChild(this.pointer);

        // TODO: _preventSelection?!?
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
        var el = document.createElement('div');
        var width = this.pointerWidth || 0;
        var style = el.style;

        el.className = 'range-replacement';

        el.setAttribute('tabindex', 0);

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

        var pointerWidth = this.pointerWidth;

        if(!!pointerWidth) {
          style.width = pointerWidth + 'px';
        }

        return pointer;
      },

      /**
       * Binds events for range replacement to work
       * @private
       */
      _bindEvents: function() {
        var self = this;
        var el = self.el;

        el.addEventListener('focus', function(e) {
          self._focus(e);
        });

        el.addEventListener('mousedown', function(e) {
          var code = e.keyCode || e.which;

          // left mousedown only
          if(code === 1) {
            var events = ['mousedown', 'mousemove', 'mouseup'];
            self._dragStart(e, events, self._getMouseX);
          }
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
       * Handle focus
       * @private
       */
      _focus: function() {
        var self = this;

        if(!self.hasFocus) {
          self.hasFocus = true;
          Event.fire(self.input, 'focus');

          self.keydown = function(e) {
            self._keydown(e);
          };

          self.blur = function(e) {
            self._clickBlur(e);
          };

          window.addEventListener('keydown', self.keydown);
          window.addEventListener('mousedown', self.blur);
        }
      },

      /**
       * Called when focused on range replacement and keydown
       * @private
       * @param e - keydown event
       */
      _keydown: function(e) {
        // TODO: cache which is in use
        var code = e.keyCode || e.charCode;
        var self = this;

        // left or down arrow
        if(code === 40 || code === 37) {
          self._setValue(self.value - self.step);
        }

        // right or up arrow
        else if(code === 38 || code === 39) {
          self._setValue(self.value + self.step);
        }

        // tab
        else if(code === 9) {
          self._blur();
        }
      },

      /**
       * @private
       * @param e - click event
       */
      _clickBlur: function(e) {
        var self = this,
            input = self.input,
            el = self.el,
            // All els which wont cause blur if clicked
            _els = el.querySelectorAll('*'),
            els = [];

        // nodelist to array
        for(var i = 0, l = _els.length; i < l; i++) {
          els.push(_els[i]);
        }

        els.push(el, input);

        // if not clicking on this.el / descendants
        if(els.indexOf(e.target) < 0) {
          self._blur();
        }
      },

      /**
       * Handle blur event on range replacement
       * @private
       */
      _blur: function() {
        var self = this;

        self.hasFocus = false;

        window.removeEventListener('mousedown', self.blur);
        window.removeEventListener('keydown', self.keydown);

        Event.fire(self.input, 'blur');
      },

      /**
       * update element dimensions, reset value and pointer position
       * to that of this.input
       * @param {boolean} silent - supress change + input event
       * @returns Range instance
       */
      'update': function(silent) {
        this.value = this._roundAndLimit(parseFloat(this.input.value));

        this._getDimensions();
        this._getPointerWidth();
        this._setValue(this.value, silent);

        return this;
      },

      /**
       * Stop user from selecting anything
       * @private
       */
      _preventSelection: function() {
        var method;
        var self = this;

        if(typeof self.el.onselectstart !== 'undefined') {
          method = function() {
            document.body.style.cursor = 'default';
            window.addEventListener('selectstart', self.noSelect = function(e) {
              e.preventDefault();
            });
          };
        } else {
          method = function() {
            var style = document.body.style;

            style.cursor = 'default';
            style.MozUserSelect = 'none';
          };
        }

        self._preventSelection = method;
        method();
      },

      /**
       * Un-prevent selection
       * @private
       */
      _allowSelection: function() {
        var method;
        var self = this;

        if(typeof self.el.onselectstart !== 'undefined') {
          method = function() {
            document.body.style.cursor = '';
            window.removeEventListener('selectstart', self.noSelect);
          };
        } else {
          method = function() {
            var style = document.body.style;

            style.cursor = '';
            style.MozUserSelect = '';
          };
        }

        self._allowSelection = method;
        method();
      },

      /**
       * Handle pointer drag for either touch or mouse
       * @private
       * @param {object} e - move event
       * @param {array} eventNames - names of required events
       * @param {function} getX - method which returns x position of event
       */
      _dragStart: function(e, events, getX) {
        var self = this,
            onMove, onUp,
            moveEvent = events[1],
            endEvent = events[2];

        self.oldValue = self.value;
        self._input(getX.call(self, e));


        window.addEventListener(moveEvent, onMove = function(e) {
          self._input(getX.call(self, e));
        });

        self._preventSelection();

        window.addEventListener(endEvent, onUp = function() {
          self._change();

          window.removeEventListener(moveEvent, onMove);
          window.removeEventListener(endEvent, onUp);
          self._allowSelection();

          document.body.style.cursor = '';
        });

        // touchstart || mousedown
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

        this._getMouseX = method;
        return method(e);
      },

      /**
       * Get mouse x position during touch event
       * @private
       * @param e - touch event
       */
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

        this._setValue(scaled);
      },

      /**
       * Sets value of both this.input and range replacement
       * @private
       * @param {number} value
       * @param {boolean} silent - no inPut or change event
       */
      _setValue: function(value, silent) {
        var self = this;

        value = self._roundAndLimit(value);

        // set pointer position only when value changes
        if(value !== self.oldInputValue) {
          self.oldInputValue = self.input.value = self.newValue = value;

          var min = self.min;
          var percent = ((value - min) / (self.max - min) * 100) || 0;

          self.pointer.style.left = [percent, '%'].join('');

          // Do not fire event on first call (initialisation)
          if(self.oldValue && !silent) {
            Event.fire(self.input, 'input');
          }

          self._change(silent);
        }
      },

      /**
       * Handle change of value if changed
       * @private
       * @param {boolean} silent - no change event
       */
      _change: function(silent) {
        var newValue = this.newValue;
        var input = this.input;

        if(this.oldValue !== newValue) {
          input.value = this.oldValue = this.value = newValue;
          if(!silent) Event.fire(input, 'change');
        }
      },

      /**
       * Round to nearest step limit between min and max
       * Also ensure same decimal places as step for ie <= 9's sake. >:0
       *
       * @private
       * @param {number} n
       */
      _roundAndLimit: function(n) {
        // count # of decimals in this.step
        var decimals = (this.step + '').split('.')[1];
        var places = (decimals) ? decimals.length : 0;

        var rounded = (Math.round(n / this.step) * this.step).toFixed(places);

        return Math.min(Math.max(rounded, this.min), this.max);
      },

      /**
       * Scale a number
       *
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
     * @param {object} args
     * @param silent - see #init
     * @returns {object} Range instance
     */
    Range.create = function(el, args, silent) {
      return new Range(el, args).init(silent);
    };

    return {
      /**
       * @memberof Range
       * @param {string|array|object} [ranges=input[type=range]] - css selector,
       * nodelist/array, or dom node to be replaced.
       * @param {object} args - arguments object
       * @param {number} args.pointerWidth - static value for pointer width.
       * Needed if range replacement is origionaly renered with `display: none`
       * @param silent - see #init
       *
       * @returns {object|array} Range instance(s)
       */
      'init': function(ranges, args, silent) {
        ranges = ranges || 'input[type=range]';

        var replacements = [];

        if(typeof ranges === 'string') {
          // selector string
          ranges = document.querySelectorAll(ranges);
        } else if(typeof ranges.length === 'undefined') {
          // dom node
          return Range.create(ranges, args, silent);
        }

        for(var i = 0, l = ranges.length; i < l; i++) {
          replacements.push(Range.create(ranges[i], args));
        }

        return replacements;
      }
    };

  })(Event));
})(window, document);

