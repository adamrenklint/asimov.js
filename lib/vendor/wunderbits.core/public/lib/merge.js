define([
  './toArray'
], function (
  toArray
) {

  'use strict';

  return function merge (object, source) {
    var sources = toArray(arguments, 1);
    while (sources.length) {
      source = sources.shift();
      for (var key in source) {
        if (source.hasOwnProperty(key)) {
          object[key] = source[key];
        }
      }
    }
    return object;
  };
});