define(function () {

  'use strict';

  function replacer (match) {
    var r = Math.random() * 16 | 0;
    var v = (match === 'x') ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  }

  return function createUID () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, replacer);
  };
});