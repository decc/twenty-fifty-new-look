(function(document) {
  'use strict';

  var testIOS = function() {
    return /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
  };

  var testClassList = function() {
    return ("document" in self) && ("classList" in document.createElement("_"));
  };

  Modernizr.load([
    {
      test: testClassList(),
      nope: '/javascripts/polyfills/classList.min.js'
    },
    {
      test: testIOS(),
      yep: '/javascripts/polyfills/ios.js'
    }
  ]);

})(document);

