/**
 * @fileoverview Scroller - Like a slide show type thing but not.
 * @author Nathan G
 * @license MIT
 * @version 0.0.3
 */

(function(){
  'use strict';
  (function(window){
    /** shim requestAnimationFrame */
    window.animationFrame = (function(){
      return window.requestAnimationFrame ||
        function(callback){
          window.setTimeout(callback, 1000 / 60);
        };
    })();

    /** Helper methods, mainly to cater for ie < 10
     * @namespace Scroller.Helpers
     */

    /** @lends Scroller.Helpers */
    var Helpers = {
      /**
       * Does el have class
       *
       * @param {object} el - dom object
       * @param {string} klass - class name
       * @returns {boolean}
       */
      hasClass: function(el, klass){
        var classes = this._gC(el);
        return (classes.indexOf(klass) > -1) ? true : false;
      },

      /**
       * Add class to el if el does not already have class
       *
       * @param {object} el - dom object
       * @param {string} klass - class name
       */
      addClass: function(el, klass){
        if(!this.hasClass(el, klass)){
          var classes = this._gC(el);
          classes.push(klass);
          this._sC(el, classes);
        }
      },

      /**
       * Remove class from el if el does have class
       *
       * @param {object} el - dom object
       * @param {string} klass - class name
       */
      removeClass: function(el, klass){
        var classes = this._gC(el);

        if(this.hasClass(el, klass)){
          classes.splice(classes.indexOf(klass), 1);
          this._sC(el, classes);
        }
      },

      /**
       * get classlist as array
       * @private
       */
      _gC: function(el){
        return el.className.split(' ');
      },

      /**
       * set className from array
       * @private
       */
      _sC: function(el, classes){
        el.className = classes.join(' ');
      },

      /**
       * time of previous call to throttle
       * @private
       */
      _prev: (function(){return new Date().getTime();})(),

      /**
       * throttle callback
       *
       * @param {number} ms - delay
       * @param {function} fn - callback function
       */
      throttle: function(ms, fn){
        var that = this;
        return function(){
          var now = new Date().getTime();

          if((now - that._prev) >= ms){
            that._prev = now;
            fn.apply(this, arguments);
          }
        };
      }
    };

    /**
     * Represents a scroller.
     *
     * @class Scroller
     * @param {object} el - The element containing scrollable elements.
     * @param {object} opts - Options
     * @param {number} opts.animMs - animation length in ms.
     * @param {boolean} opts.nav - generate navigation?
     */
    var Scroller = function(el, opts){
      this.el = el;
      this.opts = opts || {};

      if(!this.el){ throw new Error('Scroller requires el'); }

      this._init();
    };

    /** @memberof Scroller */
    Scroller.prototype = {
      /**
       * Initialize scroller
       * @private
       */
      _init: function(){
        this.scrolling = false;
        this.events = [];
        this.animMs = this.opts.animMs || 300;
        this.sections = this.el.querySelectorAll('.scrollable');

        this._parseOptions();

        this.on('activatesection', this._activateButton);
        this._activateCurrent();
        this._bindEvents();
      },


      /**
       * Kill scroller instance, unbind all event listeners
       */
      destroy: function() {
        this._unbindEvents();
        this._removeNav();
      },

      _parseOptions: function() {
        if(!!this.opts.nav){ this.nav = this._generateNav(); }
        if(!!this.opts.next){ this.next = this._generateNext(); }
      },

      /**
       * Generate Next button
       *
       * @private
       * @returns {object} next button
       */

      _generateNext: function() {
        var next = document.createElement('button');

        next.className = 'is-hidden scrollable-next';
        next.innerHTML = 'next';

        this.on('activatesection', function(scroller) {
          if(!scroller._hasNextSection()) {
            Helpers.addClass(scroller.next, 'is-hidden');
          } else {
            Helpers.removeClass(scroller.next, 'is-hidden');
          }
        });

        this.el.appendChild(next);
        return next;
      },

      /**
       * Generate navigation
       *
       * @private
       * @returns {object} nav dom object
       */
      _generateNav: function(){
        var nav = document.createElement('nav'),
            out = [];

        nav.id = nav.className = 'scrollable-nav';

        out.push('<ul>');

        this._itterateSections(function(section, i){
          var j = i + 1;
          out.push('<li><a class="scrollable-button" href="#' +
            section.id + '" data-section="' + j + '">' + j + '</a></li>');
        });

        out.push('</ul>');

        nav.innerHTML = out.join('');

        this.el.insertBefore(nav, this.el.firstChild);

        this.navEl = nav;
        return nav;
      },

      _removeNav: function() {
        var nav = this.navEl;

        nav.parentNode.removeChild(nav);
      },

      /**
       * Itterates over this.sections
       *
       * @private
       * @params {function} callback - called per section
       */
      _itterateSections: function(callback){
        var sections = this.sections;

        for(var i=0; i < sections.length; i++){
          var section = sections[i];
          callback(section, i);
        }

        return this;
      },

      /**
       * Determine which mousewheel event is supported by browser
       *
       * @type string
       * @private
       */
      _mouseWheelEvent: (function(){
        return (/Firefox/i.test(navigator.userAgent)) ?
          'DOMMouseScroll' : 'mousewheel';
      })(),

      /**
       * Bind dom events
       *
       * @private
       */
      _bindEvents: function(){
        var that = this;

        that.onMouseEvent = function(e) {
          e.preventDefault();
          that._onMouseWheel(e);
        };

        document.addEventListener(this._mouseWheelEvent, that.onMouseEvent);


        that.onKeydownEvent = function(e){ that._onKeyDown(e); }
        document.addEventListener('keydown', that.onKeydownEvent);

        that.onResizeEvent = function(){ that._currentToTop(); }
        window.addEventListener('resize', that.onResizeEvent);

        that.onScrollEvent = function(e){
          if(!that.scrolling){
            Helpers.throttle(200, that._activateCurrent).call(that);
          }else{
            e.preventDefault();
          }
        };

        // if were scrolling but not via our animation
        document.addEventListener('scroll', that.onScrollEvent);

        // touch events
        var touchStartY = 0;
        this.el.addEventListener('touchstart', function(e){
          touchStartY = e.changedTouches[0].pageY;
        }, false);

        this.el.addEventListener('touchend', function(e){
          /** @todo extract this to its own method */
          var touchEndY = e.changedTouches[0].pageY,
              minSwipe = 300;

          if((touchStartY - touchEndY) >= minSwipe){
            that._nextSection();
          }else if((touchEndY - touchStartY) >= minSwipe){
            that._prevSection();
          }
        });

        /** Disable touchmove when on el */
        this.el.addEventListener('touchmove', function(e){
          e.preventDefault(e);
        });

        // delegate click event
        this.el.addEventListener('click', function(e){
          var target = e.target;

          // next button clicked
          if(Helpers.hasClass(target, 'scrollable-next')){
            e.preventDefault();
            that._nextSection();
          }

          // prev button clicked
          if(Helpers.hasClass(target, 'scrollable-prev')){
            e.preventDefault();
            that._prevSection();
          }

          that._navClicked(e);
        });
      },

      _unbindEvents: function() {
        document.removeEventListener(this._mouseWheelEvent, this.onMouseEvent);
        document.removeEventListener('keydown', this.onKeydownEvent);
        window.removeEventListener('resize', this.onResizeEvent);
        document.removeEventListener('scroll', this.onScrollEvent);

      },

      /**
       * Make closest section to top of window current.
       *
       * @private
       */
      _activateCurrent: function(){
        var scrollY = window.pageYOffset,
            gap = null;

        this._itterateSections(function(section, i){
          var offset = section.offsetTop,
              difference = (scrollY > offset)? scrollY-offset : offset-scrollY;

          if(!gap || difference < gap.gap){gap = {id: i, gap: difference};}
        });

        this.currentSectionId = gap.id;
        this._event('activatesection');
      },

      /** Add active class to current button if we have nav */
      _activateButton: function(){
        if(this.nav){
          var buttons = this.nav.querySelectorAll('.scrollable-button');

          for(var i = 0; i < buttons.length; i++){
            var button = buttons[i];
            Helpers.removeClass(button, 'active');
          }

          Helpers.addClass(buttons[this.currentSectionId], 'active');
        }
      },

      _navClicked: function(e){
        var target = e.target;

        if(Helpers.hasClass(target, 'scrollable-button')){
          e.preventDefault();
          //get section
          var id = (target.getAttribute('data-section')*1) - 1,
              section = this.sections[id];
          //go to section
          this._scrollToEl(section);

          //set active
          this.currentSectionId = id;
          this._event('activatesection');
        }
      },

      /**
       * Move current section to top of window. Used on window resize to keep
       * current section in place.
       *
       * @private
       */
      _currentToTop: function(){
        var el = this.sections[this.currentSectionId];
        window.scrollTo(window.pageXOffset, el.offsetTop);
      },

      /**
       * Called on mousewheel event
       * @private
       */
      _onMouseWheel: function(e){
        /** @todo in chrome, scrolling jiggers if you mousewheel during anim */
        if(!this.scrolling){
          var delta = e.detail*(-120) || e.wheelDelta;
          if(delta < 0){
            this._nextSection();
          }else{
            this._prevSection();
          }
        }
      },

      /**
       * Called on keydown event
       * @private
       */
      _onKeyDown: function(e){
        var code = e.keyCode || e.charCode;

        if(code === 40){
          e.preventDefault();
          this._nextSection();
        }

        if(code === 38){
          e.preventDefault();
          this._prevSection();
        }
      },

      /**
       * Move next section to the top od window
       *
       * @private
       */
      _nextSection: function(){
        if(this._hasNextSection()){
          this._scrollToEl(this.sections[++this.currentSectionId]);
          this._event('activatesection');
        }
      },

      _hasNextSection: function() {
        return (this.currentSectionId < this.sections.length - 1);
      },

      _hasPrevSection: function() {
        return (this.currentSectionId > 0);
      },

      /**
       *  Move previous section to the top of window
       *
       *  @private
       */
      _prevSection: function(){
        if(this._hasPrevSection()){
          this._scrollToEl(this.sections[--this.currentSectionId]);
          this._event('activatesection');
        }
      },

      /**
       * Scroll to section element with animation
       *
       * @private
       * @param {object} el - section element
       * @todo OPTIMIZE: Long method
       */
      _scrollToEl: function(el){
        var offsetTo = el.offsetTop,
            scrollY = window.pageYOffset,
            scrollX = window.pageXOffset,
            difference = offsetTo - scrollY,
            px = (scrollY > offsetTo)? scrollY-offsetTo : offsetTo-scrollY,
            interval = 1000 / 60,
            pxFrame = (px / this.animMs) * interval,
            i = scrollY,
            updateScrollY,
            endCondition,
            that = this;

        //TODO: easing
        this.scrolling = true;

        /** @todo we already know direction... */
        if(difference > 0){
          //scroll down
          updateScrollY = function(i){return i + pxFrame;};
          endCondition = function(i, offset){return (i >= offset);};
        }else{
          //scroll up
          updateScrollY = function(i){return i - pxFrame;};
          endCondition = function(i, offset){return i <= offset;};
        }

        var step = function(){
          window.animationFrame(function(){
            i = updateScrollY(i);
            window.scroll(scrollX, i);

            if(endCondition(i, offsetTo)){
              clearInterval(scroll);
              window.scroll(scrollX, offsetTo);
              that.scrolling = false;
            }else{step();}
          });
        };

        step();
      },

      /**
       * Called whenever any section becomes current section.
       * @event Scroller.activatesection
       */

      /** Scroller event names */
      _events: ['activatesection'],

      /**
       * fire event by name
       *
       * @private
       * @param {string} name - name of event to fire
       */
      _event: function(name){
        this._itterateSubscribers(function(e){
          if(e.e === name){e.fn.call(this, this);}
        });
      },

      /**
       * Itterate subscribers
       *
       * @private
       * @param {function} callback - to be called per event subscriber
       */
      _itterateSubscribers: function(callback){
        var events = this.events;
        for(var i = 0; i < events.length; i++){
          var e = events[i];
          callback.call(this, e, i);
        }
      },

      /**
       * Bind events
       *
       * @param {string} e - event name
       * @param {function} fn - function to be called on e
       * @param {string} name - unique identifier so that listener can be
       * un-bound
       * @returns {object} Scroller instance
       */
      on: function(e, fn, name){
        if(this._events.indexOf(e) >= 0){
          this.events.push({e: e, fn: fn, name: name});
        }else{ throw new Error('Unknown scroller event: ' + e); }

        return this;
      },

      /**
       * Unbind an event listener
       *
       * @params {string} name - identifier of event listener.
       * @returns {object} Scroller instance
       */
      off: function(name){
        this._itterateSubscribers(function(e, i){
          if(e.name === name){
            this.events.splice(i, 1);
          }
        });

        return this;
      }
    };

    var define = window.define || null;

    if(typeof define === 'function' && define.amd){
      define('scroller', [], function(){return Scroller;}); // amd
    }else{
      window.Scroller = Scroller;
    }
  })(window);
}).call(this);

