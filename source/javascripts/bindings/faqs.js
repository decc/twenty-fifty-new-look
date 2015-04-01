define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.faq = {
    init: function(el) {

      var header = el.querySelector('header');
      var activeClass = 'is-active';

      header.addEventListener("click", function(event){

        var wrapper = el.querySelector('.js-content-wrapper');
        var content = el.querySelector('.js-content');

        if(el.classList.contains(activeClass)) {
          // closing
          wrapper.removeAttribute('style');
          el.classList.remove(activeClass);
        } else {
          // opening

          el.classList.add(activeClass);

          // repaint el with activeClass
          var h = el.offsetHeight;

          // set height... css handles transition
          var height = [content.offsetHeight, 'px'].join('');
          wrapper.style.height = height
        }

      });
    }
  };
});

