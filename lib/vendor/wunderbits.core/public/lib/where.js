define([
  './forEach'
], function (forEach) {

  'use strict';

  return function where (collection, properties) {
    var matches = [];
    forEach(collection, function (item) {
      for (var key in properties) {
        if (item[key] !== properties[key]) {
          return;
        }
        matches.push(item);
      }
    });
    return matches;
  };

});