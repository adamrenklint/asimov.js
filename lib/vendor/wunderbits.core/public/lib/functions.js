define(function () {

  'use strict';

  return function functions (obj) {
    var funcs = [];
    for (var key in obj) {
      if (typeof obj[key] === 'function') {
        funcs.push(key);
      }
    }
    return funcs;
  };
});
