/*

  collection class proxy for Slimbo.Collection

*/

define([

  '../vendor/Slimbo',
  '../vendor/wunderbits.core/public/mixins/WBUtilsMixin',
  '../vendor/wunderbits.core/public/mixins/WBDestroyableMixin',
  '../vendor/wunderbits.core/public/mixins/WBEventsMixin',
  '../vendor/wunderbits.core/public/mixins/WBBindableMixin',
  './Base',
  'lodash',
  './Model'

], function (_Slimbo, WBUtilsMixin, WBDestroyableMixin, WBEventsMixin, WBBindableMixin, Base, _, Model) {

  var _super = Slimbo.Collection.prototype;
  var base = new Base();

  return Slimbo.Collection.extend({

    'model': Model,

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      WBUtilsMixin.applyTo(self);
      WBDestroyableMixin.applyTo(self);
      WBEventsMixin.applyTo(self);
      WBBindableMixin.applyTo(self);

      self.logger = base.logger;
      self.filesystem = base.filesystem;
    },

    'fetch': function () {}
  });
});