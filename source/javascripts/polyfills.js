(function(document) {
  'use strict';

  var testClassList = function() {
    return ("document" in self) && ("classList" in document.createElement("_"));
  };

  Modernizr.addTest('flash', function() {
    var hasFlash = false;
    try {
      hasFlash = Boolean(new ActiveXObject('ShockwaveFlash.ShockwaveFlash'));
    } catch(exception) {
      hasFlash = ('undefined' != typeof navigator.mimeTypes['application/x-shockwave-flash']);
    }

    return hasFlash;
  });

  Modernizr.addTest('ios', function() {
    return /(iPad|iPhone|iPod)/g.test(navigator.userAgent);
  });

  Modernizr.load([
    {
      test: testClassList(),
      nope: '/javascripts/polyfills/classList.min.js'
    },

    {
      test: Modernizr.ios,
      yep: '/javascripts/polyfills/ios.js'
    }
  ]);

})(document);

