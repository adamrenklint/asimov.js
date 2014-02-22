define(function () {

  'use strict';

  return function (obj, skip) {
    return [].slice.call(obj, skip || 0);
  };
});