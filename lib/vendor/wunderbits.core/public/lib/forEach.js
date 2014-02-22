define(function () {

  'use strict';

  function forArray (array, iterator, context) {
    for (var i = 0, l = array.length; i < l; i++) {
      if (iterator.call(context, array[i], i, array)) {
        return;
      }
    }
  }

  function forObject (object, iterator, context) {
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
        if (iterator.call(context, object[key], key)) {
          return;
        }
      }
    }
  }

  return function forEach (collection, iterator, context) {
    var handler = Array.isArray(collection) ? forArray : forObject;
    handler(collection, iterator, context);
  };
});