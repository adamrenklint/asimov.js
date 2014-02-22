define(function () {

  'use strict';

  var nativeIsArray = Array.isArray;

  function cloneArray (arr, isDeep) {
    arr = arr.slice();
    if (isDeep) {
      var newArr = [], value;
      while (arr.length) {
        value = arr.shift();
        value = (value instanceof Object) ? clone(value, isDeep) : value;
        newArr.push(value);
      }
      arr = newArr;
    }
    return arr;
  }

  function cloneDate (date) {
    return new Date(date);
  }

  function cloneObject (source, isDeep) {
    var object = {};
    for (var key in source) {
      if (source.hasOwnProperty(key)) {
        var value = source[key];
        if (value instanceof Date) {
          object[key] = cloneDate(value);
        } else if (typeof value === 'object' && value !== null && isDeep) {
          object[key] = clone(value, isDeep);
        } else {
          object[key] = value;
        }
      }
    }
    return object;
  }

  function clone (obj, isDeep) {

    if (nativeIsArray(obj)) {
      return cloneArray(obj, isDeep);
    }

    return cloneObject(obj, isDeep);
  }

  return clone;

});
