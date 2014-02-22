/*

  model class proxy for Slimbo.Model

*/

define([

  '../vendor/Slimbo',
  '../vendor/wunderbits.core/public/mixins/WBUtilsMixin',
  '../vendor/wunderbits.core/public/mixins/WBDestroyableMixin',
  '../vendor/wunderbits.core/public/mixins/WBEventsMixin',
  '../vendor/wunderbits.core/public/mixins/WBBindableMixin',
  './Base'

], function (_Slimbo, WBUtilsMixin, WBDestroyableMixin, WBEventsMixin, WBBindableMixin, Base) {

  var _super = Slimbo.Model.prototype;
  var base = new Base();

  return Slimbo.Model.extend({

    'initialize': function () {

      var self = this;
      _super.initialize.apply(self, arguments);

      WBUtilsMixin.applyTo(self);
      WBDestroyableMixin.applyTo(self);
      WBEventsMixin.applyTo(self);
      WBBindableMixin.applyTo(self);

      self.logger = base.logger;
      self.filesystem = base.filesystem;

      self.on('change', self.parseRaw);
      self.parseRaw();
    },

    'fetch': function () {},
    'parseRaw': function () {}
  });
});