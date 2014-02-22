define([

  './WBEventEmitter',
  './mixins/WBDeferrableMixin',
  './mixins/WBDestroyableMixin'

], function (
  WBEventEmitter,
  WBDeferrableMixin, WBDestroyableMixin,
  undefined
) {

  'use strict';

  var _super = WBEventEmitter.prototype;

  var controllers = {};
  var incrementalId = 0;

  return WBEventEmitter.extend({

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      WBDeferrableMixin.applyTo(self);
      WBDestroyableMixin.applyTo(self);

      self.cid = 'controller-' + incrementalId++;
      controllers[self.cid] = self;
    },

    'onDestroy': function () {

      var self = this;
      delete controllers[self.cid];
    },

    // useful helper for controllers
    'stopEventFully': function (e) {

      e.preventDefault();
      e.stopPropagation();
    }
  });
});