define([

  '../WBMixin'

], function (WBMixin) {

  'use strict';

  function noop () {}

  function call (self, fn) {
    fn = self[fn];
    (typeof fn === 'function') && fn.call(self);
  }

  return WBMixin.extend({

    'destroy': function () {

      var self = this;

      self.trigger('destroy');

      call(self, 'unbind');
      call(self, 'unbindAll');
      call(self, 'onDestroy');

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