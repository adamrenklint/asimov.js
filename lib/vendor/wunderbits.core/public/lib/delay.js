define([
  './toArray'
], function (
  toArray
) {

  'use strict';

  return function delay (fn, time, context) {
    var args = toArray(arguments, 3);
    return setTimeout(function () {
      fn.apply(context, args);
    }, time);
  };
});