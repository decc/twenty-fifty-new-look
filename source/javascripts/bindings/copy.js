define(['knockout', 'ZeroClipboard'], function(ko, ZeroClipboard) {
  'use strict';

  ko.bindingHandlers.copy = {
    init: function(el, valueAccessor) {
      ZeroClipboard.config( { swfPath: "/swf/ZeroClipboard.swf" } );

      var client = new ZeroClipboard(el);

      client.on('copy', function(e) {
        var clipboard = e.clipboardData;
        var value = ko.unwrap(valueAccessor());

        clipboard.setData( "text/plain", value );
      });
    }
  };
});

