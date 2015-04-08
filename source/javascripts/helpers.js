define([], function() {
  return {
    throttle: function(callback, delay, trail) {
      var last = 0;
      var timeout, args, context;
      var offset = (!trail) ? 0 : delay; // defaults true

      return function() {
        var now = +new Date;
        var elapsed = (now - last - offset);

        args = arguments;
        context = this;

        var exec = function() {
          timeout && (timeout = clearTimeout(timeout));
          callback.apply(context, args);
          last = now;
        }

        if(elapsed > delay) {
          exec();
        } else if(!timeout && trail !== false) {
          timeout = setTimeout(exec, delay);
        }
      }
    }
  };
});

