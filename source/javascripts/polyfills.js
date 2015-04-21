testClassList = function() {
  return ("document" in self) && ("classList" in document.createElement("_"));
}

Modernizr.load([
  {
    test: testClassList(),
    nope: '/javascripts/polyfills/classList.min.js'
  }
]);

