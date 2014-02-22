define([
  './toArray',
  './delay'
], function (
  toArray, delay
) {

  'use strict';

  return function defer (fn) {
    var args = toArray(arguments);
    args[0] = 1;
    args.unshift(fn);
    return delay.apply(null, args);
  };
});