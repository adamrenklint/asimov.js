define([
  './WBSingleton',
  './WBDeferred'
], function (WBSingleton, WBDeferred) {

  'use strict';

  var arrayRef = [];

  var self = WBSingleton.extend({

    'when': function () {

      var context = this;
      var main = new WBDeferred(context);
      var deferreds = arrayRef.slice.call(arguments);

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
        args[index] = arrayRef.slice.call(arguments);

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
  });

  return self;
});