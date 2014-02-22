define([

  './WBClass',

  './mixins/WBEventsMixin',
  './mixins/WBStateMixin',
  './mixins/WBBindableMixin',
  './mixins/WBDestroyableMixin'

], function (
  WBClass,
  WBEventsMixin, WBStateMixin, WBBindableMixin, WBDestroyableMixin,
  undefined
) {

  'use strict';

  var originalDestroy = WBDestroyableMixin.Behavior.destroy;

  return WBClass.extend({

    'mixins': [
      WBEventsMixin,
      WBStateMixin,
      WBBindableMixin,
      WBDestroyableMixin
    ],

    'initialize': function (attributes) {

      var self = this;

      if (attributes) {
        self.attributes = attributes;
      }
    },

    'sync':  function (method, instance, options) {
      if (options && typeof options.success === 'function') {
        options.success();
      }
    },

    'fetch': function (options) {
      var self = this;
      return self.sync('read', self, options);
    },

    'save': function (key, val, options) {

      var self = this;
      if (!self.destroying) {
        // set the attributes
        self.set(key, val, options);
        // sync
        (typeof key === 'object') && (options = val);
        self.sync('update', self, options);
      }
      return self;
    },

    'destroy': function (options) {

      var self = this;
      if (!self.destroying) {
        self.destroying = true;
        originalDestroy.call(self, options);
        self.attributes = {};
        self.sync('delete', self, options);
      }
    }
  });
});