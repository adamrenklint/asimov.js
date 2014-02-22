define(function () {

  'use strict';

  return function forEach (collection) {
    !Array.isArray(collection) && (collection = Object.keys(collection));
    return collection.length;
  };
});