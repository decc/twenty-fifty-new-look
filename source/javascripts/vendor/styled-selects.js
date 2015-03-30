(function() {

  var __bind = function(fn, me){
    return function(){
      return fn.apply(me, arguments);
      };
    };

  this.StyledSelects = (function() {
    var hideOrigional;

    StyledSelects.selects = [];

    StyledSelects.init = function(elements, keepStyle) {
      var element, _i, _len;
      if (elements instanceof Object) {
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          element = elements[_i];
          StyledSelects.selects.push(new StyledSelects(element, StyledSelects.selects.length, keepStyle));
        }
      } else {
        this.selects.push(new this(elements, this.selects.length));
      }
      return document.addEventListener('click', this.click, false);
    };

    StyledSelects.click = function(e) {
      var id, select, target, _i, _len, _ref, _results;
      target = e.target;
      if (target.className === 'styled_select_selected') {
        id = target.parentNode.getAttribute('data-styled-select-id');
        StyledSelects.selects[id].selectClicked();
        return StyledSelects.closeAllBut(id);
      } else if (target.className === 'styled_select_option') {
        id = target.parentNode.parentNode.getAttribute('data-styled-select-id');
        StyledSelects.selects[id].optionClicked(target);
        return StyledSelects.closeAllBut(id);
      } else {
        _ref = StyledSelects.selects;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          select = _ref[_i];
          _results.push(select.closeOptions());
        }
        return _results;
      }
    };

    StyledSelects.closeAllBut = function(id) {
      var i, _i, _ref, _results;
      _results = [];
      for (i = _i = 0, _ref = StyledSelects.selects.length - 1; _i <= _ref; i = _i += 1) {
        if (i !== id * 1) {
          _results.push(StyledSelects.selects[i].closeOptions());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    function StyledSelects(el, instanceId, keepStyle) {
      this.keepStyle = keepStyle;
      this.optionClicked = __bind(this.optionClicked, this);
      this.documnentClicked = __bind(this.documnentClicked, this);
      this.selectClicked = __bind(this.selectClicked, this);
      this.fireChangeEvent = __bind(this.fireChangeEvent, this);
      this.el = el;
      this.options = [];
      this.width = this.el.offsetWidth;
      this.instanceId = instanceId;
      this.open = false;
      this.optionsHTML = "";
      hideOrigional(this.el);
      this.getOptions();
      this.selectedOption = this.getSelected();
      this.render();
    }

    // remove the width function
    StyledSelects.prototype.template = function() {
      return "<section  id=\"styled_select_" + this.el.id + "\"\n          style=\"width:" /* + this.width*/
      + "px;\"\n          data-styled-select-id=\"" + this.instanceId + "\"\n          data-parent-id=\"" + this.el.id + "\"\n          class=\"styled_select\">\n\n  <span class=\"styled_select_selected\">" + this.selectedOption.innerHTML + "</span>\n    <ul class=\"styled_select_options\">\n      " + this.optionsHTML + "\n    </ul>\n</section>";
    };

    StyledSelects.prototype.getOptions = function() {
      var i, label, option, value, _i, _len, _ref, _results;
      i = 0;
      _ref = this.el.options;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        value = option.value;
        label = option.innerHTML;
        this.optionsHTML += this.optionTemplate(i, value, label);
        _results.push(i++);
      }
      return _results;
    };

    StyledSelects.prototype.getSelected = function() {
      var option, selected, _i, _len, _ref;
      selected = false;
      _ref = this.el.options;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        option = _ref[_i];
        if (option.hasAttribute('selected')) {
          return option;
        }
      }
      if (selected) {
        return selected;
      }
      if (this.el.hasAttribute('data-placeholder')) {
        option = {
          value: null,
          innerHTML: this.el.getAttribute('data-placeholder')
        };
        return option;
      }
      return this.el.options[0];
    };

    StyledSelects.prototype.setSelected = function(index) {
      this.el.selectedIndex = index;
      return this.self.querySelector('span').innerHTML = this.el.options[index].innerHTML;
    };

    StyledSelects.prototype.optionTemplate = function(index, value, label) {
      return "<li class=\"styled_select_option\"\n  data-option-index=\"" + index + "\"\n  data-value=\"" + value + "\">\n  " + label + "\n</li>";
    };

    StyledSelects.prototype.render = function() {
      this.self = document.createElement('div');

      this.self.id = "styled_select_" + this.el.id;
      this.self.className = "styled_select_wrapper";
      this.self.innerHTML = this.template();

      if(this.keepStyle) {
        this.self.setAttribute('style', this.el.getAttribute('style'));
        this.self.style.opacity = 1;
        this.self.style.height = 'auto';
        this.self.style.width = 'auto';
      }

      return this.el.parentNode.appendChild(this.self);
    };

    hideOrigional = function(el) {
      el.style.width = 0;
      el.style.height = 0;
      el.style.opacity = 0;
      el.style.margin = 0;
      el.style.position = 'absolute';
      el.style.padding = 0;
    };

    StyledSelects.prototype.fireChangeEvent = function() {
      var event;
      if (document.createEvent) {
        event = document.createEvent('Events');
        event.initEvent('change', true, false);
        return this.el.dispatchEvent(event);
      } else if (document.createEventObject) {
        return this.el.fireEvent('onchange');
      } else if (typeof this.el.onchange === 'function') {
        return this.el.onchange();
      }
    };

    StyledSelects.prototype.isOpen = function() {
      return this.open;
    };

    StyledSelects.prototype.openOptions = function() {
      this.open = true;
      return this.self.querySelector('.styled_select').className += " open";
    };

    StyledSelects.prototype.closeOptions = function() {
      var el;
      this.open = false;
      el = this.self.querySelector('.styled_select');
      return el.className = el.className.replace(/(\s)?open/, '');
    };

    StyledSelects.prototype.selectClicked = function() {
      if (this.isOpen()) {
        return this.closeOptions();
      } else {
        return this.openOptions();
      }
    };

    StyledSelects.prototype.documnentClicked = function(e) {
      var klass;
      klass = e.target.className;
      if (!klass.match(/(styled_select_selected|styled_select_option)/)) {
        return this.selectClicked();
      }
    };

    StyledSelects.prototype.optionClicked = function(target) {
      this.selectedValue = target.innerHTML;
      this.setSelected(target.getAttribute('data-option-index'));
      this.selectClicked();
      return this.fireChangeEvent();
    };

    var define = window.define || null;

    if(typeof define === 'function' && define.amd){
      define('selects', [], function(){return StyledSelects;}); // amd
    }else{
      window.StyledSelects = StyledSelects;
    }
  })(window);
}).call(this);

