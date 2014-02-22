define([

  '../WBMixin',
  '../WBDeferred',
  '../When',
  '../lib/dependencies'

], function (WBMixin, WBDeferred, When, dependencies) {

  'use strict';

  var arrRef = [];
  var w_ = dependencies.w_;

  return WBMixin.extend({

    'deferred': function () {
      var self = this;
      return new WBDeferred(self);
    },

    'when': function () {
      var self = this;
      return When.when.apply(self, arguments);
    },

    'defer': function () {
      var args = arrRef.slice.call(arguments);
      args[1] = args[1] || this;
      return w_.defer.apply(null, args);
    },

    'delay': function () {
      var args = arrRef.slice.call(arguments);
      args[2] = args[2] || this;
      return w_.delay.apply(null, args);
    }
  });
});