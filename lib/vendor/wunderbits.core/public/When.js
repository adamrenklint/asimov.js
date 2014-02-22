define([
  './WBDeferred',
  './lib/toArray'
], function (WBDeferred, toArray, undefined) {

  'use strict';

  function When () {

    var context = this;
    var main = new WBDeferred(context);
    var deferreds = toArray(arguments);

    // support passing an array of deferreds, to avoid `apply`
    if (deferreds.length === 1 && Array.isArray(deferreds[0])) {
      deferreds = deferreds[0];
    }

    var count = deferreds.length;
    var args = new Array(count);

    function Fail () {
      main.rejectWith(this);
    }

    function Done () {

      if (main.state() === 'rejected') {
        return;
      }

      var index = count - deferreds.length - 1;
      args[index] = toArray(arguments);

      if (deferreds.length) {
        var next = deferreds.shift();
        next.done(Done);
      } else {
        args.unshift(this);
        main.resolveWith.apply(main, args);
      }
    }

    if (deferreds.length) {

      deferreds.forEach(function (deferred) {
        deferred.fail(Fail);
      });

      var current = deferreds.shift();
      current.done(Done);
    } else {
      main.resolve();
    }

    return main.promise();
  }

  // backward compatiblity
  When.when = When;

  return When;
});