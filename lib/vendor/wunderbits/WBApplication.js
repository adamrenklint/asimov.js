define([

  './WBRuntime',
  './WBEventEmitter',
  './mixins/WBDestroyableMixin',
  './mixins/WBBindableMixin'

], function (
  WBRuntime,
  WBEventEmitter,
  WBDestroyableMixin, WBBindableMixin,
  undefined
) {

  'use strict';

  var _super = WBEventEmitter.prototype;

  return WBEventEmitter.extend({

    'initialize': function () {

      var self = this;

      WBBindableMixin.applyTo(self);
      WBDestroyableMixin.applyTo(self);

      _super.initialize.apply(self, arguments);
    }
  });
});