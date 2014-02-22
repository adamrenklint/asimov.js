define([

  '../WBMixin',
  '../WBDeferred',
  '../When',

  '../lib/toArray',
  '../lib/forEach',
  '../lib/delay',
  '../lib/defer',
  '../lib/functions'

], function (
  WBMixin, WBDeferred, When,
  toArray, forEach, delay, defer, functions,
  undefined
) {

  'use strict';

  return WBMixin.extend({

    'deferred': function () {
      var self = this;
      return new WBDeferred(self);
    },

    'when': function () {
      var self = this;
      return When.apply(self, arguments);
    },

    'defer': function (fn) {
      var self = this;
      var args = toArray(arguments);
      // default context to self
      args[1] = args[1] || this;
      // support string names of functions on self
      (typeof fn === 'string') && (args[0] = self[fn]);
      return defer.apply(null, args);
    },

    'delay': function (fn) {
      var self = this;
      var args = toArray(arguments);
      // default context to self
      args[2] = args[2] || self;
      // support string names of functions on self
      (typeof fn === 'string') && (args[0] = self[fn]);
      return delay.apply(null, args);
    },

    'forEach': function (collection, fn, context) {
      var self = this;
      // default context to self
      context = context || self;
      // support string names of functions on self
      (typeof fn === 'string') && (fn = self[fn]);
      forEach(collection, fn, context);
    },

    'functions': function (obj) {
      return functions(obj || this);
    }
  });

});
