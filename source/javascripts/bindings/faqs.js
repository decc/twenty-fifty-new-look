define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.faq = {
    init: function(el) {

      el.addEventListener("click", function(event){
        var ele = event.target;
        var header = ele.parentNode;
        var article = header.parentNode;

        if(article.className.match(/(?:^|\s)active(?!\S)/)){
          // remove class
          article.className = article.className.replace( /(?:^|\s)active(?!\S)/g ,'');
        } else {
          // add class
          article.className += " active";
        }

      });
    }
  };
});
