define(['knockout'], function(ko) {
  'use strict';

  ko.bindingHandlers.faq = {
    init: function(el) {

      el.addEventListener("click", function(event){
        var ele = event.target;
        var header = ele.parentNode;
        var article = header.parentNode;
        
        // close all the open one
        var e = document.getElementsByClassName('faqs')[0].getElementsByClassName('active');
        if(e.length > 0 && !e[0].isEqualNode(article)){
          e[0].className = e[0].className.replace( /(?:^|\s)active(?!\S)/g ,'');
        }
        
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
