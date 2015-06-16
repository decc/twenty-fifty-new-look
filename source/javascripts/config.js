define([],
  function() {
  'use strict';

  return {
    MIN_WIDTH: 600,
    MIN_HEIGHT: 400,
    ROTATE_WIDTH: 700,
    // apiUrl: "http://obscure-sierra-8645.herokuapp.com",
    // apiUrl: "http://2050-calculator-tool.decc.gov.uk",
    apiUrl: (function() { return "http://", window.location.host].join('') } )()
    // siteUrl: "http://localhost:4567"
    siteUrl: (function() { return "http://", window.location.host].join('') } )()
  };
});

