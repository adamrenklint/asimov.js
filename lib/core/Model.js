/*

  model class proxy for Slimbo.Model

*/

define([

  '../vendor/Slimbo',
  '../vendor/wunderbits.core/public/mixins/WBUtilsMixin',
  '../vendor/wunderbits.core/public/mixins/WBDestroyableMixin',
  '../vendor/wunderbits.core/public/mixins/WBEventsMixin',
  '../vendor/wunderbits.core/public/mixins/WBBindableMixin',
  './Base',
  'lodash'

], function (_Slimbo, WBUtilsMixin, WBDestroyableMixin, WBEventsMixin, WBBindableMixin, Base, _) {

  var _super = Slimbo.Model.prototype;
  var base = new Base();

  return Slimbo.Model.extend({

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);
      _.bindAll(self);

      WBUtilsMixin.applyTo(self);
      WBDestroyableMixin.applyTo(self);
      WBEventsMixin.applyTo(self);
      WBBindableMixin.applyTo(self);

      self.logger = base.logger;
      self.filesystem = base.filesystem;

      self.on('change:raw', self.parseRaw);
      self.parseRaw();
    },

    'fetch': function () {},
    'parseRaw': function () {}
  });
});