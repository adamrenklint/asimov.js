define(function () {

  'use strict';

  return function isInstanceOf (cls) {

    return this instanceof cls;
  };
});