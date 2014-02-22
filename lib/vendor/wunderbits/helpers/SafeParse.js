define([

  './console',
  '../WBSingleton'

], function (console, WBSingleton, undefined) {

  'use strict';

  return WBSingleton.extend({

    'json': function (jsonString) {

      var data;
      try {
        data = JSON.parse(jsonString);
      }
      catch (e) {
        console.warn('Unable to parse "' + jsonString + '"');
      }

      return data;
    }
  });
});