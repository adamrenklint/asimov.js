define([
  '../lib/forEach',
  '../WBMixin'
], function (forEach, WBMixin, undefined) {

  'use strict';

  function noop () {}

  function Call (fn) {
    var self = this;
    (typeof fn === 'string') && (fn = self[fn]);
    (typeof fn === 'function') && fn.call(self);
  }

  var cleanupMethods = ['unbind', 'unbindAll', 'onDestroy'];

  return WBMixin.extend({

    'destroy': function () {

      var self = this;

      // clean up
      forEach(cleanupMethods, Call, self);

      self.trigger('destroy');

      for (var key in self) {
        if (self.hasOwnProperty(key) && key !== 'uid' && key !== 'cid') {
          // make functions noop
          if (typeof self[key] === 'function') {
            self[key] = noop;
          }
          // and others undefined
          else {
            self[key] = undefined;
          }
        }
      }

      self.destroyed = true;
    }
  });
});