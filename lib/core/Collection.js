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
      _.bindAll(self);

      WBUtilsMixin.applyTo(self);
      WBDestroyableMixin.applyTo(self);
      WBEventsMixin.applyTo(self);
      WBBindableMixin.applyTo(self);

      self.logger = base.logger;
      self.filesystem = base.filesystem;
    },

    'add': function (models, options) {

      var self = this;
      _super.add.apply(self, arguments);

      if (!_.isArray(models)) {
        models = [models];
      }

      _.each(models, function (model) {
        if (!model.attributes) {
          return;
        }
        self.trigger('add', model, self, options);
      });
    },

    'fetch': function () {}
  });
});