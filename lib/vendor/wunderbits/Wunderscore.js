// because lodash and underscore do some stupids
define([

  'vendor/lodash'

], function (_) {

  'use strict';

  var arrRef = [];

  return {

    // just returns functions, unlike lodash/underscore which sorts
    'functions': function (obj) {

      var funcs = [obj];
      for (var key in obj) {
        if (typeof obj[key] === 'function') {
          funcs.push(key);
        }
      }
      return funcs;
    },

    // always use native bind regardless of "speed", we want less closures!
    'bindAll': (function () {

      var wBindAll = function (object) {

        var self = this;
        var functions = arguments.length > 1 ? arrRef.concat.apply(arrRef, arrRef.slice.call(arguments, 1)) : self.functions(object);
        var key;

        while (functions.length) {
          key = functions.shift();
          if (key !== 'constructor') {
            object[key] = object[key].bind(object);
          }
        }
      };

      // calculate now vs. at runtime which should be used
      return ('bind' in Function.prototype) ? wBindAll : _.bindAll;
    })(),

    'merge': function (object) {

      // add every property from all sources left to right
      // http://jsperf.com/wunderscore-merge
      var sources = arrRef.concat.apply(arrRef, arrRef.slice.call(arguments, 1));
      var source;
      while (sources.length) {
        source = sources.shift();
        for (var key in source) {
          if (source.hasOwnProperty(key)) {
            object[key] = source[key];
          }
        }
      }

      return object;
    },

    'defer': function () {
      var args = arrRef.slice.call(arguments);
      var callback = args.shift();
      var context = args.shift();

      if (context) {
        _.defer(function () {
          callback.apply(context, args);
        });
      }
      else {
        _.defer(callback);
      }
    },

    'delay': function () {
      var args = arrRef.slice.call(arguments);
      var callback = args.shift();
      var wait = args.shift() || 1;
      var context = args.shift();

      if (context) {
        _.delay(function () {
          callback.apply(context, args);
        }, wait);
      }
      else {
        _.delay(callback, wait);
      }
    }
  };
});