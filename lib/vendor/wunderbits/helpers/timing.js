define([

  '../WBRuntime',

  '../WBSingleton'

], function (WBRuntime, WBSingleton, undefined) {

  'use strict';

  var window = WBRuntime.global;
  var console = WBRuntime.console;

  return WBSingleton.extend({

    // Instrument entrances and exits in your code then load up chrome://tracing and behold

    // starts a timer with a given name
    'start': function () {

      this.timingEnabled() && console.time.apply(console, arguments);
    },

    // ends a timer of a given name
    'end': function () {

      this.timingEnabled() && console.timeEnd.apply(console, arguments);
    },

    // for testing, or forcing enabled in code
    'enableTiming': function () {

      this.timing = true;
    },

    // for test, or forcing enabled in code
    'disableTiming': function () {

      this.timing = false;
    },

    // returns whether enabled
    'timingEnabled': function () {

      return (window.timing === true || this.timing === true);
    }
  });

});