(function(document) {
  'use strict';

  var testIOS = function() {
    return /(iPad|iPhone|iPod)/g.test( navigator.userAgent );
  };

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

  Modernizr.addTest('safari', function(){
     return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
  })

  Modernizr.addTest('ie', function(){
    return /*@cc_on!@*/false || !!document.documentMode; // At least IE6
  })

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

