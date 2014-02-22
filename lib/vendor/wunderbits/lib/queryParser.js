define(function () {

  'use strict';

  function parse (queryString) {

    var tokens = queryString.split('&');
    var result = {}, param, key;

    while (tokens.length) {
      param = tokens.shift().split('=');
      key = param[0];
      if (key.length) {
        result[key] = param[1];
      }
    }

    return result;
  }

  return parse;

});